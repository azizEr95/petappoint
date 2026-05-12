import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite, removeFavorite } from '@src/api/favorites'
import { useAuthStore } from '@src/stores/authStore'
import { Alert } from 'react-native'

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({ practiceId, isFavorite }: { practiceId: number; isFavorite: boolean }) =>
      isFavorite ? removeFavorite(user!.id, practiceId) : addFavorite(user!.id, practiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] })
    },
    onError: (error) => {
      console.error('Favoriten-Fehler:', error)
      Alert.alert('Fehler', String(error))
    },
  })
}
