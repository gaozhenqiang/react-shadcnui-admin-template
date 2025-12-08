/**
 * 媒体预览组件
 * 功能：点击图片/视频缩略图后弹出预览
 */

import { useState, memo } from 'react'
import { Play, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export interface IMediaPreviewProps {
  /** 媒体URL */
  src?: string
  /** 替代文本 */
  alt?: string
  /** 媒体类型：auto 自动识别 */
  type?: 'auto' | 'image' | 'video'
  /** 缩略图类名 */
  className?: string
  /** 缩略图宽度 */
  width?: number | string
  /** 缩略图高度 */
  height?: number | string
  /** 占位符（无媒体时显示） */
  placeholder?: React.ReactNode
}

// 根据 URL 判断媒体类型
function getMediaType(url: string): 'image' | 'video' {
  const ext = url.split('.').pop()?.toLowerCase() || ''
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv']
  return videoExts.includes(ext) ? 'video' : 'image'
}

const MediaPreview = memo(function MediaPreview({
  src,
  alt = '媒体预览',
  type = 'auto',
  className,
  width = 64,
  height = 40,
  placeholder,
}: IMediaPreviewProps) {
  const [open, setOpen] = useState(false)

  // 无媒体时显示占位符
  if (!src) {
    return (
      placeholder || (
        <div
          className={cn(
            'flex items-center justify-center rounded bg-muted text-muted-foreground',
            className
          )}
          style={{ width, height }}
        >
          <ImageIcon className='size-4' />
        </div>
      )
    )
  }

  // 判断媒体类型
  const mediaType = type === 'auto' ? getMediaType(src) : type
  const isVideo = mediaType === 'video'

  return (
    <>
      {/* 缩略图 */}
      <button
        type='button'
        onClick={() => setOpen(true)}
        className={cn(
          'relative cursor-pointer overflow-hidden rounded transition-opacity hover:opacity-80',
          className
        )}
        style={{ width, height }}
      >
        {isVideo ? (
          <>
            {/* 视频缩略图使用第一帧或显示播放图标 */}
            <video
              src={src}
              className='h-full w-full object-cover'
              muted
              preload='metadata'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
              <Play className='size-4 text-white' fill='white' />
            </div>
          </>
        ) : (
          <img
            src={src}
            alt={alt}
            className='h-full w-full object-cover'
          />
        )}
      </button>

      {/* 预览弹窗 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className='max-w-4xl border-none bg-transparent p-0 shadow-none'
          showCloseButton={false}
        >
          <DialogTitle className='sr-only'>{alt}</DialogTitle>
          {/* 关闭按钮 */}
          <button
            type='button'
            onClick={() => setOpen(false)}
            className='absolute right-0 -top-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
          >
            <X className='size-5' />
          </button>
          {/* 媒体内容 */}
          <div className='flex items-center justify-center'>
            {isVideo ? (
              <video
                src={src}
                controls
                autoPlay
                className='max-h-[80vh] max-w-full rounded-lg'
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className='max-h-[80vh] max-w-full rounded-lg object-contain'
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})

export default MediaPreview

