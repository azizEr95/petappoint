import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { textStyle } from './styles'

type ITextProps = React.ComponentProps<'span'> & VariantProps<typeof textStyle>

function Text({ ref, className, isTruncated, bold, underline, strikeThrough, size = 'md', sub, italic, highlight, ...props }: ITextProps & { ref?: React.RefObject<React.ComponentRef<'span'> | null> }) {
  return (
    <span
      className={textStyle({
        isTruncated: isTruncated as boolean,
        bold: bold as boolean,
        underline: underline as boolean,
        strikeThrough: strikeThrough as boolean,
        size,
        sub: sub as boolean,
        italic: italic as boolean,
        highlight: highlight as boolean,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

Text.displayName = 'Text'

export { Text }
