import {
  Table as ExpoTable,
  TBody as ExpoTBody,
  Caption as ExpoTCaption,
  TFoot as ExpoTFoot,
  THead as ExpoTHead,
  TR as ExpoTR,
} from '@expo/html-elements'
import * as React from 'react'
import { createContext, useMemo } from 'react'

import { Text, View } from 'react-native'
import {
  tableBodyStyle,
  tableCaptionStyle,
  tableDataStyle,
  tableFooterStyle,
  tableHeaderStyle,
  tableHeadStyle,
  tableRowStyleStyle,
  tableStyle,
} from './styles'

const TableHeaderContext = createContext<{
  isHeaderRow: boolean
}>({
  isHeaderRow: false,
})
const TableFooterContext = createContext<{
  isFooterRow: boolean
}>({
  isFooterRow: false,
})

type ITableProps = React.ComponentProps<typeof ExpoTable>
type ITableHeaderProps = React.ComponentProps<typeof ExpoTHead>
type ITableBodyProps = React.ComponentProps<typeof ExpoTBody>
type ITableFooterProps = React.ComponentProps<typeof ExpoTFoot>
type ITableHeadProps = React.ComponentProps<typeof View | typeof Text> & {
  useRNView?: boolean
}
type ITableRowProps = React.ComponentProps<typeof ExpoTR>
type ITableDataProps = React.ComponentProps<typeof View | typeof Text> & {
  useRNView?: boolean
}
type ITableCaptionProps = React.ComponentProps<typeof ExpoTCaption>

function Table({ ref, className, ...props }: ITableProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTable> | null> }) {
  return (
    <ExpoTable
      ref={ref}
      className={tableStyle({ class: className })}
      {...props}
    />
  )
}

function TableHeader({ ref, className, ...props }: ITableHeaderProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTHead> | null> }) {
  const contextValue = useMemo(() => {
    return {
      isHeaderRow: true,
    }
  }, [])
  return (
    <TableHeaderContext value={contextValue}>
      <ExpoTHead
        ref={ref}
        className={tableHeaderStyle({ class: className })}
        {...props}
      />
    </TableHeaderContext>
  )
}

function TableBody({ ref, className, ...props }: ITableBodyProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTBody> | null> }) {
  return (
    <ExpoTBody
      ref={ref}
      className={tableBodyStyle({ class: className })}
      {...props}
    />
  )
}

function TableFooter({ ref, className, ...props }: ITableFooterProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTFoot> | null> }) {
  const contextValue = useMemo(() => {
    return {
      isFooterRow: true,
    }
  }, [])
  return (
    <TableFooterContext value={contextValue}>
      <ExpoTFoot
        ref={ref}
        className={tableFooterStyle({ class: className })}
        {...props}
      />
    </TableFooterContext>
  )
}

function TableHead({ ref, useRNView = false, className, ...props }: ITableHeadProps & { ref?: React.RefObject<React.ComponentRef<typeof View | typeof Text> | null> }) {
  if (useRNView) {
    return (
      <View
        ref={ref}
        className={tableHeadStyle({ class: className })}
        {...props}
      />
    )
  }
  else {
    return (
      <Text
        ref={ref}
        className={tableHeadStyle({ class: className })}
        {...props}
      />
    )
  }
}

function TableRow({ ref, className, ...props }: ITableRowProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTR> | null> }) {
  const { isHeaderRow } = use(TableHeaderContext)
  const { isFooterRow } = use(TableFooterContext)

  return (
    <ExpoTR
      ref={ref}
      className={tableRowStyleStyle({
        isHeaderRow,
        isFooterRow,
        class: className,
      })}
      {...props}
    />
  )
}

function TableData({ ref, useRNView = false, className, ...props }: ITableDataProps & { ref?: React.RefObject<React.ComponentRef<typeof View | typeof Text> | null> }) {
  if (useRNView) {
    return (
      <View
        ref={ref}
        className={tableDataStyle({ class: className })}
        {...props}
      />
    )
  }
  else {
    return (
      <Text
        ref={ref}
        className={tableDataStyle({ class: className })}
        {...props}
      />
    )
  }
}

function TableCaption({ ref, className, ...props }: ITableCaptionProps & { ref?: React.RefObject<React.ComponentRef<typeof ExpoTCaption> | null> }) {
  return (
    <ExpoTCaption
      ref={ref}
      className={tableCaptionStyle({ class: className })}
      {...props}
    />
  )
}

Table.displayName = 'Table'
TableHeader.displayName = 'TableHeader'
TableBody.displayName = 'TableBody'
TableFooter.displayName = 'TableFooter'
TableHead.displayName = 'TableHead'
TableRow.displayName = 'TableRow'
TableData.displayName = 'TableData'
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
