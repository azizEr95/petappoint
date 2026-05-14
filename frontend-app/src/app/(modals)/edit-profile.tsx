// app/(modals)/edit-profile.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  Input,
  InputField,
  Spinner,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { usePerson } from '@src/hooks/usePerson'
import { useUpdatePerson } from '@src/hooks/useUpdatePerson'
import { ApiError } from '@src/api/client'

export default function EditProfile() {
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
        ? 'E-Mail bereits vergeben'
        : 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
      : error
        ? 'Ein Fehler ist aufgetreten.'
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
      {/* Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              Profil bearbeiten
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              Persönliche Daten anpassen
            </Text>
          </Box>
          <ButtonGroup>
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <ScrollView className='flex-1 px-5' contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
        <VStack className='gap-4'>
          {/* Name */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Name
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Vorname</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='Max'
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </Input>
              </VStack>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Nachname</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='Mustermann'
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </Input>
              </VStack>
            </VStack>
          </Card>

          {/* Kontakt */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Kontakt
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Telefon</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='+49 123 456789'
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType='phone-pad'
                  />
                </Input>
              </VStack>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>E-Mail</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='max@mustermann.de'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />
                </Input>
              </VStack>
            </VStack>
          </Card>

          {/* Adresse */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Adresse
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Straße & Hausnummer</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='Musterstraße 1'
                    value={street}
                    onChangeText={setStreet}
                  />
                </Input>
              </VStack>
              <Box className='flex-row gap-3'>
                <VStack className='gap-1' style={{ width: 100 }}>
                  <Text size='sm' className='font-medium text-typography-600'>PLZ</Text>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='12345'
                      value={cityCode}
                      onChangeText={setCityCode}
                      keyboardType='numeric'
                    />
                  </Input>
                </VStack>
                <VStack className='flex-1 gap-1'>
                  <Text size='sm' className='font-medium text-typography-600'>Stadt</Text>
                  <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                    <InputField
                      placeholder='Berlin'
                      value={city}
                      onChangeText={setCity}
                    />
                  </Input>
                </VStack>
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
              <ButtonText className='text-white font-bold'>Speichern</ButtonText>
            )}
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  )
}
