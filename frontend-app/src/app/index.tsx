import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { useSession } from '@src/hooks/useSession'

export default function Index() {
  const { token, isLoading, clearAuth } = useAuthStore()
  const { data: session, isError, isLoading: sessionLoading } = useSession()

  useEffect(() => {
    if (isError) {
      clearAuth()
    }
  }, [isError])

  if (isLoading || (token && sessionLoading)) return null

  if (token && session) {
    if (!session.verified) return <Redirect href='/(auth)/verify-email' />
    return <Redirect href='/(tabs)/home' />
  }

  return <Redirect href='/(auth)/login' />
}
