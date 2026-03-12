import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { hstackStyle } from './styles'

type IHStackProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof hstackStyle>

function HStack({ ref, className, space, reversed, ...props }: IHStackProps & { ref?: React.RefObject<React.ComponentRef<'div'> | null> }) {
  return (
    <div
      className={hstackStyle({
        space,
        reversed: reversed as boolean,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

HStack.displayName = 'HStack'

export { HStack }
