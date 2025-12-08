import { useCallback } from 'react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useTableSettingsStore } from '@/stores/table-settings-store'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  /** 表格唯一标识，用于持久化列设置 */
  tableKey?: string
}

// 获取列的显示名称
function getColumnDisplayName(column: { id: string; columnDef: { header?: unknown } }): string {
  const header = column.columnDef.header
  // 如果 header 是字符串，直接返回
  if (typeof header === 'string') {
    return header
  }
  // 否则返回 column.id
  return column.id
}

export function DataTableViewOptions<TData>({
  table,
  tableKey,
}: DataTableViewOptionsProps<TData>) {
  const { toggleColumnVisibility } = useTableSettingsStore(
    useShallow((state) => ({
      toggleColumnVisibility: state.toggleColumnVisibility,
    }))
  )

  // 切换列显示状态
  const handleToggle = useCallback(
    (columnId: string, value: boolean) => {
      // 更新表格状态
      table.getColumn(columnId)?.toggleVisibility(value)
      // 如果有 tableKey，持久化保存
      if (tableKey) {
        toggleColumnVisibility(tableKey, columnId, value)
      }
    },
    [table, tableKey, toggleColumnVisibility]
  )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ms-auto hidden h-8 lg:flex'
        >
          <MixerHorizontalIcon className='size-4' />
          显示列
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>切换显示列</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => handleToggle(column.id, !!value)}
              >
                {getColumnDisplayName(column)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
