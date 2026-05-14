import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import i18n from '@src/i18n'

const LANGUAGE_KEY = 'app_language'

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

type LanguageState = {
  language: 'de' | 'en'
  setLanguage: (lang: 'de' | 'en') => Promise<void>
  hydrateFromStorage: () => Promise<void>
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'de',

  setLanguage: async (language) => {
    await storage.setItem(LANGUAGE_KEY, language)
    await i18n.changeLanguage(language)
    set({ language })
  },

  hydrateFromStorage: async () => {
    const stored = await storage.getItem(LANGUAGE_KEY)
    if (stored === 'de' || stored === 'en') {
      await i18n.changeLanguage(stored)
      set({ language: stored })
    }
  },
}))
