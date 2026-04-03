import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'

import { boxStyle } from './styles'

type IBoxProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof boxStyle> & { className?: string }

function Box({ ref, className, ...props }: IBoxProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref} className={boxStyle({ class: className })} {...props} />
  )
}

Box.displayName = 'Box'
export { Box }
