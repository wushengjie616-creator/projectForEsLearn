# 西班牙语读写学习平台

## 项目目标

本项目计划建设一个面向中文母语、具备一定英语基础的学习者的西班牙语学习网站。

平台聚焦西班牙语阅读与写作，并为学习者提供两种学习路径：

- 使用平台推荐的学习规划；
- 创建和调整自己的学习规划。

听力与口语训练不属于当前阶段范围。

## 当前阶段成功标准

首个可用版本以不超过 10 位用户为容量目标。满足以下条件时，视为当前阶段成功：

- 受邀用户能够使用个人邀请码登录并安全访问自己的学习数据；
- 用户能够选择平台推荐的学习计划，或创建自己的计划；
- 用户能够阅读按难度组织的西班牙语材料；
- 用户能够完成与阅读材料相关的写作练习；
- 系统能够持久保存每位用户的计划、完成记录和学习进度；
- 用户能够查看自己的当前计划与进度概览；
- 页面整体简约、清晰，并可在桌面端和移动端正常使用。

当前阶段不要求大规模并发、听力训练、口语训练或原生移动应用。

账号开放方式已确认采用个人邀请码制：由管理员在项目中生成不超过 10 个可重复使用的邀请码，不收集邮箱，不开放公共自助注册。

版本库策略已确认采用 GitHub 私有仓库起步，并按未来公开开源的标准维护；任何凭据、用户数据和生产日志都不得进入提交历史。代码与第三方/衍生学习内容必须分别声明许可，不能用单一软件许可证覆盖全部材料。

## 推荐技术方案

> Next.js、TypeScript、Tailwind CSS、ESLint、Vitest、邀请码会话与 Supabase 服务端数据接入代码已经建立；本地环境已连接远端 Supabase 并执行数据库迁移。Vercel 尚未配置。

- Web 应用：Next.js App Router + TypeScript；
- 样式：Tailwind CSS，以少量可复用组件和清晰排版为主；
- 后端能力：优先使用 Next.js Server Actions / Route Handlers，暂不拆分独立后端服务；
- 用户身份：项目内个人邀请码注册表 + 签名 HttpOnly Cookie，不使用邮箱或 Supabase Auth；
- 用户与数据：Supabase PostgreSQL，只有服务端持有 secret key；
- 数据隔离：浏览器角色无表权限；服务端验证邀请码会话后，所有查询显式限定对应 `user_id`；
- 部署：首选 Vercel 托管 Next.js，Supabase 托管数据库；
- 工程质量：ESLint、TypeScript 类型检查，以及覆盖登录、计划、练习和进度主流程的自动化测试。

这一组合不依赖邮件服务，适合当前不超过 10 位用户的范围，同时保留了迁移到正式账号系统或独立 PostgreSQL 的可能性。邀请码本质上是登录凭据，泄露后持有者可访问对应用户的学习进度。

参考资料：

- [Next.js 安装与默认配置](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase 架构与 PostgreSQL](https://supabase.com/docs/guides/getting-started/architecture)
- [Vercel 上的 Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)

具体版本号应在开始实现时根据当时的官方稳定版本锁定，本 README 不预先虚构版本。

## 当前实现状态

已完成首个可运行切片：

- 响应式产品首页；
- 首页按 A1→A2→B1→B2 展示真实材料推荐路径；登录后依据该邀请码用户的已完成篇目计算进度和下一组阅读，读取失败时不伪装成零进度；
- 推荐路径排序、真实完成率和下一组预计用时领域模型；
- 二十四篇带来源、译者（如有）与许可信息的 A1–B2 西班牙语阅读材料；
- 阅读材料目录按 A1、A2、B1、B2 分区，并显示每级学习目标、学习前提与篇数；
- 每篇详情页解释基于等级、预计时长和本篇重点的难度依据；
- 逐段可展开中文学习译文、每篇至少 10 项的详细词表、理解题答案和写作练习；
- 原文中的每个西语单词均可用鼠标、触屏或键盘触发 DeepSeek 上下文释义，结果显示词元、词性、中英提示和语法说明；
- DeepSeek 调用只发生在服务端，要求邀请码会话有效，并有输入校验、每用户限流、超时和响应结构校验；点词释义另有前端会话缓存，点词、文章、材料和练习生成都显式关闭思考模式以保留最终输出额度；提供方返回 HTTP 402 时，所有 AI 页面都会显示余额不足提示和官方充值入口；
- 受邀用户可在 `/crear-material` 输入想法或选择平台主题，让 DeepSeek 先按 A1–B2 写一篇可预览的西语短文，确认后再转换并保存为学习材料；也可粘贴西语短文或选择本地 TXT，直接生成逐段精读、词汇、语法、理解题、写作任务与学习步骤；
- 用户短文与生成结果按邀请码用户保存为不可变快照，可在 `/mis-materiales` 下次登录后再次查看，但不会进入公开阅读材料库；
- 每份个性化材料可生成 4 道选择题和 4 道短填空；选择题按选项、填空按忽略大小写和 Unicode 组合音标后的字符串匹配进行确定性批改，不使用 AI 批改；每次得分与逐题结果长期保存；
- `/mis-datos` 展示约计空间占用与每用户软配额，支持清空答题记录或逐份删除材料并级联释放练习数据；容量不足时生成接口返回清理入口；
- 个人邀请码登录、30 天签名 HttpOnly 会话、停用检查和退出闭环；
- 首个邀请码已生成：明文保存在 Git 忽略的 `.local/invite-codes.json`，仓库注册表只保存 SHA-256 与用户 ID；
- Windows PowerShell 邀请码生成工具；
- 写作草稿与阅读完成状态的读取、校验和保存链路；保存草稿不会改变完成态，完成/取消完成是显式操作，`updated_at` 乐观并发检查会拒绝旧标签页覆盖，读取失败时编辑区会锁定；
- `reading_progress` 及个性化材料、练习题集、答题记录表迁移，浏览器角色撤权与服务端按用户访问链路；
- 首页服务端渲染行为测试与领域单元测试；
- TypeScript 类型检查、ESLint 和生产构建命令。

尚未实现：

- 第二个真实邀请码的交叉数据隔离验收；
- 学习计划编辑、独立写作记录和进度详情页；
- 个性化生成材料的导出；
- 内容管理后台与后续新增的已核验授权学习材料；
- Vercel 或其他生产环境部署。

### 本地运行

需要 Node.js 20.9 或更高版本。安装依赖并启动开发服务器：

```powershell
npm.cmd install
npm.cmd run dev
```

默认访问 `http://localhost:3000`。

首个邀请码保存在 `.local/invite-codes.json`。新增邀请码使用：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\scripts\new-invite-code.ps1' -Label '学习者 2'
```

生成后重启开发服务器。明文文件已被 Git 忽略；不要把它复制到提交、Issue 或聊天记录。

如需启用点击单词 AI 释义和个性化材料生成，请先用邀请码登录，然后用记事本打开本地环境文件：

```powershell
notepad.exe '.env.local'
```

把真实 Key 填在 `DEEPSEEK_API_KEY=` 后，保存文件并用 `npm.cmd run dev` 重启开发服务器。Next.js 会自动读取 `.env.local`；该文件已被 Git 忽略，但 Key 会以明文保存在本机，因此不要把文件同步、提交或发送到聊天中，也不要使用 `NEXT_PUBLIC_` 前缀。如果只想临时使用 Key，仍可运行 `npm.cmd run dev:deepseek`，服务器停止后脚本会清除进程变量。未配置 Key 时，阅读和静态重点词汇仍正常可用，AI 功能会明确提示尚未配置。

提交变更前运行：

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

如 PowerShell 阻止加载未签名的 `npm.ps1`，继续使用上述 `npm.cmd` 即可，不需要 WSL 或修改系统执行策略。

### Supabase 配置

邀请码认证在本地即可工作；阅读进度、个性化材料、练习题集和答题记录均已连接当前远端 Supabase，两份迁移都已执行。2026-08-27 已验证数据库 CRUD、邀请码登录、阅读保存与冲突保护，以及“生成材料 → 持久化复看 → 生成 4 道选择题与 4 道短填空 → 确定性批改并保存 → 清空答题记录但保留材料/题集 → 删除材料并级联清理”完整链路，测试数据已清零。按 [Windows 邀请码与 Supabase 接入指南](haiknow-doc/docs/supabase-setup.md) 管理配置。secret key 会绕过 RLS，只能放在服务端环境变量，绝不能进入浏览器、仓库或聊天记录。

开发服务器运行时可在另一个 PowerShell 窗口重复验收：

```powershell
npm.cmd run verify:supabase
```

个性化材料与练习的真实验收会调用两次 DeepSeek API，并只在当前邀请码用户没有既有答题记录时运行“清空全部记录”检查；脚本只删除自己创建的探针材料：

```powershell
npm.cmd run verify:custom-learning-e2e
```

### DeepSeek 点词释义

本地持久/临时密钥、生产环境变量、点词释义、AI 西语短文、个性化材料与练习生成、数据边界和故障排查见 [Windows DeepSeek 接入指南](haiknow-doc/docs/deepseek-setup.md)。默认模型是 `deepseek-v4-flash`；如官方后续升级，可在服务端设置 `DEEPSEEK_MODEL`，前端无需修改。2026-08-27 已用真实邀请码会话与真实提供方调用验证点词释义、个性化材料生成、材料复看、练习生成、确定性批改、答题记录和主动清理链路；AI 先写短文的新增两阶段流程当前已通过模拟提供方的自动化测试，仍待一次真实调用验收。DeepSeek 官方定义 HTTP 402 为余额不足，页面会给出 `https://platform.deepseek.com/top_up` 充值按钮；当前 Key 属于平台账户，普通学习者应联系该账户管理员。测试不记录 Key、邀请码或生成正文。Vercel 没有交互式启动终端，生产环境必须在项目设置中把 `DEEPSEEK_API_KEY` 配置为加密的服务端环境变量，不能使用 `NEXT_PUBLIC_` 前缀。

## 学习内容策略

课程规划建议以 Instituto Cervantes 的西班牙语参考等级与课程框架为主要依据，从 A1–C2 中选择适合读写训练的目标、语法、正字法和文本类型，并结合中文母语、具备英语基础的学习者特点提供中文说明及必要的英西对照。

学习材料的“权威性”和“可使用性”需要分别审核：

- 权威课程或商业教材可作为教学设计参考，但未经许可不得复制正文、习题或配套内容；
- 站内全文优先选用公版作品、明确允许再利用的开放许可材料，或已经取得授权的内容；
- 对仍受版权保护的文章，默认只保存来源信息和链接，不抓取或转载全文；
- 每条材料应记录标题、作者、来源链接、语言变体、难度、版权或许可依据，以及适合训练的读写目标；
- 站内 A1–B2 是结合原文长度、句法、词汇、体裁和现有译文/词表支架给出的建议阅读等级，不宣称为来源方或 Instituto Cervantes 的官方 CEFR 认证；
- Project Gutenberg 可作为公版西班牙语读物候选来源，但每部作品仍需按项目服务地区逐项核验版权状态。

参考资料：

- [Instituto Cervantes 课程规划](https://cvc.cervantes.es/ENSENANZA/biblioteca_ele/plan_curricular/default.htm)
- [Project Gutenberg：Spanish Language Readers](https://www.gutenberg.org/ebooks/subject/4582)
- [Creative Commons 许可说明](https://creativecommons.org/share-your-work/cclicenses/)

已入库材料及逐篇编辑说明见 [内容来源台账](haiknow-doc/docs/content-sources.md)。

## 建议的首阶段产品范围

1. 入门与账户：网站介绍、管理员生成个人邀请码、邀请码登录和退出。
2. 学习规划：平台推荐计划、自定义计划、阶段目标和每日/每周任务。
3. 阅读：按等级浏览材料、查看必要注释并标记完成。
4. 写作：围绕阅读材料完成短答、摘要或改写，并保存草稿与提交记录。
5. 进度：查看计划完成度、已读材料和已完成写作练习。
6. 内容管理：首阶段可由维护者通过数据库或受保护的简单入口维护材料；是否建设完整管理后台尚未决定。

## 已知边界与待定事项

以下事项尚未由项目所有者确认，因此不在本文中作事实性断言：

- 项目名称、品牌和视觉识别；
- 后续批次学习内容的具体书目、文章和授权状态；
- 是否在当前 A1–B2 之外扩展到 C1–C2；
- 写作练习采用自评、规则反馈、人工反馈还是 AI 反馈；
- 推荐学习计划的周期、强度和分级测试方式；
- 预算、上线日期、域名以及数据部署地区。

在这些事项确认前，后续设计与实现应把它们标记为待定，而不是自行补全。

## 项目知识入口

项目文档按主题从 [haiknow-doc/docs/index-by-topic.md](haiknow-doc/docs/index-by-topic.md) 进入。当前仓库已进入首阶段实现，实际完成情况以本文“当前实现状态”和可运行校验为准。
