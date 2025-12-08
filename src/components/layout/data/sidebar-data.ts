/**
 * 侧边栏菜单配置
 */

import {
  LayoutDashboard,
  Settings,
  UserCog,
  Command,
  ClipboardCheck,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '教师',
    email: 'teacher@yuan.edu',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: '育安教育',
      logo: Command,
      plan: '教师端',
    },
  ],
  navGroups: [
    {
      title: '主菜单',
      items: [
        {
          title: '仪表盘',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: '用户管理',
          url: '/users',
          icon: ClipboardCheck,
        },
      ],
    },
    {
      title: '系统设置',
      items: [
        {
          title: '设置',
          icon: Settings,
          items: [
            {
              title: '个人资料',
              url: '/settings',
              icon: UserCog,
            },
          ],
        },
      ],
    },
  ],
}
