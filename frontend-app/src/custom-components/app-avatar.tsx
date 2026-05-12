import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Pressable,
} from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from './tabbar-icon'

function getInitials(name?: string | null): string {
  if (!name?.trim()) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface AppAvatarProps {
  name?: string | null
  imageUri?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  onUpload?: (uri: string) => void
}

export function AppAvatar({
  name,
  imageUri,
  size = 'md',
  className,
  onUpload,
}: AppAvatarProps) {
  async function handlePress() {
    try {
      const ImagePicker = await import('expo-image-picker')
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onUpload?.(result.assets[0].uri)
      }
    } catch {
      // Native module not available in current build
    }
  }

  const avatarEl = (
    <Avatar size={size} className={className ?? 'bg-primary-400'}>
      {imageUri ? (
        <AvatarImage source={{ uri: imageUri }} />
      ) : (
        <AvatarFallbackText>{getInitials(name)}</AvatarFallbackText>
      )}
    </Avatar>
  )

  if (!onUpload) return avatarEl

  return (
    <Pressable onPress={handlePress} className='relative self-start'>
      {avatarEl}
      <Box className='absolute bottom-0 right-0 bg-primary-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white'>
        <FontAwesomeIcon name='camera' color='#ffffff' size={11} />
      </Box>
    </Pressable>
  )
}
