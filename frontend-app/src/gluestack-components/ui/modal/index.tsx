'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type {
  MotionComponentProps,
} from '@legendapp/motion'
import type { ViewStyle } from 'react-native'
import { createModal } from '@gluestack-ui/core/modal/creator'
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'
import {
  AnimatePresence,
  createMotionAnimatedComponent,
  Motion,
} from '@legendapp/motion'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable>
  & MotionComponentProps<typeof Pressable, ViewStyle, unknown, unknown, unknown>

const AnimatedPressable = createMotionAnimatedComponent(
  Pressable,
) as React.ComponentType<IAnimatedPressableProps>
const SCOPE = 'MODAL'

type IMotionViewProps = React.ComponentProps<typeof View>
  & MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>

const UIModal = createModal({
  Root: withStyleContext(View, SCOPE),
  Backdrop: AnimatedPressable,
  Content: MotionView,
  Body: ScrollView,
  CloseButton: Pressable,
  Footer: View,
  Header: View,
  AnimatePresence,
})

cssInterop(AnimatedPressable, { className: 'style' })
cssInterop(MotionView, { className: 'style' })

const modalStyle = tva({
  base: 'group/modal w-full h-full justify-center items-center web:pointer-events-none',
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
  },
})

const modalBackdropStyle = tva({
  base: 'absolute left-0 top-0 right-0 bottom-0 bg-background-dark web:cursor-default',
})

const modalContentStyle = tva({
  base: 'bg-background-0 rounded-md overflow-hidden border border-outline-100 shadow-hard-2 p-6',
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

const modalBodyStyle = tva({
  base: 'mt-2 mb-6',
})

const modalCloseButtonStyle = tva({
  base: 'group/modal-close-button z-10 rounded data-[focus-visible=true]:web:bg-background-100 web:outline-0 cursor-pointer',
})

const modalHeaderStyle = tva({
  base: 'justify-between items-center flex-row',
})

const modalFooterStyle = tva({
  base: 'flex-row justify-end items-center gap-2',
})

type IModalProps = React.ComponentProps<typeof UIModal>
  & VariantProps<typeof modalStyle> & { className?: string }

type IModalBackdropProps = React.ComponentProps<typeof UIModal.Backdrop>
  & VariantProps<typeof modalBackdropStyle> & { className?: string }

type IModalContentProps = React.ComponentProps<typeof UIModal.Content>
  & VariantProps<typeof modalContentStyle> & { className?: string }

type IModalHeaderProps = React.ComponentProps<typeof UIModal.Header>
  & VariantProps<typeof modalHeaderStyle> & { className?: string }

type IModalBodyProps = React.ComponentProps<typeof UIModal.Body>
  & VariantProps<typeof modalBodyStyle> & { className?: string }

type IModalFooterProps = React.ComponentProps<typeof UIModal.Footer>
  & VariantProps<typeof modalFooterStyle> & { className?: string }

type IModalCloseButtonProps = React.ComponentProps<typeof UIModal.CloseButton>
  & VariantProps<typeof modalCloseButtonStyle> & { className?: string }

function Modal({ ref, className, size = 'md', ...props }: IModalProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal> | null> }) {
  return (
    <UIModal
      ref={ref}
      {...props}
      pointerEvents="box-none"
      className={modalStyle({ size, class: className })}
      context={{ size }}
    />
  )
}

function ModalBackdrop({ ref, className, ...props }: IModalBackdropProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.Backdrop> | null> }) {
  return (
    <UIModal.Backdrop
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
      className={modalBackdropStyle({
        class: className,
      })}
    />
  )
}

function ModalContent({ ref, className, size, ...props }: IModalContentProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.Content> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UIModal.Content
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
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
      className={modalContentStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      pointerEvents="auto"
    />
  )
}

function ModalHeader({ ref, className, ...props }: IModalHeaderProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.Header> | null> }) {
  return (
    <UIModal.Header
      ref={ref}
      {...props}
      className={modalHeaderStyle({
        class: className,
      })}
    />
  )
}

function ModalBody({ ref, className, ...props }: IModalBodyProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.Body> | null> }) {
  return (
    <UIModal.Body
      ref={ref}
      {...props}
      className={modalBodyStyle({
        class: className,
      })}
    />
  )
}

function ModalFooter({ ref, className, ...props }: IModalFooterProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.Footer> | null> }) {
  return (
    <UIModal.Footer
      ref={ref}
      {...props}
      className={modalFooterStyle({
        class: className,
      })}
    />
  )
}

function ModalCloseButton({ ref, className, ...props }: IModalCloseButtonProps & { ref?: React.RefObject<React.ComponentRef<typeof UIModal.CloseButton> | null> }) {
  return (
    <UIModal.CloseButton
      ref={ref}
      {...props}
      className={modalCloseButtonStyle({
        class: className,
      })}
    />
  )
}

Modal.displayName = 'Modal'
ModalBackdrop.displayName = 'ModalBackdrop'
ModalContent.displayName = 'ModalContent'
ModalHeader.displayName = 'ModalHeader'
ModalBody.displayName = 'ModalBody'
ModalFooter.displayName = 'ModalFooter'
ModalCloseButton.displayName = 'ModalCloseButton'

export {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
}
