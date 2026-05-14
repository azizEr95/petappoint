// app/(modals)/process.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  HStack,
  Pressable,
  ScrollView,
  Spinner,
  Text,
} from '@/src/gluestack-components/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'nativewind'
import { useQuery } from '@tanstack/react-query'
import { getAppointment } from '@src/api/appointments'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useBookAppointment } from '@src/hooks/useBookAppointment'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'

function formatDateTime(date: Date): { date: string; time: string } {
  return {
    date: date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr',
  }
}

export default function Process() {
  const { appointmentId, animalId: preselectedAnimalId } = useLocalSearchParams<{ appointmentId: string; animalId?: string }>()

  const aptId = Number(appointmentId)

  const { data: appointment, isLoading: aptLoading } = useQuery({
    queryKey: ['appointment', aptId],
    queryFn: () => getAppointment(aptId),
    enabled: !!aptId,
  })

  const { data: animals, isLoading: animalsLoading } = useMyAnimals()
  const { data: animalTypes } = useAnimalTypes()
  const { mutate: book, isPending: isBooking } = useBookAppointment()

  const isEditMode = !!(appointment?.animal?.id)

  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  // Pre-select current values when editing, or preselected animal when rebooking
  useEffect(() => {
    if (selectedAnimalId === null) {
      const initial = appointment?.animal?.id ?? (preselectedAnimalId ? Number(preselectedAnimalId) : null)
      if (initial) setSelectedAnimalId(initial)
    }
    if (appointment?.service?.id && selectedServiceId === null) {
      setSelectedServiceId(appointment.service.id)
    }
  }, [appointment, preselectedAnimalId])

  const typeNameById = Object.fromEntries((animalTypes ?? []).map((t) => [t.id, t.name]))

  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'

  const [bookingError, setBookingError] = useState<string | null>(null)
  const isLoading = aptLoading || animalsLoading
  const canBook = !!selectedAnimalId && !!selectedServiceId && !isBooking

  function handleBook() {
    if (!canBook) return
    setBookingError(null)
    book(
      { appointmentId: aptId, animalId: selectedAnimalId!, serviceId: selectedServiceId!, practiceId: appointment!.veterinaryPractice.id },
      {
        onSuccess: () => {
          router.dismiss()
        },
        onError: (e) => setBookingError(e instanceof Error ? e.message : 'Buchung fehlgeschlagen.'),
      },
    )
  }

  if (isLoading) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Spinner size='large' />
      </Box>
    )
  }

  const formatted = appointment ? formatDateTime(appointment.startTime) : null

  return (
    <Box className='flex-1 bg-background-100'>
      {/** Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {isEditMode ? 'Termin bearbeiten' : 'Buchung bestätigen'}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {isEditMode ? 'Tier oder Behandlung ändern' : 'Überprüfe deine Angaben'}
            </Text>
          </Box>
          <ButtonGroup>
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <Box className='px-5 pt-6'>

          {/* Ort & Zeit */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4 mb-3'>
            <HStack className='items-center gap-2 mb-2'>
              <FontAwesomeIcon name='clock-o' color='#2e8a59' size={18} />
              <Text size='sm' className='font-semibold text-typography-500 uppercase'>
                Ort & Zeit
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800'>
              {appointment?.veterinaryPractice.name ?? '–'}
            </Text>
            <Text size='sm' className='text-typography-500 mt-0.5'>
              {appointment
                ? `${appointment.veterinaryPractice.address.street}, ${appointment.veterinaryPractice.address.cityCode} ${appointment.veterinaryPractice.address.city}`
                : '–'}
            </Text>
            {formatted && (
              <>
                <HStack className='items-center gap-2 mt-2'>
                  <FontAwesomeIcon name='calendar' color={iconColor} size={14} />
                  <Text size='sm' className='text-typography-700'>{formatted.date}</Text>
                </HStack>
                <HStack className='items-center gap-2 mt-1'>
                  <FontAwesomeIcon name='clock-o' color={iconColor} size={14} />
                  <Text size='sm' className='text-typography-700'>{formatted.time}</Text>
                </HStack>
              </>
            )}
          </Card>

          {/* Haustier auswählen */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4 mb-3'>
            <HStack className='items-center gap-2 mb-3'>
              <FontAwesomeIcon name='paw' color='#2e8a59' size={18} />
              <Text size='sm' className='font-semibold text-typography-500 uppercase'>
                Haustier
              </Text>
            </HStack>
            <Box className='flex-row flex-wrap gap-2'>
              {(animals ?? []).map((animal) => {
                const isSelected = selectedAnimalId === animal.id
                return (
                  <Pressable
                    key={animal.id}
                    onPress={() => setSelectedAnimalId(animal.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-primary-100 border-primary-400'
                        : 'bg-background-50 border-outline-200'
                    }`}
                  >
                    <Text
                      size='sm'
                      className={`font-semibold ${isSelected ? 'text-primary-600' : 'text-typography-700'}`}
                    >
                      {animal.name}
                    </Text>
                    <Text size='xs' className='text-typography-400'>
                      {typeNameById[animal.animalTypeId] ?? '–'}
                    </Text>
                  </Pressable>
                )
              })}
              {!animals?.length && (
                <Text className='text-typography-400'>Keine Haustiere gefunden.</Text>
              )}
            </Box>
          </Card>

          {/* Behandlung auswählen */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4 mb-3'>
            <HStack className='items-center gap-2 mb-3'>
              <FontAwesomeIcon name='stethoscope' color='#2e8a59' size={18} />
              <Text size='sm' className='font-semibold text-typography-500 uppercase'>
                Behandlung
              </Text>
            </HStack>
            <Box className='flex-row flex-wrap gap-2'>
              {(appointment?.availableServices ?? []).map((service) => {
                const isSelected = selectedServiceId === service.id
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => setSelectedServiceId(service.id)}
                    className={`px-3 py-2 rounded-full border ${
                      isSelected
                        ? 'bg-primary-100 border-primary-400'
                        : 'bg-background-50 border-outline-200'
                    }`}
                  >
                    <Text
                      size='sm'
                      className={`font-medium ${isSelected ? 'text-primary-600' : 'text-typography-700'}`}
                    >
                      {service.name}
                    </Text>
                  </Pressable>
                )
              })}
              {!appointment?.availableServices?.length && (
                <Text className='text-typography-400'>Keine Leistungen verfügbar.</Text>
              )}
            </Box>
          </Card>

        </Box>
      </ScrollView>

      {/* Bottom button — fixed outside ScrollView */}
      <Box className='bg-background-0 px-5 py-4 shadow-lg'>
        {bookingError && (
          <Text className='text-red-500 text-sm mb-2 text-center'>{bookingError}</Text>
        )}
        <Button
          className='w-full h-12 rounded-xl bg-primary-500'
          disabled={!canBook}
          onPress={handleBook}
        >
          {isBooking ? (
            <Spinner size='small' />
          ) : (
            <ButtonText className='text-white font-bold'>
              {isEditMode ? 'Änderungen speichern' : canBook ? 'Buchung bestätigen' : 'Haustier & Behandlung wählen'}
            </ButtonText>
          )}
        </Button>
      </Box>
    </Box>
  )
}
