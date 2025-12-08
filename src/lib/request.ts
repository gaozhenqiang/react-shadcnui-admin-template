/**
 * Axios 请求封装
 * - 自动携带 Authorization 头
 * - 统一错误处理（code !== 0 时弹出错误toast）
 * - 401 处理：清除token并跳转登录页
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'
import { useUserStore } from '@/stores/user-store'

/**
 * API 响应基础结构
 */
export interface RequestBase<T = unknown> {
  code: number
  message: string
  timestamp: string
  data: T
}

/**
 * 分页响应数据结构
 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  limit: number
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 store 获取 token
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<RequestBase>) => {
    const { data } = response

    // 检查业务状态码
    if (data.code !== 0) {
      // 显示错误提示
      toast.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    return response
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 清除 token 并跳转到登录页
          useUserStore.getState().clearToken()
          toast.error('登录已过期，请重新登录')
          // 使用 setTimeout 避免在响应处理中直接修改路由
          setTimeout(() => {
            window.location.href = '/sign-in'
          }, 100)
          break
        case 403:
          toast.error('没有权限访问该资源')
          break
        case 404:
          toast.error('请求的资源不存在')
          break
        case 500:
          toast.error('服务器内部错误')
          break
        default:
          toast.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      toast.error('网络错误，请检查网络连接')
    } else {
      toast.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

/**
 * GET 请求
 */
export async function get<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.get<RequestBase<T>>(url, {
    params,
    ...config,
  })
  return response.data.data
}

/**
 * POST 请求
 */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.post<RequestBase<T>>(url, data, config)
  return response.data.data
}

/**
 * PUT 请求
 */
export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.put<RequestBase<T>>(url, data, config)
  return response.data.data
}

/**
 * DELETE 请求
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.delete<RequestBase<T>>(url, config)
  return response.data.data
}

/**
 * 获取完整响应（包含 code、message 等）
 */
export async function getFullResponse<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<RequestBase<T>> {
  const response = await request.get<RequestBase<T>>(url, {
    params,
    ...config,
  })
  return response.data
}

/**
 * 上传文件到 OSS
 * @param uploadUrl 上传地址（从后端获取的预签名URL）
 * @param file 文件
 * @param headers 额外的请求头
 * @param onProgress 上传进度回调
 */
export async function uploadToOss(
  uploadUrl: string,
  file: File,
  headers?: Record<string, string>,
  onProgress?: (percent: number) => void
): Promise<void> {
  // 通过代理解决跨域问题
  // 将 OSS 域名替换为本地代理路径
  // 例如: http://xxx.oss-cn-beijing.aliyuncs.com/path -> /proxyOss/path
  const urlObj = new URL(uploadUrl)
  const proxyUrl = `/proxyOss${urlObj.pathname}${urlObj.search}`

  await axios.put(proxyUrl, file, {
    headers: {
      ...headers,
    },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    },
  })
}

export default request

