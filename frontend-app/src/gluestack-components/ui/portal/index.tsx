'use client'
import { Overlay } from '@gluestack-ui/core/overlay/creator'
import { cssInterop } from 'nativewind'
import * as React from 'react'

cssInterop(Overlay, { className: 'style' })

function Portal({ ref, ...props }: React.ComponentProps<typeof Overlay> & { ref?: React.RefObject<React.ComponentRef<typeof Overlay> | null> }) {
  return <Overlay {...props} ref={ref} />
}

Portal.displayName = 'Portal'

export { Portal }
