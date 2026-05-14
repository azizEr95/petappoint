export const routes = {
  auth: {
    login: '/(auth)/login' as const,
    register: '/(auth)/register' as const,
    forgotPassword: '/(auth)/forgot-password' as const,
    resetPassword: '/(auth)/reset-password' as const,
    verifyEmail: '/(auth)/verify-email' as const,
  },
  tabs: {
    home: '/(tabs)/home' as const,
    appointment: '/(tabs)/appointment' as const,
    pets: '/(tabs)/pets' as const,
    profile: '/(tabs)/profile' as const,
  },
  modals: {
    search: '/(modals)/search' as const,
    result: '/(modals)/result' as const,
    practice: '/(modals)/practice' as const,
    process: '/(modals)/process' as const,
    bookingConfirmation: '/(modals)/booking-confirmation' as const,
    addPet: '/(modals)/add-pet' as const,
    editPet: '/(modals)/edit-pet' as const,
    editProfile: '/(modals)/edit-profile' as const,
    favoritePractices: '/(modals)/favorite-practices' as const,
    language: '/(modals)/language' as const,
  },
} as const
