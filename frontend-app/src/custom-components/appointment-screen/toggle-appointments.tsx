import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
} from '@/src/gluestack-components/ui'

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
            className={`flex rounded-lg font-medium ${activeTab ? 'bg-white shadow-sm' : 'bg-primary-100 shadow-none'}`}
          >
            <ButtonText className='text-gray-700'>
              Kommend ({futureCount})
            </ButtonText>
          </Button>

          <Button
            size='lg'
            onPress={() => setActiveTab(false)}
            className={`flex rounded-lg font-medium ${!activeTab ? 'bg-white shadow-sm' : 'bg-primary-100 shadow-none'}`}
          >
            <ButtonText className='text-gray-700'>
              Vergangen ({pastCount})
            </ButtonText>
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
