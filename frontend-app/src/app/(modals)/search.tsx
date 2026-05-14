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
  Spinner,
} from '@src/gluestack-components/ui'
import { AppAvatar } from '@/src/custom-components/app-avatar'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { routes } from '@src/constants/routes'
import { useAnimalTypes } from '@src/hooks/useAnimalTypes'
import { useServices } from '@src/hooks/useServices'
import { ScrollView } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useTranslation } from 'react-i18next'

export default function SucheModal() {
  const { t } = useTranslation()
  const { data: animalTypes, isLoading: animalTypesLoading } = useAnimalTypes()
  const { data: services, isLoading: servicesLoading } = useServices()

  const [selectedPet, setSelectedPet] = useState('')
  const [selectedTreatment, setSelectedTreatment] = useState('')

  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151'

  return (
    <Box className='flex-1'>
      {/** Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('search.title')}
            </Text>
            <Text size='lg' className='text-white/70 mt-1'>
              {t('search.subtitle')}
            </Text>
          </Box>
          <ButtonGroup>
            <Button
              className='bg-white/20 rounded-3xl'
              onPress={() => router.back()}
            >
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Box className='flex-col px-5 py-3'>
          <Box className='p-2'>
            {/** Wo Feld */}
            <Text className='text-xl font-semibold'>{t('search.where_label')}</Text>
            <Box className='mb-6'>
              <Input
                variant='outline'
                size='xl'
                className='bg-background-0 rounded-lg mt-2'
              >
                <Button size='xs' className='bg-background-0 rounded-lg'>
                  <FontAwesomeIcon
                    name='map-marker'
                    color={iconColor}
                    size={20}
                  />
                </Button>
                <InputField
                  placeholder={t('search.where_placeholder')}
                  className='text-typography-700 font-semibold'
                />
              </Input>
            </Box>
            <Box className='mb-6'>
              <Text className='text-xl font-semibold'>{t('search.which_animal')}</Text>

              {animalTypesLoading ? (
                <Spinner size='small' className='mt-4' />
              ) : (
                <Box className='flex-row flex-wrap gap-2 mt-2'>
                  {(animalTypes ?? []).map((pet) => {
                    const isSelected = selectedPet === String(pet.id)
                    return (
                      <Button
                        key={pet.id}
                        size='xl'
                        onPress={() => setSelectedPet(String(pet.id))}
                        className={`flex-col flex-wrap items-center justify-center rounded-lg
    ${
      isSelected
        ? 'bg-primary-100 border-primary-400 border-2'
        : 'bg-background-50 border-outline-200'
    }`}
                      >
                        <AppAvatar size='sm' name={pet.name} />
                        <ButtonText
                          className={`text-lg font-semibold ${
                            isSelected ? 'text-primary-500' : 'text-typography-700'
                          }`}
                        >
                          {pet.name}
                        </ButtonText>
                      </Button>
                    )
                  })}
                </Box>
              )}
            </Box>
          </Box>
          <Box className='p-2 gap-2'>
            {/** Behandlungsart Feld */}
            <Box className='mb-6'>
              <Text className='text-xl font-semibold'>
                {t('search.which_treatment')}
              </Text>

              {servicesLoading ? (
                <Spinner size='small' className='mt-4' />
              ) : (
                <Box className='flex-row flex-wrap gap-2 mt-2'>
                  {(services ?? []).map((treat) => {
                    const isSelected = selectedTreatment === String(treat.id)
                    return (
                      <Button
                        key={treat.id}
                        size='xl'
                        onPress={() => setSelectedTreatment(String(treat.id))}
                        className={`flex-col flex-wrap items-center justify-center rounded-lg
    ${
      isSelected
        ? 'bg-primary-100 border-primary-400 border-2'
        : 'bg-background-50 border-outline-200'
    }`}
                      >
                        <ButtonText
                          className={`text-lg font-semibold ${
                            isSelected ? 'text-primary-500' : 'text-typography-700'
                          }`}
                        >
                          {treat.name}
                        </ButtonText>
                      </Button>
                    )
                  })}
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            {/** Praxen suchen button*/}
            <Card className='bg-primary-100 p-4 shadow-lg border-0 mb-6 rounded-xl mt-2'>
              <Button
                variant='solid'
                action='positive'
                onPress={() =>
                  router.push({
                    pathname: routes.modals.result,
                    params: {
                      animalTypeId: selectedPet,
                      serviceId: selectedTreatment,
                    },
                  })
                }
                className='bg-primary-100 rounded-xl '
              >
                <FontAwesomeIcon name='search' color={iconColor} size={20} />
                <ButtonText className='text-typography-700 text-2xl'>
                  {t('search.submit')}
                </ButtonText>
              </Button>
            </Card>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  )
}
