import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { verifyEmailApi } from '@src/api/auth'
import { useAuthStore } from '@src/stores/authStore'

export function useVerifyEmail() {
  const setVerified = useAuthStore((s) => s.setVerified)

  return useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: () => {
      setVerified()
      router.replace('/(tabs)/home')
    },
  })
}
