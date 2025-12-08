/**
 * 学员选择器组件
 * 功能：远程搜索选择学员
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
import { getStudentListApi } from '@/api/user'
import type { User } from '@/features/users/types'

export interface IStudentSelectorProps {
  /** 选中的学员ID */
  value?: string
  /** 选中变化时的回调 */
  onChange?: (studentId: string | undefined, student?: User) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
  /** 自定义宽度 */
  width?: number | string
}

const StudentSelector = memo(function StudentSelector({
  value,
  onChange,
  placeholder = '选择学员...',
  disabled = false,
  allowClear = true,
  width,
}: IStudentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<User | undefined>()

  // 搜索学员
  const searchStudents = useCallback(async (keyword: string) => {
    setLoading(true)
    try {
      const res = await getStudentListApi({
        search: keyword || undefined,
        limit: 20,
      })
      setStudents(res.list || [])
    } catch {
      // 错误已在请求拦截器中处理
    } finally {
      setLoading(false)
    }
  }, [])

  // 打开弹窗时加载数据
  useEffect(() => {
    if (open) {
      searchStudents(search)
    }
  }, [open, search, searchStudents])

  // 初始化时根据value获取学员信息
  useEffect(() => {
    if (value && !selectedStudent) {
      // 尝试从已有列表中找
      const found = students.find((s) => s._id === value)
      if (found) {
        setSelectedStudent(found)
      } else {
        // 如果没找到，从接口获取
        getStudentListApi({ limit: 100 }).then((res) => {
          const student = res.list?.find((s) => s._id === value)
          if (student) {
            setSelectedStudent(student)
          }
        })
      }
    } else if (!value) {
      setSelectedStudent(undefined)
    }
  }, [value, students, selectedStudent])

  // 选中学员
  const handleSelect = useCallback(
    (student: User) => {
      setSelectedStudent(student)
      onChange?.(student._id, student)
      setOpen(false)
    },
    [onChange]
  )

  // 清空选中
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedStudent(undefined)
      onChange?.(undefined, undefined)
    },
    [onChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='relative' style={{ width: width || '100%' }}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled}
            className='w-full justify-between font-normal'
          >
            <span className={cn(!selectedStudent && 'text-muted-foreground')}>
              {selectedStudent ? (selectedStudent.name || selectedStudent.phone) : placeholder}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        {allowClear && selectedStudent && (
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
            placeholder='搜索学员姓名或手机号...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : students.length === 0 ? (
              <CommandEmpty>未找到相关学员</CommandEmpty>
            ) : (
              <CommandGroup>
                {students.map((student) => (
                  <CommandItem
                    key={student._id}
                    value={student._id}
                    onSelect={() => handleSelect(student)}
                  >
                    {value === student._id ? (
                      <Check className='size-4 text-primary' />
                    ) : (
                      <Circle className='size-4 text-muted-foreground/30' />
                    )}
                    <div className='flex flex-col'>
                      <span>{student.name || '未设置姓名'}</span>
                      <span className='text-muted-foreground text-xs'>
                        {student.phone}
                        {student.email && ` · ${student.email}`}
                      </span>
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

export default StudentSelector

