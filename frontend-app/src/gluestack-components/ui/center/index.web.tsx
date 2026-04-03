import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'

import { centerStyle } from './styles'

type ICenterProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof centerStyle>

function Center({ ref, className, ...props }: ICenterProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className={centerStyle({ class: className })} {...props} ref={ref} />
  )
}

Center.displayName = 'Center'

export { Center }
