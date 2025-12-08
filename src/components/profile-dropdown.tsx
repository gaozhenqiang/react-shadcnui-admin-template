/**
 * ProfileDropdown - 用户头像下拉菜单
 * 功能：展示用户信息、跳转设置页面、退出登录
 */

import { Link } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'
import { Settings, LogOut, User } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useUserStore } from '@/stores/user-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

/**
 * 获取用户姓名的缩写（用于头像占位）
 */
function getNameAbbreviation(name: string | undefined): string {
  if (!name) return 'U'
  // 如果是中文名，取最后两个字；如果是英文，取首字母
  const isChinese = /[\u4e00-\u9fa5]/.test(name)
  if (isChinese) {
    return name.slice(-2)
  }
  return name.charAt(0).toUpperCase()
}

/**
 * 角色标签映射
 */
const RoleLabel: Record<string, string> = {
  '10': '管理员',
  '20': '教师',
  '30': '学生',
  admin: '管理员',
  teacher: '教师',
  student: '学生',
}

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()

  // 从 store 获取用户信息
  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.userInfo,
    }))
  )

  // 获取用户显示信息
  const displayName = userInfo?.name || '未设置姓名'
  const displayRole = userInfo?.role ? (RoleLabel[String(userInfo.role)] || '用户') : '用户'
  const avatarFallback = getNameAbbreviation(userInfo?.name)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='' alt={displayName} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{displayName}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {displayRole} · {userInfo?.phone || '未绑定手机'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <User className='mr-2 h-4 w-4' />
                个人资料
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <Settings className='mr-2 h-4 w-4' />
                设置
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut className='mr-2 h-4 w-4' />
            退出登录
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
