// app/(modals)/edit-pet.tsx
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
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useUpdateAnimal } from '@src/hooks/useUpdateAnimal'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'
import { ApiError } from '@src/api/client'
import { AnimalsType } from '@src/api/animals'

const SEX_OPTIONS: { value: AnimalsType['sex']; label: string }[] = [
  { value: 'male', label: 'Männlich' },
  { value: 'female', label: 'Weiblich' },
  { value: 'not_known', label: 'Unbekannt' },
  { value: 'not_applicable', label: 'N/A' },
]

const LIFESTYLE_OPTIONS: { value: AnimalsType['lifestyle']; label: string }[] = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'mixed', label: 'Mixed' },
]

export default function EditPet() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>()
  const { data: animals, isLoading } = useMyAnimals()
  const { data: animalTypes } = useAnimalTypes()
  const { mutate: update, isPending, error } = useUpdateAnimal()

  const pet = animals?.find((a) => a.id === Number(animalId))

  const [name, setName] = useState('')
  const [sex, setSex] = useState<AnimalsType['sex']>('not_known')
  const [weightInGram, setWeightInGram] = useState('')
  const [heightInCm, setHeightInCm] = useState('')
  const [isCastrated, setIsCastrated] = useState(false)
  const [lifestyle, setLifestyle] = useState<AnimalsType['lifestyle']>('indoor')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dateOfBirthIsExact, setDateOfBirthIsExact] = useState(true)

  useEffect(() => {
    if (pet) {
      setName(pet.name)
      setSex(pet.sex)
      setWeightInGram(pet.weightInGram != null ? String(pet.weightInGram) : '')
      setHeightInCm(pet.heightInCm != null ? String(pet.heightInCm) : '')
      setIsCastrated(pet.isCastrated)
      setLifestyle(pet.lifestyle)
      if (pet.dateOfBirth) {
        const d = pet.dateOfBirth
        const dd = String(d.getUTCDate()).padStart(2, '0')
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const yyyy = d.getUTCFullYear()
        setDateOfBirth(`${dd}.${mm}.${yyyy}`)
      } else {
        setDateOfBirth('')
      }
      setDateOfBirthIsExact(pet.dateOfBirthIsExact ?? true)
    }
  }, [pet])

  const errorMessage =
    error instanceof ApiError
      ? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
      : error
        ? 'Ein Fehler ist aufgetreten.'
        : null

  function handleSave() {
    if (!pet) return
    update(
      {
        id: pet.id,
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
        animalTypeId: pet.animalTypeId,
        timeOfDeath: pet.timeOfDeath,
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

  const typeName = animalTypes?.find((t) => t.id === pet?.animalTypeId)?.name ?? '–'

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              Tier bearbeiten
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

      <ScrollView className='flex-1 px-5' contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
        <VStack className='gap-4'>
          {/* Name */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Name
            </Text>
            <VStack className='gap-1'>
              <Text size='sm' className='font-medium text-typography-600'>Name</Text>
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
              Geburtsdatum
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Datum</Text>
                <Input className='bg-slate-50 rounded-xl border-0 shadow-sm h-12'>
                  <InputField
                    placeholder='TT.MM.JJJJ (z.B. 15.03.2020)'
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    keyboardType='numeric'
                  />
                </Input>
              </VStack>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Genauigkeit</Text>
                <Box className='flex-row gap-2'>
                  <Button
                    onPress={() => setDateOfBirthIsExact(true)}
                    className={`rounded-full px-4 h-10 ${dateOfBirthIsExact ? 'bg-primary-500' : 'bg-background-100'}`}
                  >
                    <ButtonText className={dateOfBirthIsExact ? 'text-white' : 'text-typography-700'}>
                      Genau
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={() => setDateOfBirthIsExact(false)}
                    className={`rounded-full px-4 h-10 ${!dateOfBirthIsExact ? 'bg-primary-500' : 'bg-background-100'}`}
                  >
                    <ButtonText className={!dateOfBirthIsExact ? 'text-white' : 'text-typography-700'}>
                      Ungefähr
                    </ButtonText>
                  </Button>
                </Box>
              </VStack>
            </VStack>
          </Card>

          {/* Geschlecht */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Geschlecht
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

          {/* Maße */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Körperdaten
            </Text>
            <VStack className='gap-3'>
              <VStack className='gap-1'>
                <Text size='sm' className='font-medium text-typography-600'>Gewicht (g)</Text>
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
                <Text size='sm' className='font-medium text-typography-600'>Größe (cm)</Text>
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
              Kastration
            </Text>
            <Box className='flex-row gap-2'>
              <Button
                onPress={() => setIsCastrated(true)}
                className={`rounded-full px-4 h-10 ${isCastrated ? 'bg-primary-500' : 'bg-background-100'}`}
              >
                <ButtonText className={isCastrated ? 'text-white' : 'text-typography-700'}>
                  Kastriert
                </ButtonText>
              </Button>
              <Button
                onPress={() => setIsCastrated(false)}
                className={`rounded-full px-4 h-10 ${!isCastrated ? 'bg-primary-500' : 'bg-background-100'}`}
              >
                <ButtonText className={!isCastrated ? 'text-white' : 'text-typography-700'}>
                  Nicht kastriert
                </ButtonText>
              </Button>
            </Box>
          </Card>

          {/* Lebensweise */}
          <Card className='bg-background-0 rounded-xl shadow-sm p-4'>
            <Text size='sm' className='font-semibold text-typography-500 uppercase mb-3'>
              Lebensweise
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
