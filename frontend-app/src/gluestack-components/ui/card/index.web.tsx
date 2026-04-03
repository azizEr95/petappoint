import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { cardStyle } from './styles'

type ICardProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof cardStyle>

function Card({ ref, className, size = 'md', variant = 'elevated', ...props }: ICardProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      className={cardStyle({ size, variant, class: className })}
      {...props}
      ref={ref}
    />
  )
}

Card.displayName = 'Card'

export { Card }
