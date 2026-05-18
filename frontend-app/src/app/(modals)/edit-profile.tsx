// app/(modals)/edit-profile.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  FormControl,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
  Input,
  InputField,
  Spinner,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { usePerson } from '@src/hooks/usePerson'
import { useUpdatePerson } from '@src/hooks/useUpdatePerson'
import { ApiError } from '@src/api/client'
import { useTranslation } from 'react-i18next'

export default function EditProfile() {
  const { t } = useTranslation()
  const { data: person, isLoading } = usePerson()
  const { mutate: update, isPending, error } = useUpdatePerson()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    if (person) {
      setFirstName(person.firstName)
      setLastName(person.lastName)
      setPhone(person.phone)
      setEmail(person.email)
      setStreet(person.address.street)
      setCityCode(person.address.cityCode)
      setCity(person.address.city)
    }
  }, [person])

  const errorMessage =
    error instanceof ApiError
      ? error.status === 409
        ? t('common.email_taken')
        : t('common.error_generic')
      : error
        ? t('common.error_short')
        : null

  function handleSave() {
    if (!person) return
    update(
      {
        id: person.id,
        firstName,
        lastName,
        phone,
        email,
        sex: person.sex,
        dateOfBirth: person.dateOfBirth,
        address: {
          ...person.address,
          street,
          cityCode,
          city,
        },
      },
      {
        onSuccess: () => router.back(),
      },
    )
  }

  if (isLoading) {
    return (
      <Box className='flex-1 items-center justify-center'>
        <Spinner size='large' />
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Header */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('edit_profile.title')}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {t('edit_profile.subtitle')}
            </Text>
          </Box>
          <ButtonGroup>
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView className='flex-1 px-5' contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
          <VStack className='gap-4'>

            {/* Name */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
                {t('edit_profile.section_name')}
              </Text>
              <VStack className='gap-3'>
                <FormControl isRequired>
                  <FormControlLabel className='mb-1'>
                    <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.first_name')}</FormControlLabelText>
                    <FormControlLabelAstrick className='text-red-500' />
                  </FormControlLabel>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='Max'
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </Input>
                </FormControl>
                <FormControl isRequired>
                  <FormControlLabel className='mb-1'>
                    <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.last_name')}</FormControlLabelText>
                    <FormControlLabelAstrick className='text-red-500' />
                  </FormControlLabel>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='Mustermann'
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </Input>
                </FormControl>
              </VStack>
            </Card>

            {/* Kontakt */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
                {t('edit_profile.section_contact')}
              </Text>
              <VStack className='gap-3'>
                <FormControl isRequired>
                  <FormControlLabel className='mb-1'>
                    <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.phone')}</FormControlLabelText>
                    <FormControlLabelAstrick className='text-red-500' />
                  </FormControlLabel>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='+49 123 456789'
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType='phone-pad'
                    />
                  </Input>
                </FormControl>
                <FormControl isRequired>
                  <FormControlLabel className='mb-1'>
                    <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.email_label')}</FormControlLabelText>
                    <FormControlLabelAstrick className='text-red-500' />
                  </FormControlLabel>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='max@mustermann.de'
                      value={email}
                      onChangeText={setEmail}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </Input>
                </FormControl>
              </VStack>
            </Card>

            {/* Adresse */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
                {t('edit_profile.section_address')}
              </Text>
              <VStack className='gap-3'>
                <FormControl isRequired>
                  <FormControlLabel className='mb-1'>
                    <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.street')}</FormControlLabelText>
                    <FormControlLabelAstrick className='text-red-500' />
                  </FormControlLabel>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='Musterstraße 1'
                      value={street}
                      onChangeText={setStreet}
                    />
                  </Input>
                </FormControl>
                <Box className='flex-row gap-3'>
                  <FormControl isRequired style={{ width: 100 }}>
                    <FormControlLabel className='mb-1'>
                      <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.zip')}</FormControlLabelText>
                      <FormControlLabelAstrick className='text-red-500' />
                    </FormControlLabel>
                    <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
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
                      <FormControlLabelText size='sm' className='font-medium text-typography-600'>{t('common.city')}</FormControlLabelText>
                      <FormControlLabelAstrick className='text-red-500' />
                    </FormControlLabel>
                    <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                      <InputField
                        placeholder='Berlin'
                        value={city}
                        onChangeText={setCity}
                      />
                    </Input>
                  </FormControl>
                </Box>
              </VStack>
            </Card>

            {errorMessage && (
              <Text size='sm' className='text-red-500 text-center'>
                {errorMessage}
              </Text>
            )}

            <Button
              className='w-full h-12 rounded-xl bg-primary-500'
              onPress={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner size='small' />
              ) : (
                <ButtonText className='text-white font-bold'>{t('edit_profile.submit')}</ButtonText>
              )}
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  )
}
