// app/(auth)/verify-email.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { useColorScheme } from 'nativewind'
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
import { useLocalSearchParams, router } from 'expo-router'
import { routes } from '@src/constants/routes'
import { useVerifyEmail } from '@src/hooks/useVerifyEmail'
import { useResendVerification } from '@src/hooks/useResendVerification'
import { useAuthStore } from '@src/stores/authStore'
import { ApiError } from '@src/api/client'

export default function VerifyEmail() {
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'
  const { email } = useLocalSearchParams<{ email: string }>()
  const [code, setCode] = useState('')
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleBackToLogin = async () => {
    await clearAuth()
    router.replace(routes.auth.login)
  }

  const { mutate: verify, isPending, error } = useVerifyEmail()
  const {
    mutate: resend,
    isPending: isResending,
    isSuccess: resendSuccess,
  } = useResendVerification()

  const handleVerify = () => {
    verify(code)
  }

  const errorMessage =
    error instanceof ApiError && error.status === 400
      ? 'Code ist ungültig oder abgelaufen'
      : error
        ? `${error.message}`
        : null

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          E-Mail bestätigen
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          Gib deinen Bestätigungscode ein
        </Text>
      </Box>

      {/* Logo badge */}
      <Box className='px-5 -mt-4'>
        <Card className='p-4 shadow-lg border-0 mb-6 rounded-xl bg-primary-100'>
          <Button
            variant='solid'
            action='positive'
            className='bg-primary-100 rounded-xl'
          >
            <FontAwesomeIcon name='envelope' color={iconColor} size={20} />
            <ButtonText className='text-typography-700 text-2xl'>
              Petappoint
            </ButtonText>
          </Button>
        </Card>
      </Box>

      {/* Form */}
      <Box className='flex-1 px-6 pt-4'>
        <VStack className='gap-4'>
          <Text size='sm' className='text-typography-500 text-center'>
            {email
              ? `Wir haben einen Code an ${email} gesendet.`
              : 'Wir haben dir einen Bestätigungscode per E-Mail gesendet.'}
          </Text>

          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>
              6-stelliger Code
            </Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='123456'
                value={code}
                onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
                keyboardType='numeric'
                maxLength={6}
              />
            </Input>
          </VStack>

          {errorMessage && (
            <Text size='sm' className='text-red-500 text-center'>
              {errorMessage}
            </Text>
          )}

          {resendSuccess && (
            <Text size='sm' className='text-primary-500 text-center'>
              Neuer Code wurde gesendet.
            </Text>
          )}

          <Button
            className='w-full h-12 rounded-xl bg-primary-500 mt-2'
            onPress={handleVerify}
            disabled={isPending || code.length < 6}
          >
            <ButtonText className='font-bold'>
              {isPending ? 'Wird bestätigt…' : 'Bestätigen'}
            </ButtonText>
          </Button>

          <Pressable
            className='items-center mt-2'
            onPress={() => resend()}
            disabled={isResending}
          >
            <Text size='lg' className='text-primary-500 font-medium'>
              {isResending ? 'Wird gesendet…' : 'Code erneut senden'}
            </Text>
          </Pressable>

          {/* Divider */}
          <Box className='border-t border-outline-200 mt-2' />

          <Text size='sm' className='text-typography-400 text-center'>
            {email ? `Angemeldet als: ${email}` : 'Falsche E-Mail-Adresse?'}
          </Text>

          <Pressable className='items-center' onPress={handleBackToLogin}>
            <Text size='lg' className='text-typography-500 font-medium'>
              Zurück zum Login
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </Box>
  )
}
