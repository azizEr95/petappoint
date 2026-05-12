import * as React from 'react'
import { createContext, use, useMemo } from 'react'
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

function Table({ ref, className, ...props }: React.ComponentProps<'table'> & { ref?: React.RefObject<HTMLTableElement | null> }) {
  return (
    <table
      ref={ref}
      className={tableStyle({ class: className })}
      {...props}
    />
  )
}

function TableHeader({ ref, className, ...props }: React.ComponentProps<'thead'> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) {
  const contextValue = useMemo(() => {
    return {
      isHeaderRow: true,
    }
  }, [])
  return (
    <TableHeaderContext value={contextValue}>
      <thead
        ref={ref}
        className={tableHeaderStyle({ class: className })}
        {...props}
      />
    </TableHeaderContext>
  )
}

function TableBody({ ref, className, ...props }: React.ComponentProps<'tbody'> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) {
  return (
    <tbody
      ref={ref}
      className={tableBodyStyle({ class: className })}
      {...props}
    />
  )
}

function TableFooter({ ref, className, ...props }: React.ComponentProps<'tfoot'> & { ref?: React.RefObject<HTMLTableSectionElement | null> }) {
  const contextValue = useMemo(() => {
    return {
      isFooterRow: true,
    }
  }, [])
  return (
    <TableFooterContext value={contextValue}>
      <tfoot
        ref={ref}
        className={tableFooterStyle({ class: className })}
        {...props}
      />
    </TableFooterContext>
  )
}

function TableHead({ ref, className, ...props }: React.ComponentProps<'th'> & { ref?: React.RefObject<HTMLTableCellElement | null> }) {
  return (
    <th ref={ref} className={tableHeadStyle({ class: className })} {...props} />
  )
}

function TableRow({ ref, className, ...props }: React.ComponentProps<'tr'> & { ref?: React.RefObject<HTMLTableRowElement | null> }) {
  const { isHeaderRow } = use(TableHeaderContext)
  const { isFooterRow } = use(TableFooterContext)
  return (
    <tr
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

function TableData({ ref, className, ...props }: React.ComponentProps<'td'> & { ref?: React.RefObject<HTMLTableCellElement | null> }) {
  return (
    <td ref={ref} className={tableDataStyle({ class: className })} {...props} />
  )
}

function TableCaption({ ref, className, ...props }: React.ComponentProps<'caption'> & { ref?: React.RefObject<HTMLTableCaptionElement | null> }) {
  return (
    <caption
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
