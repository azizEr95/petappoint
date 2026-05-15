// app/(auth)/register.tsx
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
import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useRegister } from '@src/hooks/useRegister'
import { ApiError } from '@src/api/client'
import { sexesType } from 'petappoint-shared/schemas/ZodSchemas'
import { useTranslation } from 'react-i18next'

export default function Register() {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [sex, setSex] = useState<sexesType>('not_known')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [street, setStreet] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [city, setCity] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const { mutate: register, isPending, error } = useRegister()

  const handleRegister = () => {
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError(t('common.passwords_mismatch'))
      return
    }

    // Convert DD.MM.YYYY to ISO datetime string
    const [dd, mm, yyyy] = dateOfBirth.split('.')
    const isoDate = dateOfBirth ? `${yyyy}-${mm}-${dd}T00:00:00.000Z` : ''

    register({
      firstName,
      lastName,
      sex,
      dateOfBirth: isoDate as unknown as Date,
      phone,
      email,
      password,
      address: {
        street,
        cityCode,
        city,
        country: 1,
        longitude: 0,
        latitude: 0,
      },
    })
  }

  const SEX_OPTIONS: { value: sexesType; label: string }[] = [
    { value: 'male', label: t('common.male') },
    { value: 'female', label: t('common.female') },
    { value: 'not_known', label: t('common.unknown') },
    { value: 'not_applicable', label: t('common.not_applicable') },
  ]

  const errorMessage =
    localError ??
    (error instanceof ApiError && error.status === 409
      ? t('common.email_taken')
      : error
        ? t('common.error_generic')
        : null)

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 h-[20%] rounded-b-3xl justify-end px-6 pb-8'>
        <Text size='3xl' className='font-bold text-white'>
          {t('auth.register.title')}
        </Text>
        <Text size='lg' className='text-white/70 mt-1'>
          {t('auth.register.subtitle')}
        </Text>
      </Box>

      {/* Logo badge */}
      <Box className='px-5 -mt-4'>
        <Card className='p-4 shadow-lg border-0 mb-2 rounded-xl bg-primary-100'>
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

      <ScrollView className='flex-1 px-6' contentContainerStyle={{ paddingBottom: 40 }}>
        <VStack className='gap-4 pt-2'>
          {/* Name row */}
          <Box className='flex-row gap-3'>
            <VStack className='flex-1 gap-1'>
              <Text size='lg' className='font-medium text-typography-600'>{t('common.first_name')}</Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Max' value={firstName} onChangeText={setFirstName} />
              </Input>
            </VStack>
            <VStack className='flex-1 gap-1'>
              <Text size='lg' className='font-medium text-typography-600'>{t('common.last_name')}</Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Mustermann' value={lastName} onChangeText={setLastName} />
              </Input>
            </VStack>
          </Box>

          {/* Sex */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.sex')}</Text>
            <Box className='flex-row flex-wrap gap-2'>
              {SEX_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSex(opt.value)}
                  className={`px-4 py-2 rounded-xl border ${sex === opt.value ? 'bg-primary-500 border-primary-500' : 'bg-background-0 border-outline-200'}`}
                >
                  <Text
                    size='sm'
                    className={sex === opt.value ? 'text-white font-semibold' : 'text-typography-600'}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </Box>
          </VStack>

          {/* Date of birth */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.date_of_birth')}</Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='TT.MM.JJJJ (z.B. 15.01.1990)'
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType='numbers-and-punctuation'
              />
            </Input>
          </VStack>

          {/* Phone */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.phone')}</Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='+49 123 456789'
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
              />
            </Input>
          </VStack>

          {/* Email */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.email_label')}</Text>
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

          {/* Address */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.street')}</Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField placeholder='Musterstraße 1' value={street} onChangeText={setStreet} />
            </Input>
          </VStack>

          <Box className='flex-row gap-3'>
            <VStack className='gap-1' style={{ width: 100 }}>
              <Text size='lg' className='font-medium text-typography-600'>{t('common.zip')}</Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField
                  placeholder='12345'
                  value={cityCode}
                  onChangeText={setCityCode}
                  keyboardType='numeric'
                />
              </Input>
            </VStack>
            <VStack className='flex-1 gap-1'>
              <Text size='lg' className='font-medium text-typography-600'>{t('common.city')}</Text>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Berlin' value={city} onChangeText={setCity} />
              </Input>
            </VStack>
          </Box>

          {/* Password */}
          <VStack className='gap-1'>
            <Text size='lg' className='font-medium text-typography-600'>{t('common.password_label')}</Text>
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
            <Text size='lg' className='font-medium text-typography-600'>{t('auth.register.confirm_password')}</Text>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='••••••••'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </Input>
          </VStack>

          {errorMessage && (
            <Text size='sm' className='text-red-500 text-center'>
              {errorMessage}
            </Text>
          )}

          <Button
            className='w-full h-12 rounded-xl bg-primary-500 mt-2'
            onPress={handleRegister}
            disabled={isPending}
          >
            <ButtonText className='font-bold'>
              {isPending ? t('auth.register.submitting') : t('auth.register.submit')}
            </ButtonText>
          </Button>
        </VStack>

        {/* Login link */}
        <Box className='flex-row justify-center mt-6'>
          <Text size='lg' className='text-typography-500'>
            {t('auth.register.has_account')}{' '}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text size='lg' className='text-primary-500 font-semibold'>
              {t('auth.register.login')}
            </Text>
          </Pressable>
        </Box>
      </ScrollView>
    </Box>
  )
}
