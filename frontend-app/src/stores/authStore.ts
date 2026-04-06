import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { LoginType } from 'petappoint-shared/schemas/ZodSchemas'

const TOKEN_KEY = 'access_token'

type AuthState = {
  user: LoginType | null
  token: string | null
  isLoading: boolean
  setAuth: (user: LoginType, token: string) => Promise<void>
  clearAuth: () => Promise<void>
  hydrateFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    set({ user, token })
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    set({ user: null, token: null })
  },

  hydrateFromStorage: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    set({ token: token ?? null, isLoading: false })
  },
}))
