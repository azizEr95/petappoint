// app/(modals)/practice.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  Text,
  ButtonText,
  ButtonGroup,
  ScrollView,
  Card,
  HStack,
  Pressable,
  Spinner,
} from '@/src/gluestack-components/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { usePracticeDetails } from '@src/hooks/usePracticeDetails'

function formatDate(date: Date): string {
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  if (isToday) return 'Heute'
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'short' })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const practiceId = Number(id)

  const { practice, services, appointments } = usePracticeDetails(practiceId)

  const groupedDates = useMemo(() => {
    if (!appointments.data) return []
    const map = new Map<
      string,
      { date: Date; slots: { id: number; time: string }[] }
    >()
    for (const apt of appointments.data) {
      const key = formatDate(apt.startTime)
      if (!map.has(key)) map.set(key, { date: apt.startTime, slots: [] })
      map.get(key)!.slots.push({ id: apt.id, time: formatTime(apt.startTime) })
    }
    return Array.from(map.entries()).map(([label, val]) => ({
      label,
      day: formatDay(val.date),
      slots: val.slots,
    }))
  }, [appointments.data])

  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null)

  const selectedSlots = groupedDates[selectedDateIndex]?.slots ?? []

  if (practice.isLoading) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Spinner size='large' />
      </Box>
    )
  }

  if (practice.isError || !practice.data) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Text className='text-red-500'>
          Praxis konnte nicht geladen werden.
        </Text>
      </Box>
    )
  }

  const vet = practice.data

  return (
    <>
      <ScrollView>
        <Box className='bg-slate-100'>
          <Box className='h-[200px] bg-primary-500 rounded-b-3xl justify-center px-6 pt-10'>
            <Box className='flex-row justify-between items-start'>
              <Box>
                <Text size='3xl' className='font-bold text-white'>
                  {vet.name}
                </Text>
              </Box>
              <ButtonGroup>
                <Button
                  className='bg-white/20 rounded-3xl'
                  onPress={() => router.back()}
                >
                  <FontAwesomeIcon name='times' color='#ffffff' size={20} />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
          <Box className='px-5 pt-4 pb-8 -mt-8'>
            {/**Vorstellung*/}
            <Box className='bg-white rounded-lg shadow-lg justify-center'>
              <Box className='flex-row rounded-lg mx-3 mb-3 mt-2 justify-between'>
                <Text size='xl' className='font-bold text-gray-700 flex-1 mr-2'>
                  {vet.name}
                </Text>
                <Box className='bg-primary-100 justify-center rounded-full px-3 py-1'>
                  <Text className='text-primary-500 font-semibold'>
                    Geöffnet
                  </Text>
                </Box>
              </Box>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='map-marker' color='#374151' size={20} />
                <Text className='text-gray-700 ml-2'>
                  {vet.address.street}, {vet.address.cityCode}{' '}
                  {vet.address.city}
                </Text>
              </HStack>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='phone' color='#374151' size={20} />
                <Text className='text-gray-700 ml-2'>{vet.phone}</Text>
              </HStack>
              {vet.website && (
                <HStack className='flex-row mx-3 mb-3'>
                  <FontAwesomeIcon name='globe' color='#374151' size={20} />
                  <Text className='text-gray-700 ml-2'>{vet.website}</Text>
                </HStack>
              )}
            </Box>

            {/** Oeffnungszeiten */}
            {/*
            <Box className='bg-white rounded-lg shadow-lg mt-4'>
              <Box className='py-2 rounded-lg mx-3 '>
                <Text size='xl' className='font-bold text-gray-700'>
                  Öffnungszeiten
                </Text>
                <Box className='py-2'>
                  {vetInfo.openingHours.map((item) => (
                    <Box key={item.day} className='flex-row justify-between'>
                      <Text size='lg' className='font-semibold'>
                        {item.day}
                      </Text>
                      <Text size='lg' className='font-semibold'>
                        {item.hours}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>/*}
            <Box className='bg-white rounded-lg shadow-lg mt-4'>
              <Box className='py-2 rounded-lg mx-3'>
                <Text size='xl' className='font-bold text-gray-700'>
                  Öffnungszeiten
                </Text>
                <Box className='py-2 flex-row items-center gap-2'>
                  <FontAwesomeIcon name='clock-o' color='#9ca3af' size={16} />
                  <Text className='text-gray-400 italic'>
                    Öffnungszeiten müssen noch hinzugefügt werden.
                  </Text>
                </Box>
              </Box>
            </Box>

            {/*Leistungen */}
            {services.data && services.data.length > 0 && (
              <Box className='bg-white mt-4 rounded-lg'>
                <Box className='m-3'>
                  <Text size='xl' className='font-bold text-gray-700'>
                    Leistungen
                  </Text>
                  <Box className='flex-row flex-wrap gap-2 mt-2'>
                    {services.data.map((service) => (
                      <Card
                        key={service.id}
                        className='bg-primary-100 py-1 px-3 rounded-full self-start'
                      >
                        <Text size='md' className='text-gray-700'>
                          {service.name}
                        </Text>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/*Termine */}
            <Box className='bg-white rounded-lg shadow-lg justify-center mt-4'>
              <Box className='rounded-lg mx-3 mb-3 mt-2'>
                <Text size='xl' className='font-bold text-gray-700'>
                  Termin buchen
                </Text>

                {appointments.isLoading ? (
                  <Box className='items-center py-4'>
                    <Spinner size='small' />
                  </Box>
                ) : groupedDates.length === 0 ? (
                  <Text className='text-gray-500 mt-2'>
                    Keine freien Termine verfügbar.
                  </Text>
                ) : (
                  <>
                    <Box className='flex-row flex-wrap gap-2 mt-2'>
                      <ScrollView
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        className='pb-3 -mx-1 px-1'
                      >
                        {groupedDates.map((dateGroup, index) => (
                          <Pressable
                            key={dateGroup.label}
                            onPress={() => {
                              setSelectedDateIndex(index)
                              setSelectedAppointmentId(null)
                            }}
                            className={`flex-col items-center min-w-[60px] py-3 px-2 rounded-xl mr-2 ${
                              selectedDateIndex === index
                                ? 'bg-primary-500'
                                : 'bg-secondary-100'
                            }`}
                          >
                            <Text
                              size='xs'
                              className={`opacity-80 ${
                                selectedDateIndex === index
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}
                            >
                              {dateGroup.day}
                            </Text>
                            <Text
                              size='sm'
                              className={`font-semibold ${
                                selectedDateIndex === index
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}
                            >
                              {dateGroup.label}
                            </Text>
                            <Text
                              size='xs'
                              className={`mt-1 opacity-70 ${
                                selectedDateIndex === index
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}
                            >
                              {dateGroup.slots.length} frei
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </Box>

                    <Box className='mt-4'>
                      <Text size='sm' className='text-gray-400 mb-3'>
                        Verfügbare Zeiten
                      </Text>
                      <Box className='flex-row flex-wrap gap-2'>
                        {selectedSlots.map((slot) => (
                          <Pressable
                            key={slot.id}
                            onPress={() => setSelectedAppointmentId(slot.id)}
                            className={`py-2 px-3 rounded-lg w-[23%] items-center ${
                              selectedAppointmentId === slot.id
                                ? 'bg-primary-500'
                                : 'bg-secondary-100'
                            }`}
                          >
                            <Text
                              size='sm'
                              className={`font-medium ${
                                selectedAppointmentId === slot.id
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}
                            >
                              {slot.time}
                            </Text>
                          </Pressable>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}

                <Box>
                  <Button
                    className='w-full mt-4 h-12 rounded-xl bg-primary-500'
                    disabled={!selectedAppointmentId}
                    onPress={() =>
                      router.push({
                        pathname: '/(modals)/process',
                        params: {
                          appointmentId: String(selectedAppointmentId),
                          practiceId: String(practiceId),
                        },
                      })
                    }
                  >
                    <ButtonText>
                      {selectedAppointmentId
                        ? `Termin buchen`
                        : 'Zeit auswählen'}
                    </ButtonText>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </>
  )
}
