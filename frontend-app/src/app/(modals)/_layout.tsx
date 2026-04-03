import { Stack } from 'expo-router'

export default function ModalLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='search'
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name='result' 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name='practice' 
          options={{ presentation: 'modal' }} 
        />
        <Stack.Screen 
          name='process' 
          options={{ presentation: 'modal' }} 
        />
      </Stack>
    </>
  )
}
