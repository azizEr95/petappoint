// app/(auth)/login.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonText,
  Card,
  Input,
  InputField,
  Pressable,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { useState } from 'react'
import { router } from 'expo-router'
import { useLogin } from '@src/hooks/useLogin'
import { ApiError } from '@src/api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, error } = useLogin()

  const handleLogin = () => {
    login({ email, password })
  }

  const errorMessage =
    error instanceof ApiError && error.status === 401
      ? 'Falsche E-Mail oder Passwort'
      : error
        ? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
        : null

  return (
    <Box className='flex-1 bg-slate-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          Willkommen
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          Melde dich an, um fortzufahren
        </Text>
      </Box>

      {/* Logo badge */}
      <Box className='px-5 -mt-4'>
        <Card className='p-4 shadow-lg border-0 mb-6 rounded-xl bg-primary-100'>
          <Button
            variant='solid'
            action='positive'
            className='bg-primary-100 rounded-xl '
          >
            <FontAwesomeIcon name='paw' color='#374151' size={20} />
            <ButtonText className='text-gray-700 text-2xl'>
              Petappoint
            </ButtonText>
          </Button>
        </Card>
      </Box>

      {/* Form */}
      <Box className='flex-1 px-6 pt-4'>
        <VStack className='gap-4'>
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-gray-600'>
              E-Mail
            </Text>
            <Input className='bg-white rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='max@mustermann.de'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </Input>
          </VStack>

          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-gray-600'>
              Passwort
            </Text>
            <Input className='bg-white rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='••••••••'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>
          </VStack>

          <Pressable className='self-end'>
            <Text size='lg' className='text-primary-500 font-medium'>
              Passwort vergessen?
            </Text>
          </Pressable>

          {errorMessage && (
            <Text size='sm' className='text-red-500 text-center'>
              {errorMessage}
            </Text>
          )}

          <Button
            className='w-full h-12 rounded-xl bg-primary-500 mt-2'
            onPress={handleLogin}
            disabled={isPending}
          >
            <ButtonText className='font-bold'>
              {isPending ? 'Anmelden…' : 'Anmelden'}
            </ButtonText>
          </Button>
        </VStack>

        {/* Register link */}
        <Box className='flex-row justify-center mt-6'>
          <Text size='lg' className='text-gray-500'>
            Noch kein Konto?{' '}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text size='lg' className='text-primary-500 font-semibold'>
              Registrieren
            </Text>
          </Pressable>
        </Box>
      </Box>
    </Box>
  )
}
