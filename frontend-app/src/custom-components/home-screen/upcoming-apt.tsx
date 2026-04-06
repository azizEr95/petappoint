import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { Avatar, Box, Card, Spinner, Text } from '@/src/gluestack-components/ui'
import { useMyAppointments } from '@src/hooks/useMyAppointments'

function formatDate(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isToday = date.toDateString() === today.toDateString()
  const isTomorrow = date.toDateString() === tomorrow.toDateString()

  if (isToday) return 'Heute'
  if (isTomorrow) return 'Morgen'
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function UpcomingApt() {
  const { future, isLoading } = useMyAppointments()

  const next = [...future].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]

  if (isLoading) {
    return (
      <Box className='items-center py-4'>
        <Spinner size='small' />
      </Box>
    )
  }

  if (!next) {
    return (
      <Box>
        <Text className='text-gray-500'>Keine kommenden Termine</Text>
      </Box>
    )
  }

  return (
    <>
      <Box className='mb-6'>
        <Box className='mb-3'>
          <Text className='text-gray-700 font-semibold text-lg'>Nächster Termin</Text>
        </Box>

        <Box>
          <Card className='border-primary-500 border-l-4 shadow-sm mb-3'>
            <Box className='flex-row items-start gap-3'>
              {/* Haustier‑Icon */}
              <Box>
                <Avatar size='lg' className='bg-primary-400' />
              </Box>

              {/* Inhalt */}
              <Box className='flex-1'>
                <Box className='flex-row items-center justify-between'>
                  <Text className='text-gray-700 text-md font-semibold'>
                    {next.animal?.name ?? '–'}
                  </Text>
                  <Box className='bg-primary-100 rounded-full px-3 py-1'>
                    <Text className='text-gray-700'>
                      {next.service?.name ?? next.availableServices[0]?.name ?? '–'}
                    </Text>
                  </Box>
                </Box>
                <Box className='flex-row items-start gap-1 py-2'>
                  <FontAwesomeIcon name='map-marker' color='#374151' size={15} />
                  <Text className='text-gray-700 text-md font-semibold'>
                    {next.veterinaryPractice.name}
                  </Text>
                </Box>

                {/* Uhrzeit‑Zeile */}
                <Box className='flex-row items-center gap-1'>
                  <FontAwesomeIcon name='clock-o' color='#374151' size={15} />
                  <Text className='text-gray-700 font-semibold'>
                    {formatDate(next.startTime)}, {formatTime(next.startTime)} Uhr
                  </Text>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  )
}
