import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { logoutApi } from '@src/api/auth'
import { routes } from '@src/constants/routes'
import { useAuthStore } from '@src/stores/authStore'
import { queryClient } from '@src/providers/QueryProvider'

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: logoutApi,
    onSettled: async () => {
      await clearAuth()
      queryClient.clear()
      router.replace(routes.auth.login)
    },
  })
}
