# 育安教育管理平台 - 业务模块逻辑说明

[![Version](https://img.shields.io/badge/Version-v2.4.0-brightgreen.svg)]()
[![Updated](https://img.shields.io/badge/Updated-2025--12--07-blue.svg)]()

本文档详细介绍育安教育管理平台各业务模块的逻辑说明，涵盖**管理端**、**教师端**、**学生端**三个终端的功能。

---

## 📋 目录

- [一、用户注册与认证](#一用户注册与认证)
- [二、报考管理](#二报考管理)
- [三、课程管理](#三课程管理)
- [四、考试管理](#四考试管理)
- [五、成绩管理](#五成绩管理)
- [六、证书管理](#六证书管理)
- [七、物流管理](#七物流管理)
- [八、订单管理](#八订单管理)
- [九、完整业务流程图](#九完整业务流程图)

---

## 一、用户注册与认证

### 1.1 角色体系

系统支持三种用户角色：

| 角色 | 代码 | 说明 | 注册方式 |
|------|------|------|----------|
| 管理员 | `ADMIN (0)` | 系统管理员，拥有最高权限 | 管理员创建 |
| 教师 | `TEACHER (1)` | 认证教师，可发布微课堂、评阅主观题 | 手机验证码注册 + 认证审核 |
| 学生 | `STUDENT (2)` | 普通学生，可学习课程、参加考试 | 手机验证码注册 |

### 1.2 管理端 - 用户管理

#### 功能概述
管理员可以创建、编辑、删除和管理所有类型的用户账号。

#### 业务逻辑

```
┌─────────────────────────────────────────────────────────────┐
│                    管理端用户管理                            │
└─────────────────────────────────────────────────────────────┘

1. 创建管理员账号
   POST /api/admin/users/admins
   ├── 输入：手机号、密码、姓名
   ├── 验证：手机号唯一性
   └── 输出：创建管理员账号，角色=ADMIN

2. 创建学生账号
   POST /api/admin/users/students
   ├── 输入：手机号、密码、姓名
   ├── 验证：手机号唯一性
   └── 输出：创建学生账号，角色=STUDENT

3. 创建教师账号
   POST /api/admin/users/teachers
   ├── 输入：手机号、密码、姓名
   ├── 验证：手机号唯一性
   └── 输出：创建教师账号，角色=TEACHER，需后续认证

4. 用户列表查询
   GET /api/admin/users
   ├── 支持按角色筛选
   ├── 支持分页查询
   └── 支持搜索姓名/手机号

5. 用户管理操作
   ├── 更新用户信息：PUT /api/admin/users/:id
   ├── 删除用户（软删除）：DELETE /api/admin/users/:id
   └── 重置密码：POST /api/admin/users/:id/reset-password
```

#### 关键规则
- 手机号全局唯一，不可重复
- 删除为软删除，标记 `status = 'inactive'`
- 重置密码后用户需要重新登录

---

### 1.3 教师端 - 注册与认证

#### 功能概述
教师通过手机验证码注册，注册后需要提交认证信息，经管理员审核通过后才能获得完整权限。

#### 业务流程

```
┌─────────────────────────────────────────────────────────────┐
│                    教师注册认证流程                          │
└─────────────────────────────────────────────────────────────┘

第一步：发送验证码
POST /api/teacher/auth/send-code
├── 输入：手机号
├── 防刷：60秒内不可重复发送
├── 限制：同一IP每天最多10次
└── 输出：发送6位验证码，5分钟有效

第二步：注册账号
POST /api/teacher/auth/register
├── 输入：手机号、密码、姓名、验证码
├── 验证：验证码正确性、手机号唯一性
├── 输出：创建教师账号（待认证状态）
└── 提示：needCertification = true

第三步：填写认证信息
POST /api/teacher/certification/save（保存草稿）
POST /api/teacher/certification/submit（提交审核）
├── 必填项：职位、社会职务、联系电话、专业方向
├── 自动生成：性别、生日（从身份证解析）
├── 必提交：一寸证件照
├── 非必填：籍贯、户口所在地、政治面貌、工作单位、邮箱、其他
└── 状态：draft → pending_review

第四步：管理员审核
POST /api/admin/teacher-certification/:id/review
├── 审核通过：status = 'approved'
├── 审核拒绝：status = 'rejected' + 拒绝原因
└── 通过后：教师获得完整权限

第五步：登录使用
POST /api/teacher/auth/login
├── 已认证教师：可发布微课堂、评阅主观题
└── 未认证教师：功能受限
```

#### 认证字段配置
管理员可动态配置哪些字段为必填：

```javascript
// 默认必填字段配置
{
  position: true,           // 职位
  socialPosition: true,     // 社会职务
  phone: true,              // 联系电话
  professionalDirection: true, // 专业方向
  idCardNumber: true,       // 身份证号
  photoUrl: true,           // 一寸证件照
  nativePlace: false,       // 籍贯
  householdRegistration: false, // 户口所在地
  politicalStatus: false,   // 政治面貌
  workUnit: false,          // 工作单位
  email: false,             // 邮箱
  other: false              // 其他
}
```

---

### 1.4 学生端 - 注册与登录

#### 功能概述
学生通过手机验证码注册，注册后可选择"报名考试"或"仅注册不报名"。

#### 业务流程

```
┌─────────────────────────────────────────────────────────────┐
│                    学生注册流程                              │
└─────────────────────────────────────────────────────────────┘

第一步：发送验证码
POST /api/student/auth/send-code
├── 输入：手机号
├── 类型：register（注册）或 login（登录）
└── 输出：发送6位验证码

第二步：注册账号
POST /api/student/auth/register
├── 输入：手机号、密码、姓名、验证码
├── 验证：验证码正确性、手机号唯一性
└── 输出：创建学生账号

第三步：选择后续操作
注册成功后弹窗提示：
├── 选项A："报名考试"
│   └── 跳转到报考项目选择页面
│
└── 选项B："仅注册不报名考试"
    └── 以普通学员身份浏览微课堂和案例学习

第四步：登录
POST /api/student/auth/login
├── 输入：手机号、密码
└── 输出：JWT Token + 用户信息
```

#### 关键特性
- 支持手机验证码登录（无需密码）
- 支持微信扫码登录（待实现）
- Token有效期：7天
- 登录后可访问所有学生端功能

---

## 二、报考管理

### 2.1 业务概述

报考管理是系统的核心业务模块，实现了**证书分类 → 证书等级 → 课程配置 → 学员报考**的完整流程。

#### 核心概念

```
证书分类（CertificateCategory）
└── 证书等级（CertificateLevel）
    └── 证书配置（CertificateConfig）
        └── 关联课程列表
            └── 学员报考（StudentEnrollment）
```

### 2.2 管理端 - 报考配置

#### 2.2.1 证书分类管理

```
POST /api/admin/certificate/categories    创建证书分类
PUT  /api/admin/certificate/categories/:id 更新证书分类
DELETE /api/admin/certificate/categories/:id 删除证书分类
GET  /api/admin/certificate/categories    获取分类列表

示例数据：
{
  "name": "心理咨询师",
  "code": "PSY",
  "description": "心理咨询师系列证书",
  "status": "active"
}
```

#### 2.2.2 证书等级管理

```
POST /api/admin/certificate/levels        创建证书等级
PUT  /api/admin/certificate/levels/:id    更新证书等级
DELETE /api/admin/certificate/levels/:id  删除证书等级
GET  /api/admin/certificate/categories/:categoryId/levels 获取等级列表

示例数据：
{
  "categoryId": "xxx",
  "name": "初级",
  "level": 1,
  "requirements": "大专及以上学历",
  "description": "适合心理学入门者",
  "requirementText": "报考条件：1. 年满18周岁...",
  "requiredFields": {
    "position": false,      // 初级不需要职位
    "jobLevel": false,      // 初级不需要职级
    "workCertificate": false // 初级不需要工作证明
  }
}
```

#### 2.2.3 证书配置管理（核心）

```
POST /api/admin/certificate/configs       创建证书配置
PUT  /api/admin/certificate/configs/:id   更新证书配置
DELETE /api/admin/certificate/configs/:id 删除证书配置
GET  /api/admin/certificate/configs       获取配置列表

示例数据：
{
  "categoryId": "xxx",
  "levelId": "xxx",
  "name": "初级心理咨询师认证",
  "courseIds": ["course_1", "course_2", "course_3"], // 必修课程
  "validityYears": 2,        // 报考有效期（年）
  "maxExamAttempts": 2,      // 每门课程最大考试次数
  "status": "active"
}
```

#### 2.2.4 报名审核管理

```
GET  /api/admin/enrollment-review/pending    获取待审核列表
GET  /api/admin/enrollment-review/:id        获取申请详情
POST /api/admin/enrollment-review/:id/review 审核申请

审核逻辑：
1. 查看学员提交的报名信息
2. 核实身份证、学历证书、工作证明等材料
3. 审核通过 → 设置 approvedAt、expiresAt（+2年）
4. 审核拒绝 → 填写拒绝原因，学员可修改后重新提交
```

### 2.3 学生端 - 报考申请

#### 业务流程

```
┌─────────────────────────────────────────────────────────────┐
│                    学生报考流程                              │
└─────────────────────────────────────────────────────────────┘

第一步：浏览报考项目
GET /api/student/enroll/projects
├── 展示所有可报考的证书项目
├── 按分类、等级筛选
└── 查看报考条件和费用

第二步：选择报考等级
GET /api/student/enroll/projects/:id
├── 查看等级详情
├── 弹窗展示报考条件
├── 学员下拉到底部，点击"已知晓报考条件"
└── 进入报名信息填写页面

第三步：填写报名信息
POST /api/student/enrollment/application/submit
├── 必填项：
│   ├── 姓名
│   ├── 身份证号
│   ├── 最高学历
│   ├── 工作年限
│   ├── 联系电话
│   ├── 详细地址（接收纸质证书）
│   ├── 岗位（部分等级需要）
│   └── 职级（部分等级需要）
├── 自动生成：性别、生日（从身份证解析）
├── 必提交材料：
│   ├── 工作证明（部分等级需要）
│   ├── 最高学历证书
│   └── 一寸证件照
├── 非必填：籍贯、户口所在地、政治面貌、工作单位、邮箱、其他
└── 提交后状态：pending_review

第四步：等待审核
GET /api/student/enrollment/application/status
├── pending_review：等待审核
├── approved：审核通过
└── rejected：审核拒绝（显示原因，可重新提交）

第五步：审核通过后
├── 系统设置报考有效期（2年）
├── 显示需要学习的课程列表
├── 显示每门课程费用和总费用
└── 可开始购买课程

第六步：购买课程
├── 可选择一门、多门或全部课程
├── 显示合计金额
├── 支付有效期：3分钟
└── 支付成功后开通课程学习权限
```

#### 关键规则

1. **报考有效期**
   - 从审核通过时开始计算，有效期2年
   - 2年内必须完成所有课程学习和考试
   - 超期未完成，报考失效，需重新报考

2. **课程共享/去重**
   - 学员可同时报考多个证书
   - 如果两个证书包含相同课程，只需学习一次
   - 例：报考证书A（含课程X、Y）和证书B（含课程X、I、F）
   - 课程X只需学习和考试一次

3. **补考机制**
   - 每门课程有2次免费考试机会（首考+1次补考）
   - 2次都未通过，需重新购买该课程
   - 重新购买后再获得2次考试机会

4. **过期处理**
   - 2年内未取证，报考失效
   - 所有课程购买记录和考试成绩作废
   - 需重新报考、重新购买课程

---

## 三、课程管理

### 3.1 业务概述

课程是学员学习的核心内容，分为**免费课程**和**收费课程**两种类型。

### 3.2 管理端 - 课程管理

#### 3.2.1 课程CRUD

```
POST /api/admin/course/courses           创建课程
PUT  /api/admin/course/courses/:id       更新课程
DELETE /api/admin/course/courses/:id     删除课程
GET  /api/admin/course/courses           获取课程列表（支持搜索）
GET  /api/admin/course/courses/:id       获取课程详情

课程数据结构：
{
  "name": "心理学基础理论",
  "description": "系统学习心理学基础知识",
  "coverUrl": "https://oss.../cover.jpg",
  "projectId": "xxx",              // 关联报考项目
  "instructorId": "xxx",           // 讲师ID
  "instructorName": "李教授",
  "direction": "心理学",           // 专业方向
  "isFree": false,                 // 是否免费
  "price": 29900,                  // 课程价格（分）
  "hasExam": true,                 // 是否有考试
  "requiredStudyHours": 20,        // 必修学时
  "status": "active"
}
```

#### 3.2.2 章节管理

```
POST /api/admin/course/lessons           创建章节
PUT  /api/admin/course/lessons/:id       更新章节
DELETE /api/admin/course/lessons/:id     删除章节
GET  /api/admin/course/courses/:id/lessons 获取章节列表

章节数据结构：
{
  "courseId": "xxx",
  "title": "第一章：心理学概述",
  "order": 1,                      // 排序
  "contentType": "video",          // video | pdf | ppt
  "mediaUrl": "https://oss.../video.mp4",
  "videoUrl": "https://oss.../video.mp4",
  "pdfUrl": "https://oss.../notes.pdf",
  "description": "本章介绍心理学的基本概念",
  "content": "详细文字内容...",
  "durationInSeconds": 1800,       // 视频时长（秒）
  "status": "active"
}
```

#### 3.2.3 文件上传

```
GET /api/admin/course/upload-url
├── 获取阿里云OSS预签名上传URL
├── 前端直传到OSS
└── 返回文件访问地址
```

### 3.3 学生端 - 课程学习

#### 3.3.1 课程访问控制

```
┌─────────────────────────────────────────────────────────────┐
│                    课程访问控制逻辑                          │
└─────────────────────────────────────────────────────────────┘

免费课程（isFree = true）
├── 所有学员都可以直接访问
├── 可以查看所有章节内容
├── 可以观看视频、下载PDF
└── 不需要购买

收费课程（isFree = false）
├── 未购买时：
│   ├── 可以看到课程基本信息
│   ├── 可以看到章节标题和描述
│   ├── 无法看到视频/PDF链接（mediaUrl、videoUrl、pdfUrl = null）
│   └── 显示 "请购买后查看" 提示
│
└── 购买后：
    ├── 可以访问所有章节内容
    ├── 可以观看视频、下载PDF
    ├── 可以记录学习进度
    └── 可以添加书签
```

#### 3.3.2 学习进度管理

```
POST /api/student/learning/courses/:courseId/start
├── 开始学习课程
├── 创建学习进度记录
└── 设置 isFirstTimeStudy = true

POST /api/student/learning/courses/:courseId/lessons/:lessonId/progress
├── 更新学习进度
├── 记录当前观看位置
└── 计算完成百分比

POST /api/student/learning/courses/:courseId/lessons/:lessonId/complete
├── 标记章节完成
├── 更新已完成章节列表
└── 计算课程整体进度

GET /api/student/learning/courses/:courseId/progress
├── 获取学习进度详情
├── 已完成章节数 / 总章节数
├── 已学习时长 / 总时长
└── 是否达到必修学时
```

#### 3.3.3 学习规则

```
第一次学习规则：
├── isFirstTimeStudy = true
├── 不允许跳过章节
├── 必须按顺序学习
└── 完成一个章节才能进入下一个

补学规则（首次考试未通过后重新学习）：
├── isFirstTimeStudy = false
├── 允许跳过已学过的章节
├── 可以快进视频
└── 直接进入需要复习的部分

书签功能：
├── POST /api/student/learning/courses/:courseId/bookmarks
├── 记录重要知识点位置
├── 方便后续复习
└── DELETE /api/student/learning/courses/:courseId/bookmarks/:index
```

#### 3.3.4 学习完成与考试

```
课程学习完成后：
├── 检查是否达到必修学时
├── 弹窗显示 "开始考试"
├── 学员点击后进入考试界面
└── 考试完成后显示提示：
    "本课程成绩有效期两年。请在两年内通过等级其他课程考试，
     否则需重新缴费参加学习和考试。"
```

---

## 四、考试管理

### 4.1 业务概述

考试系统支持多种题型和考试类型，实现了**智能组卷**、**自动批改**、**教师评阅**的完整流程。

### 4.2 题型支持

| 题型 | 代码 | 类别 | 批改方式 |
|------|------|------|----------|
| 单选题 | `single` | 客观题 | 系统自动批改 |
| 多选题 | `multiple` | 客观题 | 系统自动批改 |
| 判断题 | `judgment` | 客观题 | 系统自动批改 |
| 解答题 | `subjective` | 主观题 | 教师人工评分 |
| 论文题 | `thesis` | 主观题 | 教师人工评分 |

### 4.3 考试类型

```
考试类型（ExamType）：

1. multiple_choice（纯选择题）
   ├── 只包含客观题（单选、多选、判断）
   ├── 系统自动批改
   └── 即时出成绩

2. mc_report（选择题 + 报告）
   ├── 客观题部分：单选、多选、判断
   ├── 主观题部分：解答题/报告
   ├── 客观题系统自动批改
   └── 主观题需教师评分

3. thesis（论文）
   ├── 只包含论文题
   ├── 需要教师评分
   └── 适用于高级别证书
```

### 4.4 管理端 - 考试配置

#### 4.4.1 题库管理

```
POST /api/admin/question-bank/banks              创建题库
GET  /api/admin/question-bank/banks              获取题库列表（支持搜索）
POST /api/admin/question-bank/banks/:bankId/questions 创建题目
PUT  /api/admin/question-bank/questions/:id      更新题目
DELETE /api/admin/question-bank/questions/:id    删除题目

题目数据结构：
{
  "bankId": "xxx",
  "type": "single",              // 题型
  "content": "心理学的研究对象是？",
  "options": ["A. 行为", "B. 意识", "C. 心理现象", "D. 神经活动"],
  "answer": "C",                 // 正确答案
  "explanation": "心理学研究心理现象...",
  "maxScore": 2,                 // 分值
  "timeLimit": 2,                // 答题时间限制（分钟）
  "difficulty": "medium",        // 难度：easy | medium | hard
  "tags": ["基础知识", "心理学概论"]
}
```

#### 4.4.2 考试配置

```
POST /api/admin/exam/configs                     创建考试配置
PUT  /api/admin/exam/configs/:id                 更新考试配置
GET  /api/admin/exam/configs                     获取配置列表
GET  /api/admin/exam/configs/:id                 获取配置详情

考试配置数据结构：
{
  "projectId": "xxx",
  "courseId": "xxx",
  "questionBankId": "xxx",
  "name": "心理学基础理论考试",
  "examType": "mc_report",       // 考试类型
  "typeConfig": {
    "multipleChoice": {
      "singleChoiceCount": 20,   // 单选题数量
      "multipleChoiceCount": 10, // 多选题数量
      "judgmentCount": 10        // 判断题数量
    },
    "reportWordCount": 1000      // 报告字数要求
  },
  "totalScore": 100,             // 总分
  "passScore": 60,               // 及格分
  "subjectiveDeadlineDays": 7,   // 主观题提交期限（天）
  "status": "active"
}
```

#### 4.4.3 考试组卷（🆕 v2.4.0）

```
GET  /api/admin/exam-builder/questions           获取可选题目列表
POST /api/admin/exam-builder/calculate-score     计算已选题目总分
POST /api/admin/exam-builder/validate-selection  验证题目选择
GET  /api/admin/exam-builder/question-counts     获取题库各题型数量统计
GET  /api/admin/exam-builder/question-details    获取题目详情列表

组卷流程：
1. 选择题库
2. 获取题库中各题型数量统计
3. 按题型筛选和选择题目
4. 实时计算已选题目总分
5. 验证是否符合考试配置要求
6. 达到目标分值后保存配置
```

#### 4.4.4 考试评阅分配

```
GET  /api/admin/exam-review/pending              获取待分配评阅的考试
POST /api/admin/exam-review/:sessionId/assign-reviewer 手动分配评阅老师
POST /api/admin/exam-review/:sessionId/auto-assign     自动分配评阅老师
POST /api/admin/exam-review/batch-auto-assign    批量自动分配

分配策略：
├── 按工作量分配：优先分配给当前任务最少的教师
├── 按专业方向分配：匹配学员报考方向和教师专业
└── 手动指定：管理员直接指定评阅教师
```

### 4.5 教师端 - 主观题评分

#### 4.5.1 评分任务

```
GET  /api/teacher/exam-review/pending            获取待评分任务列表
GET  /api/teacher/exam-review/sessions/:sessionId 获取考试详情
POST /api/teacher/exam-review/sessions/:sessionId/questions/:questionId/review
                                                 提交评分

评分数据：
{
  "score": 8,                    // 给分
  "comment": "回答较为全面，但论述不够深入",
  "feedback": "建议加强对XX理论的理解"
}

评分完成后：
├── 系统检查该试卷所有题目是否都已评分
├── 如果都已评分 → 计算总分
├── 对比及格分 → 判定是否通过
└── 更新学员考试状态和成绩
```

#### 4.5.2 论文评审

```
GET  /api/teacher/reviews/thesis                 获取论文评审任务
GET  /api/teacher/reviews/thesis/:id             获取论文详情
POST /api/teacher/reviews/thesis/:id/submit      提交论文评审

评审数据：
{
  "score": 85,
  "feedback": "论文结构完整，论述清晰，创新点明确...",
  "suggestions": "建议加强实证分析部分..."
}
```

### 4.6 学生端 - 在线考试

#### 4.6.1 考试流程

```
┌─────────────────────────────────────────────────────────────┐
│                    学生考试流程                              │
└─────────────────────────────────────────────────────────────┘

前置检查：
├── 检查报考是否在有效期内 ✓
├── 检查课程是否已购买 ✓
├── 检查是否还有剩余考试次数（≥1）✓
├── 检查该课程考试是否已通过 ✓
└── 检查课程学习是否完成（达到必修学时）✓

第一阶段：客观题
POST /api/student/exam/sessions/:sessionId/questions/start
├── 开始客观题答题
├── 每道题有独立计时（如2分钟/题）
├── 时间到自动提交当前题答案
├── 不能回退到上一题
├── 所有客观题完成后进入下一阶段

第二阶段：主观题（如有）
├── 客观题全部完成后开始
├── 显示剩余提交时间（如7天）
├── 可以保存草稿
├── 最终提交前可修改
├── 超时未提交 → 该题0分

POST /api/student/exam/sessions/:sessionId/questions/submit
├── 提交所有答案
├── 客观题即时自动批改
├── 主观题等待教师评分
└── 返回客观题成绩

第三阶段：等待结果
GET /api/student/exam/sessions/:sessionId
├── 查看考试状态
├── 客观题成绩（即时）
├── 主观题成绩（教师评分后）
└── 总成绩和是否通过
```

#### 4.6.2 考试结果处理

```
考试通过：
├── 更新课程考试状态 → passed = true
├── 更新报考进度 → passedCourses + 1
├── 检查是否所有课程都通过
│   └── 是 → 满足证书申请资格
└── 显示祝贺信息

考试未通过：
├── 检查剩余考试次数
├── 还有次数 → 显示 "可补考" 提示
├── 次数用完 → 显示 "需重新购买课程" 提示
└── 提示复习建议
```

---

## 五、成绩管理

### 5.1 管理端 - 成绩查询

```
GET /api/admin/exam/sessions
├── 查询所有考试记录
├── 按学员、课程、时间筛选
├── 查看详细成绩分布
└── 导出成绩报表（待实现）

成绩数据结构：
{
  "sessionId": "xxx",
  "userId": "xxx",
  "userName": "张三",
  "courseId": "xxx",
  "courseName": "心理学基础理论",
  "examConfigId": "xxx",
  "attemptNumber": 1,            // 第几次考试
  "objectiveScore": 60,          // 客观题得分
  "subjectiveScore": 25,         // 主观题得分
  "totalScore": 85,              // 总分
  "passScore": 60,               // 及格分
  "passed": true,                // 是否通过
  "status": "completed",         // 状态
  "reviewerId": "xxx",           // 评阅教师ID
  "reviewerName": "李老师",
  "startedAt": "2025-12-07T10:00:00Z",
  "submittedAt": "2025-12-07T11:30:00Z",
  "gradedAt": "2025-12-07T15:00:00Z"
}
```

### 5.2 学生端 - 成绩查询

```
GET /api/student/exam/my-exams
├── 查询我的所有考试记录
├── 显示每次考试成绩
├── 显示是否通过
└── 显示剩余考试次数

GET /api/student/enroll/my-applications/:id/progress
├── 查看报考整体进度
├── 每门课程的考试状态
├── 已通过课程数 / 总课程数
└── 距离取证还差几门课程
```

---

## 六、证书管理

### 6.1 业务概述

证书管理涵盖**证书生成**、**工本费管理**、**纸质证书邮寄**、**扫描版上传**等功能。

### 6.2 管理端 - 证书管理

#### 6.2.1 证书生成

```
证书自动生成条件：
├── 学员该级别所有课程考试都通过
├── 报考在2年有效期内
└── 系统自动生成电子证书

证书数据结构：
{
  "certificateNo": "CERT-2025-001234",  // 唯一证书编号
  "userId": "xxx",
  "projectId": "xxx",
  "examSessionId": "xxx",               // 最后一门考试会话
  "type": "exam",                       // exam | training | honor
  "name": "初级心理咨询师证书",
  "level": "初级",
  "issueDate": "2025-12-07",
  "expiryDate": "2030-12-07",           // 有效期
  "status": "pending",                  // pending | issued | delivered
  "holderInfo": {
    "name": "张三",
    "idNumber": "110***********1234",
    "photoUrl": "https://..."
  },
  "needPhysical": true,                 // 是否需要纸质证书
  "productionFee": 5000,                // 工本费（分）
  "paymentStatus": "unpaid"             // unpaid | paid
}
```

#### 6.2.2 证书实例管理（🆕 v2.4.0）

```
GET  /api/admin/certificate-management/list      获取证书实例列表
GET  /api/admin/certificate-management/:id       获取证书详情
POST /api/admin/certificate-management/:id/upload-scan 上传纸质证书扫描版
DELETE /api/admin/certificate-management/:id/scan 删除扫描版

扫描版上传：
├── 管理员上传纸质证书扫描版图片
├── 记录上传人和上传时间
├── 学员可在线查看扫描版
└── 便于证书验证和存档
```

### 6.3 学生端 - 证书查询

```
GET /api/student/certificate/my-certificates
├── 获取我的证书列表
├── 查看电子证书
├── 查看扫描版（如已上传）
└── 申请纸质证书邮寄

GET /api/student/certificate/query-url
├── 获取证书查询网站链接
├── 跳转至"中人会"网站
└── 在线验证证书真伪
```

### 6.4 证书流程

```
┌─────────────────────────────────────────────────────────────┐
│                    证书获取流程                              │
└─────────────────────────────────────────────────────────────┘

1. 满足条件
   ├── 所有课程考试通过 ✓
   └── 报考在有效期内 ✓

2. 系统生成电子证书
   ├── 自动生成证书编号
   ├── 记录持证人信息
   └── 设置证书有效期

3. 申请纸质证书（可选）
   ├── 学员申请纸质证书
   ├── 支付工本费
   └── 填写邮寄地址

4. 证书制作与邮寄
   ├── 管理员制作纸质证书
   ├── 上传扫描版存档
   ├── 创建物流记录
   └── 发货

5. 学员收取
   ├── 查看物流轨迹
   ├── 确认收货
   └── 取证完成 ✓
```

---

## 七、物流管理

### 7.1 管理端 - 物流管理

```
POST /api/admin/logistics                        创建物流记录
PUT  /api/admin/logistics/:id                    更新物流信息
POST /api/admin/logistics/:id/tracking           添加物流轨迹
GET  /api/admin/logistics                        获取物流列表
GET  /api/admin/logistics/:id                    获取物流详情
GET  /api/admin/logistics/tracking/:trackingNo   按快递单号查询
GET  /api/admin/logistics/certificate/:certificateId 按证书ID查询

物流数据结构：
{
  "certificateId": "xxx",
  "userId": "xxx",
  "courier": "顺丰速运",
  "trackingNo": "SF1234567890",
  "status": "shipped",           // pending | shipped | in_transit | delivered
  "shippingAddress": {
    "recipientName": "张三",
    "recipientPhone": "138****8000",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "detailAddress": "某某街道123号",
    "postalCode": "100000"
  },
  "trackingHistory": [
    {
      "time": "2025-12-07T10:00:00Z",
      "status": "已揽收",
      "description": "快件已从北京发出",
      "location": "北京分拨中心"
    },
    {
      "time": "2025-12-08T08:00:00Z",
      "status": "运输中",
      "description": "快件已到达上海",
      "location": "上海分拨中心"
    }
  ],
  "shippedAt": "2025-12-07T10:00:00Z",
  "deliveredAt": null
}
```

### 7.2 物流流程

```
┌─────────────────────────────────────────────────────────────┐
│                    物流管理流程                              │
└─────────────────────────────────────────────────────────────┘

1. 学员支付工本费
   └── 填写邮寄地址

2. 管理员创建物流记录
   ├── 关联证书ID
   ├── 填写收件人信息
   ├── 填写快递公司和单号
   └── 状态：pending

3. 发货
   ├── 更新状态：shipped
   ├── 添加揽收轨迹
   └── 记录发货时间

4. 运输中
   ├── 定期更新物流轨迹
   ├── 状态：in_transit
   └── 学员可实时查看

5. 签收
   ├── 更新状态：delivered
   ├── 记录签收时间
   └── 通知学员
```

---

## 八、订单管理

### 8.1 订单类型

| 类型 | 代码 | 说明 | 创建方 |
|------|------|------|--------|
| 课程购买 | `course` | 购买收费课程 | 学员端 |
| 微课堂购买 | `micro_course` | 购买教师微课堂 | 学员端 |
| 证书工本费 | `certificate` | 纸质证书工本费 | 学员端 |
| 报考课程 | `enrollment_courses` | 报考后购买课程 | 学员端 |

### 8.2 订单状态

```
订单状态流转：

pending (待支付)
    │
    ├─→ paid (已支付) ──→ completed (已完成)
    │
    ├─→ cancelled (已取消)
    │
    ├─→ expired (已过期，超时未支付)
    │
    └─→ refund_pending (退款申请中) ──→ refunded (已退款)
```

### 8.3 学生端 - 订单管理

```
POST /api/student/orders                         创建订单
GET  /api/student/orders                         获取我的订单列表
GET  /api/student/orders/:id                     获取订单详情
POST /api/student/orders/:id/refund              申请退款
GET  /api/student/orders/refunds/my              获取我的退款申请

创建订单：
{
  "type": "course",              // 订单类型
  "relatedId": "xxx",            // 关联ID（课程ID等）
  "amount": 29900,               // 金额（分）
  "paymentMethod": "alipay"      // alipay | wechat
}

支付有效期：
├── 普通订单：15分钟
├── 报考课程订单：3分钟
└── 超时自动取消
```

### 8.4 管理端 - 订单管理

```
GET  /api/admin/orders                           获取订单列表
GET  /api/admin/orders/:id                       获取订单详情
PUT  /api/admin/orders/:id/cancel                取消订单
GET  /api/admin/orders/refunds/list              获取退款申请列表
PUT  /api/admin/orders/:id/refund/review         审核退款申请

退款审核：
{
  "approved": true,              // 是否同意
  "reason": "审核通过，原路退回"  // 审核意见
}

退款成功后：
├── 订单状态 → refunded
├── 调用支付接口原路退回
├── 撤销相关业务权限（如课程访问权限）
└── 通知学员
```

### 8.5 支付流程

```
┌─────────────────────────────────────────────────────────────┐
│                    支付流程                                  │
└─────────────────────────────────────────────────────────────┘

1. 创建订单
   ├── 学员选择商品
   ├── 选择支付方式
   ├── 创建订单记录
   └── 返回支付链接/二维码

2. 发起支付
   ├── 支付宝：调用SDK生成支付页面
   ├── 微信：生成支付二维码
   └── 用户完成支付

3. 异步回调
   ├── POST /api/api/payment/alipay/notify（支付宝）
   ├── POST /api/api/payment/wechat/notify（微信）
   ├── 验证签名
   └── 更新订单状态

4. 业务处理
   ├── 课程订单 → 开通课程访问权限
   ├── 微课堂订单 → 开通微课堂访问权限
   ├── 证书订单 → 创建物流记录
   └── 报考课程订单 → 开通课程 + 考试机会
```

---

## 九、完整业务流程图

### 9.1 学员完整学习取证流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         学员完整学习取证流程                              │
└─────────────────────────────────────────────────────────────────────────┘

第一阶段：注册与报考
───────────────────
注册账号 → 选择"报名考试" → 浏览报考项目 → 选择证书等级
→ 查看报考条件（弹窗下拉确认）→ 填写报名信息 → 上传证明材料
→ 提交申请 → 等待审核 → 审核通过 → 报考生效（2年有效期）

第二阶段：购买课程
───────────────────
查看该等级包含的课程列表 → 选择课程（可多选）
→ 确认金额 → 支付（3分钟有效）→ 支付成功 → 开通学习权限

第三阶段：课程学习
───────────────────
进入课程 → 按顺序学习章节（首次不可跳章）
→ 观看视频/阅读PDF → 记录学习进度 → 添加书签（可选）
→ 完成必修学时 → 课程学习完成

第四阶段：参加考试
───────────────────
弹窗"开始考试" → 进入考试 → 客观题答题（每题计时）
→ 主观题答题（7天提交期限）→ 提交试卷
→ 客观题即时出分 → 等待主观题评分 → 最终成绩

第五阶段：考试结果
───────────────────
├── 通过 → 完成该课程 → 进度+1 → 继续下一门课程
│
└── 未通过 → 检查剩余次数
    ├── 有次数 → 继续学习 → 补考
    └── 无次数 → 重新购买课程 → 再次学习和考试

第六阶段：获取证书
───────────────────
所有课程通过 → 系统生成电子证书 → 申请纸质证书（可选）
→ 支付工本费 → 填写邮寄地址 → 等待邮寄
→ 查看物流 → 签收 → 取证完成 ✓

特殊情况：报考过期
───────────────────
2年内未完成所有考试 → 报考失效 → 所有成绩作废
→ 需重新报考 → 重新购买所有课程 → 从头开始
```

### 9.2 教师认证与评分流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         教师认证与评分流程                              │
└─────────────────────────────────────────────────────────────────────────┘

认证流程：
───────────────────
注册账号 → 填写认证信息 → 上传证件照 → 提交认证
→ 管理员审核 → 审核通过 → 获得教师权限

评分流程：
───────────────────
登录系统 → 查看待评分任务 → 接收任务分配
→ 查看学员答案 → 参考评分标准 → 给分并写评语
→ 提交评分 → 系统计算总分 → 更新学员成绩
```

### 9.3 管理员日常运营流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         管理员日常运营流程                              │
└─────────────────────────────────────────────────────────────────────────┘

报考审核：
───────────────────
查看待审核列表 → 审核学员资料 → 通过/拒绝 → 通知学员

考试管理：
───────────────────
配置考试 → 选择题库 → 组卷 → 分配评阅教师 → 监控考试进度

证书管理：
───────────────────
查看待发证书 → 制作纸质证书 → 上传扫描版 → 创建物流 → 发货

订单管理：
───────────────────
查看订单列表 → 处理退款申请 → 审核通过/拒绝 → 执行退款
```

---

## 📊 数据流转总览

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              数据流转总览                                     │
└──────────────────────────────────────────────────────────────────────────────┘

用户注册
    │
    ▼
┌─────────┐
│  学员   │ ────────────────────────────────────────────────────┐
└────┬────┘                                                     │
     │                                                          │
     ▼                                                          │
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐ │
│ 报考申请 │ ───▶ │ 管理审核 │ ───▶ │ 课程购买 │ ───▶ │ 课程学习 │ │
└─────────┘      └─────────┘      └────┬────┘      └────┬────┘ │
                                       │                │      │
                                       ▼                ▼      │
                                  ┌─────────┐      ┌─────────┐ │
                                  │ 订单支付 │      │ 参加考试 │ │
                                  └─────────┘      └────┬────┘ │
                                                        │      │
                      ┌─────────────────────────────────┘      │
                      │                                        │
                      ▼                                        │
                 ┌─────────┐      ┌─────────┐                  │
                 │ 系统批改 │ ───▶ │ 教师评分 │                  │
                 │(客观题)  │      │(主观题)  │                  │
                 └─────────┘      └────┬────┘                  │
                                       │                       │
                                       ▼                       │
                                  ┌─────────┐                  │
                                  │ 成绩计算 │                  │
                                  └────┬────┘                  │
                                       │                       │
              ┌────────────────────────┼────────────────────┐  │
              │                        │                    │  │
              ▼                        ▼                    ▼  │
         ┌─────────┐              ┌─────────┐          ┌─────────┐
         │ 考试通过 │              │ 考试未通过│          │ 补考/重买│
         └────┬────┘              └─────────┘          └─────────┘
              │
              ▼ (所有课程通过)
         ┌─────────┐
         │ 生成证书 │
         └────┬────┘
              │
              ▼
         ┌─────────┐      ┌─────────┐      ┌─────────┐
         │申请纸质证│ ───▶ │ 物流配送 │ ───▶ │ 取证完成 │
         └─────────┘      └─────────┘      └─────────┘
```

---

## 📝 附录：API接口速查

### 管理端接口

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 用户 | `/api/admin/users/admins` | POST | 创建管理员 |
| 用户 | `/api/admin/users/students` | POST | 创建学生 |
| 用户 | `/api/admin/users/teachers` | POST | 创建教师 |
| 用户 | `/api/admin/users` | GET | 用户列表 |
| 证书 | `/api/admin/certificate/categories` | POST/GET | 证书分类 |
| 证书 | `/api/admin/certificate/levels` | POST/GET | 证书等级 |
| 证书 | `/api/admin/certificate/configs` | POST/GET | 证书配置 |
| 报名 | `/api/admin/enrollment-review/pending` | GET | 待审核列表 |
| 报名 | `/api/admin/enrollment-review/:id/review` | POST | 审核申请 |
| 课程 | `/api/admin/course/courses` | POST/GET | 课程管理 |
| 课程 | `/api/admin/course/lessons` | POST/GET | 章节管理 |
| 题库 | `/api/admin/question-bank/banks` | POST/GET | 题库管理 |
| 考试 | `/api/admin/exam/configs` | POST/GET | 考试配置 |
| 组卷 | `/api/admin/exam-builder/questions` | GET | 获取题目 |
| 组卷 | `/api/admin/exam-builder/calculate-score` | POST | 计算分值 |
| 评阅 | `/api/admin/exam-review/pending` | GET | 待分配评阅 |
| 订单 | `/api/admin/orders` | GET | 订单列表 |
| 物流 | `/api/admin/logistics` | POST/GET | 物流管理 |

### 教师端接口

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 认证 | `/api/teacher/auth/register` | POST | 注册 |
| 认证 | `/api/teacher/auth/login` | POST | 登录 |
| 认证 | `/api/teacher/certification/submit` | POST | 提交认证 |
| 评分 | `/api/teacher/exam-review/pending` | GET | 待评分任务 |
| 评分 | `/api/teacher/exam-review/sessions/:id/questions/:qid/review` | POST | 提交评分 |
| 论文 | `/api/teacher/reviews/thesis` | GET | 论文评审任务 |

### 学生端接口

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 认证 | `/api/student/auth/register` | POST | 注册 |
| 认证 | `/api/student/auth/login` | POST | 登录 |
| 报考 | `/api/student/enroll/projects` | GET | 报考项目 |
| 报考 | `/api/student/enrollment/application/submit` | POST | 提交报名 |
| 课程 | `/api/student/course/courses` | GET | 课程列表 |
| 学习 | `/api/student/learning/courses/:id/start` | POST | 开始学习 |
| 考试 | `/api/student/exam/sessions/:id/questions/start` | POST | 开始考试 |
| 证书 | `/api/student/certificate/my-certificates` | GET | 我的证书 |
| 订单 | `/api/student/orders` | POST/GET | 订单管理 |

---

**文档版本**: v1.0  
**最后更新**: 2025-12-07  
**适用版本**: yuan-teaching-admin-server v2.4.0

---

**Made with ❤️ by Yuan Teaching Team**

