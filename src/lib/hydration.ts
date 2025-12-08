/**
 * Store Hydration 工具函数
 * 用于等待持久化 Store 从 IndexedDB 完成数据恢复
 */

import { useUserStore } from '@/stores/user-store'

/**
 * 等待 UserStore 从 IndexedDB 完成 hydration
 * 在路由守卫中使用，确保在检查登录状态前数据已恢复
 */
export async function waitForUserStoreHydration(): Promise<void> {
  // 如果已经完成 hydration，直接返回
  if (useUserStore.getState()._hasHydrated) {
    return
  }

  // 等待 hydration 完成
  return new Promise<void>((resolve) => {
    const unsubscribe = useUserStore.subscribe((state) => {
      if (state._hasHydrated) {
        unsubscribe()
        resolve()
      }
    })
  })
}

