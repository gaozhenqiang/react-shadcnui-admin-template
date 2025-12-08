import { useNavigate, useLocation } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'
import { useUserStore } from '@/stores/user-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useUserStore(
    useShallow((state) => ({
      logout: state.logout,
    }))
  )

  const handleSignOut = () => {
    logout()
    // Preserve current location for redirect after sign-in
    const currentPath = location.href
    navigate({
      to: '/sign-in',
      search: { redirect: currentPath },
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='退出登录'
      desc='你确定要退出登录吗？你需要重新登录才能访问你的账户。'
      confirmText='退出登录'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
