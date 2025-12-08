# 通用组件文档

本目录包含项目中的通用组件，可在多个页面复用。

## 目录

- [FileUpload 文件上传组件](#fileupload-文件上传组件)
- [DataTable 数据表格组件](#datatable-数据表格组件)
- [ProjectSelector 项目选择器组件](#projectselector-项目选择器组件)
- [CourseSelector 课程选择器组件](#courseselector-课程选择器组件)
- [QuestionBankSelector 题库选择器组件](#questionbankselector-题库选择器组件)
- [MediaPreview 媒体预览组件](#mediapreview-媒体预览组件)
- [StudentSelector 学员选择器组件](#studentselector-学员选择器组件)
- [RichTextEditor 富文本编辑器组件](#richtexteditor-富文本编辑器组件)

---

## FileUpload 文件上传组件

**路径**: `@/components/file-upload`

用于上传文件到 OSS，支持**拖拽上传**、进度显示、文件类型验证、图片/视频预览。

### 基础用法

```tsx
import { FileUpload } from '@/components/file-upload'

function MyComponent() {
  return (
    <FileUpload
      accept={['.mp4', '.webm']}
      onSuccess={(info) => {
        console.log('上传成功:', info.fileUrl, info.fileName)
      }}
      buttonText='选择视频'
      maxSize={2000} // 最大 2GB
    />
  )
}
```

> **注意**: `getUploadUrl` 已内置默认实现，大多数情况下无需传入。如需自定义上传地址获取逻辑，可传入自定义函数。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `accept` | `string[]` | `[]` | 允许的文件扩展名，如 `['.mp4', '.pdf']` |
| `getUploadUrl` | `(fileType: string) => Promise<{uploadUrl, fileUrl, headers}>` | 内置默认 | 获取上传URL的函数（可选，默认使用内置函数） |
| `onSuccess` | `(info: FileUploadSuccessInfo) => void` | - | 上传成功回调 |
| `onError` | `(error: Error) => void` | - | 上传失败回调 |
| `onClear` | `() => void` | - | 清除文件回调 |
| `defaultFileUrl` | `string` | `''` | 默认文件URL（编辑时使用） |
| `defaultFileName` | `string` | `''` | 默认文件名 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `buttonText` | `string` | `'选择文件'` | 按钮文字 |
| `maxSize` | `number` | `500` | 最大文件大小（MB） |
| `className` | `string` | `''` | 自定义类名 |
| `enablePreview` | `boolean` | `true` | 是否启用预览（图片/视频） |
| `previewType` | `'auto' \| 'image' \| 'video' \| 'none'` | `'auto'` | 预览类型 |
| `imageValidation` | `ImageValidationConfig` | - | 图片尺寸校验配置（仅对图片文件生效） |

### ImageValidationConfig

用于校验图片尺寸的配置：

```typescript
interface ImageValidationConfig {
  aspectRatio: number          // 期望的宽高比（宽/高），如 5/7 表示一寸照片
  aspectRatioTolerance?: number // 宽高比容差，默认 0.1 表示 ±10%
  minWidth?: number            // 最小图片宽度（像素）
  minHeight?: number           // 最小图片高度（像素）
  errorMessage?: string        // 自定义错误提示
}
```

**使用示例（一寸证件照）：**

```tsx
<FileUpload
  getUploadUrl={getUploadUrl}
  accept={['.jpg', '.jpeg', '.png']}
  maxSize={2}
  buttonText='选择证件照'
  imageValidation={{
    aspectRatio: 5 / 7,           // 一寸照片宽高比
    aspectRatioTolerance: 0.1,    // ±10% 容差
    minWidth: 148,                // 最小宽度
    minHeight: 207,               // 最小高度
    errorMessage: '请上传一寸证件照，宽高比应约为 5:7',
  }}
  onSuccess={(info) => console.log(info.fileUrl)}
/>
```

### FileUploadSuccessInfo

```typescript
interface FileUploadSuccessInfo {
  fileUrl: string    // 文件URL
  fileName: string   // 文件名
  duration?: number  // 视频时长（秒），仅视频文件有效
}
```

> **视频时长自动识别**: 上传视频文件时，组件会自动获取视频时长并通过 `onSuccess` 回调返回。

### Ref 方法

通过 `ref` 可以访问以下方法：

```tsx
import { useRef } from 'react'
import { FileUpload, FileUploadRef } from '@/components/file-upload'

function MyComponent() {
  const uploadRef = useRef<FileUploadRef>(null)

  const handleClear = () => {
    uploadRef.current?.clear() // 清除已上传的文件
  }

  const handleGetUrl = () => {
    const url = uploadRef.current?.getFileUrl() // 获取当前文件URL
  }

  return <FileUpload ref={uploadRef} {...props} />
}
```

### 示例：图片上传（带预览）

```tsx
<FileUpload
  accept={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
  getUploadUrl={getUploadUrl}
  onSuccess={handleUploadSuccess}
  buttonText='选择图片'
  maxSize={10}
  enablePreview={true}
/>
```

### 示例：PDF 上传（无预览）

```tsx
<FileUpload
  accept={['.pdf']}
  getUploadUrl={getUploadUrl}
  onSuccess={handleUploadSuccess}
  buttonText='选择PDF文件'
  maxSize={50}
  enablePreview={false}
/>
```

---

## DataTable 数据表格组件

**路径**: `@/components/data-table`

基于 TanStack Table 封装的数据表格组件集合。

### 组件列表

| 组件 | 说明 |
|------|------|
| `DataTableToolbar` | 表格工具栏，包含过滤器和重置按钮 |
| `DataTablePagination` | 分页组件 |
| `DataTableColumnHeader` | 列头组件 |
| `DataTableFacetedFilter` | 分面过滤器 |
| `DataTableViewOptions` | 列显示选项 |

### DataTableToolbar 用法

```tsx
import { DataTableToolbar } from '@/components/data-table'

<DataTableToolbar
  onReset={handleReset}
  filters={[
    {
      columnId: 'status',
      title: '状态',
      value: status,
      onChange: handleStatusChange,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  ]}
/>
```

#### DataTableToolbar Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `searchPlaceholder` | `string` | `'搜索...'` | 搜索框占位符（需要 `onSearch`） |
| `searchValue` | `string` | `''` | 搜索值 |
| `onSearch` | `(value: string) => void` | - | 搜索回调（传入则显示搜索框） |
| `filters` | `FilterConfig[]` | `[]` | 过滤器配置 |
| `onReset` | `() => void` | - | 重置回调 |

#### FilterConfig

```typescript
interface FilterConfig {
  columnId: string
  title: string
  options: { label: string; value: string }[]
  value?: string
  onChange?: (value: string | undefined) => void
}
```

### DataTablePagination 用法

```tsx
import { DataTablePagination } from '@/components/data-table'

<DataTablePagination
  table={table}
  onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
  onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
/>
```

#### DataTablePagination Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `table` | `Table<TData>` | TanStack Table 实例 |
| `className` | `string` | 自定义类名 |
| `onPageChange` | `(pageIndex: number) => void` | 页码变化回调 |
| `onPageSizeChange` | `(pageSize: number) => void` | 每页数量变化回调 |


---

## CourseSelector 课程选择器组件

**路径**: `@/components/course-selector`

用于远程搜索选择课程，基于 Command + Popover 组件实现。

### 基础用法

```tsx
import CourseSelector from '@/components/course-selector'

function MyComponent() {
  const [courseId, setCourseId] = useState<string>()

  return (
    <CourseSelector
      value={courseId}
      onChange={(id, course) => {
        setCourseId(id)
        console.log('选中课程:', course)
      }}
      placeholder='选择课程...'
    />
  )
}
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | - | 选中的课程ID |
| `onChange` | `(courseId: string \| undefined, course?: Course) => void` | - | 选中变化回调 |
| `placeholder` | `string` | `'选择课程...'` | 占位符文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `allowClear` | `boolean` | `true` | 是否允许清空 |

### 特点

- 支持远程搜索课程名称
- 显示课程方向和讲师信息
- 支持清空选中
- 自动加载已选课程信息

### 示例：在表单中使用

```tsx
<FormField
  control={form.control}
  name='courseId'
  render={({ field }) => (
    <FormItem>
      <FormLabel>所属课程 *</FormLabel>
      <FormControl>
        <CourseSelector
          value={field.value}
          onChange={(courseId) => field.onChange(courseId || '')}
          placeholder='选择所属课程...'
          allowClear={false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## MediaPreview 媒体预览组件

**路径**: `@/components/media-preview`

用于在表格或列表中点击图片/视频缩略图后弹出预览。

### 基础用法

```tsx
import MediaPreview from '@/components/media-preview'

function MyComponent() {
  return (
    <MediaPreview
      src='https://example.com/image.jpg'
      alt='示例图片'
      type='image'
      width={64}
      height={40}
    />
  )
}
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | - | 媒体URL |
| `alt` | `string` | `'媒体预览'` | 替代文本 |
| `type` | `'auto' \| 'image' \| 'video'` | `'auto'` | 媒体类型，auto 自动识别 |
| `className` | `string` | - | 缩略图类名 |
| `width` | `number \| string` | `64` | 缩略图宽度 |
| `height` | `number \| string` | `40` | 缩略图高度 |
| `placeholder` | `ReactNode` | - | 无媒体时显示的占位符 |

### 示例：在表格中预览课程封面

```tsx
<MediaPreview
  src={row.original.coverUrl}
  alt={row.getValue('name')}
  type='image'
  width={64}
  height={40}
/>
```

### 示例：在表格中预览视频

```tsx
{row.original.type === 'video' && row.original.resourceUrl && (
  <MediaPreview
    src={row.original.resourceUrl}
    alt={row.getValue('name')}
    type='video'
    width={64}
    height={40}
  />
)}
```

---

## RichTextEditor 富文本编辑器组件

**路径**: `@/components/rich-text-editor`

基于 TipTap 实现的富文本编辑器，用于编辑协议等文本内容。

### 基础用法

```tsx
import { RichTextEditor } from '@/components/rich-text-editor'

function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder='请输入内容...'
    />
  )
}
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | `''` | 编辑器内容（HTML 格式） |
| `onChange` | `(value: string) => void` | - | 内容变化回调 |
| `placeholder` | `string` | `'请输入内容...'` | 占位符文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `minHeight` | `string` | `'200px'` | 最小高度 |
| `className` | `string` | - | 自定义类名 |

### 支持的功能

- **标题**: 支持 H1、H2、H3 三级标题
- **文本格式**: 加粗、斜体、下划线
- **列表**: 有序列表、无序列表
- **对齐**: 左对齐、居中、右对齐
- **撤销/重做**: 支持操作历史

### 示例：在表单中使用

```tsx
<FormField
  control={form.control}
  name='content'
  render={({ field }) => (
    <FormItem>
      <FormLabel>协议内容 *</FormLabel>
      <FormControl>
        <RichTextEditor
          value={field.value}
          onChange={field.onChange}
          placeholder='请输入协议内容...'
          minHeight='250px'
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 注意事项

- 编辑器返回 HTML 格式的内容
- 不支持图片和视频上传（仅用于文本编辑）
- 需要安装 TipTap 相关依赖：`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-text-align`, `@tiptap/extension-placeholder`

---

## 最佳实践

### 1. 统一导入路径

所有组件都通过 `@/components` 路径导入：

```tsx
import { FileUpload } from '@/components/file-upload'
import { DataTableToolbar, DataTablePagination } from '@/components/data-table'
```

### 2. 表单中使用 FileUpload

```tsx
<FormField
  control={form.control}
  name='coverUrl'
  render={() => (
    <FormItem>
      <FormLabel>封面图片</FormLabel>
      <FormControl>
        <FileUpload
          accept={['.jpg', '.png']}
          getUploadUrl={getUploadUrl}
          onSuccess={(url) => form.setValue('coverUrl', url)}
          onClear={() => form.setValue('coverUrl', '')}
          defaultFileUrl={form.watch('coverUrl')}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 3. 服务端分页表格

```tsx
const [data, setData] = useState([])
const [total, setTotal] = useState(0)

useEffect(() => {
  setLoading(true)
  fetchListApi({ page, limit, status })
    .then((res) => {
      setData(res.list || [])
      setTotal(res.total || 0)
    })
    .finally(() => setLoading(false))
}, [page, limit, status])

const table = useReactTable({
  data,
  columns,
  pageCount: Math.ceil(total / limit),
  manualPagination: true,
  getCoreRowModel: getCoreRowModel(),
})
```

