/**
 * 富文本编辑器组件
 * 基于 TipTap 实现，用于编辑协议等文本内容
 * 功能：支持标题、加粗、斜体、下划线、列表、文本对齐等基础格式
 */

import { useEffect } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface RichTextEditorProps {
  /** 编辑器内容（HTML 格式） */
  value?: string
  /** 内容变化回调 */
  onChange?: (value: string) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 最小高度 */
  minHeight?: string
  /** 自定义类名 */
  className?: string
}

/**
 * 工具栏按钮组件
 */
function ToolbarButton({
  onClick,
  disabled,
  isActive,
  tooltip,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  tooltip: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant={isActive ? 'secondary' : 'ghost'}
          size='icon'
          className='h-8 w-8'
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='top'>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * 编辑器工具栏
 */
function EditorToolbar({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) {
  if (!editor) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className='flex flex-wrap items-center gap-0.5 border-b p-1.5'>
        {/* 标题 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          disabled={disabled}
          tooltip='正文'
        >
          <Pilcrow className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          disabled={disabled}
          tooltip='标题1'
        >
          <Heading1 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
          tooltip='标题2'
        >
          <Heading2 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          disabled={disabled}
          tooltip='标题3'
        >
          <Heading3 className='h-4 w-4' />
        </ToolbarButton>

        <Separator orientation='vertical' className='mx-1 h-6' />

        {/* 文本格式 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={disabled}
          tooltip='加粗'
        >
          <Bold className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={disabled}
          tooltip='斜体'
        >
          <Italic className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={disabled}
          tooltip='下划线'
        >
          <UnderlineIcon className='h-4 w-4' />
        </ToolbarButton>

        <Separator orientation='vertical' className='mx-1 h-6' />

        {/* 列表 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          disabled={disabled}
          tooltip='无序列表'
        >
          <List className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          disabled={disabled}
          tooltip='有序列表'
        >
          <ListOrdered className='h-4 w-4' />
        </ToolbarButton>

        <Separator orientation='vertical' className='mx-1 h-6' />

        {/* 对齐 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          disabled={disabled}
          tooltip='左对齐'
        >
          <AlignLeft className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          disabled={disabled}
          tooltip='居中'
        >
          <AlignCenter className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          disabled={disabled}
          tooltip='右对齐'
        >
          <AlignRight className='h-4 w-4' />
        </ToolbarButton>

        <Separator orientation='vertical' className='mx-1 h-6' />

        {/* 撤销/重做 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          tooltip='撤销'
        >
          <Undo className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          tooltip='重做'
        >
          <Redo className='h-4 w-4' />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  )
}

/**
 * 富文本编辑器
 */
export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  disabled = false,
  minHeight = '200px',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // 当外部 value 变化时，同步更新编辑器内容
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  // 更新编辑器的可编辑状态
  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [editor, disabled])

  return (
    <div
      className={cn(
        'rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <EditorToolbar editor={editor} disabled={disabled} />
      <EditorContent
        editor={editor}
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none p-4',
          'focus:outline-none',
          '[&_.tiptap]:outline-none',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:float-left',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:h-0'
        )}
        style={{ minHeight }}
      />
    </div>
  )
}

export default RichTextEditor

