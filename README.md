# 西班牙语读写学习平台

这是一个面向中文母语、具备一定英文基础的学习者的西班牙语学习网站。平台聚焦阅读和写作，不包含听力与口语训练；当前设计容量为不超过 10 位受邀用户。

项目使用 Next.js App Router、TypeScript、Supabase PostgreSQL 和 DeepSeek API。用户通过个人邀请码登录，学习进度、个性化材料、练习和答题记录保存在 Supabase；DeepSeek Key 只由服务端读取，不进入浏览器。

> 开源状态：软件代码与原创项目文档采用 [MIT License](LICENSE)，第三方阅读原文及其学习加工不由 MIT 统一覆盖，必须同时遵守 [NOTICE](NOTICE.md) 与逐篇许可台账。GitHub 仓库仍为 Private；完成剩余发布门禁并取得所有者对可见性变更的单独确认后才能公开。

## 功能

- 按 A1、A2、B1、B2 组织 24 篇西班牙语阅读材料，并显示来源、作者、许可、难度依据和学习目标；
- 提供逐段中文学习译文、重点词汇、语法提示、理解题和写作任务；
- 用户点击西班牙语单词后，由 DeepSeek 根据上下文返回中英释义、词性和语法说明；OpenStax 材料按其原始说明关闭此能力；
- 用户可以粘贴西班牙语短文，将其转换为个性化学习材料；
- 用户也可以输入想法或选择平台主题，让 DeepSeek 先生成 A1–B2 西语短文，再由用户确认并转换为学习材料；
- 个性化材料按邀请码用户持久保存，下次登录后可重复学习；
- 每份个性化材料可生成 4 道选择题和 4 道短填空题；选择题与填空题均由程序确定性批改，批改不调用 AI；
- 保存每次作答的得分和逐题结果，支持长期学习；
- 保存阅读草稿、完成状态和更新时间，并使用乐观并发检查阻止旧页面覆盖新记录；
- 显示个人存储占用，支持清空答题记录或删除材料及其关联练习；
- DeepSeek 余额不足时显示官方充值入口；
- 个人邀请码登录、30 天签名 HttpOnly Cookie、邀请码停用检查和退出闭环；
- Windows PowerShell 邀请码生成及真实链路验收工具；
- Vitest、TypeScript、ESLint 和 Next.js 生产构建检查。

## 技术架构与安全边界

```text
浏览器
  │  邀请码 / 学习操作（不持有数据库或 DeepSeek 密钥）
  ▼
Next.js Server Actions / Route Handlers
  ├─ 验证签名 HttpOnly 邀请码会话
  ├─ 使用固定的会话 user_id 访问 Supabase
  └─ 使用服务端 DEEPSEEK_API_KEY 调用 DeepSeek
       │
       ├─ Supabase PostgreSQL：进度、材料、练习、作答
       └─ DeepSeek API：点词释义、文章、材料和练习生成
```

本项目不使用邮箱注册、密码登录或 Supabase Auth。Supabase secret key 会绕过 RLS，因此应用必须先验证邀请码会话，再把服务端会话中的 `user_id` 固定到每个查询；不得信任浏览器提交的 `user_id`。

当前限流保存在单个 Next.js 进程内，适合不超过 10 位受邀用户的首阶段。Vercel 多实例之间不共享该计数；扩大用户规模前应改用共享限流和成本告警。

## 项目目录

| 路径 | 用途 |
|---|---|
| `src/app/` | 页面、Server Actions 和 API Route Handlers |
| `src/components/` | 交互式阅读、材料生成、练习和错误提示组件 |
| `src/lib/auth/` | 邀请码、会话签名和注册表读取 |
| `src/lib/deepseek/` | DeepSeek 请求、结构校验和错误分类 |
| `src/lib/supabase/` | 仅服务端 Supabase 客户端和数据仓库 |
| `src/content/` | 网页使用的结构化学习材料 |
| `content/raw/` | 带来源头的第三方西班牙语原文 |
| `supabase/migrations/` | 新 Supabase 项目必须执行的 SQL 迁移 |
| `scripts/` | PowerShell 邀请码工具和真实环境验收脚本 |
| `haiknow-doc/docs/` | 项目知识、来源台账和详细运维说明 |

## 完整部署方案

下面的流程既供人类维护者使用，也供接手项目的 Codex 或其他编程助手执行。命令全部适配 Windows PowerShell，不需要 WSL 或 Bash。

### 0. Codex 与用户的协作规则

接手部署的 Codex 必须遵守这些边界：

1. 先读取本 README、`.env.example`、两份 `supabase/migrations/*.sql` 和 `haiknow-doc/docs/index-by-topic.md`，再判断当前部署缺什么。
2. 可以检查 `.env.local` 是否存在以及变量名是否齐全，但不得输出、复述或上传变量值。
3. Supabase 数据库密码、Supabase secret key、DeepSeek API Key、邀请码明文、`INVITE_SESSION_SECRET` 和生产 `INVITE_USERS_JSON` 必须由用户直接粘贴到本机私有文件或部署平台的加密环境变量界面，不能要求用户把它们发送到聊天。
4. 不要给任何服务端密钥加 `NEXT_PUBLIC_` 前缀；该前缀会把变量纳入浏览器侧公开边界。
5. 不要把 `.env.local`、`.local/`、生产日志或真实用户数据提交到 Git。
6. 用户没有授权付费验收时，不运行 `verify:custom-learning-e2e`，因为它会真实调用 DeepSeek。
7. 不要重复执行已经成功执行过的 `create table` 迁移；先在 Supabase Table Editor 或 SQL Editor 检查表是否存在。
8. 任何把 GitHub 仓库从 Private 改为 Public 的操作，都必须在许可证、第三方内容和完整 Git 历史检查完成后，再获得仓库所有者的明确确认。

### 1. 准备条件

- Windows 10/11 和 PowerShell；
- Git；
- Node.js 20.9 或更高版本；
- 一个 GitHub 账号；
- 一个 Supabase 账号；
- 一个 DeepSeek Platform 账号；
- 可选：Vercel 账号，用于生产部署。

检查本机工具：

```powershell
git --version
node --version
npm.cmd --version
```

Next.js 16 的最低 Node.js 版本是 20.9。若 PowerShell 阻止运行 `npm.ps1`，继续使用本文的 `npm.cmd`，不需要修改系统执行策略。

### 2. 克隆并安装依赖

```powershell
git clone 'https://github.com/wushengjie616-creator/projectForEsLearn.git'
Set-Location '.\projectForEsLearn'
npm.cmd install
```

使用锁文件进行可重复安装时，可以改用：

```powershell
npm.cmd ci
```

### 3. 创建本地环境文件

```powershell
if (-not (Test-Path -LiteralPath '.env.local')) {
    Copy-Item -LiteralPath '.env.example' -Destination '.env.local'
}
notepad.exe '.env.local'
```

最终需要以下变量：

```dotenv
INVITE_SESSION_SECRET=至少32字符的独立高强度随机值
# 本地留空；生产环境粘贴私有注册表的单行 JSON
INVITE_USERS_JSON=
SUPABASE_URL=https://你的项目引用.supabase.co
SUPABASE_SECRET_KEY=sb_secret_你的服务端密钥
DEEPSEEK_API_KEY=你的DeepSeek服务端Key
DEEPSEEK_MODEL=deepseek-v4-flash
USER_STORAGE_LIMIT_BYTES=10485760
```

在自己的 PowerShell 中生成会话密钥并复制到剪贴板：

```powershell
$bytes = New-Object byte[] 48
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $rng.GetBytes($bytes)
    [Convert]::ToBase64String($bytes) | Set-Clipboard
}
finally {
    $rng.Dispose()
    [Array]::Clear($bytes, 0, $bytes.Length)
}
```

把剪贴板内容粘贴到 `INVITE_SESSION_SECRET=` 后，然后清空剪贴板：

```powershell
Set-Clipboard -Value ''
```

每个环境应使用不同的会话密钥。更换它会让现有 Cookie 全部失效，但不会删除数据库学习记录。

### 4. 创建并配置 Supabase

#### 4.1 创建项目

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) 并登录。
2. 选择组织，点击 **New project**。
3. 填写项目名，生成并妥善保存数据库密码，选择靠近目标用户的区域和适合的套餐。
4. 等待项目完成初始化。数据库密码不写入本站 `.env.local`，但维护者以后直接连接 PostgreSQL 时可能需要它。

本项目不需要在 Supabase Auth 中创建用户，也不需要配置邮件模板或邮箱验证。

#### 4.2 获取 Project URL 和 secret key

1. 在项目顶部打开 **Connect**，或在左侧进入 **Integrations → Data API**，复制 Project URL。
2. 进入 **Settings → API Keys**。
3. 在 **Secret keys** 中创建一个新的 `sb_secret_...` key。旧项目若只有 JWT 格式的 `service_role`，应优先迁移到新的 secret key。
4. 用户本人把 URL 和 secret key 粘贴进 `.env.local`：

```dotenv
SUPABASE_URL=https://你的项目引用.supabase.co
SUPABASE_SECRET_KEY=sb_secret_你的服务端密钥
```

本站不需要 publishable/anon key。secret key 具有高权限并绕过 RLS，只能存在于可信服务端；泄露后应立即在 Supabase Dashboard 创建替代 key、更新所有环境，再删除旧 key。

#### 4.3 执行数据库迁移

全新的 Supabase 项目必须按文件名顺序执行两份迁移。

复制第一份迁移：

```powershell
Get-Content -Raw -Encoding UTF8 -LiteralPath '.\supabase\migrations\202608260001_reading_progress.sql' | Set-Clipboard
```

在 Supabase 左侧打开 **SQL Editor**，新建查询，粘贴并点击 **Run**。看到 `Success. No rows returned` 属于正常结果。

然后复制并执行第二份迁移：

```powershell
Get-Content -Raw -Encoding UTF8 -LiteralPath '.\supabase\migrations\202608270001_custom_learning_and_practice.sql' | Set-Clipboard
```

执行后，在 **Table Editor** 确认以下四张表存在：

- `reading_progress`
- `custom_learning_materials`
- `practice_sets`
- `practice_attempts`

两份迁移会开启 RLS、撤销 `anon` 和 `authenticated` 的表权限，并把访问留给服务端 `service_role`。这里的 RLS 不是邀请码用户隔离机制；真正隔离依赖 Next.js 服务端验证会话并在每个查询中限定 `user_id`。

这些迁移不是重复执行脚本。若表已经存在，不要再次运行 `create table`；升级部署时只执行仓库中新增加且尚未执行的迁移。

### 5. 创建个人邀请码

运行项目工具：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\scripts\new-invite-code.ps1' -Label '管理员'
```

脚本会：

- 在被 Git 忽略的 `.local/invite-users.json` 保存随机用户 UUID、标签、SHA-256 和启用状态；
- 在被 Git 忽略的 `.local/invite-codes.json` 保存邀请码明文；
- 在终端显示一次新邀请码。

邀请码等同于账号密码。不要把终端输出、`.local/invite-users.json` 或 `.local/invite-codes.json` 发到聊天、Issue 或公开仓库。开发服务器会优先读取本机私有哈希注册表；生成、停用或更新邀请码后需要重启。

根目录中的 `src/config/invite-users.json` 只是空的公开模板。生产环境不读取本机 `.local/` 时，必须把私有哈希注册表压成单行 JSON 并保存到加密环境变量 `INVITE_USERS_JSON`。应用按“生产环境变量 → 本机私有文件 → 空模板”的顺序读取；选中的 JSON 无效时会拒绝加载，绝不会静默回退到其他用户表。

若邀请码可能泄露，静默替换全部现有邀请码并保持公开模板为空：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\scripts\new-invite-code.ps1' -Label '管理员' -ReplaceExisting -ResetPublicTemplate -Quiet
```

新明文只保存在 `.local/invite-codes.json`。旧邀请码立即失效；需要重启本地服务，并在生产环境更新 `INVITE_USERS_JSON` 后重新部署。

### 6. 创建并配置 DeepSeek API

1. 打开 [DeepSeek Platform](https://platform.deepseek.com/) 并登录。
2. 打开 [API Keys](https://platform.deepseek.com/api_keys)，创建新的 API Key。
3. Key 通常只完整显示一次，用户应直接把它粘贴到 `.env.local`，不要发给 Codex：

```dotenv
DEEPSEEK_API_KEY=你的真实Key
DEEPSEEK_MODEL=deepseek-v4-flash
```

4. 如账户没有可用余额，打开 [DeepSeek 充值页](https://platform.deepseek.com/top_up) 充值。

本项目使用 `https://api.deepseek.com/chat/completions`，默认模型为当前官方支持的 `deepseek-v4-flash`。点词、文章、材料和练习生成都会显式关闭 thinking，模型输出还会经过服务端 JSON 和长度校验。

不要在 Key 两侧加引号或空格，不要使用 `NEXT_PUBLIC_DEEPSEEK_API_KEY`。所有学习者共用部署者的服务端 DeepSeek 账号和余额；网页出现 402 时，应由该平台账号管理员充值。

若只想在本次开发服务器生命周期临时输入 Key，而不保存到磁盘：

```powershell
npm.cmd run dev:deepseek
```

### 7. 本地启动与基础验收

```powershell
npm.cmd run dev
```

打开 `http://localhost:3000`，依次检查：

1. `/login` 只有邀请码登录，没有邮箱注册；
2. 登录后刷新首页，会话仍存在；
3. 打开一篇阅读材料，保存草稿，刷新后草稿仍存在；
4. 点击一个西语单词，能够得到上下文释义；
5. 在 `/crear-material` 生成或粘贴一篇短文，转换后能从 `/mis-materiales` 再次打开；
6. 生成练习并提交，结果出现在材料页和 `/mis-datos`；
7. 清空答题记录不会删除材料；删除材料会级联删除关联练习和作答。

自动检查 Supabase、邀请码会话和阅读进度链路：

```powershell
npm.cmd run verify:supabase
```

下面的真实端到端验收会调用 DeepSeek 并产生费用，只有在用户明确同意后运行：

```powershell
npm.cmd run verify:custom-learning-e2e
```

### 8. 部署到 Vercel

#### 8.1 导入 Git 仓库

1. 登录 [Vercel](https://vercel.com/)，选择 **Add New → Project**。
2. 连接 GitHub，并授权 Vercel 访问要部署的仓库。
3. 导入仓库。Vercel 应自动识别 Next.js；Root Directory 保持仓库根目录，构建命令使用 `npm run build`。
4. 仓库可以保持公开且邀请码注册表为空；运营实例的哈希注册表通过 Vercel 加密环境变量注入，不提交到 Git。

#### 8.2 添加生产环境变量

在 Vercel Project **Settings → Environment Variables** 添加：

| 变量 | 必需 | 说明 |
|---|---:|---|
| `INVITE_SESSION_SECRET` | 是 | 生产环境独立的至少 32 字符随机值 |
| `INVITE_USERS_JSON` | 是 | `.local/invite-users.json` 的单行内容；属于生产私有配置 |
| `SUPABASE_URL` | 是 | Supabase Project URL |
| `SUPABASE_SECRET_KEY` | 是 | 仅服务端使用的 `sb_secret_...` |
| `DEEPSEEK_API_KEY` | AI 功能必需 | 部署者的 DeepSeek Key |
| `DEEPSEEK_MODEL` | 否 | 默认 `deepseek-v4-flash` |
| `USER_STORAGE_LIMIT_BYTES` | 否 | 默认每位用户约 10 MiB，即 `10485760` |

先在本机把注册表复制到剪贴板，再直接粘贴到 Vercel 的 `INVITE_USERS_JSON` 值输入框；不要把内容发到聊天：

```powershell
(Get-Content -Raw -Encoding UTF8 -LiteralPath '.\.local\invite-users.json').Trim() | Set-Clipboard
```

至少勾选 Production。若启用 Preview，使用独立的邀请码注册表、会话密钥、Supabase 项目和 DeepSeek Key，避免测试数据或预览代码接触生产数据。粘贴后清空剪贴板：`Set-Clipboard -Value ''`。

环境变量更改只影响新的部署。添加或更新变量后执行 **Redeploy**，或向生产分支推送新提交。

#### 8.3 生产验收

部署完成后使用 `https://...vercel.app` 地址重复本地基础验收，并额外确认：

- Cookie 带 `Secure` 且刷新不会退出；
- 未登录访问受保护数据返回 401 或跳转登录；
- 浏览器 Network、页面源码和前端 bundle 中没有 Supabase secret key、DeepSeek Key 或邀请码明文；
- Supabase 中两位不同邀请码用户使用不同 UUID，彼此看不到对方的草稿、材料和作答；
- DeepSeek 401、402、429、超时和无效 JSON 都只向用户显示安全错误，不回传提供方响应正文；
- Vercel 日志没有记录用户原文、Cookie 或任何密钥。

### 9. 自托管 Node.js（可选）

任何支持 Node.js 20.9+ 的服务器都可以运行完整 Next.js 功能：

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run start
```

自托管环境同样需要设置七个服务端环境变量，并由反向代理提供 HTTPS。不要使用 Next.js static export；本站依赖 Server Actions、Route Handlers、Cookie、Supabase 和 DeepSeek 服务端调用。

### 10. 更新、备份与容量管理

- 拉取新代码前先备份 `.env.local`、`.local/invite-codes.json` 和 Supabase 数据库；这些文件不在 Git 中。
- 新迁移按文件名顺序逐份执行，只执行尚未应用的文件。
- `USER_STORAGE_LIMIT_BYTES` 是应用侧软配额，不等于 Supabase 物理数据库用量。
- 用户可在 `/mis-datos` 清空答题记录或删除材料。Supabase 已暂停或只读时，需要先在控制台恢复项目。
- DeepSeek 余额和调用费用由部署者承担；应定期检查余额和官方价格。
- 修改 `.env.local`、Next.js 配置或依赖后重启本地开发服务器；Vercel 环境变量变化后重新部署。

## 常见故障

| 现象 | 常见原因 | 处理 |
|---|---|---|
| 登录后立即退出 | `INVITE_SESSION_SECRET` 缺失/过短、私有邀请码注册表未加载、邀请码已停用、Cookie 来自旧密钥 | 检查本机 `.local/invite-users.json` 或生产 `INVITE_USERS_JSON`，确认会话密钥至少 32 字符，重启/重新部署后登录 |
| Supabase 功能返回 503 | URL 或 secret key 未配置，项目暂停 | 检查服务端变量和 Supabase 项目状态 |
| SQL Editor 在 `Get-Content` 附近报语法错 | 把 PowerShell 命令粘进了 SQL Editor | 在 PowerShell 运行 `Get-Content ... | Set-Clipboard`，SQL Editor 只粘贴剪贴板中的 SQL |
| 数据表 already exists | 重复执行迁移 | 停止重复执行，确认现有 schema 后只运行新迁移 |
| DeepSeek 返回 401 | Key 无效、已撤销或粘贴有空格 | 在平台创建新 Key，更新服务端变量并重启/重新部署 |
| DeepSeek 返回 402 | 平台账户余额不足 | 由服务器 Key 所属账号前往官方充值页充值 |
| 页面返回 429 | 达到当前用户限流 | 等待窗口结束；扩大用户量前实现共享限流 |
| AI 功能返回 502/504 | 提供方失败、超时或响应结构不合格 | 查看不含敏感正文的服务端日志，稍后重试并核对当前模型名 |
| 材料生成返回 507 | 用户达到应用软配额 | 前往 `/mis-datos` 清理答题记录或材料 |
| Vercel 改变量后仍使用旧值 | 环境变量不追溯到已有部署 | Redeploy 或创建新部署 |

更详细的 Windows 说明见：

- [Supabase 与邀请码指南](haiknow-doc/docs/supabase-setup.md)
- [DeepSeek 接入指南](haiknow-doc/docs/deepseek-setup.md)
- [测试体系与报告](haiknow-doc/docs/test-system-and-report.md)

## 质量检查

提交前运行：

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

当前基线为 22 个测试文件、125 项测试。真实 Supabase/DeepSeek 验收依赖部署者自己的外部项目和付费额度，不属于默认单元测试。

## 内容来源与许可

课程组织参考 Instituto Cervantes 的课程框架，但不复制商业教材正文。站内全文优先使用公版作品、Creative Commons 材料或明确允许再利用的内容。

第三方原文、翻译和衍生学习加工不能被仓库的软件许可证统一覆盖：

- 每篇材料的作者、来源、许可、节选/完整状态和改动记录见 [内容来源台账](haiknow-doc/docs/content-sources.md)；
- `content/corpus-manifest.json` 保存原文路径、来源链接、权利说明、规范 LF 字节数和 SHA-256；`.gitattributes` 固定原文换行，避免 Windows CRLF 改变清单校验结果；
- CC BY-SA 材料及其衍生加工继续适用对应 ShareAlike 条款；
- Project Gutenberg 文本只确认美国公版，部署者应按服务地区再次核验；
- OpenStax、UNESCO、欧盟、Global Voices、African Storybook 和 INTEF 的归属与限制必须保留；
- OpenStax 页面另有未经许可不得将教材用于训练大语言模型或纳入大语言模型/生成式 AI 产品的说明；3 篇 OpenStax 材料现已在阅读页关闭可点击单词，并由服务端在调用 DeepSeek 前再次拦截；页面显示中文概述并链接 OpenStax 原始说明；
- 用户上传内容和 AI 生成内容不会自动进入公开材料库。

参考：[Instituto Cervantes 课程规划](https://cvc.cervantes.es/ENSENANZA/biblioteca_ele/plan_curricular/default.htm)、[Creative Commons 许可证](https://creativecommons.org/share-your-work/cclicenses/)、[Project Gutenberg 西语读物](https://www.gutenberg.org/ebooks/subject/4582)。

## 开源发布门禁

把 GitHub 仓库设为 Public 之前必须完成：

- [x] 项目所有者选择 MIT 软件许可证并添加根目录 `LICENSE`；
- [x] 在 README 和 `NOTICE.md` 中明确软件许可与第三方学习内容许可相互独立；
- [x] 将公开上游的 `src/config/invite-users.json` 重置为空注册表；本机哈希与明文只在 Git 忽略的 `.local/`，生产哈希通过加密 `INVITE_USERS_JSON` 注入；
- [x] 扫描当前非私有文件、全部可达提交、远端分支及首轮 GitHub Actions 日志；未发现真实密钥、`.env.local`、邀请码明文或用户数据，首轮 CI 已通过；
- [x] 项目所有者确认现有提交作者姓名与邮箱可以公开，无需重写作者历史；
- [x] 检查 24 篇材料的逐篇归属、ShareAlike、Project Gutenberg 地域边界和 OpenStax 指定归属，并保留逐篇台账；
- [x] 关闭 3 篇 OpenStax 材料的 DeepSeek 能力，并在页面显示、链接 OpenStax 原始说明；
- [x] 添加 `SECURITY.md`，说明安全漏洞的私下报告方式，避免研究者把漏洞或凭据发到公开 Issue；
- [x] 添加 `CONTRIBUTING.md`，要求新增阅读材料提供来源和许可证据；
- [x] 添加不需要生产密钥的 Windows GitHub Actions CI，自动运行测试、类型检查、Lint 和生产构建；
- [ ] 完成第二个真实邀请码的交叉数据隔离验收；
- [x] 运行测试、类型检查、Lint、生产依赖审计和生产构建；
- [ ] 仓库所有者检查 GitHub **Settings → Danger Zone → Change repository visibility** 的影响，并单独确认公开操作。

MIT 只覆盖仓库中的软件代码与未另行声明的原创项目文档；第三方学习内容继续适用其各自许可与说明。具体边界见 [NOTICE.md](NOTICE.md) 和 [内容来源台账](haiknow-doc/docs/content-sources.md)。

## 当前边界与路线图

当前仍未完成：

- 第二个真实邀请码的跨用户数据隔离验收；
- 学习计划编辑、独立写作记录和进度详情页；
- 个性化材料导出；
- 内容管理后台；
- 分布式限流、管理员用量统计和成本告警；
- Vercel 或其他生产环境的首次部署；
- 第二用户隔离验收与首次生产部署。

项目名称、品牌、域名、预算、数据部署地区、是否扩展到 C1–C2 等仍由项目所有者决定，不应由接手的 Codex 自行假设。

## 项目知识入口

项目文档按主题从 [haiknow-doc/docs/index-by-topic.md](haiknow-doc/docs/index-by-topic.md) 进入。部署时以本 README 的完整流程为入口，再按 Supabase、DeepSeek、测试和内容来源专题文档深入。

## 官方参考

- [Next.js 安装与 Node.js 要求](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js 部署方式](https://nextjs.org/docs/app/getting-started/deploying)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [DeepSeek 第一次 API 调用](https://api-docs.deepseek.com/)
- [DeepSeek Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)
- [DeepSeek 模型与价格](https://api-docs.deepseek.com/quick_start/pricing/)
- [DeepSeek 错误码](https://api-docs.deepseek.com/quick_start/error_codes/)
- [Vercel Git 部署](https://vercel.com/docs/git)
- [Vercel 环境变量](https://vercel.com/docs/environment-variables)
- [GitHub 仓库可见性](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [GitHub 添加开源许可证](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)
