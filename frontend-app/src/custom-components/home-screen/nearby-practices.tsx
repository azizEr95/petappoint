import { Box, Card, Spinner, Text } from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from '../tabbar-icon'
import { Link } from 'expo-router'
import { useAllPractices } from '@src/hooks/useAllPractices'
import { useFavorites } from '@src/hooks/useFavorites'
import { AppAvatar } from '../app-avatar'
import { useColorScheme } from 'nativewind'
import { routes } from '@src/constants/routes'

export function NearbyPractices() {
  const { data: practices, isLoading, isError } = useAllPractices()
  const { favoriteIds } = useFavorites()
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'

  if (isLoading) {
    return (
      <Box className='items-center py-6'>
        <Spinner size='small' />
      </Box>
    )
  }

  if (isError || !practices?.length) {
    return (
      <Box>
        <Text>Keine Praxen gefunden</Text>
      </Box>
    )
  }

  return (
    <Box className='mb-6'>
      {practices.map((practice) => {
        const isFav = favoriteIds.has(practice.id)
        return (
          <Card key={practice.id} className='border-primary-500 border-l-4 shadow-sm mb-3'>
            <Link
              href={{ pathname: routes.modals.practice, params: { id: String(practice.id) } }}
            >
              <Box className='flex-row items-start gap-3'>
                <Box>
                  <AppAvatar size='lg' name={practice.name} />
                </Box>
                <Box className='flex-1'>
                  <Box className='flex-row justify-between items-center'>
                    <Text className='text-typography-700 text-md font-semibold flex-1'>{practice.name}</Text>
                    {isFav && (
                      <FontAwesomeIcon name='heart' color='#ef4444' size={16} />
                    )}
                  </Box>
                  <Box className='flex-row items-start gap-1 py-3'>
                    <FontAwesomeIcon name='map-marker' color={iconColor} size={15} />
                    <Text className='text-typography-700 text-md font-semibold'>
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
  )
}
