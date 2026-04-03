import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Text,
  Button,
  ButtonText,
  ButtonGroup,
  Input,
  InputField,
  Card,
  Avatar,
} from '@src/gluestack-components/ui'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function SucheModal() {
  const petTypes = [
    { id: 'dog', label: 'Luna', icon: '🐕' },
    { id: 'cat', label: 'Bambi', icon: '🐱' },
    { id: 'bird', label: 'Tomtom', icon: '🐦' },
    { id: 'rabbit', label: 'Pamuk', icon: '🐰' },
    { id: 'hamster', label: 'Hamtaro', icon: '🐹' },
  ]

  const treatmentTypes = [
    { id: 'checkup', label: 'Vorsorge', icon: '🩺' },
    { id: 'vaccination', label: 'Impfung', icon: '💉' },
    { id: 'dental', label: 'Zahnbehandlung', icon: '🦷' },
    { id: 'surgery', label: 'Operation', icon: '⚕️' },
    { id: 'emergency', label: 'Notfall', icon: '🚨' },
    { id: 'other', label: 'Sonstiges', icon: '📋' },
  ]

  const [selectedPet, setSelectedPet] = useState('')
  const [selectedTreatment, setSelectedTreatment] = useState('')

  const router = useRouter()
  return (
    <>
      {/** Header */}
      <Box className='flex-row justify-between items-center pt-6 px-8 pb-3 border-b-hairline'>
        <Text className='text-xl font-semibold'>Termin suchen</Text>
        <ButtonGroup>
          <Button
            className='bg-primary-100 rounded-3xl'
            onPress={() => router.back()}
          >
            <FontAwesomeIcon name='times' color='#374151' size={20} />
          </Button>
        </ButtonGroup>
      </Box>
      <Box className='flex-col px-5 py-3'>
        <Box className='p-2'>
          {/** Wo Feld */}
          <Text className='text-xl font-semibold'>Wo?</Text>
          <Box className='mb-6'>
            <Input variant='outline' size='xl' className='bg-white rounded-lg mt-2'>
              <Button size='xs' className='bg-white rounded-lg'>
                <FontAwesomeIcon name='map-marker' color='#374151' size={20} />
              </Button>
              <InputField
                placeholder='Stadt oder PLZ eingeben...'
                className='text-gray-700 font-semibold'
              />
            </Input>
          </Box>
          <Box className='mb-6'>
            <Text className='text-xl font-semibold'>Welches Tier?</Text>

            {/* Welches Tier Feld */}
            <Box className='flex-row flex-wrap gap-2 mt-2'>
              {petTypes.map((pet) => {
                const isSelected = selectedPet === pet.id
                return (
                  <Button
                    key={pet.id}
                    size='xl'
                    onPress={() => setSelectedPet(pet.id)}
                    className={`flex-col flex-wrap items-center justify-center rounded-lg
    ${
      isSelected
        ? 'bg-primary-100 border-primary-400 border-2'
        : 'bg-gray-50 border-gray-200'
    }`}
                  >
                    <Avatar size='sm' className='bg-primary-400' />
                    <ButtonText
                      className={`text-lg font-semibold ${
                        isSelected ? 'text-primary-500' : 'text-gray-700'
                      }`}
                    >
                      {pet.label}
                    </ButtonText>
                  </Button>
                )
              })}
            </Box>
          </Box>
        </Box>
        <Box className='p-2 gap-2'>
          {/** Behandlungsart Feld */}
          <Box className='mb-6'>
            <Text className='text-xl font-semibold'>
              Welche Behandlungsart?
            </Text>

            {/* Behandlungsart Feld */}
            <Box className='flex-row flex-wrap gap-2 mt-2'>
              {treatmentTypes.map((treat) => {
                const isSelected = selectedTreatment === treat.id
                return (
                  <Button
                    key={treat.id}
                    size='xl'
                    onPress={() => setSelectedTreatment(treat.id)}
                    className={`flex-col flex-wrap items-center justify-center rounded-lg
    ${
      isSelected
        ? 'bg-primary-100 border-primary-400 border-2'
        : 'bg-gray-50 border-gray-200'
    }`}
                  >
                    <ButtonText
                      className={`text-lg font-semibold ${
                        isSelected ? 'text-primary-500' : 'text-gray-700'
                      }`}
                    >
                      {treat.label}
                    </ButtonText>
                  </Button>
                )
              })}
            </Box>
          </Box>
        </Box>
        <Box>
          {/** Praxen suchen button*/}
          <Card className='bg-primary-100 p-4 shadow-lg border-0 mb-6 rounded-xl mt-2'>
            <Button
              variant='solid'
              action='positive'
              onPress={() => router.push('/(modals)/result')}
              className='bg-primary-100 rounded-xl '
            >
              <FontAwesomeIcon name='search' color='#374151' size={20} />
              <ButtonText className='text-gray-700 text-2xl'>
                Praxen suchen
              </ButtonText>
            </Button>
          </Card>
        </Box>
      </Box>
    </>
  )
}
