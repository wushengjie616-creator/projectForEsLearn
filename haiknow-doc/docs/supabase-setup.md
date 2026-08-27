# Windows 邀请码与 Supabase 接入指南

## 当前状态

应用不再使用邮箱、密码、邮件确认或 Supabase Auth。每位学习者使用一个由本项目 PowerShell 工具生成的个人邀请码：

- 明文邀请码保存在 `.local/invite-codes.json`，哈希、随机用户 UUID、标签和启用状态保存在 `.local/invite-users.json`；整个目录被 Git 忽略；
- 可开源的 `src/config/invite-users.json` 是空注册表模板；生产部署从加密环境变量 `INVITE_USERS_JSON` 读取私有哈希注册表；
- 登录后得到 30 天签名 HttpOnly Cookie；每次读取会话时都会确认该用户仍处于启用状态；
- 学习进度由 Next.js 服务端使用 Supabase secret key 读写，并显式限定会话中的 `user_id`。

新克隆不会包含 `.env.local`、Supabase 凭据或邀请码明文；部署者必须按本文创建自己的 Supabase 项目、执行迁移并生成邀请码。项目维护实例曾于 2026-08-27 通过数据库 CRUD、邀请码登录、阅读进度 Server Action、个性化材料持久化复看、客观练习、确定性批改、答题记录和主动清理验收，但这不替代新部署的独立验收。第二个真实邀请码的交叉数据隔离及 Vercel 等生产部署环境仍需单独配置和验收。

## 1. 查看和生成邀请码

查看本机保存的邀请码：

```powershell
Set-Location '<你的项目克隆目录>'
Get-Content -Raw -Encoding UTF8 -LiteralPath '.\.local\invite-codes.json'
```

为另一位学习者生成独立邀请码：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\scripts\new-invite-code.ps1' -Label '学习者 2'
```

脚本使用加密随机数生成 96 位邀请码，同时更新两个 Git 忽略的私有文件。应用依次读取生产 `INVITE_USERS_JSON`、本机 `.local/invite-users.json` 和仓库空模板；生成或停用邀请码后重启开发服务器。

邀请码相当于密码：不要把 `.local/invite-codes.json`、`.local/invite-users.json` 或生产 `INVITE_USERS_JSON` 加入 Git，也不要把它们放入 README、Issue、日志或聊天。若邀请码泄露，可静默替换全部现有邀请码并维持公开模板为空：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\scripts\new-invite-code.ps1' -Label '管理员' -ReplaceExisting -ResetPublicTemplate -Quiet
```

旧邀请码和已有 Cookie 会立即失效；新明文只保存在 `.local/invite-codes.json`。当前版本不提供旧身份进度自动迁移。重启本地服务，并在生产环境更新 `INVITE_USERS_JSON` 后重新部署。

部署到 Vercel 前，把哈希注册表直接复制到剪贴板并粘贴到加密环境变量 `INVITE_USERS_JSON`，不要把内容发给 Codex：

```powershell
(Get-Content -Raw -Encoding UTF8 -LiteralPath '.\.local\invite-users.json').Trim() | Set-Clipboard
```

粘贴完成后运行 `Set-Clipboard -Value ''`。生产环境变量的变更只对新部署生效。

## 2. 会话密钥

每个新克隆都要在 Git 忽略的 `.env.local` 中设置 `INVITE_SESSION_SECRET`。每个环境需使用独立的至少 32 字符随机值：

```dotenv
INVITE_SESSION_SECRET=每个环境独立生成的高强度随机值
```

更换该值会让所有现有登录会话失效，但不会删除邀请码或学习进度。生产密钥只放在部署平台的加密服务端环境变量中。

## 3. 创建 Supabase 项目并取得服务端凭据

1. 在 [Supabase Dashboard](https://supabase.com/dashboard) 创建项目。
2. 在 Settings → API Keys 创建或复制 `sb_secret_...` secret key。
3. 把 Project URL 和 secret key 写入本机 `.env.local`：

```dotenv
SUPABASE_URL=https://你的项目引用.supabase.co
SUPABASE_SECRET_KEY=sb_secret_你的服务端密钥
```

不要使用 `NEXT_PUBLIC_` 前缀。Supabase secret key 具备完整数据访问能力并绕过 RLS，只能由受信任的 Next.js 服务端使用；本站代码用独立的 `@supabase/supabase-js` 客户端，并关闭 session 持久化、自动刷新和 URL session 检测。

如果项目暂时只有旧式 `service_role` key，优先在 Dashboard 创建新 secret key；当前 Supabase 官方建议新服务端集成使用 `sb_secret_...`。

## 4. 应用数据库迁移

首次配置时依次执行两个迁移文件。阅读进度迁移：

```powershell
Get-Content -Raw -LiteralPath '.\supabase\migrations\202608260001_reading_progress.sql' | Set-Clipboard
```

个性化材料、练习与答题记录迁移：

```powershell
Get-Content -Raw -Encoding UTF8 -LiteralPath '.\supabase\migrations\202608270001_custom_learning_and_practice.sql' | Set-Clipboard
```

每次复制后，都在 Supabase Dashboard 的 SQL Editor 新建查询、粘贴并执行。已执行过第一份迁移时只运行第二份，不要重复运行 `create table`。

两份迁移会：

- 创建以 `(user_id, reading_slug)` 为主键的 `reading_progress`；
- 限制草稿最多 10,000 字符；
- 使用现有 `updated_at` 作为乐观并发版本；服务端条件更新会拒绝旧标签页或旧设备覆盖新进度；
- 开启 RLS，并撤销 `anon`、`authenticated` 浏览器角色的全部表权限；
- 只向服务端 `service_role` 授予所需读写权限。
- 创建 `custom_learning_materials`、`practice_sets` 和 `practice_attempts`；子表使用 `(资源 ID, user_id)` 复合外键，删除材料会级联删除其练习和答题记录；
- 将公开题面与答案键分栏保存，页面在提交前不会取得答案键；
- 保存每行约计字节数，供个人空间统计和 10 MiB 默认软配额使用。

这里的 RLS 不负责区分邀请码用户，因为邀请码不是 Supabase Auth 身份。secret key 会绕过 RLS；真正的用户隔离边界是：服务端先验证签名邀请码会话，再让每个查询和写入使用该会话对应的固定 UUID。任何新增数据库功能都必须保持这个顺序，不能接受浏览器提交的 `user_id`。

默认每个邀请码用户最多使用约 10 MiB 个性化学习空间，可在 `.env.local` 调整纯服务端变量：

```dotenv
USER_STORAGE_LIMIT_BYTES=10485760
```

修改环境变量后需要重启开发服务器。软配额只统计本站三张个性化学习表的内容字节估算，不等同于 Supabase 控制台显示的整个数据库物理占用；它用于提前阻止继续写入。数据库返回容量错误时，网页也会引导用户前往 `/mis-datos` 清空答题记录或删除材料。如果 Supabase 已暂停或进入只读状态，站内删除也可能失败，此时需先在 Supabase 控制台恢复项目或处理容量。

## 5. 启动与验收

配置变更后重启：

```powershell
npm.cmd run dev
```

验收顺序：

1. 打开 `/login`，确认只有邀请码输入框，没有邮箱、密码或找回密码；
2. 使用刚刚生成并保存在 `.local/invite-codes.json` 中的邀请码登录；
3. 打开阅读页，保存草稿并刷新，确认数据仍存在；完成后再次保存草稿，确认不会被暗中取消完成；
4. 生成第二个邀请码并重启，用第二个邀请码登录，确认看不到第一个用户的草稿；
5. 将 `.local/invite-users.json` 中第二个用户的 `active` 改为 `false` 并重启，确认其现有 Cookie 立即失效；
6. 检查 Supabase 表，确认两位用户的数据使用注册表里的不同 UUID；
7. 确认浏览器 bundle、网络请求、日志和 Git 中都没有 `SUPABASE_SECRET_KEY` 或明文邀请码。
8. 生成一份个性化材料，刷新并从 `/mis-materiales` 再次打开；生成练习并提交两次，确认 `/mis-datos` 的材料、题集和记录计数增加；
9. 清空答题记录，确认材料和题集仍存在；删除该材料，确认关联题集与记录一并删除。

项目维护实例的第 1–3、8–9 步及单邀请码阅读进度保存链路曾于 2026-08-27 自动验证，并验证旧版本提交会被拒绝且不会改变远端记录。每个新部署仍须重新验收；第 4–7 步中的第二用户隔离、停用会话和公开前密钥检查完成前，不应声称该部署的多用户与公开发布链路已经生产可用。

开发服务器运行时，可在另一个 PowerShell 窗口重复自动验收。脚本只写入唯一临时记录，并在 `finally` 中清理；测试真实阅读保存 action 前会快照原记录，同时检查保存草稿保留完成态和旧版本冲突保护，结束后恢复原值：

```powershell
npm.cmd run verify:supabase
```

个性化材料与练习链路使用下面的脚本。它会产生两次真实 DeepSeek API 调用；为避免误删真实学习记录，只有当前邀请码用户原本没有答题记录时才会执行“清空全部记录”检查，并在结束或失败时删除自己创建的探针材料：

```powershell
npm.cmd run verify:custom-learning-e2e
```

## 官方依据

- [Supabase API keys 与 secret key 安全边界](https://supabase.com/docs/guides/getting-started/api-keys)
- [服务端使用 secret key 创建独立客户端](https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa)
- [Supabase Row Level Security 与绕过规则](https://supabase.com/docs/guides/database/postgres/row-level-security)
