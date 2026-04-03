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
} from '@src/gluestack-components/ui'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'

export default function Pets() {
  const pets = [
    {
      id: 1,
      name: 'Bambi',
      type: 'Katze',
      breed: 'Europäisch Kurzhaar',
      emoji: '🐱',
      age: '3 Jahre',
      weight: '4.2 kg',
      gender: 'Weiblich',
      lastVisit: '10. Feb 2026',
      nextCheck: ' März 2026',
      color: 'bg-pink-100',
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Hund',
      breed: 'Golden Retriever',
      emoji: '🐕',
      age: '5 Jahre',
      weight: '32 kg',
      gender: 'Männlich',
      lastVisit: '28. Jan 2026',
      nextCheck: ' Juli 2026',
      color: 'bg-amber-100',
    },
    {
      id: 3,
      name: 'Pamuk',
      type: 'Vogel',
      breed: 'Wellensittich',
      emoji: '🐦',
      age: '1 Jahr',
      weight: '35 g',
      gender: 'Männlich',
      lastVisit: '5. Dez 2025',
      nextCheck: ' November 2026',
      color: 'bg-sky-100',
    },
  ]

  const router = useRouter()
  return (
    <>
      <Box className='bg-slate-100'>
        <ScrollView>
          <Header />
          <Box className='px-5 -mt-4'>
            <SearchApt />
            <Box>
              {pets.map((pet) => (
                <Card key={pet.id} className='shadow-sm mb-3'>
                  {/** Pet Header */}
                  <Box className={`${pet.color} -mx-4 p-4`}>
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
                          {pet.breed}
                        </Text>
                        <Box className='flex-row items-start gap-2'>
                          <Text
                            size='md'
                            className='bg-white rounded-full px-2'
                          >
                            {pet.gender}
                          </Text>
                          <Text
                            size='md'
                            className='bg-white rounded-full px-2'
                          >
                            {pet.age}
                          </Text>
                        </Box>
                      </Box>

                      {/**Change Button */}
                      <Box className='items-center'>
                        <ButtonGroup className='bg-white flex rounded-full'>
                          <Button className='bg-white rounded-full'>
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
                      <Text
                        size='lg'
                        className='bg-primary-100 rounded-full px-2'
                      >
                        {pet.weight}
                      </Text>
                    </Box>
                    <Box className='flex-row items-center justify-start p-2 gap-1'>
                      <FontAwesomeIcon
                        name='calendar'
                        color='#374151'
                        size={15}
                      />
                      <Text size='lg' className='text-gray-700 ml-2'>
                        Letzter Besuch:
                      </Text>
                      <Text
                        size='lg'
                        className='bg-primary-100 rounded-full px-2'
                      >
                        {pet.lastVisit}
                      </Text>
                    </Box>
                    <Box className='flex-row items-center justify-start p-2 gap-1'>
                      <FontAwesomeIcon
                        name='stethoscope'
                        color='#374151'
                        size={15}
                      />
                      <Text size='lg' className='text-gray-700 ml-2'>
                        Nächste Untersuchung:
                      </Text>
                      <Text
                        size='lg'
                        className='bg-primary-100 rounded-full px-2'
                      >
                        {pet.nextCheck}
                      </Text>
                    </Box>
                  </Box>
                  {/** Krankenakte Button und neuen Termin */}
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
                        <FontAwesomeIcon
                          name='angle-right'
                          color='#fff'
                          size={25}
                        />
                      </Button>

                      <Button
                        size='xl'
                        variant='solid'
                        action='positive'
                        className='bg-primary-100 border-primary-100 rounded-lg font-medium px-4'
                      >
                        <FontAwesomeIcon
                          name='search'
                          color='#374151'
                          size={15}
                        />
                        <ButtonText className='text-gray-700'>
                          Termin buchen
                        </ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box>
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
