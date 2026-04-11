import { Header } from '@/src/custom-components/header'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
  Text,
  Card,
  Avatar,
  Spinner,
} from '@src/gluestack-components/ui'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'

const PET_COLORS = ['#dbeafe', '#fce7f3', '#d1fae5', '#fef9c3', '#ede9fe', '#ffedd5']

const SEX_LABEL: Record<string, string> = {
  male: 'Männlich',
  female: 'Weiblich',
  not_known: 'Unbekannt',
  not_applicable: 'N/A',
}

function calcAge(dateOfBirth: Date | null): string {
  if (!dateOfBirth) return '–'
  const diffMs = Date.now() - dateOfBirth.getTime()
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))
  if (years < 1) {
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44))
    return `${months} Monat${months !== 1 ? 'e' : ''}`
  }
  return `${years} Jahr${years !== 1 ? 'e' : ''}`
}

function formatWeight(grams: number | null): string {
  if (!grams) return '–'
  return grams >= 1000 ? `${(grams / 1000).toFixed(1)} kg` : `${grams} g`
}

export default function Pets() {
  const router = useRouter()
  const { data: animals, isLoading, isError } = useMyAnimals()
  const { data: animalTypes } = useAnimalTypes()

  const typeNameById = Object.fromEntries((animalTypes ?? []).map((t) => [t.id, t.name]))

  return (
    <>
      <Box className='bg-slate-100'>
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
                <Text className='text-red-500'>Fehler beim Laden der Haustiere.</Text>
              </Box>
            )}

            {!isLoading && !isError && animals?.length === 0 && (
              <Box className='items-center py-4'>
                <Text className='text-gray-500'>Noch keine Haustiere hinzugefügt.</Text>
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
                        <Avatar size='lg' className='bg-primary-400' />
                      </Box>

                      {/**Pet Daten */}
                      <Box className='flex-1'>
                        <Text size='lg' className='text-gray-700 font-semibold'>
                          {pet.name}
                        </Text>
                        <Text size='lg' className='text-gray-700 mb-1'>
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
                            onPress={() => router.push({ pathname: '/(modals)/edit-pet', params: { animalId: pet.id } })}
                          >
                            <FontAwesomeIcon
                              name='pencil'
                              color='#374151'
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
                      <FontAwesomeIcon name='heart' color='#374151' size={15} />
                      <Text size='lg' className='text-gray-700 ml-2'>
                        Gewicht:
                      </Text>
                      <Text size='lg' className='bg-primary-100 rounded-full px-2'>
                        {formatWeight(pet.weightInGram)}
                      </Text>
                    </Box>
                  </Box>

                  {/* * Krankenakte Button und neuen Termin
                  <Box className='flex-1 mt-4 pt-3 border-t border-border'>
                    <ButtonGroup className='flex-row justify-center rounded-lg p-2'>
                      <Button
                        size='xl'
                        variant='outline'
                        className='bg-primary-500 border-primary-500 rounded-lg font-medium px-4'
                      >
                        <ButtonText className='text-white'>
                          Krankenakte
                        </ButtonText>
                        <FontAwesomeIcon name='angle-right' color='#fff' size={25} />
                      </Button>

                      <Button
                        size='xl'
                        variant='solid'
                        action='positive'
                        className='bg-primary-100 border-primary-100 rounded-lg font-medium px-4'
                        onPress={() => router.push('/(modals)/search')}
                      >
                        <FontAwesomeIcon name='search' color='#374151' size={15} />
                        <ButtonText className='text-gray-700'>
                          Termin buchen
                        </ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box> */}
                </Card>
              ))}
            </Box>

            <Box>
              <ButtonGroup className='items-center p-2'>
                <Button variant='outline' className='rounded-xl'>
                  <FontAwesomeIcon name='plus' color='#341579' size={15} />
                  <ButtonText className='text-gray-700 text-lg font-medium'>
                    Haustier hinzufügen
                  </ButtonText>
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
