import { Link, useRouter } from 'expo-router'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Text,
  Button,
  ButtonText,
  View,
  ButtonGroup,
  ButtonIcon,
  Input,
  InputField,
  Card,
  HStack,
  VStack,
  Avatar,
} from '@src/gluestack-components/ui'
import { useState } from 'react'
import { NearbyPractices } from '@/src/custom-components/home-screen/nearby-practices'
import { ScrollView } from 'react-native'

export default function Home() {
  const searchResults = [
    {
      id: '1',
      name: 'Tierarztpraxis am Park',
      address: 'Parkstraße 12, 10115 Berlin',
      rating: 4.8,
      reviews: 124,
      distance: '0.8 km',
      nextSlot: 'Heute, 14:30',
      image: '🏥',
    },
    {
      id: '2',
      name: 'Dr. Müller & Team',
      address: 'Hauptstraße 45, 10115 Berlin',
      rating: 4.6,
      reviews: 89,
      distance: '1.2 km',
      nextSlot: 'Morgen, 09:00',
      image: '🏥',
    },
    {
      id: '3',
      name: 'Tierklinik Mitte',
      address: 'Friedrichstraße 78, 10117 Berlin',
      rating: 4.9,
      reviews: 256,
      distance: '2.1 km',
      nextSlot: 'Heute, 16:00',
      image: '🏥',
    },
    {
      id: '4',
      name: 'Kleintierpraxis Dr. Weber',
      address: 'Schönhauser Allee 123, 10119 Berlin',
      rating: 4.7,
      reviews: 178,
      distance: '2.5 km',
      nextSlot: 'Morgen, 11:30',
      image: '🏥',
    },
  ]
  
  const router = useRouter()
  return (
    <>
      <ScrollView>
        <Box className='flex-row justify-between items-center pt-6 px-8 pb-3 border-b-hairline'>
          <Text className='text-xl font-semibold'>
            {searchResults.length} Praxen gefunden
          </Text>
          <ButtonGroup>
            <Button
              className='bg-primary-100 rounded-3xl'
              onPress={() => router.back()}
            >
              <FontAwesomeIcon name='times' color='#374151' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
        <Box className='p-3'>
          <NearbyPractices />
        </Box>
      </ScrollView>
    </>
  )
}
