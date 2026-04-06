import { Header } from '@/src/custom-components/header'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Card,
  Divider,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { useLogout } from '@src/hooks/useLogout'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useMyAppointments } from '@src/hooks/useMyAppointments'

const menuSections = [
  {
    id: 'account',
    label: 'Konto',
    items: [
      { icon: 'user', label: 'Persönliche Daten' },
      { icon: 'bell', label: 'Benachrichtigungen' },
      { icon: 'heart', label: 'Lieblings-Tierärzte' },
    ],
  },
  {
    id: 'support',
    label: 'Hilfe & Support',
    items: [
      { icon: 'question-circle', label: 'Hilfe-Center' },
      { icon: 'file-text-o', label: 'AGB & Datenschutz' },
      { icon: 'shield', label: 'Sicherheit' },
    ],
  },
] as const

export default function Profile() {
  const { mutate: logout, isPending } = useLogout()
  const { data: animals } = useMyAnimals()
  const { future, past } = useMyAppointments()
  const totalAppointments = future.length + past.length

  return (
    <Box className='flex-1 bg-slate-100'>
      <ScrollView>
        {/* Header */}
        <Header />

        <Box className='px-5'>
          {/* Stats */}
          <Card className='p-4 shadow-lg rounded-xl -mt-5 mb-5 bg-white'>
            <HStack className='justify-around'>
              <VStack className='items-center'>
                <Text size='2xl' className='font-bold text-primary-500'>
                  {animals?.length ?? '–'}
                </Text>
                <Text size='xs' className='text-gray-400'>
                  Haustiere
                </Text>
              </VStack>
              <Divider orientation='vertical' className='h-10' />
              <VStack className='items-center'>
                <Text size='2xl' className='font-bold text-primary-500'>
                  {totalAppointments}
                </Text>
                <Text size='xs' className='text-gray-400'>
                  Termine
                </Text>
              </VStack>
              {/*<Divider orientation='vertical' className='h-10' />
              <VStack className='items-center'>
                <Text size='2xl' className='font-bold text-primary-500'>
                  4
                </Text>
                <Text size='xs' className='text-gray-400'>
                  Bewertungen
                </Text>
              </VStack>*/}
            </HStack>
          </Card>

          {/* Menu Sections */}
          <VStack className='gap-4'>
            {menuSections.map((section) => (
              <VStack key={section.id}>
                <Text size='sm' className='font-medium text-gray-400 mb-2 px-1'>
                  {section.label}
                </Text>
                <Card className='rounded-xl overflow-hidden bg-white shadow-lg'>
                  {section.items.map((item, index) => (
                    <Box key={item.label}>
                      <Pressable className='flex-row items-center justify-between p-4'>
                        <HStack className='items-center gap-3'>
                          <Box className='w-10 h-10 rounded-full bg-slate-100 items-center justify-center'>
                            <FontAwesomeIcon
                              name={item.icon}
                              color='#2e8a59'
                              size={18}
                            />
                          </Box>
                          <Text className='font-medium text-gray-800'>
                            {item.label}
                          </Text>
                        </HStack>
                        <HStack className='items-center gap-2'>
                          <FontAwesomeIcon
                            name='chevron-right'
                            color='#9ca3af'
                            size={16}
                          />
                        </HStack>
                      </Pressable>
                      {index < section.items.length - 1 && (
                        <Divider className='ml-16' />
                      )}
                    </Box>
                  ))}
                </Card>
              </VStack>
            ))}

            {/* Logout */}
            <Card className='rounded-xl overflow-hidden bg-white shadow-sm'>
              <Pressable
                className='flex-row items-center gap-3 p-4'
                onPress={() => logout()}
                disabled={isPending}
              >
                <Box className='w-10 h-10 rounded-full bg-red-50 items-center justify-center'>
                  <FontAwesomeIcon name='sign-out' color='#ef4444' size={18} />
                </Box>
                <Text className='font-medium text-red-500'>
                  {isPending ? 'Abmelden…' : 'Abmelden'}
                </Text>
              </Pressable>
            </Card>

            {/* Version */}
            <Text size='xs' className='text-center text-gray-400 py-4'>
              PetAppoint Version 1.0.0
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}
