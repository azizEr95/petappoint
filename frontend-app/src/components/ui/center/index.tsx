import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { ViewProps } from 'react-native'
import * as React from 'react'
import { View } from 'react-native'
import { centerStyle } from './styles'

type ICenterProps = ViewProps & VariantProps<typeof centerStyle>

function Center({ ref, className, ...props }: ICenterProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View
      className={centerStyle({ class: className })}
      {...props}
      ref={ref}
    />
  )
}

Center.displayName = 'Center'

export { Center }
