// app/(auth)/login.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonText,
  Card,
  Input,
  InputField,
  InputSlot,
  Pressable,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { routes } from '@src/constants/routes'
import { useLogin } from '@src/hooks/useLogin'
import { ApiError } from '@src/api/client'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, error } = useLogin()
  const handleLogin = () => {
    login({ email, password })
  }

  const errorMessage =
    error instanceof ApiError && error.status === 401
      ? t('auth.login.error_credentials')
      : error
        ? t('common.error_generic')
        : null

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          {t('auth.login.title')}
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          {t('auth.login.subtitle')}
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
            <FontAwesomeIcon name='paw' size={20} />
            <ButtonText className='text-typography-700 text-2xl'>
              Petappoint
            </ButtonText>
          </Button>
        </Card>
      </Box>

      {/* Form */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Box className='flex-1 px-6 pt-4'>
        <VStack className='gap-4'>
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>
              {t('common.email_label')}
            </Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
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
            <Text size='lg' className='font-medium text-typography-600'>
              {t('common.password_label')}
            </Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='••••••••'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <InputSlot onPress={() => setShowPassword(p => !p)} className='pr-3'>
                <FontAwesomeIcon name={showPassword ? 'eye-slash' : 'eye'} size={18} />
              </InputSlot>
            </Input>
          </VStack>

          <Pressable className='self-end' onPress={() => router.push(routes.auth.forgotPassword)}>
            <Text size='lg' className='text-primary-500 font-medium'>
              {t('auth.login.forgot_password')}
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
              {isPending ? t('auth.login.submitting') : t('auth.login.submit')}
            </ButtonText>
          </Button>
        </VStack>

        {/* Register link */}
        <Box className='flex-row justify-center mt-6'>
          <Text size='lg' className='text-typography-500'>
            {t('auth.login.no_account')}{' '}
          </Text>
          <Pressable onPress={() => router.push(routes.auth.register)}>
            <Text size='lg' className='text-primary-500 font-semibold'>
              {t('auth.login.register')}
            </Text>
          </Pressable>
        </Box>
      </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}
