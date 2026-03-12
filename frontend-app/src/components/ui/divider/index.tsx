'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import { tva } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { Platform, View } from 'react-native'

const dividerStyle = tva({
  base: 'bg-background-200',
  variants: {
    orientation: {
      vertical: 'w-px h-full',
      horizontal: 'h-px w-full',
    },
  },
})

type IUIDividerProps = React.ComponentPropsWithoutRef<typeof View>
  & VariantProps<typeof dividerStyle>

function Divider({ ref, className, orientation = 'horizontal', ...props }: IUIDividerProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return (
    <View
      ref={ref}
      {...props}
      aria-orientation={orientation}
      role={Platform.OS === 'web' ? 'separator' : undefined}
      className={dividerStyle({
        orientation,
        class: className,
      })}
    />
  )
}

Divider.displayName = 'Divider'

export { Divider }
