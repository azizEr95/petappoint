import { useClientOnlyValue } from '@src/gluestack-components/useClientOnlyValue'
import { Tabs } from 'expo-router'
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const { t } = useTranslation()
  const tabBarIconSize = 22
  const homeIconSize = 30

  return (
    <Tabs screenOptions={{
      headerShown: useClientOnlyValue(false, false),
    }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="home" color={color} size={homeIconSize} />,
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: t('tabs.appointments'),
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="calendar" color={color} size={tabBarIconSize} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: t('tabs.pets'),
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="paw" color={color} size={tabBarIconSize} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <FontAwesomeIcon name="user" color={color} size={tabBarIconSize} />,
        }}
      />
    </Tabs>
  )
}
