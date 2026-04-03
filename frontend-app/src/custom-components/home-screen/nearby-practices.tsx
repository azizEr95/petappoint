import { Avatar, Box, Card, Text } from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from '../tabbar-icon'
import { Link } from 'expo-router'

export function NearbyPractices() {
  const nearbyPractices: any[] = [
    {
      id: 1,
      name: 'Tierarztpraxis am Park',
      address: 'Parkstraße 12, 10115 Berlin',
      rating: 4.8,
      reviews: 124,
      distance: '0.8 km',
      available: true,
    },
    {
      id: 2,
      name: 'Dr. Müller & Team',
      address: 'Hauptstraße 45, 10115 Berlin',
      rating: 4.6,
      reviews: 89,
      distance: '1.2 km',
      available: true,
    },
    {
      id: 3,
      name: 'Tierklinik Mitte',
      address: 'Friedrichstraße 78, 10117 Berlin',
      rating: 4.9,
      reviews: 256,
      distance: '2.1 km',
      available: true,
    },
  ]
  if (nearbyPractices.length === 0) {
    return (
      <>
        <Box>
          <Text>Fehlt hier alles</Text>
        </Box>
      </>
    )
  }
  return (
    <>
      <Box className='mb-6'>
        {/* Liste der Tierärzte */}
        <Box>
          <Box>
            {nearbyPractices.map((vet: any) => (
              <Card
                key={vet.id}
                className='border-primary-500 border-l-4 shadow-sm mb-3'
              >
                <Link href='/(modals)/practice'>
                  <Box className='flex-row items-start gap-3'>
                    {/* Praxis Icon */}
                    <Box>
                      <Avatar size='lg' className='bg-primary-400' />
                    </Box>

                    {/* Inhalt */}
                    <Box className='flex-1'>
                      <Box className='flex-row items-center justify-between'>
                        <Text className='text-gray-700 text-md font-semibold'>
                          {vet.name}
                        </Text>
                      </Box>
                      <Box className='flex-row items-start gap-1 py-3'>
                        <FontAwesomeIcon
                          name='map-marker'
                          color='#374151'
                          size={15}
                        />
                        <Text className='text-gray-700 text-md font-semibold'>
                          {vet.address}
                        </Text>
                      </Box>

                      {/* Bewertung */}
                      <Box className='flex-row items-center justify-between'>
                        {/* <Box className='flex-row items-center gap-1'>
                                    <Text className='text-warning text-lg'>★</Text>
                                    <Text className='text-sm font-medium text-foreground'>
                                      {vet.rating}
                                    </Text>
                                    <Text className='text-xs text-muted-foreground'>
                                      ({vet.reviews})
                                    </Text>
                                  </Box>
                                  */}

                        {/* Entfernung */}
                        <Box className=' bg-primary-100 rounded-full flex-row'>
                          {vet.available && (
                            <Text className='text-sm font-semibold rounded-full text-gray-700 px-2 py-1 '>
                              {vet.distance} entfernt von dir
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
