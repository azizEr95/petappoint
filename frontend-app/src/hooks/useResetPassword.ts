import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { resetPasswordApi } from '@src/api/auth'

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => router.replace('/(auth)/login'),
  })
}
