import { useRouter, useLocalSearchParams, Link } from 'expo-router'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Card,
  Spinner,
} from '@src/gluestack-components/ui'
import { AppAvatar } from '@/src/custom-components/app-avatar'
import { ScrollView } from 'react-native'
import { usePracticeSearch } from '@src/hooks/usePracticeSearch'
import { useFavorites } from '@src/hooks/useFavorites'

export default function ResultModal() {
  const router = useRouter()
  const { animalTypeId, serviceId } = useLocalSearchParams<{
    animalTypeId?: string
    serviceId?: string
  }>()

  const { data, isLoading, isError } = usePracticeSearch({
    animalTypeId: animalTypeId ?? undefined,
    serviceId: serviceId ?? undefined,
  })
  const { favoriteIds } = useFavorites()

  const practices = data?.data ?? []

  return (
    <>
      <ScrollView>
        {/** Top green area */}
        <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
          <Box className='flex-row justify-between items-start'>
            <Box>
              <Text size='3xl' className='font-bold text-white'>
                Suchergebnisse
              </Text>
              <Text size='lg' className='text-white/70 mt-1'>
                {isLoading ? 'Suche läuft...' : `${practices.length} Praxen gefunden`}
              </Text>
            </Box>
            <ButtonGroup>
              <Button
                className='bg-white/20 rounded-3xl'
                onPress={() => router.back()}
              >
                <FontAwesomeIcon name='times' color='#ffffff' size={20} />
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        <Box className='p-4 gap-3'>
          {isLoading && (
            <Box className='items-center py-8'>
              <Spinner size='large' />
            </Box>
          )}

          {isError && (
            <Box className='items-center py-8'>
              <Text className='text-red-500'>Fehler beim Laden der Praxen.</Text>
            </Box>
          )}

          {!isLoading && !isError && practices.length === 0 && (
            <Box className='items-center py-8'>
              <Text className='text-gray-500'>Keine Praxen gefunden.</Text>
            </Box>
          )}

          {practices.map((practice) => {
            const isFav = favoriteIds.has(practice.id)
            return (
              <Card key={practice.id} className='border-primary-500 border-l-4 shadow-sm mb-3'>
                <Link
                  href={{ pathname: '/(modals)/practice', params: { id: String(practice.id) } }}
                >
                  <Box className='flex-row items-start gap-3'>
                    <Box>
                      <AppAvatar size='lg' name={practice.name} />
                    </Box>
                    <Box className='flex-1'>
                      <Box className='flex-row justify-between items-center'>
                        <Text className='text-gray-700 text-md font-semibold flex-1'>{practice.name}</Text>
                        {isFav && (
                          <FontAwesomeIcon name='heart' color='#ef4444' size={16} />
                        )}
                      </Box>
                      <Box className='flex-row items-start gap-1 py-3'>
                        <FontAwesomeIcon name='map-marker' color='#374151' size={15} />
                        <Text className='text-gray-700 text-md font-semibold'>
                          {practice.address.street}, {practice.address.cityCode} {practice.address.city}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Card>
            )
          })}
        </Box>
      </ScrollView>
    </>
  )
}
