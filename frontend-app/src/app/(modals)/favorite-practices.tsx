// app/(modals)/favorite-practices.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Pressable,
  Spinner,
  Text,
} from '@/src/gluestack-components/ui'
import { Link, router } from 'expo-router'
import { ScrollView } from 'react-native'
import { useAllPractices } from '@src/hooks/useAllPractices'
import { useFavorites } from '@src/hooks/useFavorites'
import { useToggleFavorite } from '@src/hooks/useToggleFavorite'

export default function FavoritePracticesScreen() {
  const { data: practices, isLoading } = useAllPractices()
  const { favoriteIds } = useFavorites()
  const { mutate: toggle } = useToggleFavorite()

  const favorites = (practices ?? []).filter((p) => favoriteIds.has(p.id))

  return (
    <Box className='flex-1 bg-slate-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              Lieblings-Tierarztpraxen
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              Deine favorisierten Praxen
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
        {isLoading && (
          <Box className='items-center py-8'>
            <Spinner size='large' />
          </Box>
        )}

        {!isLoading && favorites.length === 0 && (
          <Box className='items-center py-8'>
            <FontAwesomeIcon name='heart-o' color='#9ca3af' size={40} />
            <Text className='text-gray-400 mt-3 text-center'>
              Noch keine Favoriten hinzugefügt.
            </Text>
            <Text className='text-gray-400 text-center text-sm mt-1'>
              Tippe auf das Herz-Symbol bei einer Praxis.
            </Text>
          </Box>
        )}

        {favorites.map((practice) => (
          <Card key={practice.id} className='border-red-400 border-l-4 shadow-sm mb-3'>
            <Box className='flex-row items-center'>
              <Link
                href={{ pathname: '/(modals)/practice', params: { id: String(practice.id) } }}
                style={{ flex: 1 }}
              >
                <Box className='flex-row items-start gap-3'>
                  <Box>
                    <Avatar size='lg' className='bg-primary-400' />
                  </Box>
                  <Box className='flex-1'>
                    <Text className='text-gray-700 text-md font-semibold'>{practice.name}</Text>
                    <Box className='flex-row items-start gap-1 py-3'>
                      <FontAwesomeIcon name='map-marker' color='#374151' size={15} />
                      <Text className='text-gray-700 text-md font-semibold'>
                        {practice.address.street}, {practice.address.cityCode} {practice.address.city}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Link>
              <Pressable
                className='p-2 ml-2'
                onPress={() => toggle({ practiceId: practice.id, isFavorite: true })}
              >
                <FontAwesomeIcon name='heart' color='#ef4444' size={22} />
              </Pressable>
            </Box>
          </Card>
        ))}
      </ScrollView>
    </Box>
  )
}
