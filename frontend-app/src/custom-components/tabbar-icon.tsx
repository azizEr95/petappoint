import type { ComponentProps } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export function FontAwesomeIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name']
  color: string
  size: number
}) {
  return <FontAwesome {...props} />
}
