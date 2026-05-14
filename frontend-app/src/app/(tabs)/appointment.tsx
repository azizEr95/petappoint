import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  Spinner,
  Text,
} from '@src/gluestack-components/ui'
import { AnimalAvatar } from '@/src/custom-components/animal-avatar'
import { useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { Header } from '@/src/custom-components/header'
import { ToggleApt } from '@/src/custom-components/appointment-screen/toggle-appointments'
import { useMyAppointments } from '@src/hooks/useMyAppointments'
import { useRouter } from 'expo-router'
import { useCancelAppointment } from '@src/hooks/useCancelAppointment'
import { useColorScheme } from 'nativewind'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'
import i18n from '@src/i18n'

function getLocale() {
  return i18n.language === 'en' ? 'en-US' : 'de-DE'
}

function formatAppointmentDate(date: Date): string {
  return date.toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' })
}

export default function Appointment() {
  const { t } = useTranslation()
  const router = useRouter()
  const { future, past, isLoading, isError } = useMyAppointments()
  const { mutate: cancel } = useCancelAppointment()
  const [activeTab, setActiveTab] = useState<boolean>(true)
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'

  function handleCancel(aptId: number, aptName: string) {
    Alert.alert(
      t('appointments.cancel_title'),
      t('appointments.cancel_confirm', { name: aptName }),
      [
        { text: t('appointments.cancel_no'), style: 'cancel' },
        { text: t('appointments.cancel_yes'), style: 'destructive', onPress: () => cancel(aptId) },
      ],
    )
  }

  const displayed = activeTab ? future : past

  return (
    <>
      <Box className='h-full bg-background-100'>
        <ScrollView>
          <Header />

          {/** Card */}
          <Box className='px-5 -mt-4'>
            <SearchApt />
            {/** Toggle für kommende und vergangene Termine */}
            <ToggleApt
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              futureCount={future.length}
              pastCount={past.length}
            />

            {isLoading && (
              <Box className='items-center py-8'>
                <Spinner size='large' />
              </Box>
            )}

            {isError && (
              <Text className='text-red-500 text-center py-4'>
                {t('appointments.error_loading')}
              </Text>
            )}

            {!isLoading && !isError && displayed.length === 0 && (
              <Text className='text-gray-500 text-center py-4'>
                {activeTab ? t('appointments.no_upcoming') : t('appointments.no_past')}
              </Text>
            )}

            {displayed.map((apt) => (
              <Card
                key={apt.id}
                className='border-primary-500 border-l-4 shadow-sm mb-3'
              >
                <Box className='flex-row items-start gap-3'>
                  {/* Haustier‑Icon */}
                  <Box>
                    <AnimalAvatar size='lg' animalId={apt.animal?.id} name={apt.animal?.name} />
                  </Box>

                  {/* Inhalt */}
                  <Box className='flex-1'>
                    <Box className='flex-row items-center justify-between'>
                      <Text className='text-typography-700 text-md font-semibold'>
                        {apt.animal?.name ?? '–'}
                      </Text>
                      <Box className='bg-primary-100 rounded-full px-3 py-1'>
                        <Text className='text-typography-700'>
                          {apt.service?.name ?? apt.availableServices[0]?.name ?? '–'}
                        </Text>
                      </Box>
                    </Box>
                    <Box className='flex-row items-start gap-1 py-2'>
                      <FontAwesomeIcon name='map-marker' color={iconColor} size={15} />
                      <Text className='text-typography-700 text-md font-semibold'>
                        {apt.veterinaryPractice.name}
                      </Text>
                    </Box>

                    {/* Uhrzeit‑Zeile */}
                    <Box className='flex-row items-center gap-1'>
                      <FontAwesomeIcon name='clock-o' color={iconColor} size={15} />
                      <Text className='text-typography-700 font-semibold'>
                        {formatAppointmentDate(apt.startTime)}, {formatTime(apt.startTime)}{t('common.time_suffix')}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                {/** Absagen & Bearbeiten Buttons bei kommenden Termine */}
                {activeTab && (
                  <Box className='flex gap-2 mt-4 pt-3 border-t border-border'>
                    <ButtonGroup className='flex-row justify-center rounded-lg w-fit p-2'>
                      <Button
                        size='lg'
                        variant='outline'
                        action='negative'
                        className='rounded-lg font-medium'
                        onPress={() => handleCancel(apt.id, apt.animal?.name ?? t('appointments.this_animal'))}
                      >
                        <ButtonText className='text-red-500'>{t('appointments.cancel_btn')}</ButtonText>
                      </Button>

                      <Button
                        size='lg'
                        variant='outline'
                        action='positive'
                        className='rounded-lg font-medium'
                        onPress={() => router.push({ pathname: routes.modals.process, params: { appointmentId: apt.id } })}
                      >
                        <ButtonText>{t('appointments.edit_btn')}</ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box>
                )}
                {/** Erneut buchen Button bei vergangenen Terminen */}
                {!activeTab && (
                  <Box className='flex gap-2 mt-4 pt-3 border-t border-border'>
                    <ButtonGroup className='flex-row justify-center rounded-lg w-fit p-2'>
                      <Button
                        size='lg'
                        variant='solid'
                        action='positive'
                        className='rounded-lg font-medium'
                        onPress={() => router.push({ pathname: routes.modals.practice, params: { id: apt.veterinaryPractice.id, animalId: apt.animal?.id } })}
                      >
                        <ButtonText className='text-white'>{t('appointments.rebook_btn')}</ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
