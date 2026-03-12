'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import { createAvatar } from '@gluestack-ui/core/avatar/creator'

import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'

import * as React from 'react'
import { Image, Platform, Text, View } from 'react-native'

const SCOPE = 'AVATAR'

const UIAvatar = createAvatar({
  Root: withStyleContext(View, SCOPE),
  Badge: View,
  Group: View,
  Image,
  FallbackText: Text,
})

const avatarStyle = tva({
  base: 'rounded-full justify-center items-center relative bg-primary-600 group-[.avatar-group]/avatar-group:-ml-2.5',
  variants: {
    size: {
      'xs': 'w-6 h-6',
      'sm': 'w-8 h-8',
      'md': 'w-12 h-12',
      'lg': 'w-16 h-16',
      'xl': 'w-24 h-24',
      '2xl': 'w-32 h-32',
    },
  },
})

const avatarFallbackTextStyle = tva({
  base: 'text-typography-0 font-semibold overflow-hidden text-transform:uppercase web:cursor-default',

  parentVariants: {
    size: {
      'xs': 'text-2xs',
      'sm': 'text-xs',
      'md': 'text-base',
      'lg': 'text-xl',
      'xl': 'text-3xl',
      '2xl': 'text-5xl',
    },
  },
})

const avatarGroupStyle = tva({
  base: 'group/avatar-group flex-row-reverse relative avatar-group',
})

const avatarBadgeStyle = tva({
  base: 'w-5 h-5 bg-success-500 rounded-full absolute right-0 bottom-0 border-background-0 border-2',
  parentVariants: {
    size: {
      'xs': 'w-2 h-2',
      'sm': 'w-2 h-2',
      'md': 'w-3 h-3',
      'lg': 'w-4 h-4',
      'xl': 'w-6 h-6',
      '2xl': 'w-8 h-8',
    },
  },
})

const avatarImageStyle = tva({
  base: 'h-full w-full rounded-full absolute',
})

type IAvatarProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIAvatar>,
  'context'
>
& VariantProps<typeof avatarStyle>

function Avatar({ ref, className, size = 'md', ...props }: IAvatarProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAvatar> | null> }) {
  return (
    <UIAvatar
      ref={ref}
      {...props}
      className={avatarStyle({ size, class: className })}
      context={{ size }}
    />
  )
}

type IAvatarBadgeProps = React.ComponentPropsWithoutRef<typeof UIAvatar.Badge>
  & VariantProps<typeof avatarBadgeStyle>

function AvatarBadge({ ref, className, size, ...props }: IAvatarBadgeProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAvatar.Badge> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UIAvatar.Badge
      ref={ref}
      {...props}
      className={avatarBadgeStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  )
}

type IAvatarFallbackTextProps = React.ComponentPropsWithoutRef<
  typeof UIAvatar.FallbackText
>
& VariantProps<typeof avatarFallbackTextStyle>
function AvatarFallbackText({ ref, className, size, ...props }: IAvatarFallbackTextProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAvatar.FallbackText> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UIAvatar.FallbackText
      ref={ref}
      {...props}
      className={avatarFallbackTextStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  )
}

type IAvatarImageProps = React.ComponentPropsWithoutRef<typeof UIAvatar.Image>
  & VariantProps<typeof avatarImageStyle>

function AvatarImage({ ref, className, ...props }: IAvatarImageProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAvatar.Image> | null> }) {
  return (
    <UIAvatar.Image
      ref={ref}
      {...props}
      className={avatarImageStyle({
        class: className,
      })}
      // @ts-expect-error : This is a workaround to fix the issue with the image style on web.
      style={
        Platform.OS === 'web'
          ? { height: 'revert-layer', width: 'revert-layer' }
          : undefined
      }
    />
  )
}

type IAvatarGroupProps = React.ComponentPropsWithoutRef<typeof UIAvatar.Group>
  & VariantProps<typeof avatarGroupStyle>

function AvatarGroup({ ref, className, ...props }: IAvatarGroupProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAvatar.Group> | null> }) {
  return (
    <UIAvatar.Group
      ref={ref}
      {...props}
      className={avatarGroupStyle({
        class: className,
      })}
    />
  )
}

export { Avatar, AvatarBadge, AvatarFallbackText, AvatarGroup, AvatarImage }
