'use client'
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils'
import type { TextProps } from 'react-native'
import { H3 } from '@expo/html-elements'
import { createAccordion } from '@gluestack-ui/core/accordion/creator'
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator'
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

const SCOPE = 'ACCORDION'
/** Styles */

const accordionStyle = tva({
  base: 'w-full',
  variants: {
    variant: {
      filled: 'bg-white shadow-hard-2',
      unfilled: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
})

const accordionItemStyle = tva({
  base: '',
  parentVariants: {
    variant: {
      filled: 'bg-background-0',
      unfilled: 'bg-transparent',
    },
  },
})
const accordionTitleTextStyle = tva({
  base: 'text-typography-900 font-bold flex-1 text-left',
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
})
const accordionIconStyle = tva({
  base: 'text-typography-900 fill-none',
  parentVariants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
    },
  },
})
const accordionContentTextStyle = tva({
  base: 'text-typography-700 font-normal',
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
})
const accordionHeaderStyle = tva({
  base: 'mx-0 my-0',
})
const accordionContentStyle = tva({
  base: 'pt-1 pb-3 px-4',
})
const accordionTriggerStyle = tva({
  base: 'w-full flex-row justify-between items-center web:outline-none focus:outline-none data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed data-[focus-visible=true]:bg-background-50 py-3 px-4',
})

const Root = withStyleContext(View, SCOPE)

const Header = (
  Platform.OS === 'web' ? H3 : View
) as React.ComponentType<TextProps>

/** Creator */
const UIAccordion = createAccordion({
  Root,
  Item: View,
  Header,
  Trigger: Pressable,
  Icon: UIIcon,
  TitleText: Text,
  ContentText: Text,
  Content: View,
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

cssInterop(H3, {
  className: {
    target: 'style',
  },
})

type IAccordionProps = React.ComponentPropsWithoutRef<typeof UIAccordion>
  & VariantProps<typeof accordionStyle>

type IAccordionItemProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.Item
>
& VariantProps<typeof accordionItemStyle>

type IAccordionContentProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.Content
>
& VariantProps<typeof accordionContentStyle>

type IAccordionContentTextProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.ContentText
>
& VariantProps<typeof accordionContentTextStyle>

type IAccordionIconProps = VariantProps<typeof accordionIconStyle>
  & React.ComponentPropsWithoutRef<typeof UIAccordion.Icon> & {
    as?: React.ElementType
    height?: number
    width?: number
  }

type IAccordionHeaderProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.Header
>
& VariantProps<typeof accordionHeaderStyle>

type IAccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.Trigger
>
& VariantProps<typeof accordionTriggerStyle>

type IAccordionTitleTextProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.TitleText
>
& VariantProps<typeof accordionTitleTextStyle>

/** Components */

function Accordion({ ref, className, variant = 'filled', size = 'md', ...props }: IAccordionProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion> | null> }) {
  return (
    <UIAccordion
      ref={ref}
      {...props}
      className={accordionStyle({ variant, class: className })}
      context={{ variant, size }}
    />
  )
}

function AccordionItem({ ref, className, ...props }: IAccordionItemProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.Item> | null> }) {
  const { variant } = useStyleContext(SCOPE)
  return (
    <UIAccordion.Item
      ref={ref}
      {...props}
      className={accordionItemStyle({
        parentVariants: { variant },
        class: className,
      })}
    />
  )
}

function AccordionContent({ ref, className, ...props }: IAccordionContentProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.Content> | null> }) {
  return (
    <UIAccordion.Content
      ref={ref}
      {...props}
      className={accordionContentStyle({
        class: className,
      })}
    />
  )
}

function AccordionContentText({ ref, className, ...props }: IAccordionContentTextProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.ContentText> | null> }) {
  const { size } = useStyleContext(SCOPE)
  return (
    <UIAccordion.ContentText
      ref={ref}
      {...props}
      className={accordionContentTextStyle({
        parentVariants: { size },
        class: className,
      })}
    />
  )
}

function AccordionIcon({ ref, size, className, ...props }: IAccordionIconProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.Icon> | null> }) {
  const { size: parentSize } = useStyleContext(SCOPE)

  if (typeof size === 'number') {
    return (
      <UIAccordion.Icon
        ref={ref}
        {...props}
        className={accordionIconStyle({ class: className })}
        size={size}
      />
    )
  }
  else if (
    (props.height !== undefined || props.width !== undefined)
    && size === undefined
  ) {
    return (
      <UIAccordion.Icon
        ref={ref}
        {...props}
        className={accordionIconStyle({ class: className })}
      />
    )
  }
  return (
    <UIAccordion.Icon
      ref={ref}
      {...props}
      className={accordionIconStyle({
        size,
        class: className,
        parentVariants: { size: parentSize },
      })}
    />
  )
}

function AccordionHeader({ ref, className, ...props }: IAccordionHeaderProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.Header> | null> }) {
  return (
    <UIAccordion.Header
      ref={ref}
      {...props}
      className={accordionHeaderStyle({
        class: className,
      })}
    />
  )
}

function AccordionTrigger({ ref, className, ...props }: IAccordionTriggerProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.Trigger> | null> }) {
  return (
    <UIAccordion.Trigger
      ref={ref}
      {...props}
      className={accordionTriggerStyle({
        class: className,
      })}
    />
  )
}
function AccordionTitleText({ ref, className, ...props }: IAccordionTitleTextProps & { ref?: React.RefObject<React.ComponentRef<typeof UIAccordion.TitleText> | null> }) {
  const { size } = useStyleContext(SCOPE)
  return (
    <UIAccordion.TitleText
      ref={ref}
      {...props}
      className={accordionTitleTextStyle({
        parentVariants: { size },
        class: className,
      })}
    />
  )
}

Accordion.displayName = 'Accordion'
AccordionItem.displayName = 'AccordionItem'
AccordionHeader.displayName = 'AccordionHeader'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionTitleText.displayName = 'AccordionTitleText'
AccordionContentText.displayName = 'AccordionContentText'
AccordionIcon.displayName = 'AccordionIcon'
AccordionContent.displayName = 'AccordionContent'

export {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
}
