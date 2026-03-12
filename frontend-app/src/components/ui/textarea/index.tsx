'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import { createTextarea } from '@gluestack-ui/core/textarea/creator'
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'
import * as React from 'react'
import { TextInput, View } from 'react-native'

const SCOPE = 'TEXTAREA'
const UITextarea = createTextarea({
  Root: withStyleContext(View, SCOPE),
  Input: TextInput,
})

const textareaStyle = tva({
  base: 'w-full h-[100px] border border-background-300 rounded data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:data-[hover=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:bg-background-50 data-[disabled=true]:data-[hover=true]:border-background-300',

  variants: {
    variant: {
      default:
        'data-[focus=true]:border-primary-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:border-error-700 data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[focus=true]:data-[hover=true]:border-primary-700 data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-1 data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-inset data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-indicator-primary data-[invalid=true]:data-[disabled=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-1 data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-inset data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-indicator-error ',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
})

const textareaInputStyle = tva({
  base: 'p-2 web:outline-0 web:outline-none flex-1 color-typography-900 placeholder:text-typography-500 web:cursor-text web:data-[disabled=true]:cursor-not-allowed',
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
})

type ITextareaProps = React.ComponentProps<typeof UITextarea>
  & VariantProps<typeof textareaStyle>

function Textarea({ ref, className, variant = 'default', size = 'md', ...props }: ITextareaProps & { ref?: React.RefObject<React.ComponentRef<typeof UITextarea> | null> }) {
  return (
    <UITextarea
      ref={ref}
      {...props}
      className={textareaStyle({ variant, class: className })}
      context={{ size }}
    />
  )
}

type ITextareaInputProps = React.ComponentProps<typeof UITextarea.Input>
  & VariantProps<typeof textareaInputStyle>

function TextareaInput({ ref, className, ...props }: ITextareaInputProps & { ref?: React.RefObject<React.ComponentRef<typeof UITextarea.Input> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UITextarea.Input
      ref={ref}
      {...props}
      textAlignVertical="top"
      className={textareaInputStyle({
        parentVariants: {
          size: parentSize,
        },
        class: className,
      })}
    />
  )
}

Textarea.displayName = 'Textarea'
TextareaInput.displayName = 'TextareaInput'

export { Textarea, TextareaInput }
