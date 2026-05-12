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
import { router } from 'expo-router'
import { useForgotPassword } from '@src/hooks/useForgotPassword'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { mutate: requestReset, isPending, isSuccess, error } = useForgotPassword()

  const handleSubmit = () => {
    requestReset({ email })
  }

  return (
    <Box className='flex-1 bg-slate-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[25%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          Passwort vergessen?
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          Wir senden dir einen Reset-Link
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
            <FontAwesomeIcon name='key' color='#374151' size={20} />
            <ButtonText className='text-gray-700 text-2xl'>
              Petappoint
            </ButtonText>
          </Button>
        </Card>
      </Box>

      {/* Form */}
      <Box className='flex-1 px-6 pt-4'>
        <VStack className='gap-4'>
          {isSuccess ? (
            <Box className='bg-primary-50 border border-primary-200 rounded-xl p-4'>
              <Text size='sm' className='text-primary-700 text-center'>
                Falls ein Konto mit dieser E-Mail-Adresse existiert, erhältst du einen Link zum Zurücksetzen deines Passworts.
              </Text>
              <Text size='sm' className='text-gray-400 text-center mt-2'>
                Der Link ist 1 Stunde gültig.
              </Text>
            </Box>
          ) : (
            <>
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

              {error && (
                <Text size='sm' className='text-red-500 text-center'>
                  Ein Fehler ist aufgetreten. Bitte versuche es erneut.
                </Text>
              )}

              <Button
                className='w-full h-12 rounded-xl bg-primary-500 mt-2'
                onPress={handleSubmit}
                disabled={isPending || email.length === 0}
              >
                <ButtonText className='font-bold'>
                  {isPending ? 'Wird gesendet…' : 'Link senden'}
                </ButtonText>
              </Button>
            </>
          )}

          <Pressable className='items-center mt-2' onPress={() => router.back()}>
            <Text size='lg' className='text-gray-500 font-medium'>
              Zurück zum Login
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </Box>
  )
}
