/**
 * 课程选择器组件
 * 功能：远程搜索选择课程
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
import { getCourseListApi } from '@/api/course'
import type { Course } from '@/features/course/types'

export interface ICourseSelectorProps {
  /** 选中的课程ID */
  value?: string
  /** 选中变化时的回调 */
  onChange?: (courseId: string | undefined, course?: Course) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
}

const CourseSelector = memo(function CourseSelector({
  value,
  onChange,
  placeholder = '选择课程...',
  disabled = false,
  allowClear = true,
}: ICourseSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>()

  // 搜索课程
  const searchCourses = useCallback(async (keyword: string) => {
    setLoading(true)
    try {
      const res = await getCourseListApi({
        search: keyword || undefined,
        limit: 20,
      })
      setCourses(res.list || [])
    } catch {
      // 错误已在请求拦截器中处理
    } finally {
      setLoading(false)
    }
  }, [])

  // 打开弹窗时加载数据
  useEffect(() => {
    if (open) {
      searchCourses(search)
    }
  }, [open, search, searchCourses])

  // 初始化时根据value获取课程信息
  useEffect(() => {
    if (value && !selectedCourse) {
      // 尝试从已有列表中找
      const found = courses.find((c) => c._id === value)
      if (found) {
        setSelectedCourse(found)
      } else {
        // 如果没找到，从接口获取
        getCourseListApi({ limit: 100 }).then((res) => {
          const course = res.list?.find((c) => c._id === value)
          if (course) {
            setSelectedCourse(course)
          }
        })
      }
    } else if (!value) {
      setSelectedCourse(undefined)
    }
  }, [value, courses, selectedCourse])

  // 选中课程
  const handleSelect = useCallback(
    (course: Course) => {
      setSelectedCourse(course)
      onChange?.(course._id, course)
      setOpen(false)
    },
    [onChange]
  )

  // 清空选中
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedCourse(undefined)
      onChange?.(undefined, undefined)
    },
    [onChange]
  )

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
            <span className={cn(!selectedCourse && 'text-muted-foreground')}>
              {selectedCourse ? selectedCourse.name : placeholder}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        {allowClear && selectedCourse && (
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
            placeholder='搜索课程名称...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : courses.length === 0 ? (
              <CommandEmpty>未找到相关课程</CommandEmpty>
            ) : (
              <CommandGroup>
                {courses.map((course) => (
                  <CommandItem
                    key={course._id}
                    value={course._id}
                    onSelect={() => handleSelect(course)}
                  >
                    {value === course._id ? (
                      <Check className='size-4 text-primary' />
                    ) : (
                      <Circle className='size-4 text-muted-foreground/30' />
                    )}
                    <div className='flex flex-col'>
                      <span>{course.name}</span>
                      <span className='text-muted-foreground text-xs'>
                        {course.direction && `方向: ${course.direction}`}
                        {course.instructorName && ` · 讲师: ${course.instructorName}`}
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

export default CourseSelector

