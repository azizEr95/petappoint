import { Box, Text } from '@src/gluestack-components/ui'
import { ScrollView } from 'react-native'
import { Header } from '@/src/custom-components/header'
import { NearbyPractices } from '@/src/custom-components/home-screen/nearby-practices'
import { FavoritePractices } from '@/src/custom-components/home-screen/favorite-practices'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { UpcomingApt } from '@/src/custom-components/home-screen/upcoming-apt'

export default function Home() {
  return (
    <>
      <Box className='h-full bg-slate-100'>
        <ScrollView>
          <Header />
          <Box className='px-5 -mt-4'>
            <SearchApt />
            <UpcomingApt />
            <FavoritePractices />
            <Box className='mb-3'>
              <Text className='text-gray-700 font-semibold text-lg'>
                Tierarztpraxen in der Nähe
              </Text>
            </Box>
            <NearbyPractices />
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
