import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { Avatar, Box, Card, Text } from '@/src/gluestack-components/ui'

export function UpcomingApt() {
  const formater = (date: any, time: any) => {
    return `${date}, ${time} Uhr`
  }
  const upcomingAppointments: any[] = [
    {
      id: 1,
      pet: 'Bambi',
      petType: 'Katze',
      vet: 'Dr. Schmidt',
      clinic: 'Tierarztpraxis am Park',
      date: 'Morgen',
      time: '10:30',
      type: 'Impfung',
    },
  ]

  if (upcomingAppointments.length === 0) {
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
      <Box className="mb-6">
        <Box className="mb-3">
          <Text className="text-gray-700 font-semibold text-lg">
            Nächster Termin
          </Text>
        </Box>

        {/* Rest deines „Nächster Termin“‑Inhalts */}
        <Box>
          <Box>
            {upcomingAppointments.map((apt: any) => (
              <Card
                key={apt.id}
                className="border-primary-500 border-l-4 shadow-sm mb-3"
              >
                <Box className="flex-row items-start gap-3">
                  {/* Haustier‑Icon */}
                  <Box>
                    <Avatar size="lg" className="bg-primary-400" />
                  </Box>

                  {/* Inhalt */}
                  <Box className="flex-1">
                    <Box className="flex-row items-center justify-between">
                      <Text className="text-gray-700 text-md font-semibold">
                        {apt.pet}
                      </Text>
                      <Box className="bg-primary-100 rounded-full px-3 py-1">
                        <Text className="text-gray-700">{apt.type}</Text>
                      </Box>
                    </Box>
                    <Box className="flex-row items-start gap-1 py-2">
                      <FontAwesomeIcon name="map-marker" color="#374151" size={15} />
                      <Text className="text-gray-700 text-md font-semibold">
                        {apt.clinic}
                      </Text>
                    </Box>

                    {/* Uhrzeit‑Zeile */}
                    <Box className="flex-row items-center gap-1">
                      <FontAwesomeIcon name="clock-o" color="#3r74151" size={15} />
                      <Text className="text-gray-700 font-semibold">
                        {formater(apt.date, apt.time)}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
