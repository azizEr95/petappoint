import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

export function useStoredImage(key: string): [string | null, (uri: string) => Promise<void>] {
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync(key).then((val) => {
      if (val) setImageUri(val)
    })
  }, [key])

  async function saveImageUri(uri: string) {
    await SecureStore.setItemAsync(key, uri)
    setImageUri(uri)
  }

  return [imageUri, saveImageUri]
}
