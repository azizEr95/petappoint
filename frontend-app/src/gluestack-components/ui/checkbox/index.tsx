'use client'
import type {
  IPrimitiveIcon,
} from '@gluestack-ui/core/icon/creator'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { TextProps, ViewProps } from 'react-native'
import { createCheckbox } from '@gluestack-ui/core/checkbox/creator'
import {
  PrimitiveIcon,
  UIIcon,
} from '@gluestack-ui/core/icon/creator'
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

function IndicatorWrapper({ ref, ...props }: ViewProps & { ref?: React.RefObject<React.ComponentRef<typeof View> | null> }) {
  return <View {...props} ref={ref} />
}

function LabelWrapper({ ref, ...props }: TextProps & { ref?: React.RefObject<React.ComponentRef<typeof Text> | null> }) {
  return <Text {...props} ref={ref} />
}

function IconWrapper({ ref, ...props }: IPrimitiveIcon & { ref?: React.RefObject<React.ComponentRef<typeof PrimitiveIcon> | null> }) {
  return <UIIcon {...props} ref={ref} />
}

const SCOPE = 'CHECKBOX'
const UICheckbox = createCheckbox({
  // @ts-expect-error : internal implementation for r-19/react-native-web
  Root:
    Platform.OS === 'web'
      ? withStyleContext(View, SCOPE)
      : withStyleContext(Pressable, SCOPE),
  Group: View,
  Icon: IconWrapper,
  Label: LabelWrapper,
  Indicator: IndicatorWrapper,
})

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
})

const checkboxStyle = tva({
  base: 'group/checkbox flex-row items-center justify-start web:cursor-pointer data-[disabled=true]:cursor-not-allowed',
  variants: {
    size: {
      lg: 'gap-2',
      md: 'gap-2',
      sm: 'gap-1.5',
    },
  },
})

const checkboxIndicatorStyle = tva({
  base: 'justify-center items-center border-outline-400 bg-transparent rounded web:data-[focus-visible=true]:outline-none web:data-[focus-visible=true]:ring-2 web:data-[focus-visible=true]:ring-indicator-primary data-[checked=true]:bg-primary-600 data-[checked=true]:border-primary-600 data-[hover=true]:data-[checked=false]:border-outline-500 data-[hover=true]:bg-transparent data-[hover=true]:data-[invalid=true]:border-error-700 data-[hover=true]:data-[checked=true]:bg-primary-700 data-[hover=true]:data-[checked=true]:border-primary-700 data-[hover=true]:data-[checked=true]:data-[disabled=true]:border-primary-600 data-[hover=true]:data-[checked=true]:data-[disabled=true]:bg-primary-600 data-[hover=true]:data-[checked=true]:data-[disabled=true]:opacity-40 data-[hover=true]:data-[checked=true]:data-[disabled=true]:data-[invalid=true]:border-error-700 data-[hover=true]:data-[disabled=true]:border-outline-400 data-[hover=true]:data-[disabled=true]:data-[invalid=true]:border-error-700 data-[active=true]:data-[checked=true]:bg-primary-800 data-[active=true]:data-[checked=true]:border-primary-800 data-[invalid=true]:border-error-700 data-[disabled=true]:opacity-40',
  parentVariants: {
    size: {
      lg: 'w-6 h-6 border-[3px]',
      md: 'w-5 h-5 border-2',
      sm: 'w-4 h-4 border-2',
    },
  },
})

const checkboxLabelStyle = tva({
  base: 'text-typography-600 data-[checked=true]:text-typography-900 data-[hover=true]:text-typography-900 data-[hover=true]:data-[checked=true]:text-typography-900 data-[hover=true]:data-[checked=true]:data-[disabled=true]:text-typography-900 data-[hover=true]:data-[disabled=true]:text-typography-400 data-[active=true]:text-typography-900 data-[active=true]:data-[checked=true]:text-typography-900 data-[disabled=true]:opacity-40 web:select-none',
  parentVariants: {
    size: {
      lg: 'text-lg',
      md: 'text-base',
      sm: 'text-sm',
    },
  },
})

const checkboxIconStyle = tva({
  base: 'text-typography-50 fill-none',

  parentVariants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
  },
})

const CheckboxGroup = UICheckbox.Group

type ICheckboxProps = React.ComponentPropsWithoutRef<typeof UICheckbox>
  & VariantProps<typeof checkboxStyle>

function Checkbox({ ref, className, size = 'md', ...props }: ICheckboxProps & { ref?: React.RefObject<React.ComponentRef<typeof UICheckbox> | null> }) {
  return (
    <UICheckbox
      className={checkboxStyle({
        class: className,
        size,
      })}
      {...props}
      context={{
        size,
      }}
      ref={ref}
    />
  )
}

type ICheckboxIndicatorProps = React.ComponentPropsWithoutRef<
  typeof UICheckbox.Indicator
>
& VariantProps<typeof checkboxIndicatorStyle>

function CheckboxIndicator({ ref, className, ...props }: ICheckboxIndicatorProps & { ref?: React.RefObject<React.ComponentRef<typeof UICheckbox.Indicator> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  return (
    <UICheckbox.Indicator
      className={checkboxIndicatorStyle({
        parentVariants: {
          size: parentSize,
        },
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

type ICheckboxLabelProps = React.ComponentPropsWithoutRef<
  typeof UICheckbox.Label
>
& VariantProps<typeof checkboxLabelStyle>
function CheckboxLabel({ ref, className, ...props }: ICheckboxLabelProps & { ref?: React.RefObject<React.ComponentRef<typeof UICheckbox.Label> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)
  return (
    <UICheckbox.Label
      className={checkboxLabelStyle({
        parentVariants: {
          size: parentSize,
        },
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

type ICheckboxIconProps = React.ComponentPropsWithoutRef<
  typeof UICheckbox.Icon
>
& VariantProps<typeof checkboxIconStyle>

function CheckboxIcon({ ref, className, size, ...props }: ICheckboxIconProps & { ref?: React.RefObject<React.ComponentRef<typeof UICheckbox.Icon> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  if (typeof size === 'number') {
    return (
      <UICheckbox.Icon
        ref={ref}
        {...props}
        className={checkboxIconStyle({ class: className })}
        size={size}
      />
    )
  }
  else if (
    (props.height !== undefined || props.width !== undefined)
    && size === undefined
  ) {
    return (
      <UICheckbox.Icon
        ref={ref}
        {...props}
        className={checkboxIconStyle({ class: className })}
      />
    )
  }

  return (
    <UICheckbox.Icon
      className={checkboxIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  )
}

Checkbox.displayName = 'Checkbox'
CheckboxIndicator.displayName = 'CheckboxIndicator'
CheckboxLabel.displayName = 'CheckboxLabel'
CheckboxIcon.displayName = 'CheckboxIcon'

export {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
}
