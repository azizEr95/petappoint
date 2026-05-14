import { Center, Text, Button, ButtonText } from '@src/gluestack-components/ui/'
import { Link, Stack, usePathname, useRouter } from 'expo-router'

export default function NotFoundScreen() {
  const router = useRouter()
  const pathname = usePathname()
  console.log('Not found path:', pathname)
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Center className='flex-1'>
        <Text className='text-primary-500'>This screen doesn't exist.</Text>
        <Link href='/' style={{ marginTop: 10 }}>
          <Button onPress={() => router.dismissTo('/(tabs)/home')}>
            <ButtonText className='text-primary-500'>
              Go to home screen!
            </ButtonText>
          </Button>
        </Link>
      </Center>
    </>
  )
}
