# Lib 通用工具函数库

本目录包含项目中的通用工具函数和配置。

## 文件说明

### `utils.ts`

> 基础工具函数

| 函数 | 说明 | 参数 |
| --- | --- | --- |
| `cn(...inputs)` | 合并 Tailwind CSS 类名，自动处理冲突 | `ClassValue[]` |
| `sleep(ms)` | 延时函数，用于模拟等待 | `ms: number` 默认 1000 |
| `getPageNumbers(currentPage, totalPages)` | 生成分页器页码数组，包含省略号 | `currentPage: number, totalPages: number` |

### `request.ts`

> Axios 请求封装

**特性：**

- 自动携带 `Authorization` 头（从 `useUserStore` 获取 token）
- 统一错误处理（code !== 0 时弹出错误 toast）
- 401 处理：清除 token 并跳转登录页

**类型定义：**

| 类型 | 说明 |
| --- | --- |
| `RequestBase<T>` | API 响应基础结构（code, message, timestamp, data） |
| `PaginatedData<T>` | 分页响应数据结构（list, total, page, limit） |
| `PaginationParams` | 分页请求参数（page, limit） |

**方法：**

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `get<T>(url, params?, config?)` | GET 请求 | `Promise<T>` |
| `post<T>(url, data?, config?)` | POST 请求 | `Promise<T>` |
| `put<T>(url, data?, config?)` | PUT 请求 | `Promise<T>` |
| `del<T>(url, config?)` | DELETE 请求 | `Promise<T>` |
| `getFullResponse<T>(url, params?, config?)` | 获取完整响应（包含 code、message 等） | `Promise<RequestBase<T>>` |
| `uploadToOss(uploadUrl, file, headers?, onProgress?)` | 上传文件到 OSS（通过代理） | `Promise<void>` |

### `upload.ts`

> 文件上传相关 API

| 函数 | 说明 | 参数 |
| --- | --- | --- |
| `getFileUploadUrl(fileType)` | 获取 OSS 上传预签名 URL | `fileType: string` 文件扩展名（不带点） |
| `createGetUploadUrl()` | 创建上传 URL 获取函数（用于 FileUpload 组件） | - |

**类型定义：**

| 类型 | 说明 |
| --- | --- |
| `UploadUrlResponse` | 上传 URL 响应（uploadUrl, fileUrl, objectKey, headers） |

### `regulars.ts`

> 正则表达式校验工具

**正则常量：**

| 常量 | 说明 | 示例 |
| --- | --- | --- |
| `PHONE_REGEX` | 手机号正则（1[3-9]开头11位） | `13812345678` |
| `ID_CARD_REGEX` | 身份证号正则（15/18位） | `110101199001011234` |
| `EMAIL_REGEX` | 邮箱正则 | `test@example.com` |

**校验函数：**

| 函数 | 说明 | 返回值 |
| --- | --- | --- |
| `isValidPhone(phone)` | 验证手机号格式 | `boolean` |
| `isValidIdCard(idCard)` | 验证身份证号格式 | `boolean` |
| `isValidEmail(email)` | 验证邮箱格式 | `boolean` |

### `cookies.ts`

> Cookie 操作工具

| 函数 | 说明 | 参数 |
| --- | --- | --- |
| `getCookie(name)` | 获取 Cookie 值 | `name: string` |
| `setCookie(name, value, maxAge?)` | 设置 Cookie（默认 7 天） | `name, value: string, maxAge?: number` |
| `removeCookie(name)` | 删除 Cookie | `name: string` |

### `store.ts`

> Zustand 持久化 Store 工厂函数

| 函数 | 说明 | 用途 |
| --- | --- | --- |
| `createPersistStore(state, methods, options)` | 创建持久化 Store（使用 IndexedDB） | 创建需要持久化的全局状态 |
| `deepClone(obj)` | 深拷贝对象 | - |

**使用示例：**

```ts
import { createPersistStore } from '@/lib/store'

export const useMyStore = createPersistStore(
  { count: 0 },
  (set, get) => ({
    increment: () => set({ count: get().count + 1 }),
  }),
  { name: 'MyStore' }
)
```

**注意：** 持久化 Store 使用 IndexedDB，读取是异步的，需通过 `_hasHydrated` 判断同步状态：

```tsx
const { _hasHydrated } = useMyStore(
  useShallow(state => ({ _hasHydrated: state._hasHydrated }))
)

useEffect(() => {
  if (_hasHydrated) {
    console.log('持久化数据同步完成')
  }
}, [_hasHydrated])
```

### `indexedDB-storage.ts`

> IndexedDB 存储适配器

为 Zustand persist 中间件提供 IndexedDB 存储支持，支持降级到 localStorage。

> **内部模块**，一般不需要直接使用，由 `store.ts` 内部调用。

### `hydration.ts`

> Store Hydration 工具

| 函数 | 说明 | 用途 |
| --- | --- | --- |
| `waitForUserStoreHydration()` | 等待 UserStore 完成 hydration | 路由守卫中确保数据恢复后再检查登录状态 |

### `handle-server-error.ts`

> 服务端错误处理

| 函数 | 说明 | 用途 |
| --- | --- | --- |
| `handleServerError(error)` | 统一处理服务端错误并弹出 toast | React Query mutation 错误处理 |

### `show-submitted-data.tsx`

> 表单提交调试工具

| 函数 | 说明 | 用途 |
| --- | --- | --- |
| `showSubmittedData(data, title?)` | 以 toast 形式展示提交的数据 | 开发调试时查看表单提交内容 |

## 使用规范

1. 表单校验优先使用 `regulars.ts` 中的正则和校验函数
2. HTTP 请求使用 `request.ts` 中封装的方法，不要直接使用 axios
3. 需要持久化的状态使用 `createPersistStore` 创建
4. CSS 类名合并使用 `cn()` 函数

