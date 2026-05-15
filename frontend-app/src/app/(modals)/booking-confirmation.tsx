import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonText,
  Card,
  HStack,
  ScrollView,
  Text,
} from '@/src/gluestack-components/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'

export default function BookingConfirmation() {
  const { t } = useTranslation()
  const { practiceName, date, time, serviceName, animalName } =
    useLocalSearchParams<{
      practiceName: string
      date: string
      time: string
      serviceName: string
      animalName: string
    }>()

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top white area with green checkmark */}
      <Box className='bg-background-0 rounded-b-3xl px-6 pb-8 pt-16 items-center shadow-sm'>
        <Box className='w-20 h-20 rounded-full bg-primary-100 items-center justify-center mb-4'>
          <FontAwesomeIcon name='check' color='#2e8a59' size={40} />
        </Box>
        <Text size='2xl' className='font-bold text-typography-800 text-center'>
          {t('booking_confirmation.success_title')}
        </Text>
        <Text size='sm' className='text-typography-500 text-center mt-2'>
          {t('booking_confirmation.success_email')}
        </Text>
      </Box>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <Box className='px-5 pt-6'>

          {/* Details Card */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4 mb-4'>

            {/* Tierarztpraxis */}
            <HStack className='items-center gap-2 mb-1'>
              <FontAwesomeIcon name='building' color='#2e8a59' size={16} />
              <Text size='xs' className='font-semibold text-typography-500 uppercase'>
                {t('booking_confirmation.practice_label')}
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800 mb-3'>
              {practiceName ?? '–'}
            </Text>

            <Box className='h-px bg-outline-200 mb-3' />

            {/* Datum */}
            <HStack className='items-center gap-2 mb-1'>
              <FontAwesomeIcon name='calendar' size={15} />
              <Text size='xs' className='font-semibold text-typography-500 uppercase'>
                {t('booking_confirmation.date_label')}
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800 mb-3'>
              {date ?? '–'}
            </Text>

            <Box className='h-px bg-outline-200 mb-3' />

            {/* Uhrzeit */}
            <HStack className='items-center gap-2 mb-1'>
              <FontAwesomeIcon name='clock-o' size={15} />
              <Text size='xs' className='font-semibold text-typography-500 uppercase'>
                {t('booking_confirmation.time_label')}
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800 mb-3'>
              {time ?? '–'}
            </Text>

            <Box className='h-px bg-outline-200 mb-3' />

            {/* Behandlung */}
            <HStack className='items-center gap-2 mb-1'>
              <FontAwesomeIcon name='stethoscope' size={15} />
              <Text size='xs' className='font-semibold text-typography-500 uppercase'>
                {t('booking_confirmation.treatment_label')}
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800 mb-3'>
              {serviceName ?? '–'}
            </Text>

            <Box className='h-px bg-outline-200 mb-3' />

            {/* Tier */}
            <HStack className='items-center gap-2 mb-1'>
              <FontAwesomeIcon name='paw' size={15} />
              <Text size='xs' className='font-semibold text-typography-500 uppercase'>
                {t('booking_confirmation.animal_label')}
              </Text>
            </HStack>
            <Text size='md' className='font-semibold text-typography-800'>
              {animalName ?? '–'}
            </Text>

          </Card>

        </Box>
      </ScrollView>

      {/* Bottom buttons */}
      <Box className='bg-background-0 px-5 py-4 shadow-lg gap-3'>
        <Button
          className='w-full h-12 rounded-xl bg-primary-500'
          onPress={() => {
            router.dismissAll()
            router.push(routes.tabs.appointment)
          }}
        >
          <ButtonText className='text-white font-bold'>{t('booking_confirmation.go_to_appointments')}</ButtonText>
        </Button>
        <Button
          className='w-full h-12 rounded-xl'
          variant='outline'
          onPress={() => {
            router.dismissAll()
            router.push(routes.tabs.home)
          }}
        >
          <ButtonText className='font-bold'>{t('booking_confirmation.back_to_home')}</ButtonText>
        </Button>
      </Box>
    </Box>
  )
}
