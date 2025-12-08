import { useState, useRef, useEffect, useCallback } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type DataTableToolbarProps = {
  searchPlaceholder?: string
  /** 服务端搜索值 */
  searchValue?: string
  /** 服务端搜索回调 */
  onSearch?: (value: string) => void
  /** 服务端过滤配置 */
  filters?: {
    columnId: string
    title: string
    options: FilterOption[]
    value?: string
    onChange?: (value: string | undefined) => void
  }[]
  /** 重置回调 */
  onReset?: () => void
}

export function DataTableToolbar({
  searchPlaceholder = '搜索...',
  searchValue = '',
  onSearch,
  filters = [],
  onReset,
}: DataTableToolbarProps) {
  // 搜索输入
  const [inputValue, setInputValue] = useState(searchValue)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  // 同步外部搜索值变化到输入框
  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  // 处理输入变化 - 使用防抖
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
    
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      onSearch?.(value)
    }, 300)
  }, [onSearch])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 跳过首次渲染
  useEffect(() => {
    isFirstRender.current = false
  }, [])

  // 判断是否有过滤（只有支持搜索时才考虑 inputValue）
  const isFiltered = (onSearch && inputValue) || filters.some((f) => f.value)

  // 重置
  const handleReset = useCallback(() => {
    // 清除防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setInputValue('')
    onReset?.()
  }, [onReset])

  // 如果没有搜索和过滤，不显示工具栏
  if (!onSearch && filters.length === 0) {
    return null
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* 只有传递了 onSearch 才显示搜索框 */}
        {onSearch && (
          <Input
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => (
            <Select
              key={filter.columnId}
              value={filter.value || 'all'}
              onValueChange={(val) => filter.onChange?.(val === 'all' ? undefined : val)}
            >
              <SelectTrigger className='h-8 w-[120px]'>
                <SelectValue placeholder={filter.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部{filter.title}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            重置
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
