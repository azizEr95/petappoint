import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { useSession } from '@src/hooks/useSession'

export default function Index() {
  const { token, isLoading, clearAuth } = useAuthStore()
  const { data: session, isError } = useSession()

  useEffect(() => {
    if (isError) {
      clearAuth()
    }
  }, [isError])

  if (isLoading) return null

  if (token && session) {
    return <Redirect href='/(tabs)/home' />
  }

  return <Redirect href='/(auth)/login' />
}
