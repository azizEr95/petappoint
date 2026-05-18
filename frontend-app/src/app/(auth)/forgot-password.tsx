// app/(auth)/forgot-password.tsx
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
import { KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { useForgotPassword } from '@src/hooks/useForgotPassword'
import { useTranslation } from 'react-i18next'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const { mutate: requestReset, isPending, isSuccess, error } = useForgotPassword()

  const handleSubmit = () => {
    requestReset({ email })
  }

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          {t('auth.forgot_password.title')}
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          {t('auth.forgot_password.subtitle')}
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
            <FontAwesomeIcon name='key' size={20} />
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
          {isSuccess ? (
            <Box className='bg-primary-50 border border-primary-200 rounded-xl p-4'>
              <Text size='sm' className='text-primary-700 text-center'>
                {t('auth.forgot_password.success_message')}
              </Text>
              <Text size='sm' className='text-typography-400 text-center mt-2'>
                {t('auth.forgot_password.link_validity')}
              </Text>
            </Box>
          ) : (
            <>
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

              {error && (
                <Text size='sm' className='text-red-500 text-center'>
                  {t('common.error_generic')}
                </Text>
              )}

              <Button
                className='w-full h-12 rounded-xl bg-primary-500 mt-2'
                onPress={handleSubmit}
                disabled={isPending || email.length === 0}
              >
                <ButtonText className='font-bold'>
                  {isPending ? t('auth.forgot_password.submitting') : t('auth.forgot_password.submit')}
                </ButtonText>
              </Button>
            </>
          )}

          <Pressable className='items-center mt-2' onPress={() => router.back()}>
            <Text size='lg' className='text-typography-500 font-medium'>
              {t('common.back_to_login')}
            </Text>
          </Pressable>
        </VStack>
      </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}
