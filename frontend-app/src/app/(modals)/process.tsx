// app/(modals)/process.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonText,
  Card,
  HStack,
  Pressable,
  ScrollView,
  Text,
} from '@/src/gluestack-components/ui'
import { router } from 'expo-router'

// Mock data — replace with real params/state later
const booking = {
  practice: 'Tierarztpraxis am Park',
  address: 'Parkstraße 12, 10115 Berlin',
  date: 'Donnerstag, 14.03.2026',
  time: '10:00 Uhr',
  pet: 'Bello',
  petType: 'Hund',
  treatment: 'Allgemeine Untersuchung',
}

function SectionCard({
  icon,
  title,
  children,
  onEdit,
}: {
  icon: string
  title: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <Card className='bg-white rounded-xl shadow-sm p-4 mb-3'>
      <HStack className='justify-between items-center mb-2'>
        <HStack className='items-center gap-2'>
          <FontAwesomeIcon name='clock-o' color='#2e8a59' size={18} />
          <Text size='sm' className='font-semibold text-gray-500 uppercase'>
            {title}
          </Text>
        </HStack>
        <Pressable onPress={onEdit} className='flex-row items-center gap-1'>
          <FontAwesomeIcon name='pencil' color='#2e8a59' size={14} />
          <Text size='sm' className='text-primary-500 font-medium'>
            Ändern
          </Text>
        </Pressable>
      </HStack>
      {children}
    </Card>
  )
}

export default function Process() {
  return (
    <Box className='flex-1 bg-slate-100'>
      <ScrollView>
        <Box className='px-5 pt-6 pb-32'>
          {/* Header */}
          <Text size='2xl' className='font-bold text-gray-800 mb-1'>
            Buchung bestätigen
          </Text>
          <Text size='sm' className='text-gray-400 mb-6'>
            Bitte überprüfe deine Angaben vor der Buchung.
          </Text>

          {/* Ort & Zeit */}
          <SectionCard
            icon='map-marker'
            title='Ort & Zeit'
            onEdit={() => router.back()}
          >
            <Text size='md' className='font-semibold text-gray-800'>
              {booking.practice}
            </Text>
            <Text size='sm' className='text-gray-500 mt-0.5'>
              {booking.address}
            </Text>
            <HStack className='items-center gap-2 mt-2'>
              <FontAwesomeIcon name='calendar' color='#374151' size={14} />
              <Text size='sm' className='text-gray-700'>
                {booking.date}
              </Text>
            </HStack>
            <HStack className='items-center gap-2 mt-1'>
              <FontAwesomeIcon name='clock-o' color='#374151' size={14} />
              <Text size='sm' className='text-gray-700'>
                {booking.time}
              </Text>
            </HStack>
          </SectionCard>

          {/* Haustier */}
          <SectionCard
            icon='paw'
            title='Haustier'
            onEdit={() => router.push('/(tabs)/pets')}
          >
            <HStack className='items-center gap-3'>
              <Box className='bg-primary-100 rounded-full w-10 h-10 items-center justify-center'>
                <FontAwesomeIcon name='paw' color='#2e8a59' size={18} />
              </Box>
              <Box>
                <Text size='md' className='font-semibold text-gray-800'>
                  {booking.pet}
                </Text>
                <Text size='sm' className='text-gray-500'>
                  {booking.petType}
                </Text>
              </Box>
            </HStack>
          </SectionCard>

          {/* Behandlung */}
          <SectionCard
            icon='stethoscope'
            title='Behandlung'
            onEdit={() => router.back()}
          >
            <HStack className='items-center gap-3'>
              <Box className='bg-primary-100 rounded-full px-3 py-1 self-start'>
                <Text size='sm' className='text-primary-500 font-medium'>
                  {booking.treatment}
                </Text>
              </Box>
            </HStack>
          </SectionCard>
        </Box>
        {/* Sticky bottom button */}
        <Box className='absolute bottom-0 left-0 right-0 bg-white px-5 py-4 shadow-lg'>
          <Button
            className='w-full h-12 rounded-xl bg-primary-500'
            onPress={() => router.dismissTo('/(tabs)/appointment')}
          >
            <ButtonText className='text-white font-bold'>
              Buchung bestätigen
            </ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  )
}
