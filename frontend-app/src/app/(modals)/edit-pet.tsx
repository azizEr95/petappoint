// app/(modals)/edit-pet.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
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
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useUpdateAnimal } from '@src/hooks/useUpdateAnimal'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'
import { useAnimalRaces } from '@src/hooks/useAnimalRaces'
import { getAnimalRaces, addRacesToAnimal, deleteAllRacesFromAnimal } from '@src/api/animalRaces'
import { ApiError } from '@src/api/client'
import { AnimalsType } from '@src/api/animals'
import { useTranslation } from 'react-i18next'

const APPROX_AGE_OPTIONS = [
  { key: '0-3m',  labelKey: 'add_pet.age_0_3m',  daysAgo: 45   },
  { key: '4-6m',  labelKey: 'add_pet.age_4_6m',  daysAgo: 150  },
  { key: '7-12m', labelKey: 'add_pet.age_7_12m', daysAgo: 270  },
  { key: '1-2y',  labelKey: 'add_pet.age_1_2y',  daysAgo: 548  },
  { key: '3-5y',  labelKey: 'add_pet.age_3_5y',  daysAgo: 1460 },
  { key: '5+y',   labelKey: 'add_pet.age_5y_plus', daysAgo: 2555 },
]

export default function EditPet() {
  const { t } = useTranslation()
  const { animalId } = useLocalSearchParams<{ animalId: string }>()
  const { data: animals, isLoading } = useMyAnimals()
  const { data: animalTypes } = useAnimalTypes()
  const { mutate: update, isPending, error } = useUpdateAnimal()

  const pet = animals?.find((a) => a.id === Number(animalId))

  const [name, setName] = useState('')
  const [dobKnown, setDobKnown] = useState<boolean | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [approxAgeKey, setApproxAgeKey] = useState<string | null>(null)
  const [sex, setSex] = useState<AnimalsType['sex']>('not_known')
  const [isCastrated, setIsCastrated] = useState(false)
  const [lifestyle, setLifestyle] = useState<AnimalsType['lifestyle']>('indoor')
  const [heightInCm, setHeightInCm] = useState('')
  const [weightInGram, setWeightInGram] = useState('')
  const [animalRaceId, setAnimalRaceId] = useState<number | null>(null)

  const [raceSheetOpen, setRaceSheetOpen] = useState(false)

  const { data: animalRaces } = useAnimalRaces(pet?.animalTypeId ?? null)
  const selectedRace = (animalRaces ?? []).find((r) => r.id === animalRaceId)

  const SEX_OPTIONS: { value: AnimalsType['sex']; label: string }[] = [
    { value: 'male',      label: t('common.male') },
    { value: 'female',    label: t('common.female') },
    { value: 'not_known', label: t('common.unknown') },
  ]

  const LIFESTYLE_OPTIONS: { value: AnimalsType['lifestyle']; label: string }[] = [
    { value: 'indoor',  label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'mixed',   label: 'Mixed' },
  ]

  useEffect(() => {
    if (!pet) return
    setName(pet.name)
    setSex(pet.sex === 'not_applicable' ? 'not_known' : pet.sex)
    setWeightInGram(pet.weightInGram != null ? String(pet.weightInGram) : '')
    setHeightInCm(pet.heightInCm != null ? String(pet.heightInCm) : '')
    setIsCastrated(pet.isCastrated)
    setLifestyle(pet.lifestyle)

    if (pet.dateOfBirth) {
      if (pet.dateOfBirthIsExact === false) {
        setDobKnown(false)
      } else {
        setDobKnown(true)
        const d = pet.dateOfBirth
        const dd = String(d.getUTCDate()).padStart(2, '0')
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const yyyy = d.getUTCFullYear()
        setDateOfBirth(`${dd}.${mm}.${yyyy}`)
      }
    } else {
      setDobKnown(null)
    }

    // Bestehende Rasse laden
    getAnimalRaces(pet.id)
      .then((races) => {
        if (races.length > 0) setAnimalRaceId(races[0].id)
      })
      .catch(() => {})
  }, [pet])

  const errorMessage =
    error instanceof ApiError
      ? t('common.error_generic')
      : error
        ? t('common.error_short')
        : null

  function resolveDateOfBirth(): { date: Date | null; isExact: boolean | null } {
    if (dobKnown === true) {
      if (!dateOfBirth) return { date: null, isExact: null }
      const [dd, mm, yyyy] = dateOfBirth.split('.')
      return { date: new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`), isExact: true }
    }
    if (dobKnown === false && approxAgeKey) {
      const opt = APPROX_AGE_OPTIONS.find((o) => o.key === approxAgeKey)
      if (opt) {
        const d = new Date()
        d.setDate(d.getDate() - opt.daysAgo)
        return { date: d, isExact: false }
      }
    }
    if (dobKnown === false && pet?.dateOfBirth && pet?.dateOfBirthIsExact === false) {
      return { date: pet.dateOfBirth, isExact: false }
    }
    return { date: null, isExact: null }
  }

  function handleSave() {
    if (!pet) return
    const { date, isExact } = resolveDateOfBirth()
    update(
      {
        id: pet.id,
        name,
        sex,
        dateOfBirth: date,
        dateOfBirthIsExact: isExact,
        weightInGram: weightInGram !== '' ? parseInt(weightInGram, 10) : null,
        heightInCm: heightInCm !== '' ? parseInt(heightInCm, 10) : null,
        isCastrated,
        lifestyle,
        animalTypeId: pet.animalTypeId,
        timeOfDeath: pet.timeOfDeath,
      },
      {
        onSuccess: async () => {
          try {
            await deleteAllRacesFromAnimal(pet.id)
            if (animalRaceId) {
              await addRacesToAnimal(pet.id, [animalRaceId])
            }
          } catch {
            // Rasse konnte nicht aktualisiert werden – trotzdem weiter
          }
          router.back()
        },
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

  const typeName = animalTypes?.find((type) => type.id === pet?.animalTypeId)?.name ?? '–'

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Header */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('edit_pet.title')}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {pet?.name ?? ''} · {typeName}
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
              <FormControl isRequired>
                <FormControlLabel className='mb-3'>
                  <FormControlLabelText size='sm' className='font-semibold text-typography-500 uppercase'>{t('add_pet.name_section')}</FormControlLabelText>
                  <FormControlLabelAstrick className='text-red-500' />
                </FormControlLabel>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='Buddy'
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </FormControl>
            </Card>

            {/* Geburtsdatum */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <FormControl isRequired>
                <FormControlLabel className='mb-3'>
                  <FormControlLabelText size='sm' className='font-semibold text-typography-500 uppercase'>{t('add_pet.dob_section')}</FormControlLabelText>
                  <FormControlLabelAstrick className='text-red-500' />
                </FormControlLabel>
                <VStack className='gap-3'>
                  <VStack className='gap-2'>
                    <Text size='sm' className='font-medium text-typography-600'>
                      {t('add_pet.dob_known_question')}
                    </Text>
                    <Box className='flex-row gap-2'>
                      <Button
                        onPress={() => { setDobKnown(true); setApproxAgeKey(null) }}
                        className={`rounded-full px-4 h-10 ${dobKnown === true ? 'bg-primary-500' : 'bg-background-100'}`}
                      >
                        <ButtonText className={dobKnown === true ? 'text-white' : 'text-typography-700'}>
                          {t('add_pet.dob_known_yes')}
                        </ButtonText>
                      </Button>
                      <Button
                        onPress={() => { setDobKnown(false); setDateOfBirth('') }}
                        className={`rounded-full px-4 h-10 ${dobKnown === false ? 'bg-primary-500' : 'bg-background-100'}`}
                      >
                        <ButtonText className={dobKnown === false ? 'text-white' : 'text-typography-700'}>
                          {t('add_pet.dob_known_no')}
                        </ButtonText>
                      </Button>
                    </Box>
                  </VStack>

                  {dobKnown === true && (
                    <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                      <InputField
                        placeholder={t('add_pet.dob_placeholder')}
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        keyboardType='numeric'
                      />
                    </Input>
                  )}

                  {dobKnown === false && (
                    <VStack className='gap-2'>
                      <Text size='sm' className='font-medium text-typography-600'>
                        {t('add_pet.dob_approx_label')}
                      </Text>
                      <Box className='flex-row flex-wrap gap-2'>
                        {APPROX_AGE_OPTIONS.map((opt) => (
                          <Button
                            key={opt.key}
                            onPress={() => setApproxAgeKey(approxAgeKey === opt.key ? null : opt.key)}
                            className={`rounded-full px-4 h-10 ${approxAgeKey === opt.key ? 'bg-primary-500' : 'bg-background-100'}`}
                          >
                            <ButtonText className={approxAgeKey === opt.key ? 'text-white' : 'text-typography-700'}>
                              {t(opt.labelKey)}
                            </ButtonText>
                          </Button>
                        ))}
                      </Box>
                    </VStack>
                  )}
                </VStack>
              </FormControl>
            </Card>

            {/* Geschlecht */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <FormControl isRequired>
                <FormControlLabel className='mb-3'>
                  <FormControlLabelText size='sm' className='font-semibold text-typography-500 uppercase'>{t('add_pet.sex_section')}</FormControlLabelText>
                  <FormControlLabelAstrick className='text-red-500' />
                </FormControlLabel>
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
              </FormControl>
            </Card>

            {/* Kastration */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <FormControl isRequired>
                <FormControlLabel className='mb-3'>
                  <FormControlLabelText size='sm' className='font-semibold text-typography-500 uppercase'>{t('add_pet.castration_section')}</FormControlLabelText>
                  <FormControlLabelAstrick className='text-red-500' />
                </FormControlLabel>
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
              </FormControl>
            </Card>

            {/* Lebensweise */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <FormControl isRequired>
                <FormControlLabel className='mb-3'>
                  <FormControlLabelText size='sm' className='font-semibold text-typography-500 uppercase'>{t('add_pet.lifestyle_section')}</FormControlLabelText>
                  <FormControlLabelAstrick className='text-red-500' />
                </FormControlLabel>
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
              </FormControl>
            </Card>

            {/* Größe & Gewicht (optional) */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
                {t('add_pet.body_section')}
              </Text>
              <VStack className='gap-3'>
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
              </VStack>
            </Card>

            {/* Rasse (optional) */}
            <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
              <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
                {t('add_pet.race_section')}
              </Text>
              <TouchableOpacity
                onPress={() => setRaceSheetOpen(true)}
                activeOpacity={0.7}
                style={{ backgroundColor: '#f8fafc', borderRadius: 12, height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent: 'space-between' }}
              >
                <Text className={selectedRace ? 'text-typography-900' : 'text-typography-400'}>
                  {selectedRace?.name ?? t('add_pet.race_placeholder')}
                </Text>
                <FontAwesomeIcon name='chevron-down' size={14} color='#6b7280' />
              </TouchableOpacity>
            </Card>

            {errorMessage && (
              <Text size='sm' className='text-red-500 text-center'>
                {errorMessage}
              </Text>
            )}

            <Button
              className='w-full h-12 rounded-xl bg-primary-500'
              onPress={handleSave}
              disabled={isPending || !name}
            >
              {isPending ? (
                <Spinner size='small' />
              ) : (
                <ButtonText className='text-white font-bold'>{t('edit_pet.submit')}</ButtonText>
              )}
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rasse Actionsheet */}
      <Actionsheet isOpen={raceSheetOpen} onClose={() => setRaceSheetOpen(false)} useRNModal>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetFlatList
            data={animalRaces ?? []}
            keyExtractor={(item) => String((item as { id: number }).id)}
            renderItem={({ item }) => {
              const race = item as { id: number; name: string }
              return (
                <ActionsheetItem
                  onPress={() => {
                    setAnimalRaceId(race.id)
                    setRaceSheetOpen(false)
                  }}
                >
                  <ActionsheetItemText className={animalRaceId === race.id ? 'text-primary-500 font-semibold' : ''}>
                    {race.name}
                  </ActionsheetItemText>
                </ActionsheetItem>
              )
            }}
            style={{ maxHeight: 350, width: '100%' }}
          />
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  )
}
