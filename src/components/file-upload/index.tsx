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

export interface FileUploadProps {
  /** 允许的文件扩展名，如 ['.mp4', '.pdf'] */
  accept?: string[]
  /** 获取上传URL的函数 */
  getUploadUrl: (fileType: string) => Promise<{
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

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  (
    {
      accept = [],
      getUploadUrl,
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
    },
    ref
  ) => {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [fileUrl, setFileUrl] = useState(defaultFileUrl)
    const [fileName, setFileName] = useState(defaultFileName)
    const [previewOpen, setPreviewOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    // 处理文件选择
    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

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
          // 显示具体的错误信息，而不是通用的"文件上传失败"
          toast.error(err.message || '文件上传失败')
          console.error('Upload error:', error)
        } finally {
          setUploading(false)
          // 清空 input，允许重新选择同一文件
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      },
      [accept, maxSize, getUploadUrl, onSuccess, onError]
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
          /* 上传按钮 */
          <Button
            type='button'
            variant='outline'
            className='w-full'
            disabled={disabled || uploading}
            onClick={triggerFileSelect}
          >
            {uploading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Upload className='mr-2 h-4 w-4' />
            )}
            {uploading ? '上传中...' : buttonText}
          </Button>
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
