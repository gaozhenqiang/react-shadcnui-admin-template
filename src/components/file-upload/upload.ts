/**
 * 文件上传相关 API
 * 用于获取 OSS 上传地址
 */

import { get } from '@/lib/request'

/**
 * 上传URL响应
 */
export interface UploadUrlResponse {
  uploadUrl: string
  fileUrl: string
  objectKey: string
  headers: Record<string, string>
}

/**
 * 获取文件上传 URL
 * @param fileType 文件扩展名（不带点），如 'jpg', 'png'
 * @param dir 上传目录，默认 'certification'
 */
export async function getFileUploadUrl(
  fileType: string,
): Promise<UploadUrlResponse> {
  return get<UploadUrlResponse>('/admin/course/upload-url', { fileType })
}

/**
 * 创建获取上传 URL 的函数（用于 FileUpload 组件）
 * @param dir 上传目录
 */
export function createGetUploadUrl() {
  return async (fileType: string): Promise<UploadUrlResponse> => {
    return getFileUploadUrl(fileType)
  }
}

