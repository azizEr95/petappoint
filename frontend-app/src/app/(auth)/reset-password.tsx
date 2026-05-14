// app/(auth)/reset-password.tsx
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
import { useQuery } from '@tanstack/react-query'
import { verifyResetTokenApi } from '@src/api/auth'
import { useResetPassword } from '@src/hooks/useResetPassword'
import { useTranslation } from 'react-i18next'

function validatePassword(password: string, t: (key: string) => string): string | null {
  if (password.length < 8) return t('auth.reset_password.error_min_length')
  if (!/[A-Z]/.test(password)) return t('auth.reset_password.error_uppercase')
  if (!/[0-9]/.test(password)) return t('auth.reset_password.error_number')
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    return t('auth.reset_password.error_special')
  return null
}

export default function ResetPassword() {
  const { t } = useTranslation()
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'
  const { token } = useLocalSearchParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { isLoading, isError } = useQuery({
    queryKey: ['reset-token', token],
    queryFn: () => verifyResetTokenApi({ token: token ?? '' }),
    enabled: !!token,
    retry: false,
  })

  const { mutate: resetPassword, isPending, error: resetError } = useResetPassword()

  const handleSubmit = () => {
    const pwError = validatePassword(password, t)
    if (pwError) {
      setValidationError(pwError)
      return
    }
    if (password !== confirmPassword) {
      setValidationError(t('common.passwords_mismatch'))
      return
    }
    setValidationError(null)
    resetPassword({ token: token ?? '', newPassword: password })
  }

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          {t('auth.reset_password.title')}
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          {t('auth.reset_password.subtitle')}
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
            <FontAwesomeIcon name='lock' color={iconColor} size={20} />
            <ButtonText className='text-typography-700 text-2xl'>
              Petappoint
            </ButtonText>
          </Button>
        </Card>
      </Box>

      {/* Content */}
      <Box className='flex-1 px-6 pt-4'>
        {isLoading ? (
          <Text size='lg' className='text-typography-500 text-center'>
            {t('auth.reset_password.checking_link')}
          </Text>
        ) : isError || !token ? (
          <VStack className='gap-4 items-center'>
            <Text size='lg' className='text-red-500 text-center font-medium'>
              {t('auth.reset_password.invalid_link')}
            </Text>
            <Pressable onPress={() => router.replace(routes.auth.forgotPassword)}>
              <Text size='lg' className='text-primary-500 font-medium'>
                {t('auth.reset_password.request_new_link')}
              </Text>
            </Pressable>
          </VStack>
        ) : (
          <VStack className='gap-4'>
            <VStack className='gap-1'>
              <Text size='lg' className='font-medium text-typography-600'>
                {t('auth.reset_password.new_password')}
              </Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField
                  placeholder='••••••••'
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
            </VStack>

            <VStack className='gap-1'>
              <Text size='lg' className='font-medium text-typography-600'>
                {t('auth.reset_password.repeat_password')}
              </Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </Input>
            </VStack>

            {validationError && (
              <Text size='sm' className='text-red-500 text-center'>
                {validationError}
              </Text>
            )}

            {resetError && !validationError && (
              <Text size='sm' className='text-red-500 text-center'>
                {t('common.error_generic')}
              </Text>
            )}

            <Button
              className='w-full h-12 rounded-xl bg-primary-500 mt-2'
              onPress={handleSubmit}
              disabled={isPending || password.length === 0 || confirmPassword.length === 0}
            >
              <ButtonText className='font-bold'>
                {isPending ? t('auth.reset_password.submitting') : t('auth.reset_password.submit')}
              </ButtonText>
            </Button>

            <Pressable className='items-center mt-2' onPress={() => router.replace(routes.auth.login)}>
              <Text size='lg' className='text-typography-500 font-medium'>
                {t('common.back_to_login')}
              </Text>
            </Pressable>
          </VStack>
        )}
      </Box>
    </Box>
  )
}
