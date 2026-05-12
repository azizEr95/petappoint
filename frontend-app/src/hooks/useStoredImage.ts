import * as SecureStore from 'expo-secure-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useStoredImage(key: string): [string | null, (uri: string) => Promise<void>] {
  const queryClient = useQueryClient()

  const { data: imageUri = null } = useQuery({
    queryKey: ['storedImage', key],
    queryFn: () => SecureStore.getItemAsync(key),
  })

  const { mutateAsync: saveImageUri } = useMutation({
    mutationFn: async (uri: string) => {
      await SecureStore.setItemAsync(key, uri)
      return uri
    },
    onSuccess: (uri) => {
      queryClient.setQueryData(['storedImage', key], uri)
    },
  })

  return [imageUri, async (uri: string) => { await saveImageUri(uri) }]
}
