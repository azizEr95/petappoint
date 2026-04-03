import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { ViewProps } from 'react-native'
import * as React from 'react'
import { View } from 'react-native'
import { cardStyle } from './styles'

type ICardProps = ViewProps
  & VariantProps<typeof cardStyle> & { className?: string }

function Card({ ref, className, size = 'md', variant = 'elevated', ...props }: ICardProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View
      className={cardStyle({ size, variant, class: className })}
      {...props}
      ref={ref}
    />
  )
}

Card.displayName = 'Card'

export { Card }
