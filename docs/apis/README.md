# 育安教育管理平台后端服务

[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)
[![Version](https://img.shields.io/badge/Version-v2.4.0-brightgreen.svg)](./CHANGELOG.md)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)]()
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

育安教育管理平台的后端服务，基于 NestJS + MongoDB + TypeScript 构建，提供**管理端**、**教师端**、**学生端**的完整业务功能。

---

## 🎉 最新更新 v2.4.0

**考试管理和证书系统重大升级！** 新增以下核心功能：

### ✨ 第1批高优先级功能（已完成）

#### 1. 考试类型组合设置
- ✅ 支持3种考试类型：只有选择题、选择题+报告、论文
- ✅ 灵活配置各题型的数量、字数要求、分值比例
- ✅ 自动验证分值比例总和
- ✅ 支持自定义考试流程

#### 2. 题目选择和分值计算
- ✅ 实时计算已选题目总分
- ✅ 智能提示剩余分值
- ✅ 达到目标分值后自动禁用继续选题
- ✅ 按题型统计题库数量
- ✅ 智能推荐题目功能

#### 3. 纸质证书扫描版上传
- ✅ 管理员可上传纸质证书扫描版
- ✅ 学生可在线查看扫描版
- ✅ 记录上传人和上传时间
- ✅ 支持删除和更新

**整体完成度**: 从 77% 提升至 **91%** 🎯

---

## 📖 完整文档清单

### 核心文档
- 📘 **[README.md](./README.md)** - 项目说明（本文档）
- 📗 **[QUICKSTART.md](./QUICKSTART.md)** - 快速开始指南
- 📙 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 部署指南
- 📕 **[CHANGELOG.md](./CHANGELOG.md)** - 完整变更日志

### 业务逻辑文档
- 📄 **[BUSINESS_LOGIC.md](./BUSINESS_LOGIC.md)** - 完整业务逻辑说明
- 📄 **[FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md)** - 功能概览
- 📄 **[CERTIFICATE_SYSTEM_IMPLEMENTATION.md](./CERTIFICATE_SYSTEM_IMPLEMENTATION.md)** - 证书系统实施文档
- 📄 **[EXAM_SYSTEM_UPGRADE.md](./EXAM_SYSTEM_UPGRADE.md)** - 考试系统升级文档
- 📄 **[STUDENT_ENROLLMENT_ENHANCEMENT.md](./STUDENT_ENROLLMENT_ENHANCEMENT.md)** - 学员报考流程优化

### 技术文档
- 📄 **[API.md](./API.md)** - API接口文档
- 📄 **[API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md)** - API接口清单
- 📄 **[SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)** - Swagger文档编写指南
- 📄 **[VALIDATION_ERROR_HANDLING.md](./VALIDATION_ERROR_HANDLING.md)** - 参数验证错误处理

### 实施总结
- 📄 **[PRIORITY_FEATURES_IMPLEMENTATION.md](./PRIORITY_FEATURES_IMPLEMENTATION.md)** - 第1批高优先级功能实施报告
- 📄 **[EXAM_MANAGEMENT_ANALYSIS.md](./EXAM_MANAGEMENT_ANALYSIS.md)** - 考试管理功能分析
- 📄 **[FINAL_IMPLEMENTATION_SUMMARY.md](./FINAL_IMPLEMENTATION_SUMMARY.md)** - 最终实施总结
- 📄 **[TEACHER_CERTIFICATION_FEATURE.md](./TEACHER_CERTIFICATION_FEATURE.md)** - 教师认证功能文档

---

## 📋 目录

- [项目概述](#-项目概述)
- [核心特性](#-核心特性)
- [技术栈](#️-技术栈)
- [功能模块](#-功能模块)
- [API 响应格式](#-api-响应格式)
- [快速开始](#-快速开始)
- [配置说明](#️-配置说明)
- [API文档](#-api文档)
- [数据库设计](#️-数据库设计)
- [核心业务流程](#-核心业务流程)
- [权限控制](#-权限控制)
- [部署指南](#-部署指南)
- [开发指南](#-开发指南)
- [性能优化](#-性能优化)
- [常见问题](#-常见问题)
- [监控和日志](#-监控和日志)

---

## 🎯 项目概述

育安教育管理平台是一个**功能完整**的在线教育管理系统，覆盖教育培训全业务流程：

### 核心功能
- 📚 **课程管理** - 支持免费/收费课程，章节视频/PDF内容，学习进度跟踪
- 📝 **报考管理** - 在线报名、资料审核、证书发放、有效期管理
- 📖 **题库考试** - 5种题型、智能组卷、在线考试、自动批改、主观题评阅
- 👨‍🏫 **教师管理** - 教师认证审核、微课堂发布、主观题评分、论文评审
- 🎓 **证书管理** - 证书生成、工本费管理、物流追踪、扫描版上传
- 💰 **订单支付** - 支付宝/微信支付集成、订单管理、退款处理
- 📦 **物流管理** - 证书邮寄追踪、物流轨迹记录
- 📰 **内容管理** - 公告、轮播图、考培动态、常见问题

### 系统特点
- ✅ **三端分离** - 管理端、教师端、学生端独立模块
- ✅ **权限完善** - 基于角色的访问控制（RBAC）
- ✅ **API标准** - 统一响应格式、完整错误码体系
- ✅ **文档齐全** - Swagger API文档、业务逻辑文档
- ✅ **类型安全** - TypeScript全栈类型保护
- ✅ **生产就绪** - 完善的异常处理、日志记录、监控告警

---

## 🌟 核心特性

### 1. 统一响应格式
所有 API 返回统一的 JSON 格式：
```typescript
{
  code: number      // 0=成功，其他=错误码
  message: string   // 成功='success'，失败=错误信息
  timestamp: string // ISO格式时间戳
  data: object      // 响应数据
}
```

### 2. 完整的业务流程
- **报考流程**: 注册 → 报名 → 审核 → 付费 → 学习 → 考试 → 证书
- **学习流程**: 购买 → 权限开通 → 章节学习 → 进度追踪 → 学习完成
- **考试流程**: 开始 → 答题 → 提交 → 自动批改 → 主观题评分 → 成绩计算
- **退款流程**: 申请 → 审核 → 原路退回

### 3. 强大的考试系统
- **5种题型**: 单选、多选、判断、解答题、论文
- **3种考试类型**: 纯选择题、选择题+报告、论文
- **智能组卷**: 按分值自动推荐题目
- **分值计算**: 实时验证，防止超出目标分值
- **自动批改**: 客观题自动评分
- **教师评阅**: 主观题人工评分

### 4. 灵活的证书系统
- **多种证书**: 考试证书、培训证书、荣誉证书
- **工本费管理**: 可配置证书工本费
- **物流追踪**: 完整的物流信息记录
- **扫描版上传**: 支持纸质证书扫描版管理

### 5. 第三方服务集成
- **阿里云 OSS**: 文件上传、预签名URL
- **阿里云短信**: 验证码发送、防刷策略
- **阿里云实名认证**: 身份验证
- **支付宝/微信支付**: 在线支付、异步回调

---

## 🛠️ 技术栈

### 核心框架
- **NestJS 11.x** - 渐进式 Node.js 框架
- **TypeScript 5.x** - 类型安全的 JavaScript 超集
- **MongoDB 8.x** - NoSQL 数据库
- **Mongoose 8.x** - MongoDB ODM

### 认证授权
- **Passport JWT** - JWT 认证策略
- **bcrypt** - 密码加密

### 数据验证
- **class-validator** - DTO 验证
- **class-transformer** - 类型转换
- **zod** - Schema 验证

### 第三方服务
- **阿里云 OSS** - 对象存储服务
- **阿里云短信** - 短信验证码
- **阿里云实名认证** - 身份验证
- **支付宝 SDK** - 支付集成
- **微信支付** - 支付集成

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Swagger** - API 文档生成
- **Jest** - 单元测试

---

## 🎨 功能模块

### 1️⃣ 管理端模块 (Admin)

#### 🔐 认证管理
- **POST** `/api/admin/auth/login` - 管理员登录

#### 👥 用户管理
- **POST** `/api/admin/users/admins` - 创建管理员账号
- **POST** `/api/admin/users/students` - 创建学生账号
- **POST** `/api/admin/users/teachers` - 创建教师账号
- **GET** `/api/admin/users` - 获取用户列表（可按角色筛选）
- **GET** `/api/admin/users/students` - 获取学生列表
- **GET** `/api/admin/users/teachers` - 获取教师列表
- **GET** `/api/admin/users/:id` - 获取用户详情
- **PUT** `/api/admin/users/:id` - 更新用户信息
- **DELETE** `/api/admin/users/:id` - 删除用户（软删除）
- **POST** `/api/admin/users/:id/reset-password` - 重置用户密码

#### 📚 报考管理
- **POST** `/api/admin/enroll/projects` - 创建报考项目
- **PUT** `/api/admin/enroll/projects/:id` - 更新报考项目
- **DELETE** `/api/admin/enroll/projects/:id` - 删除报考项目
- **GET** `/api/admin/enroll/projects` - 获取项目列表（支持搜索）

#### 📖 课程管理
- **GET** `/api/admin/course/upload-url` - 获取OSS文件上传地址
- **POST** `/api/admin/course/courses` - 创建课程（支持免费/收费）
- **PUT** `/api/admin/course/courses/:id` - 更新课程
- **DELETE** `/api/admin/course/courses/:id` - 删除课程
- **GET** `/api/admin/course/courses` - 获取课程列表（支持搜索）
- **POST** `/api/admin/course/lessons` - 创建章节（支持视频/PDF）
- **PUT** `/api/admin/course/lessons/:id` - 更新章节
- **DELETE** `/api/admin/course/lessons/:id` - 删除章节

#### 📝 题库管理
- **POST** `/api/admin/question-bank/banks` - 创建题库
- **GET** `/api/admin/question-bank/banks` - 获取题库列表（支持搜索）
- **POST** `/api/admin/question-bank/banks/:bankId/questions` - 创建题目
- **PUT** `/api/admin/question-bank/questions/:id` - 更新题目
- **DELETE** `/api/admin/question-bank/questions/:id` - 删除题目

#### 📋 考试管理
- **POST** `/api/admin/exam/configs` - 创建考试配置（支持3种类型）
- **PUT** `/api/admin/exam/configs/:id` - 更新考试配置
- **GET** `/api/admin/exam/sessions` - 查看考试记录

#### 🎯 考试组卷 🆕
- **GET** `/api/admin/exam-builder/questions` - 获取可选题目列表
- **POST** `/api/admin/exam-builder/calculate-score` - 计算已选题目总分
- **POST** `/api/admin/exam-builder/validate-selection` - 验证题目选择
- **GET** `/api/admin/exam-builder/question-counts` - 获取题库各题型数量统计
- **GET** `/api/admin/exam-builder/question-details` - 获取题目详情列表

#### 📝 考试评阅管理
- **GET** `/api/admin/exam-review/pending` - 获取待分配评阅的考试会话列表
- **POST** `/api/admin/exam-review/:sessionId/assign-reviewer` - 手动分配评阅老师
- **POST** `/api/admin/exam-review/:sessionId/auto-assign` - 自动分配评阅老师
- **POST** `/api/admin/exam-review/batch-auto-assign` - 批量自动分配评阅老师

#### 💳 订单管理
- **GET** `/api/admin/orders` - 获取订单列表
- **PUT** `/api/admin/orders/:id/cancel` - 取消订单
- **GET** `/api/admin/orders/refunds/list` - 获取退款申请列表
- **PUT** `/api/admin/orders/:id/refund/review` - 审核退款申请

#### 🎓 证书配置管理
- **POST** `/api/admin/certificate/categories` - 创建证书分类
- **POST** `/api/admin/certificate/levels` - 创建证书等级
- **POST** `/api/admin/certificate/configs` - 创建证书配置

#### 🎓 证书实例管理 🆕
- **GET** `/api/admin/certificate-management/list` - 获取证书列表
- **GET** `/api/admin/certificate-management/:id` - 获取证书详情
- **POST** `/api/admin/certificate-management/:id/upload-scan` - 上传纸质证书扫描版 🆕
- **DELETE** `/api/admin/certificate-management/:id/scan` - 删除纸质证书扫描版 🆕

#### 📦 物流管理
- **POST** `/api/admin/logistics` - 创建物流记录
- **PUT** `/api/admin/logistics/:id` - 更新物流信息
- **POST** `/api/admin/logistics/:id/tracking` - 添加物流轨迹

#### 📰 内容管理
- **POST** `/api/admin/modules` - 创建模块（公告/轮播/考培动态）
- **PUT** `/api/admin/modules/:id` - 更新模块
- **DELETE** `/api/admin/modules/:id` - 删除模块
- **GET** `/api/admin/modules` - 获取模块列表

#### ❓ 常见问题管理
- **POST** `/api/admin/faq` - 创建常见问题
- **PUT** `/api/admin/faq/:id` - 更新常见问题
- **DELETE** `/api/admin/faq/:id` - 删除常见问题
- **GET** `/api/admin/faq` - 获取常见问题列表

#### ⚙️ 配置管理
- **POST** `/api/admin/config` - 创建配置项
- **PUT** `/api/admin/config/:id` - 更新配置项
- **DELETE** `/api/admin/config/:id` - 删除配置项
- **GET** `/api/admin/config` - 获取配置项列表

#### 👨‍🏫 教师认证管理
- **GET** `/api/admin/teacher-certification/pending` - 获取待审核的教师认证列表
- **GET** `/api/admin/teacher-certification/all` - 获取所有教师认证列表
- **GET** `/api/admin/teacher-certification/:id` - 获取教师认证详情
- **POST** `/api/admin/teacher-certification/:id/review` - 审核教师认证
- **GET** `/api/admin/teacher-certification/config/fields` - 获取教师认证必填字段配置
- **POST** `/api/admin/teacher-certification/config/fields` - 更新教师认证必填字段配置

#### 📋 报名审核管理
- **GET** `/api/admin/enrollment-review/pending` - 获取待审核的报名申请列表
- **GET** `/api/admin/enrollment-review/:id` - 获取报名申请详情
- **POST** `/api/admin/enrollment-review/:id/review` - 审核报名申请

---

### 2️⃣ 教师端模块 (Teacher)

#### 🔐 认证管理
- **POST** `/api/teacher/auth/send-code` - 发送验证码
- **POST** `/api/teacher/auth/register` - 教师注册（需审核）
- **POST** `/api/teacher/auth/login` - 教师登录

#### 🎓 认证管理
- **POST** `/api/teacher/certification/save` - 保存认证信息（草稿）
- **POST** `/api/teacher/certification/submit` - 提交认证申请
- **GET** `/api/teacher/certification/my` - 获取我的认证信息
- **GET** `/api/teacher/certification/status` - 检查认证状态
- **GET** `/api/teacher/certification/config/fields` - 获取教师认证必填字段配置

#### 📱 微课堂管理
- **POST** `/api/teacher/micro-courses` - 创建微课堂
- **PUT** `/api/teacher/micro-courses/:id` - 更新微课堂
- **DELETE** `/api/teacher/micro-courses/:id` - 删除微课堂
- **GET** `/api/teacher/micro-courses` - 获取我的微课堂列表
- **POST** `/api/teacher/micro-courses/:id/publish` - 发布微课堂
- **POST** `/api/teacher/micro-courses/:id/offline` - 下线微课堂
- **GET** `/api/teacher/micro-courses/stats/monthly` - 获取月度统计

#### 📊 评分评审
- **GET** `/api/teacher/exam-review/my-tasks` - 获取我的主观题评分任务
- **POST** `/api/teacher/exam-review/tasks/:taskId/submit` - 提交主观题评分

---

### 3️⃣ 学生端模块 (Student)

#### 🔐 认证管理
- **POST** `/api/student/auth/send-code` - 发送验证码
- **POST** `/api/student/auth/register` - 学生注册
- **POST** `/api/student/auth/login` - 学生登录

#### 📚 课程学习
- **GET** `/api/student/course/courses` - 获取课程列表
- **GET** `/api/student/course/courses/:id` - 获取课程详情（含购买状态）
- **GET** `/api/student/course/courses/:id/lessons` - 获取章节列表（权限验证）
- **GET** `/api/student/course/lessons/:id` - 获取章节详情（权限验证）
- **POST** `/api/student/course/learning-records` - 更新学习记录
- **POST** `/api/student/course/bookmarks` - 添加书签
- **GET** `/api/student/course/my-courses` - 我的课程
- **GET** `/api/student/course/my-courses/:courseId/progress` - 学习进度
- **POST** `/api/student/course/repurchase` - 重新购买课程（考试次数用完后）
- **GET** `/api/student/course/purchase-eligibility/:courseId` - 检查课程购买资格

#### 📚 学习进度管理
- **POST** `/api/student/learning-progress/start` - 开始学习课程
- **POST** `/api/student/learning-progress/lesson-completed` - 标记章节完成
- **POST** `/api/student/learning-progress/bookmark` - 添加/更新书签
- **GET** `/api/student/learning-progress/:courseId` - 获取学习进度

#### 📝 报名申请
- **GET** `/api/student/enroll/projects` - 获取报考项目
- **POST** `/api/student/enroll/applications` - 提交报名申请
- **GET** `/api/student/enroll/my-applications` - 我的申请记录
- **GET** `/api/student/enroll/my-applications/:id/progress` - 获取报考详情（含进度）
- **GET** `/api/student/enroll/applications/:id/certificate-eligibility` - 检查证书资格

#### 📝 报名信息提交
- **POST** `/api/student/enrollment/submit-application` - 提交报名详细信息
- **GET** `/api/student/enrollment/my-application` - 获取我的报名申请

#### 📋 在线考试
- **POST** `/api/student/exam/configs/:configId/start` - 开始考试
- **GET** `/api/student/exam/sessions/:sessionId` - 获取考试详情
- **POST** `/api/student/exam/sessions/:sessionId/submit` - 提交考试答案
- **GET** `/api/student/exam/my-exams` - 我的考试记录

#### 🎓 证书管理
- **GET** `/api/student/certificate/my-certificates` - 获取我的证书列表
- **GET** `/api/student/certificate/query-url` - 获取证书查询网站链接

#### 💳 订单管理
- **POST** `/api/student/orders` - 创建订单（课程/证书）
- **GET** `/api/student/orders` - 获取我的订单列表
- **GET** `/api/student/orders/:id` - 获取订单详情
- **POST** `/api/student/orders/:id/refund` - 申请退款
- **GET** `/api/student/orders/refunds/my` - 获取我的退款申请列表

#### 👨‍🏫 教师列表
- **GET** `/api/student/teacher/list` - 获取认证教师列表（支持搜索）

#### ❓ 常见问题
- **GET** `/api/student/faq/list` - 获取常见问题列表

#### ⚙️ 配置获取
- **GET** `/api/student/config/list` - 获取配置项列表

---

### 4️⃣ 公开接口 (Public API)

#### 📰 模块内容
- **GET** `/api/api/modules` - 获取模块列表（公告/轮播/考培动态）

查询参数：
- `type`: 类别筛选（可选）- `announcement`(公告) | `banner`(轮播) | `training_news`(考培动态)
- `page`: 页码（可选，默认1）
- `limit`: 每页数量（可选，默认20）

#### 💰 支付回调
- **POST** `/api/api/payment/alipay/notify` - 支付宝支付回调
- **POST** `/api/api/payment/wechat/notify` - 微信支付回调

> 📌 **说明**: 公开接口不需要 token 认证，可直接访问

---

> 🆕 标注的接口为 v2.4.0 新增接口

---

## 📡 API 响应格式

### 统一响应结构

所有 API 接口都返回统一的响应格式：

```typescript
{
  code: number      // 状态码：0表示成功，其他表示错误码
  message: string   // 响应消息：成功='success'，失败=具体错误信息
  timestamp: string // ISO格式时间戳，如 '2025-12-07T12:00:00.000Z'
  data: object      // 响应数据：成功时有内容，失败时为空对象 {}
}
```

**重要**: 参数验证错误会将详细的错误信息返回到 `message` 字段中，例如：
- "订单金额不能为空; 订单类型必须是 course 或 certificate"
- "手机号格式不正确"

> 📖 **详细说明**: 查看 [VALIDATION_ERROR_HANDLING.md](./VALIDATION_ERROR_HANDLING.md)

### 成功响应示例

#### 单个对象响应
```json
{
  "code": 0,
  "message": "success",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "data": {
    "_id": "60d0fe4f5311b0001c8e4781",
    "name": "心理咨询师认证",
    "price": 299900,
    "status": "active"
  }
}
```

#### 分页列表响应
```json
{
  "code": 0,
  "message": "success",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "data": {
    "list": [
      {
        "_id": "60d0fe4f5311b0001c8e4781",
        "name": "心理咨询师认证",
        "status": "active"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### 简单消息响应
```json
{
  "code": 0,
  "message": "success",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "data": {
    "message": "操作成功"
  }
}
```

### 错误响应示例

#### 业务错误
```json
{
  "code": 1004,
  "message": "资源不存在",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "data": {}
}
```

#### 参数验证错误
```json
{
  "code": 400,
  "message": "订单金额不能为空; 订单类型必须是 course 或 certificate",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "data": {}
}
```

### 常用状态码

| code | 说明 | 场景 |
|------|------|------|
| 0 | 成功 | 请求正常处理 |
| 1000 | 请求参数错误 | 参数缺失或格式错误 |
| 1001 | 未授权 | 未登录或 token 无效 |
| 1003 | 无权限 | 角色权限不足 |
| 1004 | 资源不存在 | 查询的数据不存在 |
| 1500 | 服务器内部错误 | 系统异常 |
| 2xxx | 用户相关错误 | 用户注册、登录等 |
| 4xxx | 报考相关错误 | 报考申请、审核等 |
| 5xxx | 课程相关错误 | 课程购买、学习等 |
| 6xxx | 考试相关错误 | 考试次数、成绩等 |
| 7xxx | 订单相关错误 | 订单支付、退款等 |

> 📖 **完整错误码列表**: 查看 `src/common/enums/exception-code.enum.ts`

### Swagger 文档

项目集成了完整的 Swagger API 文档，所有接口都包含：
- ✅ 详细的请求参数说明
- ✅ 完整的响应结构定义
- ✅ 真实的响应示例数据
- ✅ 错误码说明

**访问地址**: http://localhost:3000/docs

> 📚 **开发指南**: 查看 [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) 了解如何为新接口添加文档

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **MongoDB** >= 5.x
- **Redis** >= 6.x (可选)

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 配置文件

复制配置文件模板：

```bash
# 开发环境
cp config/dev.config.example.js config/dev.config.js

# 本地环境（可选）
cp config/local.config.example.js config/local.config.js
```

编辑配置文件，填入必要的配置信息（详见[配置说明](#⚙️-配置说明)）。

### 启动服务

```bash
# 开发模式（监听文件变化自动重启）
pnpm run dev

# 使用本地配置
pnpm run dev:local

# 普通启动
pnpm run start

# 生产环境
pnpm run build
pnpm run prod
```

### 访问服务

服务启动后，可以访问：
- 🚀 **API 服务**: http://localhost:3000/api
- 📚 **API 文档**: http://localhost:3000/docs
- 📄 **OpenAPI JSON**: http://localhost:3000/api/openapi.json
- 📄 **OpenAPI YAML**: http://localhost:3000/api/openapi.yaml

---

## ⚙️ 配置说明

### 基础配置

```javascript
module.exports = {
  // 服务端口
  port: 3000,
  
  // MongoDB 配置
  mongodb: {
    uri: 'mongodb://localhost:27017',
    dbName: 'yuan_teaching_dev',
  },
  
  // JWT 配置
  jwt: {
    secret: 'your-secret-key',      // 务必修改！
    expiresIn: '7d',                // Token 有效期
    refreshExpiresIn: '30d',        // 刷新 Token 有效期
  },
  
  // Redis 配置（可选）
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  
  // API 文档配置
  docs: {
    enabled: true,                  // 生产环境建议关闭
    path: '/docs',
  },
}
```

### 阿里云服务配置

#### OSS 对象存储
```javascript
oss: {
  region: 'oss-cn-hangzhou',
  accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.ALI_OSS_BUCKET || '',
}
```

#### 短信服务
```javascript
sms: {
  accessKeyId: process.env.ALI_SMS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALI_SMS_ACCESS_KEY_SECRET || '',
  signName: '育安教育',
  templateCode: {
    login: 'SMS_463900387',
    register: 'SMS_463970414',
  },
}
```

#### 实名认证
```javascript
realname: {
  accessKeyId: process.env.ALI_REALNAME_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALI_REALNAME_ACCESS_KEY_SECRET || '',
}
```

### 支付配置

#### 支付宝
```javascript
alipay: {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gateway: 'https://openapi.alipay.com/gateway.do',
  notifyUrl: 'https://your-domain.com/api/payment/alipay/notify',
  returnUrl: 'https://your-domain.com/payment/success',
}
```

#### 微信支付
```javascript
wechatPay: {
  appId: process.env.WECHAT_APP_ID || '',
  mchId: process.env.WECHAT_MCH_ID || '',
  apiKey: process.env.WECHAT_API_KEY || '',
  apiV3Key: process.env.WECHAT_API_V3_KEY || '',
  serialNo: process.env.WECHAT_SERIAL_NO || '',
  privateKey: process.env.WECHAT_PRIVATE_KEY || '',
  notifyUrl: 'https://your-domain.com/api/payment/wechat/notify',
}
```

### 环境变量

推荐使用 `.env` 文件管理敏感信息：

```bash
# 阿里云 OSS
ALI_OSS_ACCESS_KEY_ID=your_key_id
ALI_OSS_ACCESS_KEY_SECRET=your_key_secret
ALI_OSS_BUCKET=your_bucket_name

# 阿里云短信
ALI_SMS_ACCESS_KEY_ID=your_key_id
ALI_SMS_ACCESS_KEY_SECRET=your_key_secret

# 阿里云实名认证
ALI_REALNAME_ACCESS_KEY_ID=your_key_id
ALI_REALNAME_ACCESS_KEY_SECRET=your_key_secret

# 支付宝
ALIPAY_APP_ID=your_app_id
ALIPAY_PRIVATE_KEY=your_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key

# 微信支付
WECHAT_APP_ID=your_app_id
WECHAT_MCH_ID=your_mch_id
WECHAT_API_KEY=your_api_key
```

---

## 📖 API 文档

### Swagger 文档

启动服务后访问: http://localhost:3000/docs

Swagger 文档提供：
- 📋 所有 API 接口列表
- 📝 请求/响应参数说明
- 🔧 在线测试工具
- 📄 Schema 定义

### OpenAPI 规范

- **JSON 格式**: http://localhost:3000/api/openapi.json
- **YAML 格式**: http://localhost:3000/api/openapi.yaml

可以导入到 Postman、Apifox 等 API 工具中使用。

---

## 🗄️ 数据库设计

### 核心数据模型

#### 用户模型 (User)
```typescript
{
  phone: string           // 手机号（唯一）
  password: string        // 加密密码
  name: string           // 姓名
  role: number           // 角色：0=管理员 | 1=教师 | 2=学生
  status: string         // 状态：active | inactive
  lastLoginAt: Date      // 最后登录时间
  lastLoginIp: string    // 最后登录IP
}
```

#### 课程模型 (Course)
```typescript
{
  name: string           // 课程名称
  description: string    // 课程描述
  coverUrl: string       // 封面图片
  projectId: ObjectId    // 关联报考项目
  instructorId: ObjectId // 讲师ID
  isFree: boolean        // 是否免费
  price: number          // 课程价格
  hasExam: boolean       // 是否包含考试
  status: string         // 状态：active | inactive
  lessonCount: number    // 章节数
  totalDuration: number  // 总时长（秒）
}
```

#### 考试配置模型 (ExamConfig)
```typescript
{
  projectId: ObjectId    // 关联项目
  courseId: ObjectId     // 关联课程
  questionBankId: ObjectId  // 题库ID
  examType: string       // 考试类型：multiple_choice | mc_report | thesis
  typeConfig: Object     // 考试类型详细配置
  totalScore: number     // 总分
  passScore: number      // 及格分
  status: string         // 状态
}
```

#### 证书模型 (Certificate)
```typescript
{
  certificateNo: string  // 证书编号
  userId: ObjectId       // 用户ID
  projectId: ObjectId    // 项目ID
  examSessionId: ObjectId // 考试会话ID
  type: string           // 证书类型
  name: string           // 证书名称
  level: string          // 级别
  holderInfo: Object     // 持证人信息
  status: string         // 状态
  needPhysical: boolean  // 是否需要纸质证书
  physicalCertificateScanUrl: string // 纸质证书扫描版URL 🆕
  logisticsId: ObjectId  // 物流ID
}
```

> 📖 **完整数据模型**: 查看 `src/libs/database/schemas/` 目录

---

## 🎯 核心业务流程

### 1. 学生报考流程

```
学生注册 → 浏览报考项目 → 提交报名申请 → 填写详细信息 
→ 管理员审核 → 购买课程 → 支付 → 开通课程权限 
→ 学习课程 → 参加考试 → 通过考试 → 生成证书 
→ 支付工本费 → 填写邮寄地址 → 物流配送（纸质证书）
→ 上传扫描版
```

### 2. 课程学习流程（收费课程）

```
浏览课程列表 → 查看课程详情 → 购买课程 → 支付成功 
→ 开通访问权限 → 开始学习 → 查看章节列表 
→ 学习章节内容（视频/PDF） → 记录学习进度 
→ 添加书签 → 完成学习
```

### 3. 课程学习流程（免费课程）

```
浏览课程列表 → 查看课程详情 → 查看章节列表 
→ 直接学习章节内容 → 记录学习进度 → 完成学习
```

### 4. 考试流程

```
查看考试配置 → 开始考试（生成试卷） → 答题 
→ 提交答案 → 自动批改客观题 → 管理员分配评阅教师
→ 教师评分主观题 → 计算总分 → 判定是否通过
```

### 5. 教师认证评分流程

```
教师注册 → 填写认证信息 → 提交认证 → 管理员审核通过 
→ 教师登录 → 接收评分任务 → 评分主观题 
→ 提交评分结果 → 系统计算总分
```

### 6. 管理员考试组卷流程（新增）

```
创建考试配置 → 选择考试类型 → 选择题库 
→ 获取可选题目列表 → 选择题目 → 实时计算分数 
→ 验证分值 → 保存考试配置
```

---

## 🔒 权限控制

### 角色定义

```typescript
enum UserRole {
  ADMIN = 0,      // 管理员
  TEACHER = 1,    // 教师
  STUDENT = 2,    // 学生
}
```

### 访问控制

所有需要认证的接口都使用：
```typescript
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)  // 或 TEACHER、STUDENT
```

### 课程访问控制逻辑

```typescript
// 免费课程：直接访问
if (course.isFree) {
  return true
}

// 收费课程：检查购买记录
const purchase = await coursePurchaseModel.findOne({
  userId: user._id,
  courseId: course._id,
  status: 'active',
})

return !!purchase
```

---

## 📦 部署指南

### 1. 构建项目

```bash
pnpm run build
```

生成的文件在 `dist/` 目录。

### 2. 使用 PM2 部署

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'yuan-teaching-admin-server',
    script: 'dist/main.js',
    args: '-c config/prod.config.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
  }],
}
```

启动服务：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. 使用 Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "dist/main", "-c", "config/prod.config.js"]
```

构建和运行：

```bash
docker build -t yuan-teaching-server .
docker run -d -p 3000:3000 \
  -e ALI_OSS_ACCESS_KEY_ID=xxx \
  -e ALI_SMS_ACCESS_KEY_ID=xxx \
  yuan-teaching-server
```

### 4. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> 📖 **详细部署指南**: 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💻 开发指南

### 项目结构

```
src/
├── admin/              # 管理端模块
│   ├── auth/          # 认证
│   ├── certificate/   # 证书配置管理
│   ├── certificate-management/ # 证书实例管理 🆕
│   ├── course/        # 课程管理
│   ├── enroll/        # 报考管理
│   ├── enrollment-review/ # 报名审核管理
│   ├── exam/          # 考试管理
│   ├── exam-builder/  # 考试组卷 🆕
│   ├── exam-review/   # 考试评阅管理
│   ├── logistics/     # 物流管理
│   ├── order/         # 订单管理
│   ├── question-bank/ # 题库管理
│   ├── teacher-certification/ # 教师认证管理
│   ├── faq/           # 常见问题管理
│   ├── config/        # 配置管理
│   └── user/          # 用户管理
├── teacher/           # 教师端模块
│   ├── auth/          # 认证
│   ├── certification/ # 教师认证
│   ├── micro-course/  # 微课堂
│   └── exam-review/   # 考试评阅
├── student/           # 学生端模块
│   ├── auth/          # 认证
│   ├── course/        # 课程学习
│   ├── enroll/        # 报名申请
│   ├── enrollment/    # 报名信息提交
│   ├── exam/          # 在线考试
│   ├── learning/      # 学习进度管理
│   ├── certificate/   # 证书管理
│   ├── order/         # 订单管理
│   ├── teacher/       # 教师列表
│   ├── faq/           # 常见问题
│   └── config/        # 配置获取
├── api/               # 公共API模块
│   └── payment/       # 支付回调
├── modules/           # 业务服务模块
│   ├── auth/          # 认证服务
│   ├── certificate/   # 证书服务
│   ├── course/        # 课程服务
│   ├── enroll/        # 报名服务
│   ├── exam/          # 考试服务
│   ├── exam-builder/  # 考试组卷服务 🆕
│   ├── learning-progress/ # 学习进度服务
│   ├── logistics/     # 物流服务
│   ├── micro-course/  # 微课堂服务
│   ├── module/        # 模块服务
│   ├── order/         # 订单服务
│   ├── payment/       # 支付服务
│   ├── question-bank/ # 题库服务
│   ├── review/        # 评审服务
│   ├── teacher-certification/ # 教师认证服务
│   ├── sms-code/      # 短信验证码服务
│   ├── faq/           # 常见问题服务
│   ├── config/        # 配置服务
│   └── user/          # 用户服务
├── libs/              # 公共库
│   ├── ali-cloudauth/ # 阿里云实名认证
│   ├── ali-oss/       # 阿里云OSS
│   ├── ali-pay/       # 支付宝支付
│   ├── ali-sms/       # 阿里云短信
│   ├── database/      # 数据库配置
│   │   └── schemas/   # MongoDB Schema定义
│   └── wechat-pay/    # 微信支付
├── common/            # 公共组件
│   ├── constants/     # 常量
│   ├── decorators/    # 装饰器
│   ├── enums/         # 枚举
│   ├── exceptions/    # 异常定义
│   ├── filters/       # 异常过滤器
│   ├── interceptors/  # 拦截器
│   ├── interfaces/    # 接口定义
│   └── utils/         # 工具函数
└── config.ts          # 配置加载器
```

### 代码规范

```bash
# 代码检查
pnpm run lint

# 代码格式化
pnpm run format

# 运行测试
pnpm run test

# 测试覆盖率
pnpm run test:cov
```

### 添加新模块

```bash
# 使用 NestJS CLI 生成模块
nest generate module modules/your-module
nest generate service modules/your-module
nest generate controller admin/your-module
```

### Git 提交规范

项目已配置 Git Hooks，提交前会自动执行 ESLint 检查：

```bash
git add .
git commit -m "feat: 添加新功能"
# 自动运行 eslint --fix
```

提交消息规范：
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链
```

---

## 📊 性能优化

### 1. 数据库索引

所有 Schema 都创建了合适的索引：

```typescript
// 课程索引
CourseSchema.index({ projectId: 1, status: 1 })
CourseSchema.index({ status: 1, order: 1 })

// 章节索引
LessonSchema.index({ courseId: 1, order: 1 })

// 订单索引
OrderSchema.index({ orderNo: 1 }, { unique: true })
OrderSchema.index({ userId: 1, status: 1 })

// 考试会话索引
ExamSessionSchema.index({ userId: 1, configId: 1 })
ExamSessionSchema.index({ status: 1, createdAt: -1 })
```

### 2. 查询优化

- 使用 `.lean()` 返回普通对象
- 合理使用 `populate()` 关联查询
- 分页查询避免全表扫描
- 使用 `select()` 只查询需要的字段

### 3. 缓存策略

可以集成 Redis 进行：
- Token 缓存
- 验证码缓存
- 热点数据缓存
- 题库缓存

---

## 🐛 常见问题

### Q: 启动时提示端口被占用？

```bash
# 查找占用端口的进程
lsof -ti:3000

# 结束进程
lsof -ti:3000 | xargs kill -9
```

### Q: MongoDB 连接失败？

检查：
1. MongoDB 服务是否启动
2. 配置文件中的连接地址是否正确
3. 数据库访问权限

### Q: 第三方服务配置为空导致启动失败？

服务已优化，配置为空时会显示警告但不影响启动：
```
⚠️  阿里云 OSS 配置不完整，文件上传功能将无法使用
⚠️  阿里云短信配置不完整，短信功能将无法使用
```

### Q: 如何初始化管理员账号？

使用 API 创建：
```bash
POST /api/admin/users/admins
{
  "phone": "13800138000",
  "password": "admin123456",
  "name": "系统管理员"
}
```

### Q: 收费课程学生无法访问章节内容？

这是正常的权限控制，学生需要：
1. 购买课程
2. 支付成功后自动开通访问权限
3. 然后才能查看章节的视频/PDF内容

### Q: 如何使用考试组卷功能？

1. 获取题库题型统计
2. 获取可选题目列表
3. 选择题目并实时计算分数
4. 验证是否可以继续选题
5. 保存考试配置

详见 [PRIORITY_FEATURES_IMPLEMENTATION.md](./PRIORITY_FEATURES_IMPLEMENTATION.md)

---

## 📈 监控和日志

### 日志级别

- `LOG` - 正常日志
- `WARN` - 警告信息
- `ERROR` - 错误信息
- `FATAL` - 致命错误

### 日志查看

```bash
# PM2 查看日志
pm2 logs yuan-teaching-admin-server

# 实时日志
pm2 logs yuan-teaching-admin-server --lines 100

# 错误日志
pm2 logs yuan-teaching-admin-server --err
```

---

## 🔧 常用命令

```bash
# 开发
pnpm run dev              # 开发模式（热重载）
pnpm run dev:local        # 使用本地配置
pnpm run debug            # 调试模式

# 构建
pnpm run build            # 构建生产版本

# 运行
pnpm run start            # 普通启动
pnpm run prod             # 生产模式

# 代码质量
pnpm run lint             # 代码检查
pnpm run format           # 代码格式化

# 测试
pnpm run test             # 运行测试
pnpm run test:watch       # 监听模式测试
pnpm run test:cov         # 测试覆盖率
```

---

## 🤝 贡献指南

### 提交代码前

1. 运行代码检查：`pnpm run lint`
2. 运行测试：`pnpm run test`
3. 确保构建成功：`pnpm run build`

### Commit 规范

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链
```

---

## 📞 技术支持

- **项目名称**: 育安教育管理平台后端服务
- **版本**: v2.4.0
- **框架**: NestJS 11.x
- **数据库**: MongoDB 8.x
- **Node版本**: >= 18.x
- **功能完成度**: 91%

---

## 📄 许可证

UNLICENSED (私有项目)

---

## 🔄 更新日志

### v2.4.0 (2025-12-07)

#### ✨ 第1批高优先级功能（已完成）

**考试管理和证书系统重大升级！**

##### 1. 考试类型组合设置
- ✅ 新增 `examType` 字段：支持3种考试类型
  - `multiple_choice`: 只有选择题
  - `mc_report`: 选择题 + 报告
  - `thesis`: 论文
- ✅ 新增 `typeConfig` 字段：详细配置各类型参数
- ✅ 新增完整的DTO验证

##### 2. 题目选择和分值计算功能
- ✅ 新建 `ExamBuilderService`
  - 获取可选题目列表（分页）
  - 计算已选题目总分
  - 验证题目选择（智能提示）
  - 按题型统计数量
  - 智能推荐题目
- ✅ 新建 `AdminExamBuilderController`（5个新接口）
- ✅ 实时验证分值，防止超出目标分值

##### 3. 纸质证书扫描版上传
- ✅ 扩展 `Certificate` Schema
  - `physicalCertificateScanUrl`: 扫描版URL
  - `physicalCertificateScanUploadedAt`: 上传时间
  - `physicalCertificateScanUploadedBy`: 上传人
- ✅ 新增证书实例管理接口（4个）
- ✅ 学生可在线查看扫描版

#### 🎯 实施成果
- 新增 **9个API接口**
- 新增 **1个Service**（ExamBuilderService）
- 新增 **2个Controller**
- 扩展 **2个Schema**
- 新增 **4个DTO**
- 整体完成度：**77% → 91%**

#### 📄 新增文档
- **PRIORITY_FEATURES_IMPLEMENTATION.md** - 第1批功能实施报告
- **EXAM_MANAGEMENT_ANALYSIS.md** - 考试管理功能分析

### v2.3.0 (2025-12-06)

#### ✨ 教师端和学生端增强

##### 教师端
- ✅ 简化教师注册流程
- ✅ 动态配置教师认证必填字段
- ✅ 教师认证审核流程优化
- ✅ 考试自动分配功能

##### 学生端
- ✅ 学员报考流程优化（方案A）
- ✅ 报名信息详细配置
- ✅ 学习进度控制
- ✅ 支付有效期（3分钟）
- ✅ 考试完成提示
- ✅ 证书查询外链

#### 📄 新增文档
- **STUDENT_ENROLLMENT_ENHANCEMENT.md** - 学员端优化方案
- **TEACHER_CERTIFICATION_FEATURE.md** - 教师认证功能

### v2.2.0 (2025-12-05)

#### ✨ 新功能
- ✅ 配置项管理模块
- ✅ 常见问题模块
- ✅ 教师列表查询
- ✅ 模块管理参数优化

### v2.1.0 (2025-12-04)

#### ✨ 新功能
- ✅ 证书工本费管理
- ✅ 证书物流追踪
- ✅ 订单退款流程
- ✅ 学生端订单创建

### v2.0.0 (2025-12-03)

#### ✨ 新功能
- ✅ 考试认证体系全新升级
- ✅ 报考有效期管理（2年）
- ✅ 考试次数控制（2次免费）
- ✅ 考试进度追踪
- ✅ 证书资格检查
- ✅ 课程重新购买

### v0.0.1 (2025-11-29)

#### ✨ 初始版本
- ✅ 完善的三端架构（管理端、教师端、学生端）
- ✅ 课程收费/免费区分
- ✅ 章节视频/PDF内容支持
- ✅ 基于购买状态的访问权限控制
- ✅ 完整的报考审核流程
- ✅ 在线考试和智能组卷
- ✅ 教师评分和论文评审
- ✅ 支付宝和微信支付集成
- ✅ 证书生成和物流追踪

> 📖 **完整变更日志**: 查看 [CHANGELOG.md](./CHANGELOG.md)

---

## 📚 参考资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [MongoDB 文档](https://docs.mongodb.com/)
- [Mongoose 文档](https://mongoosejs.com/)
- [Swagger 文档](https://swagger.io/docs/)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [阿里云短信服务](https://help.aliyun.com/product/44282.html)
- [支付宝开放平台](https://open.alipay.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

## 🎉 致谢

感谢所有为本项目做出贡献的开发者！

---

**Made with ❤️ by Yuan Teaching Team**

**© 2025 育安教育管理平台. All rights reserved.**
