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
import { Switch } from '@/src/gluestack-components/ui/switch'
import { router } from 'expo-router'
import type { ComponentProps } from 'react'
import { routes } from '@src/constants/routes'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useLogout } from '@src/hooks/useLogout'
import { useMyAnimals } from '@src/hooks/useMyAnimals'
import { useMyAppointments } from '@src/hooks/useMyAppointments'
import { useThemeStore } from '@src/stores/themeStore'


export default function Profile() {
  const { mutate: logout, isPending } = useLogout()
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  const menuSections = [
    {
      id: 'account',
      label: 'Konto',
      items: [
        { icon: 'user', label: 'Persönliche Daten', onPress: () => router.push(routes.modals.editProfile) },
        { icon: 'heart', label: 'Lieblings-Tierarztpraxen', onPress: () => router.push(routes.modals.favoritePractices) },
      ],
    },
  ]
  const { data: animals } = useMyAnimals()
  const { future, past } = useMyAppointments()
  const totalAppointments = future.length + past.length

  return (
    <Box className='flex-1 bg-background-100'>
      <ScrollView>
        {/* Header */}
        <Header />

        <Box className='px-5'>
          {/* Stats */}
          <Card className='p-4 shadow-lg rounded-xl -mt-5 mb-5 bg-background-0'>
            <HStack className='justify-around'>
              <VStack className='items-center'>
                <Text size='2xl' className='font-bold text-primary-500'>
                  {animals?.length ?? '–'}
                </Text>
                <Text size='xs' className='text-typography-400'>
                  Haustiere
                </Text>
              </VStack>
              <Divider orientation='vertical' className='h-10' />
              <VStack className='items-center'>
                <Text size='2xl' className='font-bold text-primary-500'>
                  {totalAppointments}
                </Text>
                <Text size='xs' className='text-typography-400'>
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
                <Text size='sm' className='font-medium text-typography-400 mb-2 px-1'>
                  {section.label}
                </Text>
                <Card className='rounded-xl overflow-hidden bg-background-0 shadow-lg'>
                  {section.items.map((item, index) => (
                    <Box key={item.label}>
                      <Pressable className='flex-row items-center justify-between p-4' onPress={item.onPress}>
                        <HStack className='items-center gap-3'>
                          <Box className='w-10 h-10 rounded-full bg-background-100 items-center justify-center'>
                            <FontAwesomeIcon
                              name={item.icon as ComponentProps<typeof FontAwesome>['name']}
                              color='#2e8a59'
                              size={18}
                            />
                          </Box>
                          <Text className='font-medium text-typography-800'>
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
                      <Divider className='ml-16' />
                    </Box>
                  ))}
                  {/* Erscheinungsbild */}
                  <Box className='flex-row items-center justify-between px-4 py-3'>
                    <HStack className='items-center gap-3'>
                      <Box className='w-10 h-10 rounded-full bg-background-100 items-center justify-center'>
                        <FontAwesomeIcon name={mode === 'dark' ? 'moon-o' : 'sun-o'} color='#2e8a59' size={18} />
                      </Box>
                      <Text className='font-medium text-typography-800'>Erscheinungsbild</Text>
                    </HStack>
                    <Switch
                      className='ml-4 pt-3'
                      size='sm'
                      value={mode === 'dark'}
                      onValueChange={(val) => setMode(val ? 'dark' : 'system')}
                    />
                  </Box>
                </Card>
              </VStack>
            ))}

            {/* Logout */}
            <Card className='rounded-xl overflow-hidden bg-background-0 shadow-sm'>
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
            <Text size='xs' className='text-center text-typography-400 py-4'>
              PetAppoint Version 1.0.0
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}
