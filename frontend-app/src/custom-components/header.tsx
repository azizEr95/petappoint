import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Text,
} from '@/src/gluestack-components/ui'

export function Header() {
  return (
    <>
      <Box className='flex-1 bg-primary-500 rounded-b-3xl px-5 pt-4 pb-8'>
        <Box className='flex-row items-center justify-between mb-6'>
          <Box>
            <Text className=' text-white'>Guten Tag,</Text>
            <Text className=' text-white text-xl font-bold'>
              Max Mustermann
            </Text>
          </Box>
          <Avatar size='lg' className='bg-primary-400' />
        </Box>
        {/* Location */}
        <Box className='flex-row items-center justify-between mb-6'>
          <ButtonGroup>
            <Button
              variant='solid'
              className='bg-primary-400 rounded-full px-4 py-2'
            >
              <FontAwesomeIcon name='location-arrow' color='white' size={15} />
              <ButtonText className='text-white text-xl'>
                Berlin, Deutschland
              </ButtonText>
              <FontAwesomeIcon name='angle-right' color='white' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  )
}
