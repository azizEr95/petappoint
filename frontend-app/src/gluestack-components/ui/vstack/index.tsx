import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { View } from 'react-native'

import { vstackStyle } from './styles'

type IVStackProps = React.ComponentProps<typeof View>
  & VariantProps<typeof vstackStyle>

function VStack({ ref, className, space, reversed, ...props }: IVStackProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View
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
