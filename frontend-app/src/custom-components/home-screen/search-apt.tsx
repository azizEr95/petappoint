import { useRouter } from 'expo-router'
import { Button, ButtonText, Card } from '@/src/gluestack-components/ui'
import { FontAwesomeIcon } from '@src/custom-components/tabbar-icon'

export function SearchApt() {
  const router = useRouter()

  return (
    <>
      <Card className='p-4 shadow-lg border-0 mb-6 rounded-xl bg-primary-100'>
        <Button
          variant='solid'
          action='positive'
          onPress={() => router.push('/(modals)/search')}
          className='bg-primary-100 rounded-xl '
        >
          <FontAwesomeIcon name='search' color='#374151' size={20} />
          <ButtonText className='text-gray-700 text-2xl'>
            Termin buchen
          </ButtonText>
        </Button>
      </Card>
    </>
  )
}
