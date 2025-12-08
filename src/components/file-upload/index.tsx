/**
 * 文件上传组件
 * 支持上传到 OSS，显示进度，预览媒体资源
 */

import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Loader2, Upload, X, FileIcon, Play, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { uploadToOss } from '@/lib/request'
import { createGetUploadUrl } from './upload'

// 默认的获取上传 URL 函数
const defaultGetUploadUrl = createGetUploadUrl()

export interface FileUploadRef {
  /** 清除已上传的文件 */
  clear: () => void
  /** 获取当前文件URL */
  getFileUrl: () => string
}

export interface FileUploadSuccessInfo {
  /** 文件URL */
  fileUrl: string
  /** 文件名 */
  fileName: string
  /** 视频时长（秒），仅视频文件有效 */
  duration?: number
}

export interface ImageValidationConfig {
  /** 期望的图片宽高比（宽/高），如 5/7 表示一寸照片 */
  aspectRatio: number
  /** 宽高比容差，默认 0.1 表示 ±10% */
  aspectRatioTolerance?: number
  /** 最小图片宽度（像素） */
  minWidth?: number
  /** 最小图片高度（像素） */
  minHeight?: number
  /** 自定义错误提示 */
  errorMessage?: string
}

export interface FileUploadProps {
  /** 允许的文件扩展名，如 ['.mp4', '.pdf'] */
  accept?: string[]
  /** 获取上传URL的函数（可选，默认使用内置函数） */
  getUploadUrl?: (fileType: string) => Promise<{
    uploadUrl: string
    fileUrl: string
    headers?: Record<string, string>
  }>
  /** 上传成功回调 */
  onSuccess?: (info: FileUploadSuccessInfo) => void
  /** 上传失败回调 */
  onError?: (error: Error) => void
  /** 清除文件回调 */
  onClear?: () => void
  /** 默认文件URL（编辑时使用） */
  defaultFileUrl?: string
  /** 默认文件名 */
  defaultFileName?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 按钮文字 */
  buttonText?: string
  /** 最大文件大小（MB） */
  maxSize?: number
  /** 自定义类名 */
  className?: string
  /** 是否启用预览（图片/视频） */
  enablePreview?: boolean
  /** 预览类型 */
  previewType?: 'auto' | 'image' | 'video' | 'none'
  /** 图片尺寸校验配置（仅对图片文件生效） */
  imageValidation?: ImageValidationConfig
}

// 视频扩展名列表
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
// 图片扩展名列表
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']

// 判断文件类型
function getFileType(url: string, accept: string[]): 'image' | 'video' | 'other' {
  const ext = url.split('.').pop()?.toLowerCase() || ''

  if (IMAGE_EXTS.some((e) => e.slice(1) === ext || accept.includes(e))) {
    if (accept.some((a) => IMAGE_EXTS.includes(a))) return 'image'
  }
  if (VIDEO_EXTS.some((e) => e.slice(1) === ext || accept.includes(e))) {
    if (accept.some((a) => VIDEO_EXTS.includes(a))) return 'video'
  }

  return 'other'
}

// 判断是否为视频文件
function isVideoFile(fileName: string): boolean {
  const ext = `.${fileName.split('.').pop()?.toLowerCase()}`
  return VIDEO_EXTS.includes(ext)
}

/**
 * 获取视频时长（秒）
 * @param file 视频文件
 * @returns Promise<number> 时长（秒），取整
 */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const duration = Math.round(video.duration)
      resolve(duration)
    }

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src)
      reject(new Error('无法获取视频时长'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * 校验图片尺寸
 * @param file 图片文件
 * @param config 校验配置
 * @returns Promise<{ valid: boolean; message?: string }>
 */
function validateImageSize(
  file: File,
  config: ImageValidationConfig
): Promise<{ valid: boolean; message?: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      const ratio = width / height
      const tolerance = config.aspectRatioTolerance ?? 0.1

      // 检查宽高比
      const minRatio = config.aspectRatio * (1 - tolerance)
      const maxRatio = config.aspectRatio * (1 + tolerance)

      if (ratio < minRatio || ratio > maxRatio) {
        const message =
          config.errorMessage ||
          `图片比例不符合要求。当前比例 ${ratio.toFixed(2)}，期望比例约为 ${config.aspectRatio.toFixed(2)}`
        resolve({ valid: false, message })
        URL.revokeObjectURL(img.src)
        return
      }

      // 检查最小尺寸
      if (config.minWidth && width < config.minWidth) {
        resolve({
          valid: false,
          message: `图片宽度过小，当前 ${width}px，最小要求 ${config.minWidth}px`,
        })
        URL.revokeObjectURL(img.src)
        return
      }

      if (config.minHeight && height < config.minHeight) {
        resolve({
          valid: false,
          message: `图片高度过小，当前 ${height}px，最小要求 ${config.minHeight}px`,
        })
        URL.revokeObjectURL(img.src)
        return
      }

      resolve({ valid: true })
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      resolve({ valid: false, message: '无法读取图片信息' })
    }

    img.src = URL.createObjectURL(file)
  })
}

// 判断是否为图片文件
function isImageFile(fileName: string): boolean {
  const ext = `.${fileName.split('.').pop()?.toLowerCase()}`
  return IMAGE_EXTS.includes(ext)
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  (
    {
      accept = [],
      getUploadUrl = defaultGetUploadUrl,
      onSuccess,
      onError,
      onClear,
      defaultFileUrl = '',
      defaultFileName = '',
      disabled = false,
      buttonText = '选择文件',
      maxSize = 500,
      className = '',
      enablePreview = true,
      previewType = 'auto',
      imageValidation,
    },
    ref
  ) => {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [fileUrl, setFileUrl] = useState(defaultFileUrl)
    const [fileName, setFileName] = useState(defaultFileName)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      clear: handleClear,
      getFileUrl: () => fileUrl,
    }))

    // 清除文件
    const handleClear = useCallback(() => {
      setFileUrl('')
      setFileName('')
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClear?.()
    }, [onClear])

    // 处理文件上传（通用函数，供 input 和拖拽使用）
    const processFile = useCallback(
      async (file: File) => {
        // 验证文件扩展名
        const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`
        if (accept.length > 0 && !accept.includes(fileExt)) {
          toast.error(`请上传 ${accept.join(', ')} 格式的文件`)
          return
        }

        // 验证文件大小
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSize) {
          toast.error(`文件大小不能超过 ${maxSize}MB`)
          return
        }

        // 如果是图片文件且配置了图片校验，进行尺寸校验
        if (imageValidation && isImageFile(file.name)) {
          const validation = await validateImageSize(file, imageValidation)
          if (!validation.valid) {
            toast.error(validation.message || '图片尺寸不符合要求')
            return
          }
        }

        setUploading(true)
        setProgress(0)

        try {
          // 获取文件类型（不带点）
          const fileType = fileExt.slice(1)

          // 获取上传URL
          const uploadInfo = await getUploadUrl(fileType)

          // 上传到 OSS
          await uploadToOss(
            uploadInfo.uploadUrl,
            file,
            uploadInfo.headers,
            (percent) => setProgress(percent)
          )

          // 如果是视频文件，获取时长
          let duration: number | undefined
          if (isVideoFile(file.name)) {
            try {
              duration = await getVideoDuration(file)
            } catch {
              console.warn('无法获取视频时长')
            }
          }

          // 更新状态
          setFileUrl(uploadInfo.fileUrl)
          setFileName(file.name)
          onSuccess?.({
            fileUrl: uploadInfo.fileUrl,
            fileName: file.name,
            duration,
          })
          toast.success('文件上传成功')
        } catch (error) {
          const err = error instanceof Error ? error : new Error('上传失败')
          onError?.(err)
          toast.error(err.message || '文件上传失败')
          console.error('Upload error:', error)
        } finally {
          setUploading(false)
        }
      },
      [accept, maxSize, getUploadUrl, onSuccess, onError, imageValidation]
    )

    // 处理 input 文件选择
    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        await processFile(file)

        // 清空 input，允许重新选择同一文件
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [processFile]
    )

    // 拖拽事件处理
    const handleDragEnter = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled && !uploading) {
          setIsDragging(true)
        }
      },
      [disabled, uploading]
    )

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled && !uploading) {
          setIsDragging(true)
        }
      },
      [disabled, uploading]
    )

    const handleDragLeave = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // 只有当离开整个拖拽区域时才取消高亮
        if (
          dropZoneRef.current &&
          !dropZoneRef.current.contains(e.relatedTarget as Node)
        ) {
          setIsDragging(false)
        }
      },
      []
    )

    const handleDrop = useCallback(
      async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (disabled || uploading) return

        const files = e.dataTransfer.files
        if (files.length > 0) {
          await processFile(files[0])
        }
      },
      [disabled, uploading, processFile]
    )

    // 触发文件选择
    const triggerFileSelect = useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    // 生成 accept 属性
    const acceptAttr = accept.length > 0 ? accept.join(',') : undefined

    // 判断当前文件类型用于预览
    const currentFileType =
      previewType === 'auto' ? getFileType(fileUrl, accept) : previewType

    // 是否可预览
    const canPreview =
      enablePreview &&
      fileUrl &&
      (currentFileType === 'image' || currentFileType === 'video')

    // 渲染预览缩略图
    const renderThumbnail = () => {
      if (!fileUrl || !enablePreview) return null

      if (currentFileType === 'image') {
        return (
          <div
            className='relative h-10 w-10 cursor-pointer overflow-hidden rounded border'
            onClick={() => setPreviewOpen(true)}
          >
            <img
              src={fileUrl}
              alt={fileName}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100'>
              <ImageIcon className='h-4 w-4 text-white' />
            </div>
          </div>
        )
      }

      if (currentFileType === 'video') {
        return (
          <div
            className='relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded border bg-muted'
            onClick={() => setPreviewOpen(true)}
          >
            <Play className='h-4 w-4' />
          </div>
        )
      }

      return <FileIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
    }

    return (
      <div className={className}>
        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          accept={acceptAttr}
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />

        {/* 已上传文件显示 */}
        {fileUrl ? (
          <div className='flex items-center gap-2 rounded-md border p-2'>
            {renderThumbnail()}
            <span
              className={cn(
                'flex-1 truncate text-sm',
                canPreview && 'cursor-pointer hover:text-primary'
              )}
              title={fileName || fileUrl}
              onClick={() => canPreview && setPreviewOpen(true)}
            >
              {fileName || '已上传文件'}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleClear}
              disabled={disabled || uploading}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          /* 拖拽上传区域 */
          <div
            ref={dropZoneRef}
            className={cn(
              'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
              (disabled || uploading) && 'cursor-not-allowed opacity-50'
            )}
            onClick={triggerFileSelect}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            ) : (
              <Upload
                className={cn(
                  'h-8 w-8',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            )}
            <p className='mt-2 text-sm text-muted-foreground'>
              {uploading ? '上传中...' : isDragging ? '释放文件以上传' : buttonText}
            </p>
            <p className='mt-1 text-xs text-muted-foreground/70'>
              点击或拖拽文件到此区域
            </p>
          </div>
        )}

        {/* 上传进度 */}
        {uploading && <Progress value={progress} className='mt-2 h-2' />}

        {/* 预览弹窗 */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle>{fileName || '预览'}</DialogTitle>
            </DialogHeader>
            <div className='flex items-center justify-center'>
              {currentFileType === 'image' && (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className='max-h-[70vh] max-w-full object-contain'
                />
              )}
              {currentFileType === 'video' && (
                <video
                  src={fileUrl}
                  controls
                  className='max-h-[70vh] max-w-full'
                >
                  您的浏览器不支持视频播放
                </video>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
