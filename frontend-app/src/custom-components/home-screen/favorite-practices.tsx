import { Box, Card, Text } from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from '../tabbar-icon'
import { Link } from 'expo-router'
import { useAllPractices } from '@src/hooks/useAllPractices'
import { useFavorites } from '@src/hooks/useFavorites'
import { AppAvatar } from '../app-avatar'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'

export function FavoritePractices() {
  const { t } = useTranslation()
  const { data: practices } = useAllPractices()
  const { favoriteIds } = useFavorites()
  const favorites = (practices ?? []).filter((p) => favoriteIds.has(p.id))

  if (favorites.length === 0) return null

  return (
    <Box className='mb-4'>
      <Text className='text-typography-700 font-semibold text-lg mb-3'>
        {t('home.favorites_title')}
      </Text>
      {favorites.map((practice) => (
        <Card key={practice.id} className='border-red-400 border-l-4 shadow-sm mb-3'>
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
                  <FontAwesomeIcon name='heart' color='#ef4444' size={16} />
                </Box>
                <Box className='flex-row items-start gap-1 py-3'>
                  <FontAwesomeIcon name='map-marker' size={15} />
                  <Text className='text-typography-700 text-md font-semibold'>
                    {practice.address.street}, {practice.address.cityCode} {practice.address.city}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Link>
        </Card>
      ))}
    </Box>
  )
}
