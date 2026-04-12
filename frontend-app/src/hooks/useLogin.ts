import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { loginApi } from '@src/api/auth'
import { useAuthStore } from '@src/stores/authStore'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data, variables) => {
      await setAuth(
        { id: data.id, role: data.role, verified: data.verified, exp: data.exp },
        data.token,
      )
      if (!data.verified) {
        router.replace({ pathname: '/(auth)/verify-email', params: { email: variables.email } })
      } else {
        router.replace('/(tabs)/home')
      }
    },
  })
}
