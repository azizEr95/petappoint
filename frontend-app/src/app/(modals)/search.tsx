import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Card,
  HStack,
  Input,
  InputField,
  Spinner,
  Text,
} from '@src/gluestack-components/ui'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { routes } from '@src/constants/routes'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useServices } from '@src/hooks/useServices'
import { useTranslation } from 'react-i18next'

export default function SucheModal() {
  const { t } = useTranslation()
  const { data: myAnimals, isLoading: myAnimalsLoading } = useMyAnimals()
  const { data: services, isLoading: servicesLoading } = useServices()

  const [query, setQuery] = useState('')
  const [selectedPet, setSelectedPet] = useState('')
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [petSheetOpen, setPetSheetOpen] = useState(false)
  const [treatmentSheetOpen, setTreatmentSheetOpen] = useState(false)

  const router = useRouter()

  const selectedMyPet = (myAnimals ?? []).find((p) => String(p.id) === selectedPet)

  function toggleTreatment(id: string) {
    setSelectedTreatments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectedServiceNames = (services ?? [])
    .filter((s) => selectedTreatments.includes(String(s.id)))
    .map((s) => s.name)

  return (
    <Box className='flex-1'>
      {/* Header */}
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
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <Box className='flex-col px-5 py-3 gap-4'>

            {/* Suche */}
            <Box>
              <Text className='text-xl font-semibold mb-2'>{t('search.query_label')}</Text>
              <Input variant='outline' size='xl' className='bg-background-0 rounded-lg'>
                <Button size='xs' className='bg-background-0 rounded-lg'>
                  <FontAwesomeIcon name='search' size={18} />
                </Button>
                <InputField
                  placeholder={t('search.query_placeholder')}
                  className='text-typography-700 font-semibold'
                  value={query}
                  onChangeText={setQuery}
                />
              </Input>
            </Box>

            {/* Haustier */}
            <Box>
              <Text className='text-xl font-semibold mb-2'>{t('search.which_animal')}</Text>
              {myAnimalsLoading ? (
                <Spinner size='small' className='mt-2' />
              ) : (
                <TouchableOpacity
                  onPress={() => setPetSheetOpen(true)}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#ffffff', borderRadius: 8, height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent: 'space-between', borderWidth: 1, borderColor: '#e5e7eb' }}
                >
                  <Text className={selectedMyPet ? 'text-typography-900 font-semibold' : 'text-typography-400'}>
                    {selectedMyPet?.name ?? t('search.select_pet')}
                  </Text>
                  <FontAwesomeIcon name='chevron-down' size={14} color='#6b7280' />
                </TouchableOpacity>
              )}
            </Box>

            {/* Behandlungsart */}
            <Box>
              <Text className='text-xl font-semibold mb-2'>{t('search.which_treatment')}</Text>
              {servicesLoading ? (
                <Spinner size='small' className='mt-2' />
              ) : (
                <TouchableOpacity
                  onPress={() => setTreatmentSheetOpen(true)}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#ffffff', borderRadius: 8, minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent: 'space-between', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 10 }}
                >
                  <Text
                    className={selectedServiceNames.length > 0 ? 'text-typography-900 font-semibold flex-1 mr-2' : 'text-typography-400 flex-1'}
                  >
                    {selectedServiceNames.length > 0
                      ? selectedServiceNames.join(', ')
                      : t('search.which_treatment')}
                  </Text>
                  <FontAwesomeIcon name='chevron-down' size={14} color='#6b7280' />
                </TouchableOpacity>
              )}
            </Box>

            {/* Suchen Button */}
            <Card className='bg-primary-100 p-4 shadow-lg border-0 rounded-xl mt-2'>
              <Button
                variant='solid'
                action='positive'
                onPress={() =>
                  router.push({
                    pathname: routes.modals.result,
                    params: {
                      query,
                      animalTypeId: selectedMyPet ? String(selectedMyPet.animalTypeId) : '',
                      serviceId: selectedTreatments.join(','),
                      ...(selectedPet ? { animalId: selectedPet } : {}),
                    },
                  })
                }
                className='bg-primary-100 rounded-xl'
              >
                <FontAwesomeIcon name='search' size={20} />
                <ButtonText className='text-typography-700 text-2xl'>
                  {t('search.submit')}
                </ButtonText>
              </Button>
            </Card>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Haustier Actionsheet */}
      <Actionsheet isOpen={petSheetOpen} onClose={() => setPetSheetOpen(false)} useRNModal>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetFlatList
            data={myAnimals ?? []}
            keyExtractor={(item) => String((item as { id: number }).id)}
            renderItem={({ item }) => {
              const pet = item as { id: number; name: string }
              return (
                <ActionsheetItem
                  onPress={() => {
                    setSelectedPet(String(pet.id))
                    setPetSheetOpen(false)
                  }}
                >
                  <ActionsheetItemText className={selectedPet === String(pet.id) ? 'text-primary-500 font-semibold' : ''}>
                    {pet.name}
                  </ActionsheetItemText>
                </ActionsheetItem>
              )
            }}
            style={{ maxHeight: 350, width: '100%' }}
          />
        </ActionsheetContent>
      </Actionsheet>

      {/* Behandlung Actionsheet */}
      <Actionsheet isOpen={treatmentSheetOpen} onClose={() => setTreatmentSheetOpen(false)} useRNModal>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetFlatList
            data={services ?? []}
            keyExtractor={(item) => String((item as { id: number }).id)}
            renderItem={({ item }) => {
              const service = item as { id: number; name: string }
              const isSelected = selectedTreatments.includes(String(service.id))
              return (
                <ActionsheetItem onPress={() => toggleTreatment(String(service.id))}>
                  <HStack className='flex-1 justify-between items-center'>
                    <ActionsheetItemText className={isSelected ? 'text-primary-500 font-semibold' : ''}>
                      {service.name}
                    </ActionsheetItemText>
                    {isSelected && <FontAwesomeIcon name='check' color='#2e8a59' size={16} />}
                  </HStack>
                </ActionsheetItem>
              )
            }}
            style={{ maxHeight: 350, width: '100%' }}
          />
          <Box className='px-4 pb-4 pt-2 w-full'>
            <Button
              className='w-full rounded-xl bg-primary-500'
              onPress={() => setTreatmentSheetOpen(false)}
            >
              <ButtonText className='text-white font-bold'>{t('search.treatment_done')}</ButtonText>
            </Button>
          </Box>
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  )
}
