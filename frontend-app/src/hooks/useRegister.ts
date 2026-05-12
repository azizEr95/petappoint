import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { registerApi } from '@src/api/auth'
import { useAuthStore } from '@src/stores/authStore'

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: registerApi,
    onSuccess: async (data, variables) => {
      await setAuth(
        { id: data.id, role: data.role, verified: data.verified, exp: data.exp },
        data.token,
      )
      router.replace({ pathname: '/(auth)/verify-email', params: { email: variables.email } })
    },
  })
}
