import { Stack } from 'expo-router'

export default function ModalLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='search'
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen 
          name='result' 
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen 
          name='practice' 
          options={{ presentation: 'fullScreenModal' }} 
        />
        <Stack.Screen 
          name='process' 
          options={{ presentation: 'fullScreenModal' }} 
        />
      </Stack>
    </>
  )
}
