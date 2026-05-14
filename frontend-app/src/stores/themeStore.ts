import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const THEME_KEY = 'theme_mode'

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key)
    return SecureStore.getItemAsync(key)
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return }
    await SecureStore.setItemAsync(key, value)
  },
}

type ThemeState = {
  mode: 'light' | 'dark' | 'system'
  setMode: (mode: 'light' | 'dark' | 'system') => Promise<void>
  hydrateFromStorage: () => Promise<void>
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',

  setMode: async (mode) => {
    await storage.setItem(THEME_KEY, mode)
    set({ mode })
  },

  hydrateFromStorage: async () => {
    const stored = await storage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      set({ mode: stored })
    }
  },
}))
