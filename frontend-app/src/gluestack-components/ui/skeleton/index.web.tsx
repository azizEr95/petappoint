import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'

import { skeletonStyle, skeletonTextStyle } from './styles'

type ISkeletonProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof skeletonStyle> & {
    startColor?: string
    isLoaded?: boolean
  }

function Skeleton({ ref, className, variant = 'rounded', children, speed = 2, startColor = 'bg-background-200', isLoaded = false, ...props }: ISkeletonProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  if (!isLoaded) {
    return (
      <div
        ref={ref}
        className={`animate-pulse ${startColor} ${skeletonStyle({
          variant,
          speed,
          class: className,
        })}`}
        {...props}
      />
    )
  }
  else {
    return children
  }
}

type ISkeletonTextProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof skeletonTextStyle> & {
    _lines?: number
    isLoaded?: boolean
    startColor?: string
  }

function SkeletonText({ ref, className, _lines, isLoaded = false, startColor = 'bg-background-200', gap = 2, children, ...props }: ISkeletonTextProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  if (!isLoaded) {
    if (_lines) {
      return (
        <div
          ref={ref}
          className={`flex flex-col ${skeletonTextStyle({
            gap,
          })}`}
        >
          {Array.from({ length: _lines }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse ${startColor} ${skeletonTextStyle({
                class: className,
              })}`}
              {...props}
            />
          ))}
        </div>
      )
    }
    else {
      return (
        <div
          ref={ref}
          className={`animate-pulse ${startColor} ${skeletonTextStyle({
            class: className,
          })}`}
          {...props}
        />
      )
    }
  }
  else {
    return children
  }
}

Skeleton.displayName = 'Skeleton'
SkeletonText.displayName = 'SkeletonText'

export { Skeleton, SkeletonText }
