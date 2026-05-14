// app/(modals)/practice.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  Text,
  ButtonText,
  ScrollView,
  Card,
  HStack,
  Pressable,
  Spinner,
} from '@/src/gluestack-components/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { usePracticeDetails } from '@src/hooks/usePracticeDetails'
import { useFavorites } from '@src/hooks/useFavorites'
import { useToggleFavorite } from '@src/hooks/useToggleFavorite'
import { useColorScheme } from 'nativewind'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'
import i18n from '@src/i18n'

function getLocale() {
  return i18n.language === 'en' ? 'en-US' : 'de-DE'
}

function formatDate(date: Date, todayLabel: string): string {
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  if (isToday) return todayLabel
  return date.toLocaleDateString(getLocale(), { day: '2-digit', month: '2-digit' })
}

function formatDay(date: Date): string {
  return date.toLocaleDateString(getLocale(), { weekday: 'short' })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(getLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Practice() {
  const { t } = useTranslation()
  const { id, animalId: preselectedAnimalId } = useLocalSearchParams<{ id: string; animalId?: string }>()
  const practiceId = Number(id)

  const { practice, services, appointments } = usePracticeDetails(practiceId)
  const { favoriteIds } = useFavorites()
  const { mutate: toggle } = useToggleFavorite()
  const isFav = favoriteIds.has(practiceId)

  if (!id || isNaN(practiceId)) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Text className='text-red-500'>{t('practice.invalid_id')}</Text>
      </Box>
    )
  }

  const todayLabel = t('practice.today')

  const groupedDates = useMemo(() => {
    if (!appointments.data) return []
    const map = new Map<
      string,
      { date: Date; slots: { id: number; time: string }[] }
    >()
    for (const apt of appointments.data) {
      const key = formatDate(apt.startTime, todayLabel)
      if (!map.has(key)) map.set(key, { date: apt.startTime, slots: [] })
      map.get(key)!.slots.push({ id: apt.id, time: formatTime(apt.startTime) })
    }
    return Array.from(map.entries()).map(([label, val]) => ({
      label,
      day: formatDay(val.date),
      slots: val.slots,
    }))
  }, [appointments.data, todayLabel])

  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'

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
          {t('practice.error_loading')}
        </Text>
      </Box>
    )
  }

  const vet = practice.data

  return (
    <>
      <ScrollView>
        <Box className='bg-background-100'>
          <Box className='h-[200px] bg-primary-500 rounded-b-3xl justify-center px-6 pt-10'>
            <Box className='flex-row justify-between items-center'>
              <Button
                className='bg-white/20 rounded-3xl'
                onPress={() => toggle({ practiceId, isFavorite: isFav })}
              >
                <FontAwesomeIcon
                  name={isFav ? 'heart' : 'heart-o'}
                  color={isFav ? '#ef4444' : '#ffffff'}
                  size={20}
                />
              </Button>
              <Button
                className='bg-white/20 rounded-3xl'
                onPress={() => router.back()}
              >
                <FontAwesomeIcon name='times' color='#ffffff' size={20} />
              </Button>
            </Box>
            <Box className='mt-3'>
              <Text size='3xl' className='font-bold text-white'>
                {vet.name}
              </Text>
            </Box>
          </Box>
          <Box className='px-5 pt-4 pb-8 -mt-8'>
            {/**Vorstellung*/}
            <Box className='bg-background-0 rounded-lg shadow-lg justify-center'>
              <Box className='flex-row rounded-lg mx-3 mb-3 mt-2 justify-between'>
                <Text size='xl' className='font-bold text-typography-700 flex-1 mr-2'>
                  {vet.name}
                </Text>
                <Box className='bg-primary-100 justify-center rounded-full px-3 py-1'>
                  <Text className='text-primary-500 font-semibold'>
                    {t('practice.open')}
                  </Text>
                </Box>
              </Box>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='map-marker' color={iconColor} size={20} />
                <Text className='text-typography-700 ml-2'>
                  {vet.address.street}, {vet.address.cityCode}{' '}
                  {vet.address.city}
                </Text>
              </HStack>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='phone' color={iconColor} size={20} />
                <Text className='text-typography-700 ml-2'>{vet.phone}</Text>
              </HStack>
              {vet.website && (
                <HStack className='flex-row mx-3 mb-3'>
                  <FontAwesomeIcon name='globe' color={iconColor} size={20} />
                  <Text className='text-typography-700 ml-2'>{vet.website}</Text>
                </HStack>
              )}
            </Box>

            {/*Leistungen */}
            {services.data && services.data.length > 0 && (
              <Box className='bg-background-0 mt-4 rounded-lg'>
                <Box className='m-3'>
                  <Box className='flex-row flex-wrap gap-2 mt-2'>
                    {services.data.map((service) => (
                      <Card
                        key={service.id}
                        className='bg-primary-100 py-1 px-3 rounded-full self-start'
                      >
                        <Text size='md' className='text-typography-700'>
                          {service.name}
                        </Text>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/*Termine */}
            <Box className='bg-background-0 rounded-lg shadow-lg justify-center mt-4'>
              <Box className='rounded-lg mx-3 mb-3 mt-2'>
                <Text size='xl' className='font-bold text-typography-700'>
                  {t('practice.book_btn_selected')}
                </Text>

                {appointments.isLoading ? (
                  <Box className='items-center py-4'>
                    <Spinner size='small' />
                  </Box>
                ) : groupedDates.length === 0 ? (
                  <Text className='text-typography-500 mt-2'>
                    {t('practice.no_appointments')}
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
                                  : 'text-typography-700'
                              }`}
                            >
                              {dateGroup.day}
                            </Text>
                            <Text
                              size='sm'
                              className={`font-semibold ${
                                selectedDateIndex === index
                                  ? 'text-white'
                                  : 'text-typography-700'
                              }`}
                            >
                              {dateGroup.label}
                            </Text>
                            <Text
                              size='xs'
                              className={`mt-1 opacity-70 ${
                                selectedDateIndex === index
                                  ? 'text-white'
                                  : 'text-typography-700'
                              }`}
                            >
                              {t('practice.slots_free', { count: dateGroup.slots.length })}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </Box>

                    <Box className='mt-4'>
                      <Text size='sm' className='text-typography-400 mb-3'>
                        {t('practice.available_times')}
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
                                  : 'text-typography-700'
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
                        pathname: routes.modals.process,
                        params: {
                          appointmentId: String(selectedAppointmentId),
                          practiceId: String(practiceId),
                          ...(preselectedAnimalId ? { animalId: preselectedAnimalId } : {}),
                        },
                      })
                    }
                  >
                    <ButtonText>
                      {selectedAppointmentId
                        ? t('practice.book_btn_selected')
                        : t('practice.book_btn_unselected')}
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
