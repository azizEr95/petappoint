import { Redirect } from 'expo-router'

// TODO: replace with real auth check (e.g. from a store or SecureStore)
const isLoggedIn = false

export default function Index() {
  if (isLoggedIn) {
    return <Redirect href='/(tabs)/home' />
  }
  return <Redirect href='/(auth)/login' />
}
