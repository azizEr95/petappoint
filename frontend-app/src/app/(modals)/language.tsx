// app/(modals)/language.tsx
import { FontAwesomeIcon } from '@/src/custom-components/tabbar-icon'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Pressable,
  Text,
  VStack,
} from '@/src/gluestack-components/ui'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@src/stores/languageStore'

const LANGUAGES: { value: 'de' | 'en'; label: string; nativeLabel: string }[] = [
  { value: 'de', label: 'Deutsch', nativeLabel: 'Deutsch' },
  { value: 'en', label: 'English', nativeLabel: 'English' },
]

export default function LanguageScreen() {
  const { t } = useTranslation()
  const language = useLanguageStore((s) => s.language)
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  return (
    <Box className='flex-1 bg-background-100'>
      {/* Top green area */}
      <Box className='bg-primary-500 rounded-b-3xl justify-center px-6 pb-4 pt-16'>
        <Box className='flex-row justify-between items-start'>
          <Box>
            <Text size='3xl' className='font-bold text-white'>
              {t('profile.language')}
            </Text>
          </Box>
          <ButtonGroup>
            <Button className='bg-white/20 rounded-3xl' onPress={() => router.back()}>
              <FontAwesomeIcon name='times' color='#ffffff' size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <VStack className='px-5 pt-6 gap-3'>
        <Card className='rounded-xl overflow-hidden bg-background-0 shadow-lg p-0'>
          {LANGUAGES.map((lang, index) => (
            <Box key={lang.value}>
              <Pressable
                className='flex-row items-center justify-between px-4 py-4'
                onPress={() => setLanguage(lang.value)}
              >
                <Text className='font-medium text-typography-800 text-lg'>
                  {lang.label}
                </Text>
                {language === lang.value && (
                  <FontAwesomeIcon name='check' color='#2e8a59' size={18} />
                )}
              </Pressable>
              {index < LANGUAGES.length - 1 && (
                <Box className='h-px bg-outline-100 mx-4' />
              )}
            </Box>
          ))}
        </Card>
      </VStack>
    </Box>
  )
}
