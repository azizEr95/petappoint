import { View } from 'react-native'
import Searchbutton from './search-button'

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Searchbutton />
    </View>
  )
}
