/**
 * 题库选择器组件
 * 功能：远程搜索选择题库
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { Check, ChevronsUpDown, Circle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getQuestionBankListApi } from '@/api/question-bank'
import type { QuestionBank } from '@/features/question-bank/types'

export interface IQuestionBankSelectorProps {
  /** 选中的题库ID */
  value?: string
  /** 选中变化时的回调 */
  onChange?: (bankId: string | undefined, bank?: QuestionBank) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
  /** 按课程ID筛选 */
  courseId?: string
}

const QuestionBankSelector = memo(function QuestionBankSelector({
  value,
  onChange,
  placeholder = '选择题库...',
  disabled = false,
  allowClear = true,
  courseId,
}: IQuestionBankSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [banks, setBanks] = useState<QuestionBank[]>([])
  const [search, setSearch] = useState('')
  const [selectedBank, setSelectedBank] = useState<QuestionBank | undefined>()

  // 搜索题库
  const searchBanks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getQuestionBankListApi({
        courseId: courseId || undefined,
        limit: 50,
        status: 'active',
      })
      setBanks(res.list || [])
    } catch {
      // 错误已在请求拦截器中处理
    } finally {
      setLoading(false)
    }
  }, [courseId])

  // 打开弹窗时加载数据
  useEffect(() => {
    if (open) {
      searchBanks()
    }
  }, [open, searchBanks])

  // 当 courseId 变化时，清空选中
  useEffect(() => {
    if (courseId && selectedBank && selectedBank.courseId !== courseId) {
      setSelectedBank(undefined)
      onChange?.(undefined, undefined)
    }
  }, [courseId, selectedBank, onChange])

  // 初始化时根据value获取题库信息
  useEffect(() => {
    if (value && !selectedBank) {
      // 尝试从已有列表中找
      const found = banks.find((b) => b._id === value)
      if (found) {
        setSelectedBank(found)
      } else {
        // 如果没找到，从接口获取
        getQuestionBankListApi({ limit: 100 }).then((res) => {
          const bank = res.list?.find((b) => b._id === value)
          if (bank) {
            setSelectedBank(bank)
          }
        })
      }
    } else if (!value) {
      setSelectedBank(undefined)
    }
  }, [value, banks, selectedBank])

  // 选中题库
  const handleSelect = useCallback(
    (bank: QuestionBank) => {
      setSelectedBank(bank)
      onChange?.(bank._id, bank)
      setOpen(false)
    },
    [onChange]
  )

  // 清空选中
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedBank(undefined)
      onChange?.(undefined, undefined)
    },
    [onChange]
  )

  // 过滤搜索结果
  const filteredBanks = search
    ? banks.filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
      )
    : banks

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='relative w-full'>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled}
            className='w-full justify-between font-normal'
          >
            <span className={cn(!selectedBank && 'text-muted-foreground')}>
              {selectedBank ? selectedBank.name : placeholder}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        {allowClear && selectedBank && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-50 hover:opacity-100'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='搜索题库名称...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : filteredBanks.length === 0 ? (
              <CommandEmpty>未找到相关题库</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredBanks.map((bank) => (
                  <CommandItem
                    key={bank._id}
                    value={bank._id}
                    onSelect={() => handleSelect(bank)}
                  >
                    {value === bank._id ? (
                      <Check className='size-4 text-primary' />
                    ) : (
                      <Circle className='size-4 text-muted-foreground/30' />
                    )}
                    <div className='flex flex-col'>
                      <span>{bank.name}</span>
                      {bank.courseName && (
                        <span className='text-muted-foreground text-xs'>
                          课程: {bank.courseName}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

export default QuestionBankSelector

