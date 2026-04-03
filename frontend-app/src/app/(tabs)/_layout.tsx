import { useClientOnlyValue } from '@src/gluestack-components/useClientOnlyValue'
import { Tabs } from 'expo-router'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'

export default function Layout() {
  const tabBarIconSize = 22
  const homeIconSize = 30

  return (
    <Tabs screenOptions={{
      headerShown: useClientOnlyValue(false, true),
    }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Startseite',
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="home" color={color} size={homeIconSize} />,
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: 'Termine',
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="calendar" color={color} size={tabBarIconSize} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Haustiere',
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="paw" color={color} size={tabBarIconSize} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="user" color={color} size={tabBarIconSize} />,
        }}
      />
    </Tabs>
  )
}
