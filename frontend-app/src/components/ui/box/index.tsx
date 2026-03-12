import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { ViewProps } from 'react-native'
import * as React from 'react'

import { View } from 'react-native'
import { boxStyle } from './styles'

type IBoxProps = ViewProps
  & VariantProps<typeof boxStyle> & { className?: string }

function Box({ ref, className, ...props }: IBoxProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View ref={ref} {...props} className={boxStyle({ class: className })} />
  )
}

Box.displayName = 'Box'
export { Box }
