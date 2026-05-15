import { Header } from '@/src/custom-components/header'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { AppAvatar } from '@/src/custom-components/app-avatar'
import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
  Text,
  Card,
  Spinner,
} from '@src/gluestack-components/ui'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'
import { useStoredImage } from '@src/hooks/useStoredImage'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'
import i18n from '@src/i18n'

const PET_COLORS = ['#dbeafe', '#fce7f3', '#d1fae5', '#fef9c3', '#ede9fe', '#ffedd5']

function calcAge(dateOfBirth: Date | null): string {
  if (!dateOfBirth) return '–'
  const diffMs = Date.now() - dateOfBirth.getTime()
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))
  if (years < 1) {
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44))
    return `${months} ${i18n.t('pets.month', { count: months })}`
  }
  return `${years} ${i18n.t('pets.year', { count: years })}`
}

function formatWeight(grams: number | null): string {
  if (!grams) return '–'
  return grams >= 1000 ? `${(grams / 1000).toFixed(1)} kg` : `${grams} g`
}

function PetAvatar({ animalId, name }: { animalId: number; name: string }) {
  const [imageUri, saveImageUri] = useStoredImage(`avatar_animal_${animalId}`)
  return (
    <AppAvatar
      size='lg'
      name={name}
      imageUri={imageUri}
      onUpload={saveImageUri}
    />
  )
}

export default function Pets() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: animals, isLoading, isError } = useMyAnimals()
  const { data: animalTypes } = useAnimalTypes()
  const SEX_LABEL: Record<string, string> = {
    male: t('pets.sex_male'),
    female: t('pets.sex_female'),
    not_known: t('pets.sex_unknown'),
    not_applicable: t('pets.sex_na'),
  }

  const typeNameById = Object.fromEntries((animalTypes ?? []).map((t) => [t.id, t.name]))

  return (
    <>
      <Box className='bg-background-100'>
        <ScrollView>
          <Header />
          <Box className='px-5 -mt-4'>
            <SearchApt />

            {isLoading && (
              <Box className='items-center py-8'>
                <Spinner size='large' />
              </Box>
            )}

            {isError && (
              <Box className='items-center py-4'>
                <Text className='text-red-500'>{t('pets.error_loading')}</Text>
              </Box>
            )}

            {!isLoading && !isError && animals?.length === 0 && (
              <Box className='items-center py-4'>
                <Text className='text-typography-500'>{t('pets.no_pets')}</Text>
              </Box>
            )}

            <Box>
              {(animals ?? []).map((pet, index) => (
                <Card key={pet.id} className='shadow-sm mb-3'>
                  {/** Pet Header */}
                  <Box className='-mx-4 p-4' style={{ backgroundColor: PET_COLORS[index % PET_COLORS.length] }}>
                    <Box className='flex-row items-start justify-between gap-3'>
                      {/* Haustier‑Icon */}
                      <Box className='flex items-center'>
                        <PetAvatar animalId={pet.id} name={pet.name} />
                      </Box>

                      {/**Pet Daten */}
                      <Box className='flex-1'>
                        <Text size='lg' className='text-typography-700 font-semibold'>
                          {pet.name}
                        </Text>
                        <Text size='lg' className='text-typography-700 mb-1'>
                          {typeNameById[pet.animalTypeId] ?? '–'}
                        </Text>
                        <Box className='flex-row items-start gap-2'>
                          <Text size='md' className='bg-white rounded-full px-2'>
                            {SEX_LABEL[pet.sex] ?? pet.sex}
                          </Text>
                          <Text size='md' className='bg-white rounded-full px-2'>
                            {calcAge(pet.dateOfBirth)}
                          </Text>
                        </Box>
                      </Box>

                      {/**Change Button */}
                      <Box className='items-center'>
                        <ButtonGroup className='bg-white flex rounded-full'>
                          <Button
                            className='bg-white rounded-full'
                            onPress={() => router.push({ pathname: routes.modals.editPet, params: { animalId: pet.id } })}
                          >
                            <FontAwesomeIcon
                              name='pencil'
                              size={25}
                            />
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Box>
                  </Box>

                  {/**Card Body - Pet Details*/}
                  <Box className='flex-1 items-start mt-3'>
                    <Box className='flex-row flex-1 items-center justify-start p-2 gap-1'>
                      <FontAwesomeIcon name='heart' size={15} />
                      <Text size='lg' className='text-typography-700 ml-2'>
                        {t('pets.weight')}
                      </Text>
                      <Text size='lg' className='bg-primary-100 rounded-full px-2'>
                        {formatWeight(pet.weightInGram)}
                      </Text>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            <Box className='py-2'>
              <Button
                variant='outline'
                className='w-full h-14 rounded-xl'
                onPress={() => router.push(routes.modals.addPet)}
              >
                <FontAwesomeIcon name='plus' color='#341579' size={18} />
                <ButtonText className='text-typography-700 text-lg font-medium ml-2'>
                  {t('pets.add_pet')}
                </ButtonText>
              </Button>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
