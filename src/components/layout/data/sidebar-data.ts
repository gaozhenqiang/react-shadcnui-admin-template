/**
 * 侧边栏菜单配置
 */

import {
  LayoutDashboard,
  Settings,
  UserCog,
  Command,
  ClipboardList,
  GraduationCap,
  BookOpen,
  FileQuestion,
  ShoppingCart,
  Award,
  Megaphone,
  Users,
  UserCheck,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '管理员',
    email: 'admin@yuan.edu',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: '育安教育',
      logo: Command,
      plan: '管理后台',
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
      ],
    },
    {
      title: '业务管理',
      items: [
        {
          title: '报考管理',
          icon: ClipboardList,
          items: [
            {
              title: '报考项目',
              url: '/enroll/projects',
            },
            {
              title: '报考申请',
              url: '/enroll/applications',
            },
            {
              title: '已通过用户',
              url: '/enroll/approved-users',
            },
          ],
        },
        {
          title: '课程管理',
          icon: BookOpen,
          items: [
            {
              title: '课程列表',
              url: '/course/courses',
            },
            {
              title: '课时管理',
              url: '/course/lessons',
            },
          ],
        },
        {
          title: '题库管理',
          icon: FileQuestion,
          items: [
            {
              title: '题库列表',
              url: '/question-bank/banks',
            },
            {
              title: '题目管理',
              url: '/question-bank/questions',
            },
          ],
        },
        {
          title: '考试管理',
          icon: GraduationCap,
          items: [
            {
              title: '考试配置',
              url: '/exam/configs',
            },
            {
              title: '考试记录',
              url: '/exam/sessions',
            },
          ],
        },
        {
          title: '用户管理',
          icon: Users,
          items: [
            {
              title: '学生管理',
              url: '/users/students',
            },
            {
              title: '教师管理',
              url: '/users/teachers',
            },
            {
              title: '管理员',
              url: '/users/admins',
            },
          ],
        },
        {
          title: '教师认证',
          url: '/teacher-certification',
          icon: UserCheck,
        },
      ],
    },
    {
      title: '运营管理',
      items: [
        {
          title: '订单管理',
          icon: ShoppingCart,
          items: [
            {
              title: '订单列表',
              url: '/order/orders',
            },
            {
              title: '退款申请',
              url: '/order/refunds',
            },
          ],
        },
        {
          title: '证书管理',
          url: '/certificates',
          icon: Award,
        },
        {
          title: '内容管理',
          icon: Megaphone,
          items: [
            {
              title: '公告管理',
              url: '/content/announcements',
            },
            {
              title: '轮播管理',
              url: '/content/banners',
            },
            {
              title: '考培动态',
              url: '/content/training-news',
            },
            {
              title: '常见问题',
              url: '/content/faq',
            },
            {
              title: '协议管理',
              url: '/content/agreements',
            },
          ],
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
