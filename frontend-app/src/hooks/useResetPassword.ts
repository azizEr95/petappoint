import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { resetPasswordApi } from '@src/api/auth'
import { routes } from '@src/constants/routes'

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => router.replace(routes.auth.login),
  })
}
