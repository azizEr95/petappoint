import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import HomeScreen from '../components/home-screen'

// NUR ZUM TESTEN
export default function Index() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <HomeScreen />
        <StatusBar style="auto" />
      </View>
    </>
  )
}
