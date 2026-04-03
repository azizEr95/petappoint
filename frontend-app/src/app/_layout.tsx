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
import { useEffect, useState } from 'react';
import '@/global.css';

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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'system' | 'light' | 'dark'>('system');

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
          <Stack.Screen name="(auth)" />

          {/* Tabs (z.B. in (tabs)) */}
          <Stack.Screen
            name="(tabs)"
            options={{presentation: 'fullScreenModal'}}
          />

          {/* Modal‑Stack für search / booking */}
          <Stack.Screen
            name="(modals)"
            options={{ presentation: 'formSheet' }}
          />
        </Stack>

        {/* Deinen Button nur für den Start‑Pfad */}
        {usePathname() === '/' && (
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
