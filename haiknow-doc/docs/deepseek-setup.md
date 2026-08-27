# Windows DeepSeek 学习功能接入

## 能力与安全边界

阅读页会把每个西语单词渲染为可聚焦按钮。用户点击后，浏览器只向本站 `POST /api/translate-word` 发送被点单词和最多 600 个字符的当前段落上下文；本站服务端再调用 DeepSeek。API Key 永不进入前端代码或浏览器响应。

`/crear-material` 还允许受邀用户粘贴西语短文或选择本地 TXT，并通过 `POST /api/generate-material` 生成符合本站结构的学习材料：难度说明、逐段中译和语言提示、重点词汇、语法观察、阅读理解、写作练习及建议学习步骤。用户可以选择自动/A1–B2 目标等级，以及均衡、词汇、语法或写作重点；成功结果与原文按邀请码用户保存，可从 `/mis-materiales` 再次查看。

同一页面还提供两阶段文章生成：用户输入 3–1000 个字符的想法，或从 6 个服务端固定主题中选择一个，再由 `POST /api/generate-article` 生成 A1–B2 西语短文草稿。草稿不会立即入库；用户检查后点击“转换并保存为学习材料”，才会再次调用 `/api/generate-material`，此后复看、练习、批改和清理全部复用现有链路。文章生成每位用户每 10 分钟最多 5 次，写作要求和主题描述均按不可信数据处理。

保存后的材料可调用 `POST /api/materials/[id]/practice` 生成恰好 4 道选择题和 4 道短填空。DeepSeek 只负责出题和生成服务端答案键；提交到 `POST /api/practice/[id]/attempts` 后不再调用模型，选择题比较选项 ID，填空题将答案转小写、Unicode NFD 分解并去除组合音标、压缩空格后做严格字符串匹配。每次答案、得分和逐题结果都会保存。

接口只允许持有有效邀请码会话的用户使用。当前还包括：

- 单词必须是最长 80 个字符的拉丁字母词，拒绝任意提示文本；
- 每位用户每分钟最多 20 次请求；这是单进程的初级保护，在 Vercel 多实例间不共享；
- 15 秒超时，第三方错误和响应正文不会返回给浏览器；
- 点词释义属于简单结构化任务，请求会显式关闭 DeepSeek 思考模式，让 320 个输出 token 全部用于最终 JSON，避免思考过程耗尽额度后返回空内容；
- 个性化材料生成同样显式关闭思考模式，让 2600 个输出 token 用于最终 JSON；此前默认思考会耗尽额度并留下空 `content`，表现为本站 502；
- DeepSeek 必须返回指定 JSON 字段，服务端再次检查字段和长度；
- 同一页面内相同“单词 + 上下文”的成功结果会复用，不重复计费；
- AI 结果明确标注可能有误，人工编写的重点词汇不依赖 DeepSeek。
- DeepSeek 官方以 HTTP 402 表示账户余额不足；点词、文章、材料和练习四条调用链统一返回 `deepseek_insufficient_balance`，前端显示官方 `https://platform.deepseek.com/top_up` 充值按钮。服务器 Key 属于平台账户；若学习者不是该账户管理员，应联系管理员，而不是给自己的其他 DeepSeek 账户充值。

发送上下文意味着这段西语材料会交给 DeepSeek 处理。不要把用户草稿、邮箱、Cookie 或其他个人信息加入请求。当前代码没有持久保存 AI 释义或请求正文。

个性化生成另有以下边界：

- 短文需为 50–6000 个字符、最多 12 段；本地 TXT 上限为 30 KB；
- 用户必须明确勾选同意把短文发送给 DeepSeek，否则服务端拒绝请求；
- 每位用户每 10 分钟最多生成 5 次，等待上限 45 秒；
- 模型结果必须包含与输入段落数量完全一致的逐段讲解，以及限定数量的词汇、语法点、问题和学习步骤；
- 原文与生成结果保存到仅服务端可访问的 Supabase 表，不会自动进入公开材料库；
- 每位用户默认约 10 MiB 软配额；容量不足时提示前往 `/mis-datos` 清空答题记录或删除材料，删除材料会级联删除其练习与作答；
- 练习生成每位用户每 10 分钟最多 3 次，固定为客观题；答案键不会在提交前返回浏览器，批改不消耗 DeepSeek token。

2026-08-27 已通过真实邀请码会话分别验证点词释义、个性化材料生成与持久化复看、4 道选择题 + 4 道短填空生成、忽略大小写和重音符号的确定性批改、答题记录保存及两种主动清理动作。练习链路曾因真实模型使用大写/下划线题目 ID 而返回 502，现已在保留安全 ASCII 标识约束的前提下兼容并增加回归测试。验证输出只记录 HTTP 状态和结构结果，不记录 Key、邀请码、用户原文、题目或答案；探针数据已全部删除。

## 本地启动（PowerShell）

先按 [Windows 邀请码与 Supabase 接入指南](supabase-setup.md) 使用个人邀请码登录，并执行两份数据库迁移。点词释义不依赖数据库，但个性化材料与练习必须先配置 Supabase。

如需让本机以后启动时自动使用同一个 Key，在项目目录用记事本打开本地环境文件：

```powershell
notepad.exe '.env.local'
```

填写并保存以下两项；不要在 Key 两侧加引号或多余空格：

```dotenv
DEEPSEEK_API_KEY=你的真实 Key
DEEPSEEK_MODEL=deepseek-v4-flash
```

然后安装依赖并启动：

```powershell
npm.cmd install
npm.cmd run dev
```

Next.js 启动时会自动读取 `.env.local`，修改 Key 后需要重启开发服务器。该文件已被 Git 忽略，但内容仍以明文保存在本机；不要把它复制到提交、Issue、云同步目录或聊天记录，也不要把变量改成带 `NEXT_PUBLIC_` 前缀的名称。如果 Key 泄露，应立即在 DeepSeek 控制台撤销并更换。

如果以后只想临时使用而不把 Key 留在磁盘，可改用：

```powershell
npm.cmd run dev:deepseek
```

`scripts/start-with-deepseek.ps1` 会隐藏输入，只在当前进程及其 Next.js 子进程中设置 `DEEPSEEK_API_KEY`，开发服务器退出后在 `finally` 中清除变量并释放明文缓冲区。

默认模型为 `deepseek-v4-flash`。持久配置可直接修改 `.env.local` 中的 `DEEPSEEK_MODEL`；仅需临时覆盖时，可在本次 PowerShell 会话指定服务端模型：

```powershell
$env:DEEPSEEK_MODEL = "deepseek-v4-flash"
npm.cmd run dev:deepseek
Remove-Item Env:\DEEPSEEK_MODEL -ErrorAction SilentlyContinue
```

浏览器访问 `http://localhost:3000`。登录后可进入任意阅读详情页点击西语单词，或打开 `http://localhost:3000/crear-material` 让 AI 先写短文再转换、也可直接转换已有短文；保存后从 `/mis-materiales` 生成练习和重复作答。未登录返回 401；余额不足返回 402 和充值入口；未配置 Key 或数据库返回 503；请求过频返回 429；个人空间不足返回 507 并附带清理入口，均会显示中文提示。

开发服务器运行期间，普通 `.ts`、`.tsx` 和 CSS 修改通常会由 Next.js 自动热更新，不需要手动关闭重启。修改 `.env.local`、安装或升级依赖、修改 Next.js 配置，或者热更新后行为明显未生效时，应按 `Ctrl+C` 停止服务器，再运行 `npm.cmd run dev`。Vercel 环境变量变化需要重新部署。

## Vercel 生产配置

Vercel 没有供应用每次冷启动时交互输入密钥的终端。生产环境需在 Vercel 项目设置中添加服务端加密环境变量：

- `DEEPSEEK_API_KEY`：必需，仅用于 Production；如 Preview 需要测试，应使用独立 Key；
- `DEEPSEEK_MODEL`：可选，未设置时使用 `deepseek-v4-flash`。

变量名不能带 `NEXT_PUBLIC_` 前缀。修改后需重新部署。生产上线前还应在 DeepSeek 账户侧控制余额，并观察 401、402、429、500 和 503 等提供方错误；当前网页不返回提供方响应正文，只有官方定义的 402 会被单独分类为余额不足并提供充值入口，其他提供方故障仍使用不含敏感细节的统一提示。

进程内限流不等于分布式配额。当前不超过 10 位受邀用户时可以作为第一道保护；如果未来扩大用户量，应迁移到共享限流存储，并增加管理员可查看的用量与成本告警。

## 官方依据

- [DeepSeek 模型、Base URL 与价格](https://api-docs.deepseek.com/quick_start/pricing/)
- [DeepSeek Chat Completions API](https://api-docs.deepseek.com/api/create-chat-completion/)
- [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode/)
- [DeepSeek 错误码](https://api-docs.deepseek.com/quick_start/error_codes/)
