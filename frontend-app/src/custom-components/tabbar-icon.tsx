import type { ComponentProps } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from 'nativewind'

const DEFAULT_LIGHT = '#374151'
const DEFAULT_DARK = '#d1d5db'

export function FontAwesomeIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name']
  color?: string
  size: number
}) {
  const { colorScheme } = useColorScheme()
  const color = props.color ?? (colorScheme === 'dark' ? DEFAULT_DARK : DEFAULT_LIGHT)

  return <FontAwesome {...props} color={color} />
}
