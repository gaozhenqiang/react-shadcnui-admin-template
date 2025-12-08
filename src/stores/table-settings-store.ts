/**
 * 表格设置持久化 Store
 * 功能：保存各表格的列显示设置
 */

import { type VisibilityState } from '@tanstack/react-table'
import { createPersistStore } from '@/lib/store'

export interface ITableSettingsStore {
  /** 各表格的列显示设置，key 为表格唯一标识 */
  columnVisibility: Record<string, VisibilityState>
}

const state: ITableSettingsStore = {
  columnVisibility: {},
}

export const useTableSettingsStore = createPersistStore(
  {
    ...state,
  },
  (set, get) => {
    const methods = {
      /**
       * 获取指定表格的列显示设置
       * @param tableKey 表格唯一标识
       */
      getColumnVisibility(tableKey: string): VisibilityState {
        return get().columnVisibility[tableKey] || {}
      },

      /**
       * 设置指定表格的列显示设置
       * @param tableKey 表格唯一标识
       * @param visibility 列显示状态
       */
      setColumnVisibility(tableKey: string, visibility: VisibilityState) {
        set({
          columnVisibility: {
            ...get().columnVisibility,
            [tableKey]: visibility,
          },
        })
      },

      /**
       * 更新指定表格的单列显示状态
       * @param tableKey 表格唯一标识
       * @param columnId 列ID
       * @param isVisible 是否显示
       */
      toggleColumnVisibility(tableKey: string, columnId: string, isVisible: boolean) {
        const current = get().columnVisibility[tableKey] || {}
        set({
          columnVisibility: {
            ...get().columnVisibility,
            [tableKey]: {
              ...current,
              [columnId]: isVisible,
            },
          },
        })
      },

      /**
       * 重置指定表格的列显示设置
       * @param tableKey 表格唯一标识
       */
      resetColumnVisibility(tableKey: string) {
        const { [tableKey]: _, ...rest } = get().columnVisibility
        set({ columnVisibility: rest })
      },
    }

    return methods
  },
  {
    name: 'TableSettings',
  }
)

