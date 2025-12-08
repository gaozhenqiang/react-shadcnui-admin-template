/**
 * 项目选择器组件
 * 功能：远程搜索选择报考项目
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
import { getProjectListApi } from '@/api/enroll'
import type { Project } from '@/features/enroll/types'

export interface IProjectSelectorProps {
  /** 选中的项目ID */
  value?: string
  /** 选中变化时的回调 */
  onChange?: (projectId: string | undefined, project?: Project) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
}

const ProjectSelector = memo(function ProjectSelector({
  value,
  onChange,
  placeholder = '选择报考项目...',
  disabled = false,
  allowClear = true,
}: IProjectSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | undefined>()

  // 搜索项目
  const searchProjects = useCallback(async (keyword: string) => {
    setLoading(true)
    try {
      const res = await getProjectListApi({
        search: keyword || undefined,
        limit: 20,
      })
      setProjects(res.list || [])
    } catch {
      // 错误已在请求拦截器中处理
    } finally {
      setLoading(false)
    }
  }, [])

  // 打开弹窗时加载数据
  useEffect(() => {
    if (open) {
      searchProjects(search)
    }
  }, [open, search, searchProjects])

  // 初始化时根据value获取项目信息
  useEffect(() => {
    if (value && !selectedProject) {
      // 尝试从已有列表中找
      const found = projects.find((p) => p._id === value)
      if (found) {
        setSelectedProject(found)
      } else {
        // 如果没找到，从接口获取
        getProjectListApi({ limit: 100 }).then((res) => {
          const project = res.list?.find((p) => p._id === value)
          if (project) {
            setSelectedProject(project)
          }
        })
      }
    } else if (!value) {
      setSelectedProject(undefined)
    }
  }, [value, projects, selectedProject])

  // 选中项目
  const handleSelect = useCallback(
    (project: Project) => {
      setSelectedProject(project)
      onChange?.(project._id, project)
      setOpen(false)
    },
    [onChange]
  )

  // 清空选中
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedProject(undefined)
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
            <span className={cn(!selectedProject && 'text-muted-foreground')}>
              {selectedProject ? selectedProject.name : placeholder}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        {allowClear && selectedProject && (
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
            placeholder='搜索项目名称...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : projects.length === 0 ? (
              <CommandEmpty>未找到相关项目</CommandEmpty>
            ) : (
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project._id}
                    value={project._id}
                    onSelect={() => handleSelect(project)}
                  >
                    {value === project._id ? (
                      <Check className='size-4 text-primary' />
                    ) : (
                      <Circle className='size-4 text-muted-foreground/30' />
                    )}
                    <div className='flex flex-col'>
                      <span>{project.name}</span>
                      <span className='text-muted-foreground text-xs'>
                        等级: {project.level}
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

export default ProjectSelector

