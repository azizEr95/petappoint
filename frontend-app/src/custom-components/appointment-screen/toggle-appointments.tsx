import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
} from '@/src/gluestack-components/ui'
import { useTranslation } from 'react-i18next'

interface ToggleAptProps {
  activeTab: any
  setActiveTab: any
  futureCount: number
  pastCount: number
}
export function ToggleApt({
  activeTab,
  setActiveTab,
  futureCount,
  pastCount,
}: ToggleAptProps) {
  const { t } = useTranslation()

  return (
    <>
      <Box className='flex-row justify-center rounded-lg pb-6'>
        <ButtonGroup
          isAttached
          className='bg-primary-100 flex-row justify-center shadow-md rounded-lg w-fit p-2'
        >
          <Button
            size='lg'
            onPress={() => setActiveTab(true)}
            className={`flex rounded-lg font-medium ${activeTab ? 'bg-background-0 shadow-sm' : 'bg-primary-100 shadow-none'}`}
          >
            <ButtonText className='text-typography-700'>
              {t('appointments.tab_upcoming', { count: futureCount })}
            </ButtonText>
          </Button>

          <Button
            size='lg'
            onPress={() => setActiveTab(false)}
            className={`flex rounded-lg font-medium ${!activeTab ? 'bg-background-0 shadow-sm' : 'bg-primary-100 shadow-none'}`}
          >
            <ButtonText className='text-typography-700'>
              {t('appointments.tab_past', { count: pastCount })}
            </ButtonText>
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
