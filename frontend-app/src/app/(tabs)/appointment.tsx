import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  Text,
} from '@src/gluestack-components/ui'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { SearchApt } from '@/src/custom-components/home-screen/search-apt'
import { Header } from '@/src/custom-components/header'
import { ToggleApt } from '@/src/custom-components/appointment-screen/toggle-appointments'

export default function Appointment() {
  const appointments = [
    {
      id: 1,
      pet: 'Bambi',
      petEmoji: '🐱',
      petType: 'Katze',
      vet: 'Dr. Schmidt',
      clinic: 'Tierarztpraxis am Park',
      address: 'Parkstraße 12, 10115 Berlin',
      date: '15. März 2026',
      time: '10:30',
      type: 'Impfung',
      status: 'confirmed',
    },
    {
      id: 2,
      pet: 'Luna',
      petEmoji: '🐕',
      petType: 'Hund',
      vet: 'Dr. Müller',
      clinic: 'Dr. Müller & Team',
      address: 'Hauptstraße 45, 10115 Berlin',
      date: '22. März 2026',
      time: '14:00',
      type: 'Vorsorge',
      status: 'pending',
    },
  ]

  const [activeTab, setActiveTab] = useState<boolean>(true)

  const formater = (date: any, time: any) => {
    return `${date}, ${time} Uhr`
  }

  return (
    <>
      <Box className='h-full bg-slate-100'>
        <ScrollView>
          <Header />

          {/** Card */}
          <Box className='px-5 -mt-4'>
            <SearchApt />
            {/** Toggle für kommende und vergangene Termine */}
            <ToggleApt
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              appointments={appointments}
            />
            {appointments.map((apt) => (
              <Card
                key={apt.id}
                className='border-primary-500 border-l-4 shadow-sm mb-3'
              >
                <Box className='flex-row items-start gap-3'>
                  {/* Haustier‑Icon */}
                  <Box>
                    <Avatar size='lg' className='bg-primary-400' />
                  </Box>

                  {/* Inhalt */}
                  <Box className='flex-1'>
                    <Box className='flex-row items-center justify-between'>
                      <Text className='text-gray-700 text-md font-semibold'>
                        {apt.pet}
                      </Text>
                      <Box className='bg-primary-100 rounded-full px-3 py-1'>
                        <Text className='text-gray-700'>{apt.type}</Text>
                      </Box>
                    </Box>
                    <Box className='flex-row items-start gap-1 py-2'>
                      <FontAwesomeIcon
                        name='map-marker'
                        color='#374151'
                        size={15}
                      />
                      <Text className='text-gray-700 text-md font-semibold'>
                        {apt.clinic}
                      </Text>
                    </Box>

                    {/* Uhrzeit‑Zeile */}
                    <Box className='flex-row items-center gap-1'>
                      <FontAwesomeIcon
                        name='clock-o'
                        color='#374151'
                        size={15}
                      />
                      <Text className='text-gray-700 font-semibold'>
                        {formater(apt.date, apt.time)}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                {/** Absagen & Bearbeiten Buttons bei kommenden Termine */}
                {activeTab && (
                  <Box className='flex gap-2 mt-4 pt-3 border-t border-border'>
                    <ButtonGroup className='flex-row justify-center rounded-lg w-fit p-2'>
                      <Button
                        size='lg'
                        variant='outline'
                        action='negative'
                        className='rounded-lg font-medium'
                      >
                        <ButtonText className='text-red-500'>
                          Absagen
                        </ButtonText>
                      </Button>

                      <Button
                        size='lg'
                        variant='outline'
                        action='positive'
                        className='rounded-lg font-medium'
                      >
                        <ButtonText>Bearbeiten</ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box>
                )}
                {/** Erneut buchen Button bei vergangenen Terminen */}
                {!activeTab && (
                  <Box className='flex gap-2 mt-4 pt-3 border-t border-border'>
                    <ButtonGroup className='flex-row justify-center rounded-lg w-fit p-2'>
                      <Button
                        size='lg'
                        variant='solid'
                        action='positive'
                        className='rounded-lg font-medium'
                      >
                        <ButtonText className='text-white'>
                          Erneut buchen
                        </ButtonText>
                      </Button>
                    </ButtonGroup>
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        </ScrollView>
      </Box>
    </>
  )
}
