import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { ViewProps } from 'react-native'
import * as React from 'react'
import { View } from 'react-native'
import { hstackStyle } from './styles'

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>

function HStack({ ref, className, space, reversed, ...props }: IHStackProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View
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
