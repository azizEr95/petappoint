import { useRouter } from 'expo-router'
import { Button, ButtonText, Card } from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from '@src/custom-components/tabbar-icon'
import { routes } from '@src/constants/routes'
import { useTranslation } from 'react-i18next'

export function SearchApt() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <Card className='p-4 shadow-lg border-0 mb-6 rounded-xl bg-primary-100'>
        <Button
          variant='solid'
          action='positive'
          onPress={() => router.push(routes.modals.search)}
          className='bg-primary-100 rounded-xl '
        >
          <FontAwesomeIcon name='search' size={20} />
          <ButtonText className='text-typography-700 text-2xl'>
            {t('home.book_appointment')}
          </ButtonText>
        </Button>
      </Card>
    </>
  )
}
