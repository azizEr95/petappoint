// app/(modals)/practice.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  Text,
  ButtonText,
  Avatar,
  ButtonGroup,
  ScrollView,
  Card,
  HStack,
  Pressable,
} from '@/src/gluestack-components/ui'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

export default function Practice() {
  const vetInfo = {
    name: 'Tierarztpraxis am Park',
    address: 'Parkstraße 12, 10115 Berlin',
    rating: 4.8,
    reviews: 124,
    distance: '0.8 km',
    phone: '+49 30 1234567',
    website: 'www.tierarzt-am-park.de',
    description:
      'Moderne Tierarztpraxis mit über 15 Jahren Erfahrung in der Behandlung von Klein- und Heimtieren. Wir bieten umfassende medizinische Versorgung für Ihr Haustier.',
    services: [
      'Allgemeine Untersuchung',
      'Impfungen',
      'Chirurgie',
      'Zahnmedizin',
      'Röntgen',
      'Ultraschall',
    ],
    openingHours: [
      { day: 'Montag - Freitag', hours: '08:00 - 18:00' },
      { day: 'Samstag', hours: '09:00 - 13:00' },
      { day: 'Sonntag', hours: 'Geschlossen' },
    ],
    team: [
      {
        name: 'Dr. Anna Schmidt',
        role: 'Tierärztin',
        specialty: 'Innere Medizin',
      },
      { name: 'Dr. Thomas Weber', role: 'Tierarzt', specialty: 'Chirurgie' },
    ],
  }

  const availableDates = [
    { date: 'Heute', day: 'Mi', slots: 3 },
    { date: '14.03', day: 'Do', slots: 5 },
    { date: '15.03', day: 'Fr', slots: 2 },
    { date: '16.03', day: 'Sa', slots: 1 },
    { date: '18.03', day: 'Mo', slots: 4 },
    { date: '19.03', day: 'Di', slots: 3 },
    { date: '20.03', day: 'Mi', slots: 5 },
    { date: '21.03', day: 'Do', slots: 2 },
    { date: '22.03', day: 'Do', slots: 1 },
    { date: '23.03', day: 'Fr', slots: 4 },
  ]

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '11:30',
    '14:00',
    '15:30',
    '16:00',
  ]

  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const params = useLocalSearchParams<{ name: string }>()
  return (
    <>
      <Box className='bg-slate-100'>
        <ScrollView>
          <Box className='h-[200px] bg-primary-500 rounded-b-3xl' />
          <Box className='px-5 pt-4 pb-8 -mt-8'>
            {/**Vorstellung*/}
            <Box className='bg-white rounded-lg shadow-lg justify-center'>
              <Box className='flex-row rounded-lg mx-3 mb-3 mt-2 justify-between'>
                <Text size='xl' className='font-bold text-gray-700'>
                  {vetInfo.name}
                </Text>
                <Box className='bg-primary-100 justify-center rounded-full px-3 py-1'>
                  <Text className='text-primary-500 font-semibold'>
                    Geöffnet
                  </Text>
                </Box>
              </Box>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='map-marker' color='#374151' size={20} />
                <Text className='text-gray-700 ml-2'>
                  {vetInfo.address} • {vetInfo.distance}
                </Text>
              </HStack>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='phone' color='#374151' size={20} />
                <Text className='text-gray-700 ml-2'>{vetInfo.phone}</Text>
              </HStack>
              <HStack className='flex-row mx-3 mb-3'>
                <FontAwesomeIcon name='clock-o' color='#374151' size={20} />
                <Text className='text-gray-700 ml-2'>{vetInfo.phone}</Text>
              </HStack>
            </Box>
            {/** Oeffnungszeiten */}
            <Box className='bg-white rounded-lg shadow-lg mt-4'>
              <Box className='py-2 rounded-lg mx-3 '>
                <Text size='xl' className='font-bold text-gray-700'>
                  Öffnungszeiten
                </Text>
                <Box className='py-2'>
                  {vetInfo.openingHours.map((item) => (
                    <Box key={item.day} className='flex-row justify-between'>
                      <Text size='lg' className='font-semibold'>
                        {item.day}
                      </Text>
                      <Text size='lg' className='font-semibold'>
                        {item.hours}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/*Leistungen */}
            <Box className='bg-white mt-4 rounded-lg'>
              <Box className='m-3'>
                <Text size='xl' className='font-bold text-gray-700'>
                  Leistungen
                </Text>
                <Box className='flex-row flex-wrap gap-2 mt-2'>
                  {vetInfo.services.map((service) => (
                    <Card
                      key={service}
                      className='bg-primary-100 py-1 px-3 rounded-full self-start'
                    >
                      <Text size='md' className='text-gray-700'>
                        {service}
                      </Text>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>

            {/*Termine */}
            <Box className='bg-white rounded-lg shadow-lg justify-center mt-4'>
              <Box className='rounded-lg mx-3 mb-3 mt-2'>
                <Text size='xl' className='font-bold text-gray-700'>
                  Termin buchen
                </Text>
                <Box className='flex-row flex-wrap gap-2 mt-2'>
                  <ScrollView
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    className='pb-3 -mx-1 px-1'
                  >
                    {availableDates.map((date, index) => (
                      <Pressable
                        key={index}
                        onPress={() => setSelectedDate(index)}
                        className={`flex-col items-center min-w-[60px] py-3 px-2
  rounded-xl mr-2 ${
    selectedDate === index ? 'bg-primary-500' : 'bg-secondary-100'
  }`}
                      >
                        <Text
                          size='xs'
                          className={`opacity-80 ${
                            selectedDate === index
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.day}
                        </Text>
                        <Text
                          size='sm'
                          className={`font-semibold ${
                            selectedDate === index
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.date}
                        </Text>
                        <Text
                          size='xs'
                          className={`mt-1 opacity-70 ${
                            selectedDate === index
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.slots} frei
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </Box>
                <Box className='mt-4'>
                  <Text size='sm' className='text-gray-400 mb-3'>
                    Verfügbare Zeiten
                  </Text>
                  <Box className='flex-row flex-wrap gap-2'>
                    {timeSlots.map((time) => (
                      <Pressable
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg w-[23%] items-center ${
                          selectedTime === time
                            ? 'bg-primary-500'
                            : 'bg-secondary-100'
                        }`}
                      >
                        <Text
                          size='sm'
                          className={`font-medium ${
                            selectedTime === time
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Button
                    className='w-full mt-4 h-12 rounded-xl bg-primary-500'
                    disabled={!selectedTime}
                    onPress={() => router.push('/(modals)/process')}
                  >
                    <ButtonText>
                      {selectedTime
                        ? `Termin um ${selectedTime} buchen`
                        : 'Zeit auswählen'}
                    </ButtonText>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
