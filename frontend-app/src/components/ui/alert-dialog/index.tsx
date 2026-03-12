'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type {
  MotionComponentProps,
} from '@legendapp/motion'
import type { ViewStyle } from 'react-native'

import { createAlertDialog } from '@gluestack-ui/core/alert-dialog/creator'
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'
import {
  AnimatePresence,
  createMotionAnimatedComponent,
  Motion,
} from '@legendapp/motion'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'

const SCOPE = 'ALERT_DIALOG'

const RootComponent = withStyleContext(View, SCOPE)

type IMotionViewProps = React.ComponentProps<typeof View>
  & MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable>
  & MotionComponentProps<typeof Pressable, ViewStyle, unknown, unknown, unknown>

const AnimatedPressable = createMotionAnimatedComponent(
  Pressable,
) as React.ComponentType<IAnimatedPressableProps>

const UIAccessibleAlertDialog = createAlertDialog({
  Root: RootComponent,
  Body: ScrollView,
  Content: MotionView,
  CloseButton: Pressable,
  Header: View,
  Footer: View,
  Backdrop: AnimatedPressable,
  AnimatePresence,
})

cssInterop(MotionView, { className: 'style' })
cssInterop(AnimatedPressable, { className: 'style' })

const alertDialogStyle = tva({
  base: 'group/modal w-full h-full justify-center items-center web:pointer-events-none',
  parentVariants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
  },
})

const alertDialogContentStyle = tva({
  base: 'bg-background-0 rounded-lg overflow-hidden border border-outline-100 p-6',
  parentVariants: {
    size: {
      xs: 'w-[60%] max-w-[360px]',
      sm: 'w-[70%] max-w-[420px]',
      md: 'w-[80%] max-w-[510px]',
      lg: 'w-[90%] max-w-[640px]',
      full: 'w-full',
    },
  },
})

const alertDialogCloseButtonStyle = tva({
  base: 'group/alert-dialog-close-button z-10 rounded-sm p-2 data-[focus-visible=true]:bg-background-100 web:cursor-pointer outline-0',
})

const alertDialogHeaderStyle = tva({
  base: 'justify-between items-center flex-row',
})

const alertDialogFooterStyle = tva({
  base: 'flex-row justify-end items-center gap-3',
})

const alertDialogBodyStyle = tva({ base: '' })

const alertDialogBackdropStyle = tva({
  base: 'absolute left-0 top-0 right-0 bottom-0 bg-background-dark web:cursor-default',
})

type IAlertDialogProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog
>
& VariantProps<typeof alertDialogStyle>

type IAlertDialogContentProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.Content
>
& VariantProps<typeof alertDialogContentStyle> & { className?: string }

type IAlertDialogCloseButtonProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.CloseButton
>
& VariantProps<typeof alertDialogCloseButtonStyle>

type IAlertDialogHeaderProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.Header
>
& VariantProps<typeof alertDialogHeaderStyle>

type IAlertDialogFooterProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.Footer
>
& VariantProps<typeof alertDialogFooterStyle>

type IAlertDialogBodyProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.Body
>
& VariantProps<typeof alertDialogBodyStyle>

type IAlertDialogBackdropProps = React.ComponentPropsWithoutRef<
  typeof UIAccessibleAlertDialog.Backdrop
>
& VariantProps<typeof alertDialogBackdropStyle> & { className?: string }

function AlertDialog({ ref, className, size = 'md', ...props }: IAlertDialogProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog> | null> }) {
  return (
    <UIAccessibleAlertDialog
      ref={ref}
      {...props}
      className={alertDialogStyle({ class: className })}
      context={{ size }}
      pointerEvents="box-none"
    />
  )
}

function AlertDialogContent({ ref, className, size, ...props }: IAlertDialogContentProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.Content> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UIAccessibleAlertDialog.Content
      pointerEvents="auto"
      ref={ref}
      initial={{
        scale: 0.9,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0.9,
        opacity: 0,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 250,
        opacity: {
          type: 'timing',
          duration: 250,
        },
      }}
      {...props}
      className={alertDialogContentStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  )
}

function AlertDialogCloseButton({ ref, className, ...props }: IAlertDialogCloseButtonProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.CloseButton> | null> }) {
  return (
    <UIAccessibleAlertDialog.CloseButton
      ref={ref}
      {...props}
      className={alertDialogCloseButtonStyle({
        class: className,
      })}
    />
  )
}

function AlertDialogHeader({ ref, className, ...props }: IAlertDialogHeaderProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.Header> | null> }) {
  return (
    <UIAccessibleAlertDialog.Header
      ref={ref}
      {...props}
      className={alertDialogHeaderStyle({
        class: className,
      })}
    />
  )
}

function AlertDialogFooter({ ref, className, ...props }: IAlertDialogFooterProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.Footer> | null> }) {
  return (
    <UIAccessibleAlertDialog.Footer
      ref={ref}
      {...props}
      className={alertDialogFooterStyle({
        class: className,
      })}
    />
  )
}

function AlertDialogBody({ ref, className, ...props }: IAlertDialogBodyProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.Body> | null> }) {
  return (
    <UIAccessibleAlertDialog.Body
      ref={ref}
      {...props}
      className={alertDialogBodyStyle({
        class: className,
      })}
    />
  )
}

function AlertDialogBackdrop({ ref, className, ...props }: IAlertDialogBackdropProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccessibleAlertDialog.Backdrop> | null> }) {
  return (
    <UIAccessibleAlertDialog.Backdrop
      ref={ref}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 0.5,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 250,
        opacity: {
          type: 'timing',
          duration: 250,
        },
      }}
      {...props}
      className={alertDialogBackdropStyle({
        class: className,
      })}
    />
  )
}

AlertDialog.displayName = 'AlertDialog'
AlertDialogContent.displayName = 'AlertDialogContent'
AlertDialogCloseButton.displayName = 'AlertDialogCloseButton'
AlertDialogHeader.displayName = 'AlertDialogHeader'
AlertDialogFooter.displayName = 'AlertDialogFooter'
AlertDialogBody.displayName = 'AlertDialogBody'
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop'

export {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
}
