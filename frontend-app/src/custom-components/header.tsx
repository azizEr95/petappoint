import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Text,
} from '@/src/gluestack-components/ui'
import { usePerson } from '@src/hooks/usePerson'
import { AppAvatar } from '@/src/custom-components/app-avatar'
import { useStoredImage } from '@src/hooks/useStoredImage'

export function Header() {
  const { data: person } = usePerson()
  const [profileImage, saveProfileImage] = useStoredImage('avatar_profile')

  const displayName = person ? `${person.firstName} ${person.lastName}` : '…'

  return (
    <>
      <Box className='bg-primary-500 rounded-b-3xl px-5 pt-16 pb-8'>
        <Box className='flex-row items-center justify-between mb-6'>
          <Box>
            <Text className=' text-white'>Guten Tag,</Text>
            <Text className=' text-white text-xl font-bold'>{displayName}</Text>
          </Box>
          <AppAvatar
            size='lg'
            name={displayName}
            imageUri={profileImage}
            onUpload={saveProfileImage}
          />
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
                {person?.address?.city ?? 'Standort'}
              </ButtonText>
              <FontAwesomeIcon name='angle-right' color='white' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  )
}
