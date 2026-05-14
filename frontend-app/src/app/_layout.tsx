import { Stack, usePathname } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Fab, FabIcon } from '@src/gluestack-components/ui/fab';
import { MoonIcon, SlashIcon, SunIcon } from '@src/gluestack-components/ui/icon';
import { GluestackUIProvider } from '@src/gluestack-components/ui/gluestack-ui-provider';
import { useColorScheme } from '@src/gluestack-components/useColorScheme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '@/global.css';
import '@src/i18n';
import { QueryProvider } from '@src/providers/QueryProvider';
import { useAuthStore } from '@src/stores/authStore';
import { useThemeStore } from '@src/stores/themeStore';
import { useLanguageStore } from '@src/stores/languageStore';

// --- für ErrorBoundary kannst du deinen bestehenden hängen lassen ---
export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);
  const hydrateTheme = useThemeStore((s) => s.hydrateFromStorage);
  const hydrateLanguage = useLanguageStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      Promise.all([hydrateFromStorage(), hydrateTheme(), hydrateLanguage()]).then(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryProvider>
      <RootLayoutNav />
    </QueryProvider>
  );
}

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const effectiveColorScheme =
    mode === 'system' ? (systemColorScheme ?? 'light') : mode;

  const handleToggleTheme = () => {
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  return (
    <GluestackUIProvider mode={mode}>
      <ThemeProvider
        value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        {/* Haupt‑Stack mit Tabs + Modals */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth screens (login / register) */}
          <Stack.Screen name="(auth)"/>

          {/* Tabs */}
          <Stack.Screen name="(tabs)"/>

          {/* Modals – direkt im Root‑Stack, damit router.navigate() korrekt zurücknavigiert */}
          <Stack.Screen name="(modals)/search" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/result" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/practice" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/process" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/booking-confirmation" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/add-pet" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/edit-pet" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/edit-profile" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/favorite-practices" options={{ presentation: 'fullScreenModal' }}/>
          <Stack.Screen name="(modals)/language" options={{ presentation: 'fullScreenModal' }}/>
        </Stack>

        {/* Deinen Button nur für den Start‑Pfad */}
        {usePathname() === '/login' && (
          <Fab onPress={handleToggleTheme} className="m-6" size="lg">
            <FabIcon
              as={
                mode === 'system'
                  ? SlashIcon
                  : effectiveColorScheme === 'dark'
                  ? MoonIcon
                  : SunIcon
              }
            />
          </Fab>
        )}
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
