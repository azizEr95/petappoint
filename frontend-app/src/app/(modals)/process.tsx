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
import { useQuery } from '@tanstack/react-query'
import { getAppointment } from '@src/api/appointments'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useBookAppointment } from '@src/hooks/useBookAppointment'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'
import i18n from '@src/i18n'

function getLocale() {
  return i18n.language === 'en' ? 'en-US' : 'de-DE'
}

function formatDateTime(date: Date, timeSuffix: string): { date: string; time: string } {
  return {
    date: date.toLocaleDateString(getLocale(), {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) + timeSuffix,
  }
}

export default function Process() {
  const { t } = useTranslation()
  const { appointmentId, animalId: preselectedAnimalId, serviceId: preselectedServiceId } = useLocalSearchParams<{ appointmentId: string; animalId?: string; serviceId?: string }>()

  const aptId = Number(appointmentId)

  const { data: appointment, isLoading: aptLoading } = useQuery({
    queryKey: ['appointment', aptId],
    queryFn: () => getAppointment(aptId),
    enabled: !!aptId,
  })

  const { data: animals, isLoading: animalsLoading } = useMyAnimals()
  const { mutate: book, isPending: isBooking } = useBookAppointment()

  const isEditMode = !!(appointment?.animal?.id)

  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  useEffect(() => {
    if (selectedAnimalId === null) {
      const preselected = preselectedAnimalId ? Number(preselectedAnimalId) : null
      const onlyAnimal = animals?.length === 1 ? animals[0].id : null
      const initial = appointment?.animal?.id ?? preselected ?? onlyAnimal
      if (initial) setSelectedAnimalId(initial)
    }
    if (selectedServiceId === null) {
      const fromAppointment = appointment?.service?.id ?? null
      const availableIds = (appointment?.availableServices ?? []).map((s) => s.id)
      const preselectedIds = preselectedServiceId
        ? preselectedServiceId.split(',').map(Number).filter((n) => !isNaN(n) && n > 0)
        : []
      const matchingPreselected = preselectedIds.filter((id) => availableIds.includes(id))
      const fromPreselected = matchingPreselected.length === 1 ? matchingPreselected[0] : null
      const onlyService = availableIds.length === 1 ? availableIds[0] : null
      const initial = fromAppointment ?? fromPreselected ?? onlyService
      if (initial) setSelectedServiceId(initial)
    }
  }, [appointment, preselectedAnimalId, preselectedServiceId, animals])

  if (!appointmentId || isNaN(aptId)) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Text className='text-red-500'>{t('process.invalid_id')}</Text>
      </Box>
    )
  }

  const [bookingError, setBookingError] = useState<string | null>(null)
  const isLoading = aptLoading || animalsLoading
  const canBook = !!selectedAnimalId && !!selectedServiceId && !isBooking

  const timeSuffix = t('common.time_suffix')

  function handleBook() {
    if (!canBook) return
    setBookingError(null)
    const formatted = appointment ? formatDateTime(appointment.startTime, timeSuffix) : null
    const selectedAnimal = (animals ?? []).find((a) => a.id === selectedAnimalId)
    const selectedService = (appointment?.availableServices ?? []).find((s) => s.id === selectedServiceId)

    book(
      { appointmentId: aptId, animalId: selectedAnimalId!, serviceId: selectedServiceId!, practiceId: appointment!.veterinaryPractice.id },
      {
        onSuccess: () => {
          router.replace({
            pathname: routes.modals.bookingConfirmation,
            params: {
              practiceName: appointment!.veterinaryPractice.name,
              date: formatted?.date ?? '',
              time: formatted?.time ?? '',
              serviceName: selectedService?.name ?? '',
              animalName: selectedAnimal?.name ?? '',
            },
          })
        },
        onError: (e) => setBookingError(e instanceof Error ? e.message : t('process.booking_error')),
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

  const formatted = appointment ? formatDateTime(appointment.startTime, timeSuffix) : null

  return (
    <Box className='flex-1 bg-background-100'>
      {/** Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {isEditMode ? t('process.title_edit') : t('process.title_book')}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {isEditMode ? t('process.subtitle_edit') : t('process.subtitle_book')}
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
                {t('process.location_time')}
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
                  <FontAwesomeIcon name='calendar' size={14} />
                  <Text size='sm' className='text-typography-700'>{formatted.date}</Text>
                </HStack>
                <HStack className='items-center gap-2 mt-1'>
                  <FontAwesomeIcon name='clock-o' size={14} />
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
                {t('process.pet_section')}
              </Text>
            </HStack>
            <Box className='flex-row flex-wrap gap-2'>
              {(animals ?? []).map((animal) => {
                const isSelected = selectedAnimalId === animal.id
                return (
                  <Pressable
                    key={animal.id}
                    onPress={() => setSelectedAnimalId(animal.id)}
                    className='px-3 py-2 rounded-lg border'
                    style={{
                      backgroundColor: isSelected ? '#2e8a59' : undefined,
                      borderColor: isSelected ? '#2e8a59' : '#e5e7eb',
                    }}
                  >
                    <Text
                      size='sm'
                      className='font-semibold'
                      style={{ color: isSelected ? '#ffffff' : '#374151' }}
                    >
                      {animal.name}
                    </Text>
                  </Pressable>
                )
              })}
              <Button
                variant='outline'
                className='rounded-xl border-dashed border-primary-400'
                onPress={() => router.push(routes.modals.addPet)}
              >
                <FontAwesomeIcon name='plus' color='#2e8a59' size={14} />
                <ButtonText className='text-primary-600 font-semibold ml-1'>
                  {t('process.add_pet_btn')}
                </ButtonText>
              </Button>
            </Box>
          </Card>

          {/* Behandlung auswählen */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4 mb-3'>
            <HStack className='items-center gap-2 mb-3'>
              <FontAwesomeIcon name='stethoscope' color='#2e8a59' size={18} />
              <Text size='sm' className='font-semibold text-typography-500 uppercase'>
                {t('process.treatment_section')}
              </Text>
            </HStack>
            <Box className='flex-row flex-wrap gap-2'>
              {(appointment?.availableServices ?? []).map((service) => {
                const isSelected = selectedServiceId === service.id
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => setSelectedServiceId(service.id)}
                    className='px-3 py-2 rounded-full border'
                    style={{
                      backgroundColor: isSelected ? '#2e8a59' : undefined,
                      borderColor: isSelected ? '#2e8a59' : '#e5e7eb',
                    }}
                  >
                    <Text
                      size='sm'
                      className='font-medium'
                      style={{ color: isSelected ? '#ffffff' : '#374151' }}
                    >
                      {service.name}
                    </Text>
                  </Pressable>
                )
              })}
              {!appointment?.availableServices?.length && (
                <Text className='text-typography-400'>{t('process.no_services')}</Text>
              )}
            </Box>
          </Card>

        </Box>
      </ScrollView>

      {/* Bottom button */}
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
              {isEditMode ? t('process.btn_save') : canBook ? t('process.btn_confirm') : t('process.btn_select')}
            </ButtonText>
          )}
        </Button>
      </Box>
    </Box>
  )
}
