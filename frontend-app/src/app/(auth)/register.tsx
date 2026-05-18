// app/(auth)/register.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonText,
  Card,
  FormControl,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
  Input,
  InputField,
  InputSlot,
  Pressable,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRegister } from '@src/hooks/useRegister'
import { useCountries } from '@src/hooks/useCountries'
import { ApiError } from '@src/api/client'
import { sexesType } from 'petappoint-shared/schemas/ZodSchemas'
import { useTranslation } from 'react-i18next'

function validatePassword(password: string, t: (key: string) => string): string | null {
  if (password.length < 8) return t('auth.reset_password.error_min_length')
  if (!/[A-Z]/.test(password)) return t('auth.reset_password.error_uppercase')
  if (!/[0-9]/.test(password)) return t('auth.reset_password.error_number')
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return t('auth.reset_password.error_special')
  return null
}

export default function Register() {
  const { t } = useTranslation()
  const { data: countries } = useCountries()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [sex, setSex] = useState<sexesType | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState<number | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const { mutate: register, isPending, error } = useRegister()

  const handleRegister = () => {
    setLocalError(null)

    if (!firstName || !lastName || !dateOfBirth || !sex || !phone || !email || !street || !houseNumber || !cityCode || !city || !country || !password) {
      setLocalError(t('common.required_fields'))
      return
    }

    const pwError = validatePassword(password, t)
    if (pwError) {
      setLocalError(pwError)
      return
    }

    if (password !== confirmPassword) {
      setLocalError(t('common.passwords_mismatch'))
      return
    }

    // Convert DD.MM.YYYY to ISO datetime string
    const [dd, mm, yyyy] = dateOfBirth.split('.')
    const isoDate = `${yyyy}-${mm}-${dd}T00:00:00.000Z`

    register({
      firstName,
      lastName,
      sex,
      dateOfBirth: isoDate as unknown as Date,
      phone,
      email,
      password,
      address: {
        street: `${street} ${houseNumber}`,
        cityCode,
        city,
        country,
        longitude: 0,
        latitude: 0,
      },
    })
  }

  const SEX_OPTIONS: { value: sexesType; label: string }[] = [
    { value: 'male', label: t('common.male') },
    { value: 'female', label: t('common.female') },
    { value: 'not_applicable', label: t('common.divers') },
  ]

  const PW_RULES = [
    { ok: password.length >= 8,                             label: t('auth.register.pw_min_length') },
    { ok: /[A-Z]/.test(password),                          label: t('auth.register.pw_uppercase') },
    { ok: /[0-9]/.test(password),                          label: t('auth.register.pw_number') },
    { ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), label: t('auth.register.pw_special') },
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <ScrollView className='flex-1 px-6' contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Required field legend */}
        <Text size='sm' className='text-typography-400 text-right pt-2'>
          <Text className='text-red-500'>*</Text> {t('common.required_field_hint')}
        </Text>

        <VStack className='gap-4 pt-2'>
          {/* Name row */}
          <Box className='flex-row gap-3'>
            <FormControl isRequired className='flex-1'>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.first_name')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Max' value={firstName} onChangeText={setFirstName} />
              </Input>
            </FormControl>
            <FormControl isRequired className='flex-1'>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.last_name')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Mustermann' value={lastName} onChangeText={setLastName} />
              </Input>
            </FormControl>
          </Box>

          {/* Sex */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.sex')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
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
          </FormControl>

          {/* Date of birth */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.date_of_birth')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='TT.MM.JJJJ (z.B. 15.01.1990)'
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType='numbers-and-punctuation'
              />
            </Input>
          </FormControl>

          {/* Phone */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.phone')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='+49 123 456789'
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
              />
            </Input>
          </FormControl>

          {/* Email */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.email_label')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='max@mustermann.de'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </Input>
          </FormControl>

          {/* Street + house number row */}
          <Box className='flex-row gap-3'>
            <FormControl isRequired className='flex-1'>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.street')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Musterstraße' value={street} onChangeText={setStreet} />
              </Input>
            </FormControl>
            <FormControl isRequired style={{ width: 90 }}>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.house_number')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='1a' value={houseNumber} onChangeText={setHouseNumber} />
              </Input>
            </FormControl>
          </Box>

          {/* PLZ + Stadt row */}
          <Box className='flex-row gap-3'>
            <FormControl isRequired style={{ width: 100 }}>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.zip')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField
                  placeholder='12345'
                  value={cityCode}
                  onChangeText={setCityCode}
                  keyboardType='numeric'
                />
              </Input>
            </FormControl>
            <FormControl isRequired className='flex-1'>
              <FormControlLabel className='mb-1'>
                <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.city')}</FormControlLabelText>
                <FormControlLabelAstrick className='text-red-500' />
              </FormControlLabel>
              <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                <InputField placeholder='Berlin' value={city} onChangeText={setCity} />
              </Input>
            </FormControl>
          </Box>

          {/* Country */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.country')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
            <Box className='flex-row items-center gap-2'>
              <Box className='flex-1'>
                <Select
                  selectedValue={country ? String(country) : undefined}
                  onValueChange={(val) => setCountry(Number(val))}
                >
                  <SelectTrigger className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
                    <SelectInput placeholder={t('common.country_placeholder')} className='flex-1' />
                    <SelectIcon className='pr-3'>
                      <FontAwesomeIcon name='chevron-down' size={14} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {(countries ?? []).map((c) => (
                        <SelectItem key={c.id} label={c.name} value={String(c.id)} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
            </Box>
          </FormControl>

          {/* Password */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('common.password_label')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
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
            {password.length > 0 && (
              <VStack className='gap-1 mt-2'>
                {PW_RULES.map(({ ok, label }) => (
                  <Box key={label} className='flex-row items-center gap-1'>
                    <FontAwesomeIcon name={ok ? 'check' : 'times'} size={12} color={ok ? '#16a34a' : '#ef4444'} />
                    <Text size='xs' className={ok ? 'text-green-600' : 'text-red-500'}>{label}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </FormControl>

          {/* Confirm password */}
          <FormControl isRequired>
            <FormControlLabel className='mb-1'>
              <FormControlLabelText size='lg' className='font-medium text-typography-600'>{t('auth.register.repeat_password')}</FormControlLabelText>
              <FormControlLabelAstrick className='text-red-500' />
            </FormControlLabel>
            <Input className='bg-background-0 rounded-xl border-0 shadow-sm h-12'>
              <InputField
                placeholder='••••••••'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <InputSlot onPress={() => setShowConfirmPassword(p => !p)} className='pr-3'>
                <FontAwesomeIcon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={18} />
              </InputSlot>
            </Input>
          </FormControl>

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
      </KeyboardAvoidingView>
    </Box>
  )
}
