import Ionicons from '@expo/vector-icons/Ionicons'
import { Text, TouchableOpacity } from 'react-native'

export default function Searchbutton() {
  const handleSearch = () => {
    console.log('Suche starten...')
  }

  return (
    <>
      <TouchableOpacity
        onPress={handleSearch}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#2C8A59',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color="#ffffff"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#ffffff',
          }}
        >
          Suchen
        </Text>
      </TouchableOpacity>
    </>
  )
}
