import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Text,
} from '@/src/gluestack-components/ui'
import { useCancelAppointment } from '@src/hooks/useCancelAppointment'
import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function CancelAppointmentScreen() {
  const { t } = useTranslation()
  const { aptId, aptName } = useLocalSearchParams<{ aptId: string; aptName: string }>()
  const { mutate: cancel, isPending } = useCancelAppointment()

  function handleConfirm() {
    cancel(Number(aptId), {
      onSuccess: () => router.back(),
    })
  }

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Grüner Header */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('appointments.cancel_title')}
            </Text>
          </Box>
          <ButtonGroup>
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {/* Inhalt */}
      <Box className='flex-1 items-center justify-center px-6 gap-6'>
        <FontAwesomeIcon name='exclamation-triangle' size={56} color='#e53e3e' />
        <Text size='lg' className='text-typography-700 text-center'>
          {t('appointments.cancel_confirm', { name: aptName })}
        </Text>
      </Box>

      {/* Buttons */}
      <Box className='bg-background-0 px-5 py-4 shadow-lg gap-3'>
        <Button
          size='lg'
          variant='solid'
          action='negative'
          className='rounded-lg'
          onPress={handleConfirm}
          disabled={isPending}
        >
          <ButtonText className='text-white'>{t('appointments.cancel_yes')}</ButtonText>
        </Button>
        <Button
          size='lg'
          variant='outline'
          className='rounded-lg'
          onPress={() => router.back()}
          disabled={isPending}
        >
          <ButtonText>{t('appointments.cancel_no')}</ButtonText>
        </Button>
      </Box>
    </Box>
  )
}
