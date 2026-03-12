'use client'
import { tva } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { ImageBackground as RNImageBackground } from 'react-native'

const imageBackgroundStyle = tva({})

function ImageBackground({ ref, className, ...props }: React.ComponentProps<typeof RNImageBackground> & { ref?: React.RefObject<React.ComponentRef<typeof RNImageBackground> | null> }) {
  return (
    <RNImageBackground
      className={imageBackgroundStyle({
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

ImageBackground.displayName = 'ImageBackground'

export { ImageBackground }
