// app/(modals)/add-pet.tsx
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
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useCreateAnimal } from '@src/hooks/useCreateAnimal'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'
import { ApiError } from '@src/api/client'
import { AnimalsType } from '@src/api/animals'
import { useTranslation } from 'react-i18next'

export default function AddPet() {
  const { t } = useTranslation()
  const { data: animalTypes } = useAnimalTypes()
  const { mutate: create, isPending, error } = useCreateAnimal()

  const [name, setName] = useState('')
  const [animalTypeId, setAnimalTypeId] = useState<number | null>(null)
  const [sex, setSex] = useState<AnimalsType['sex']>('not_known')
  const [weightInGram, setWeightInGram] = useState('')
  const [heightInCm, setHeightInCm] = useState('')
  const [isCastrated, setIsCastrated] = useState(false)
  const [lifestyle, setLifestyle] = useState<AnimalsType['lifestyle']>('indoor')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dateOfBirthIsExact, setDateOfBirthIsExact] = useState(true)

  const SEX_OPTIONS: { value: AnimalsType['sex']; label: string }[] = [
    { value: 'male', label: t('common.male') },
    { value: 'female', label: t('common.female') },
    { value: 'not_known', label: t('common.unknown') },
    { value: 'not_applicable', label: t('pets.sex_na') },
  ]

  const LIFESTYLE_OPTIONS: { value: AnimalsType['lifestyle']; label: string }[] = [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'mixed', label: 'Mixed' },
  ]

  const errorMessage =
    error instanceof ApiError
      ? t('common.error_generic')
      : error
        ? t('common.error_short')
        : null

  function handleSave() {
    if (!animalTypeId) return
    create(
      {
        name,
        sex,
        dateOfBirth: (() => {
          if (!dateOfBirth) return null
          const [dd, mm, yyyy] = dateOfBirth.split('.')
          return new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`)
        })(),
        dateOfBirthIsExact: dateOfBirth ? dateOfBirthIsExact : null,
        weightInGram: weightInGram !== '' ? parseInt(weightInGram, 10) : null,
        heightInCm: heightInCm !== '' ? parseInt(heightInCm, 10) : null,
        isCastrated,
        lifestyle,
        animalTypeId,
        timeOfDeath: null,
      },
      {
        onSuccess: () => router.back(),
      },
    )
  }

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('add_pet.title')}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {t('add_pet.subtitle')}
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
          {/* Tierart */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.animal_type')}
            </Text>
            <Box className='flex-row flex-wrap gap-2'>
              {(animalTypes ?? []).map((type) => (
                <Button
                  key={type.id}
                  onPress={() => setAnimalTypeId(type.id)}
                  className={`rounded-full px-4 h-10 ${animalTypeId === type.id ? 'bg-primary-500' : 'bg-background-100'}`}
                >
                  <ButtonText className={animalTypeId === type.id ? 'text-white' : 'text-typography-700'}>
                    {type.name}
                  </ButtonText>
                </Button>
              ))}
            </Box>
          </Card>

          {/* Name */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.name_section')}
            </Text>
            <VStack className='gap-1'>
              <Text size='sm' className='font-medium text-typography-600'>{t('add_pet.name_label')}</Text>
              <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                <InputField
                  placeholder='Buddy'
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </VStack>
          </Card>

          {/* Geburtsdatum */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.dob_section')}
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>{t('add_pet.dob_date')}</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder={t('add_pet.dob_placeholder')}
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    keyboardType='numeric'
                  />
                </Input>
              </VStack>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>{t('add_pet.dob_accuracy')}</Text>
                <Box className='flex-row gap-2'>
                  <Button
                    onPress={() => setDateOfBirthIsExact(true)}
                    className={`rounded-full px-4 h-10 ${dateOfBirthIsExact ? 'bg-primary-500' : 'bg-background-100'}`}
                  >
                    <ButtonText className={dateOfBirthIsExact ? 'text-white' : 'text-typography-700'}>
                      {t('add_pet.dob_exact')}
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={() => setDateOfBirthIsExact(false)}
                    className={`rounded-full px-4 h-10 ${!dateOfBirthIsExact ? 'bg-primary-500' : 'bg-background-100'}`}
                  >
                    <ButtonText className={!dateOfBirthIsExact ? 'text-white' : 'text-typography-700'}>
                      {t('add_pet.dob_approx')}
                    </ButtonText>
                  </Button>
                </Box>
              </VStack>
            </VStack>
          </Card>

          {/* Geschlecht */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.sex_section')}
            </Text>
            <Box className='flex-row flex-wrap gap-2'>
              {SEX_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  onPress={() => setSex(opt.value)}
                  className={`rounded-full px-4 h-10 ${sex === opt.value ? 'bg-primary-500' : 'bg-background-100'}`}
                >
                  <ButtonText className={sex === opt.value ? 'text-white' : 'text-typography-700'}>
                    {opt.label}
                  </ButtonText>
                </Button>
              ))}
            </Box>
          </Card>

          {/* Körperdaten */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.body_section')}
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>{t('add_pet.weight_label')}</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='5000'
                    value={weightInGram}
                    onChangeText={setWeightInGram}
                    keyboardType='numeric'
                  />
                </Input>
              </VStack>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>{t('add_pet.height_label')}</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='30'
                    value={heightInCm}
                    onChangeText={setHeightInCm}
                    keyboardType='numeric'
                  />
                </Input>
              </VStack>
            </VStack>
          </Card>

          {/* Kastration */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.castration_section')}
            </Text>
            <Box className='flex-row gap-2'>
              <Button
                onPress={() => setIsCastrated(true)}
                className={`rounded-full px-4 h-10 ${isCastrated ? 'bg-primary-500' : 'bg-background-100'}`}
              >
                <ButtonText className={isCastrated ? 'text-white' : 'text-typography-700'}>
                  {t('add_pet.castrated')}
                </ButtonText>
              </Button>
              <Button
                onPress={() => setIsCastrated(false)}
                className={`rounded-full px-4 h-10 ${!isCastrated ? 'bg-primary-500' : 'bg-background-100'}`}
              >
                <ButtonText className={!isCastrated ? 'text-white' : 'text-typography-700'}>
                  {t('add_pet.not_castrated')}
                </ButtonText>
              </Button>
            </Box>
          </Card>

          {/* Lebensweise */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              {t('add_pet.lifestyle_section')}
            </Text>
            <Box className='flex-row gap-2'>
              {LIFESTYLE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  onPress={() => setLifestyle(opt.value)}
                  className={`rounded-full px-4 h-10 ${lifestyle === opt.value ? 'bg-primary-500' : 'bg-background-100'}`}
                >
                  <ButtonText className={lifestyle === opt.value ? 'text-white' : 'text-typography-700'}>
                    {opt.label}
                  </ButtonText>
                </Button>
              ))}
            </Box>
          </Card>

          {errorMessage && (
            <Text size='sm' className='text-red-500 text-center'>
              {errorMessage}
            </Text>
          )}

          <Button
            className='w-full h-12 rounded-xl bg-primary-500'
            onPress={handleSave}
            disabled={isPending || !animalTypeId || !name}
          >
            {isPending ? (
              <Spinner size='small' />
            ) : (
              <ButtonText className='text-white font-bold'>{t('add_pet.submit')}</ButtonText>
            )}
          </Button>
        </VStack>
      </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  )
}
