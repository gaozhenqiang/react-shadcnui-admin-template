/**
 * 用户状态管理
 * 使用持久化存储保存用户信息和token
 */

import { createPersistStore } from '@/lib/store'

// 用户信息类型
export interface IUserInfo {
  _id: string
  phone: string
  name: string
  role: string
  status: string
}

// 用户Store状态类型
export interface IUserStoreState {
  // 用户信息
  userInfo: IUserInfo | null
  // 访问令牌
  token: string
}

// 初始状态
const initialState: IUserStoreState = {
  userInfo: null,
  token: '',
}

/**
 * 用户Store
 * 用于管理用户登录状态、token等信息
 */
export const useUserStore = createPersistStore(
  { ...initialState },
  (set, get) => {
    const methods = {
      /**
       * 设置token
       */
      setToken(token: string) {
        set({ token })
      },

      /**
       * 获取token
       */
      getToken() {
        return get().token
      },

      /**
       * 设置用户信息
       */
      setUserInfo(userInfo: IUserInfo) {
        set({ userInfo })
      },

      /**
       * 获取用户信息
       */
      getUserInfo() {
        return get().userInfo
      },

      /**
       * 登录成功后保存信息
       */
      login(token: string, userInfo?: IUserInfo) {
        set({
          token,
          userInfo: userInfo || null,
        })
      },

      /**
       * 退出登录
       */
      logout() {
        set({
          token: '',
          userInfo: null,
        })
      },

      /**
       * 判断是否已登录
       */
      isLoggedIn() {
        return !!get().token
      },

      /**
       * 清除token（用于401时）
       */
      clearToken() {
        set({ token: '' })
      },
    }
    return methods
  },
  {
    name: 'UserStore',
  }
)

