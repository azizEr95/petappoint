import { Box, Text } from '@src/gluestack-components/ui'
import { ScrollView } from 'react-native'
import { Header } from '@/src/custom-components/header'
import { NearbyPractices } from '@/src/custom-components/home-screen/nearby-practices'
import { FavoritePractices } from '@/src/custom-components/home-screen/favorite-practices'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { UpcomingApt } from '@/src/custom-components/home-screen/upcoming-apt'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <Box className='h-full bg-background-100'>
        <ScrollView>
          <Header />
          <Box className='px-5 -mt-4'>
            <SearchApt />
            <UpcomingApt />
            <FavoritePractices />
            <Box className='mb-3'>
              <Text className='text-typography-700 font-semibold text-lg'>
                {t('home.nearby_practices')}
              </Text>
            </Box>
            <NearbyPractices />
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
