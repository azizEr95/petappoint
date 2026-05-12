import { AppAvatar } from './app-avatar'
import { useStoredImage } from '@src/hooks/useStoredImage'

interface AnimalAvatarProps {
  animalId?: number | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function AnimalAvatar({ animalId, name, size = 'lg' }: AnimalAvatarProps) {
  const [imageUri] = useStoredImage(animalId ? `avatar_animal_${animalId}` : '__none__')
  return <AppAvatar size={size} name={name} imageUri={imageUri} />
}
