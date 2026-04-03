'use client'
import { tva } from '@gluestack-ui/utils/nativewind-utils'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { ActivityIndicator } from 'react-native'

cssInterop(ActivityIndicator, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
})

const spinnerStyle = tva({})

function Spinner({ ref, className, color, focusable = false, 'aria-label': ariaLabel = 'loading', ...props }: React.ComponentProps<typeof ActivityIndicator> & { ref?: React.RefObject<React.ComponentRef<typeof ActivityIndicator> | null> }) {
  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      {...props}
      color={color}
      className={spinnerStyle({ class: className })}
    />
  )
}

Spinner.displayName = 'Spinner'

export { Spinner }
