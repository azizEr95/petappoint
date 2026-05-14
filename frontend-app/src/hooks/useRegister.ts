import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { registerApi } from '@src/api/auth'
import { routes } from '@src/constants/routes'
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
      router.replace({ pathname: routes.auth.verifyEmail, params: { email: variables.email } })
    },
  })
}
