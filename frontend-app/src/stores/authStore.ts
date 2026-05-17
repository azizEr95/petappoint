import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { LoginType } from 'petappoint-shared/schemas/ZodSchemas'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

// expo-secure-store is native-only — fall back to localStorage on web
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key)
    return SecureStore.getItemAsync(key)
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return }
    await SecureStore.setItemAsync(key, value)
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return }
    await SecureStore.deleteItemAsync(key)
  },
}

type AuthState = {
  user: LoginType | null
  token: string | null
  isLoading: boolean
  setAuth: (user: LoginType, token: string) => Promise<void>
  setVerified: () => void
  clearAuth: () => Promise<void>
  hydrateFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await Promise.all([
      storage.setItem(TOKEN_KEY, token),
      storage.setItem(USER_KEY, JSON.stringify(user)),
    ])
    set({ user, token })
  },

  setVerified: () => {
    set((state) => ({
      user: state.user ? { ...state.user, verified: true } : null,
    }))
  },

  clearAuth: async () => {
    await Promise.all([
      storage.deleteItem(TOKEN_KEY),
      storage.deleteItem(USER_KEY),
    ])
    set({ user: null, token: null })
  },

  hydrateFromStorage: async () => {
    const [token, userJson] = await Promise.all([
      storage.getItem(TOKEN_KEY),
      storage.getItem(USER_KEY),
    ])
    const user: LoginType | null = userJson ? JSON.parse(userJson) : null
    set({ token: token ?? null, user, isLoading: false })
  },
}))
