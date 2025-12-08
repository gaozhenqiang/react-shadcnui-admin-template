# 全局状态管理 (Stores)

本目录包含项目的全局状态管理模块，使用 [Zustand](https://github.com/pmndrs/zustand) 进行状态管理。

## 文件列表

| 文件名 | 描述 | 持久化 |
| --- | --- | --- |
| `user-store.ts` | 用户状态管理，包含登录信息、token 等 | ✅ IndexedDB |
| `table-settings-store.ts` | 表格设置持久化，保存列显示配置 | ✅ IndexedDB |

---

## user-store.ts

用户状态管理，使用 IndexedDB 持久化存储用户信息和 token。

### 类型定义

```typescript
// 用户信息类型
interface IUserInfo {
  _id: string
  phone: string
  name: string
  role: string
  status: string
}

// Store 状态类型
interface IUserStoreState {
  userInfo: IUserInfo | null
  token: string
}
```

### 方法列表

| 方法 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| `setToken` | `token: string` | `void` | 设置 token |
| `getToken` | - | `string` | 获取 token |
| `setUserInfo` | `userInfo: IUserInfo` | `void` | 设置用户信息 |
| `getUserInfo` | - | `IUserInfo \| null` | 获取用户信息 |
| `login` | `token: string, userInfo?: IUserInfo` | `void` | 登录成功后保存信息 |
| `logout` | - | `void` | 退出登录，清除所有信息 |
| `isLoggedIn` | - | `boolean` | 判断是否已登录 |
| `clearToken` | - | `void` | 仅清除 token（用于 401 时） |

### 使用示例

```tsx
import { useShallow } from 'zustand/react/shallow'
import { useUserStore } from '@/stores/user-store'

// 组件中使用
function MyComponent() {
  const { token, userInfo, login, logout } = useUserStore(
    useShallow(state => ({
      token: state.token,
      userInfo: state.userInfo,
      login: state.login,
      logout: state.logout,
    }))
  )

  // 登录
  const handleLogin = () => {
    login('your-token', { _id: '1', phone: '13800138000', name: '张三', role: 'admin', status: 'active' })
  }

  // 退出登录
  const handleLogout = () => {
    logout()
  }
}

// 组件外使用（如请求拦截器）
const token = useUserStore.getState().getToken()
useUserStore.getState().logout()
```

### 注意事项

由于使用了 IndexedDB 持久化，数据读取是异步的，需要通过 `_hasHydrated` 判断数据是否同步完成：

```tsx
const { _hasHydrated } = useUserStore(
  useShallow(state => ({
    _hasHydrated: state._hasHydrated,
  }))
)

useEffect(() => {
  if (_hasHydrated) {
    console.log('持久化数据同步完成')
  }
}, [_hasHydrated])
```

---

## table-settings-store.ts

表格设置持久化 Store，用于保存各表格的列显示设置。

### 类型定义

```typescript
interface ITableSettingsStore {
  /** 各表格的列显示设置，key 为表格唯一标识 */
  columnVisibility: Record<string, VisibilityState>
}
```

### 方法列表

| 方法 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| `getColumnVisibility` | `tableKey: string` | `VisibilityState` | 获取指定表格的列显示设置 |
| `setColumnVisibility` | `tableKey: string, visibility: VisibilityState` | `void` | 设置指定表格的列显示设置 |
| `toggleColumnVisibility` | `tableKey: string, columnId: string, isVisible: boolean` | `void` | 更新指定表格的单列显示状态 |
| `resetColumnVisibility` | `tableKey: string` | `void` | 重置指定表格的列显示设置 |

### 使用示例

```tsx
import { useShallow } from 'zustand/react/shallow'
import { useTableSettingsStore } from '@/stores/table-settings-store'

// 组件中使用
function TableComponent() {
  const { getColumnVisibility, setColumnVisibility } = useTableSettingsStore(
    useShallow(state => ({
      getColumnVisibility: state.getColumnVisibility,
      setColumnVisibility: state.setColumnVisibility,
    }))
  )

  // 获取列显示设置
  const visibility = getColumnVisibility('users-table')

  // 保存列显示设置
  const handleVisibilityChange = (visibility: VisibilityState) => {
    setColumnVisibility('users-table', visibility)
  }
}
```

---

## Store 使用最佳实践

### 1. 使用 useShallow 优化性能

```tsx
import { useShallow } from 'zustand/react/shallow'

// ✅ 推荐：使用 useShallow 避免不必要的重渲染
const { token, userInfo } = useUserStore(
  useShallow(state => ({
    token: state.token,
    userInfo: state.userInfo,
  }))
)

// ❌ 不推荐：直接解构会导致任何状态变化都触发重渲染
const { token, userInfo } = useUserStore()
```

### 2. 组件外使用 Store

```tsx
// 在请求拦截器、路由守卫等非组件环境中使用
const token = useUserStore.getState().getToken()
useUserStore.getState().logout()
```

### 3. 持久化 Store 的 hydration 处理

```tsx
// 等待持久化数据加载完成后再渲染内容
function App() {
  const { _hasHydrated } = useUserStore(
    useShallow(state => ({ _hasHydrated: state._hasHydrated }))
  )

  if (!_hasHydrated) {
    return <LoadingSpinner />
  }

  return <MainContent />
}
```

