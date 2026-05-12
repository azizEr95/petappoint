import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'

import { gridItemStyle, gridStyle } from './styles'

type IGridProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof gridStyle> & {
    gap?: number
    rowGap?: number
    columnGap?: number
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    padding?: number
    paddingLeft?: number
    paddingRight?: number
    paddingStart?: number
    paddingEnd?: number
    _extra: {
      className: string
    }
  }

function Grid({ ref, className, _extra, ...props }: IGridProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const gridClass = _extra?.className
  const finalGridClass = gridClass ?? ''
  return (
    <div
      ref={ref}
      className={gridStyle({
        class: `${className} ${finalGridClass}`,
      })}
      {...props}
    />
  )
}

type IGridItemProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof gridItemStyle> & {
    index?: number
    _extra: {
      className: string
    }
  }
function GridItem({ ref, className, _extra, ...props }: IGridItemProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const gridItemClass = _extra?.className

  const finalGridItemClass = gridItemClass ?? ''
  return (
    <div
      ref={ref}
      className={gridItemStyle({
        class: `${className} ${finalGridItemClass}`,
      })}
      {...props}
    />
  )
}

Grid.displayName = 'Grid'
GridItem.displayName = 'GridItem'

export { Grid, GridItem }
