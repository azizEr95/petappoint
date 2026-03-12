import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'

import { vstackStyle } from './styles'

type IVStackProps = React.ComponentProps<'div'>
  & VariantProps<typeof vstackStyle>

function VStack({ ref, className, space, reversed, ...props }: IVStackProps & { ref?: React.RefObject<React.ComponentRef<'div'> | null> }) {
  return (
    <div
      className={vstackStyle({
        space,
        reversed: reversed as boolean,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

VStack.displayName = 'VStack'

export { VStack }
