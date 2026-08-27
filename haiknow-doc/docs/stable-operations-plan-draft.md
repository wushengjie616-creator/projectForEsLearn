# 平台稳定运行与增长计划（待审批草案）

> 状态：待项目所有者审批。由于当前 HAiKnow runtime 缺少 `new-document.md` 与 plan schema，本文件暂作为项目普通 Markdown 设计草案，不冒充已冻结的正式 P。批准后再转换为正式计划与实施任务。

## 1. 目标与边界

目标是在不超过 10 位用户的当前容量下，让平台具备可恢复、可验证、可持续扩充的生产运行能力：

- 用户能可靠使用管理员生成的个人邀请码登录和退出；
- 每位用户的草稿和完成状态只对本人可见；
- 邀请码状态、应用错误、数据库状态和部署结果可观察；
- 新材料必须经过许可审核、去重、教学加工、自动检查和人工复核后才能发布；
- 学习者可点击任意西语单词，通过受保护的 DeepSeek 服务端接口在原文旁查看中文释义、词元、词性和语法/语境提示；
- 学习者可提交自己的西语短文，或输入想法/选择平台主题让 AI 先写西语短文，再选择目标等级和学习重点，获得与本站阅读材料一致且可长期复看的读写讲解；
- 发生错误时能够回退代码、恢复数据，并知道由谁处理。

当前不把以下事项纳入首轮：听说训练、无限规模用户、完整 CMS、对 AI 释义正确率作绝对承诺、整篇或批量运行时 AI 翻译、原生移动应用和复杂微服务。

## 2. 已核实的项目基线

| 状态 | 事实 | 影响 |
| --- | --- | --- |
| confirmed | Next.js 16.3.3、项目内邀请码哈希注册表、签名 HttpOnly Cookie、登录/退出 action 和 PowerShell 生成工具存在 | 不收集邮箱，不依赖 Supabase Auth 或 SMTP；首个邀请码明文只保存在 Git 忽略的本地文件 |
| confirmed | `reading_progress` 迁移以邀请码用户 UUID 与篇目为主键，浏览器角色无表权限，服务端查询显式限定用户 ID | 服务端 secret key 会绕过 RLS，因此仍必须在真实项目执行双邀请码隔离测试 |
| confirmed | 24 篇材料以纯文本、静态 TypeScript、来源台账与 SHA-256 清单保存 | 小规模下 Git 即内容事实源，暂不引入 CMS |
| confirmed | 本地测试、类型检查、Lint、构建和 HTTP 烟雾验证可运行 | 可直接作为 CI 基础 |
| drifted | 当前应用文件已进入 Git 暂存区，但 HEAD 仍只含 `.haiknow.yml`，且仓库没有 remote | 首次提交前必须先完成密钥、许可和第三方内容审计，再形成可审阅基线并连接私有远端 |
| confirmed | 本地环境已配置远端 Supabase URL/server-only secret key，并执行 `reading_progress` 迁移 | 2026-08-27 已通过 CRUD、邀请码登录、保存草稿保留完成态、保存 action、远端回读、旧版本冲突拒绝、测试清理和原记录恢复；双邀请码交叉隔离仍待验证 |
| unknown | 域名、Vercel 项目、DNS、监控和预算 | 生产部署尚无稳定落点；SMTP 已退出范围 |
| confirmed | 账号采用每人一个可重复使用的个人邀请码，不使用邮箱 | 登录页只接受邀请码；邀请码失效通过注册表 `active` 状态控制 |
| confirmed | 任意单词点击、DeepSeek 服务端代理、Git 忽略的 `.env.local` 持久密钥配置、可选 PowerShell 临时密钥启动器、鉴权/限流/超时/结构校验代码与自动化测试存在 | 项目所有者选择在本机明文保存 Key；2026-08-27 已通过真实邀请码会话和真实提供方调用验证点词返回 200，生产密钥仍必须改用 Vercel 加密环境变量 |
| confirmed | `/crear-material`、AI 文章草稿、个性化生成接口、TXT/文本输入、外部处理确认、显式关闭思考模式、按用户持久化、复看、客观练习、答题历史与清理代码存在 | 原有材料/练习链路已在 2026-08-27 完成真实验收；AI 文章采用预览后再转换的两阶段流程，自动化测试已通过，仍待真实提供方调用验收 |
| confirmed | 开源许可组合为原创代码 MIT、原创普通文档 CC BY 4.0、第三方与衍生学习材料逐篇继承许可 | 创建正式许可文件前仍需项目所有者给出版权持有人署名 |
| unknown | 隐私政策、数据保留与删号规则 | 会改变账号管理、数据导出和删除流程 |

## 3. 推荐架构与关键选择

### 3.1 账号模式

已确认采用“个人邀请码账号”：管理员用项目 PowerShell 工具生成不超过 10 个可重复使用的邀请码，网站不收集邮箱，不提供密码或找回密码。每个邀请码固定映射一个随机 UUID，因此可以跨设备恢复同一份学习进度。

邀请码本质上是单因素长期凭据：任何持有者都能访问对应进度。明文只保存在 Git 忽略的 `.local/invite-codes.json`；仓库注册表只保存 SHA-256。泄露时先停用旧身份，再生成新邀请码；当前不自动迁移旧进度。

### 3.2 邀请码与数据访问闭环

认证不再使用 Supabase Auth。应用自行验证高熵邀请码并签发 30 天 HMAC 签名 HttpOnly Cookie；每次请求都重新检查注册表中的启用状态。Supabase 只负责 PostgreSQL 持久化。

认证数据流：

```text
PowerShell 生成 96 位随机邀请码
  -> 明文写入 Git 忽略文件，SHA-256 + UUID 写入注册表
  -> /login 服务端做定时安全哈希匹配
  -> 签发 HttpOnly + SameSite=Lax Cookie
  -> 每次请求验证签名、过期时间和 active 状态
  -> 服务端 secret client 只按该 UUID 读写 reading_progress
```

应用代码已实现：

- 邀请码格式规范化、SHA-256 匹配、停用检查和统一失败提示；
- 防篡改、到期失效的签名会话 Cookie；
- 登录页只保留邀请码输入，不存在邮箱、密码或恢复入口；
- DeepSeek 点词/生成接口与进度读写统一使用邀请码会话用户 ID；
- Supabase secret client 仅存在于服务端模块，浏览器角色没有数据表权限。

外部配置与后续完善：

- 为 Local、Preview、Production 分别生成不同的 `INVITE_SESSION_SECRET`；
- 配置 Supabase `SUPABASE_SECRET_KEY`，并用两个邀请码验证服务端查询没有串号；
- 增加邀请码轮换并保留原用户 UUID的管理工具；
- 定义邀请码用户删除、进度导出和数据保留规则。

官方实施依据：

- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [服务端 secret client](https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa)
- [Supabase RLS 与 bypass 规则](https://supabase.com/docs/guides/database/postgres/row-level-security)

### 3.3 点词释义

已按项目所有者新增要求采用“人工重点词汇 + DeepSeek 任意单词释义”的混合方案。人工词表继续作为离线、可审核的稳定支架；AI 负责扩大原文点击覆盖率，但不替代人工内容：

```ts
type GlossaryEntry = {
  id: string;
  lemma: string;
  forms: string[];
  partOfSpeech: string;
  meaningZh: string;
  meaningEn?: string;
  note?: string;
};
```

- Unicode 切词层保持原文字符逐字一致，每个拉丁字母词渲染为原生按钮，鼠标、触屏和键盘均可操作；
- 卡片显示词元、词性、中文义、可选英文提示和本句用法，并明确标识 AI 结果可能有误；
- 浏览器只向本站发送被点单词和最多 600 字符的当前段落上下文；API Key 只存在服务端；
- 接口要求有效邀请码会话，通过每用户每分钟 20 次进程内限流、15 秒超时和严格 JSON 字段校验控制滥用与异常；
- 点词释义显式关闭 DeepSeek 思考模式，使 320 个输出 token 用于最终 JSON，避免简单任务的思考过程耗尽输出额度；
- 同页缓存相同“单词 + 上下文”结果；当前不持久化 AI 请求或结果；
- 本地默认从 Git 忽略的 `.env.local` 读取持久 Key，也保留 `npm.cmd run dev:deepseek` 临时输入模式；Vercel 使用加密服务端环境变量；
- 原文字符串继续保持原样，标注层不得改写、西语纠错或破坏来源一致性测试。

保留风险：AI 释义会带来成本、延迟、服务中断与幻觉。DeepSeek 不可用、Key 缺失或用户未登录时，原文、中文学习译文和人工重点词汇必须继续可用。进程内限流在 Vercel 多实例间不共享；用户规模扩大前需换成共享限流与集中用量告警。

首版验收：24 篇原文字符保持一致；非 OpenStax 材料中识别出的西语词可点击，三篇 OpenStax 材料按来源原始说明关闭 DeepSeek；带重音词与连字符词切分测试通过；键盘和移动端可用；未登录、无 Key、超限、超时和提供方异常均安全失败；人工重点词汇在无网络时仍可显示。

个性化材料生成复用同一安全边界，但采用独立的较低限额（每用户每 10 分钟 5 次）和 45 秒超时，并显式关闭思考模式，让 2600 个输出 token 用于最终 JSON。输入为 50–6000 字符、最多 12 段，用户必须明确确认外部处理。用户还可以输入 3–1000 字符的想法或选择 6 个服务端固定主题之一，先生成 A1–B2 西语文章草稿；草稿不入库，用户确认转换后才进行第二次 DeepSeek 调用并保存。输出沿用本站教学结构：等级与难度、逐段中译/语言提示、5–12 个词条、1–5 个语法点、2–5 道理解题、写作任务和 3–6 个学习步骤；逐段讲解数量必须与输入一致。原文与生成结果按邀请码用户保存为不可变快照，不进入公共材料库；练习固定为 4 道选择题和 4 道短填空，答案键仅在服务端，批改采用忽略大小写与重音符号的字符串比较。每用户默认 10 MiB 软配额，可清空答题记录或删除材料并级联释放空间。所有 DeepSeek 调用统一识别官方 HTTP 402，在页面提示平台账户管理员充值并链接官方充值页。2026-08-27 已用真实邀请码会话验证原有材料、复看、练习、批改、记录与清理链路；AI 文章两阶段流程已完成自动化测试，仍待真实调用。

### 3.4 材料持续扩充

在 100–200 篇以前继续采用“Git + 原文文件 + TypeScript 数据 + manifest”，避免为 10 位用户提前承担 CMS 和数据库内容迁移成本。发布流水线固定为：

```text
candidate
  -> rights-reviewed
  -> raw-saved + SHA-256
  -> teaching-material-drafted
  -> source-text-matched
  -> vocabulary/difficulty-reviewed
  -> tests-passed
  -> published
```

每篇发布门槛：

- 仅公版、CC0、CC BY、CC BY-SA 或明确书面授权；许可不明即停止；
- 保存稳定来源 URL、作者/译者、发布日期/版本、检索日期、许可依据和排除的第三方素材；
- 原文 UTF-8 文本、规范化 URL 与 SHA-256 去重，总容量不超过清单上限；
- 学习页西语段落能在所存原文中逐字或经声明的规范化规则匹配；
- 有中文学习译文、独立定级依据、至少 10 个结构化词条、理解题和写作任务；
- CC BY-SA/IGO 的归属、同方式共享与衍生声明在详情页保留；
- `content-audit.ps1`、测试、类型检查、Lint 和生产构建全部通过。

建议扩充节奏为每月 2–4 篇，按 A1/A2 缺口优先，而不是按文件体积追求数量。每季度复核死链、许可页变更、难度分布和词表质量。

### 3.5 部署、监控和恢复

继续采用 Vercel + Supabase：

- Git 远端作为代码和内容协作入口；PR 必须通过 `npm.cmd test`、typecheck、Lint、build 和内容审计；
- Vercel 分 Local、Preview、Production；Preview 不得写入生产 Supabase，使用独立测试项目或禁用数据写入；
- 正式域名只指向通过门禁的 Production deployment；环境变量分别配置；
- 使用 Vercel Logs/Observability 观察部署、函数错误和延迟，再接一个外部 HTTPS 可用性监控；
- 增加不泄露密钥的 `/api/health`，检查应用版本、配置存在性和轻量数据库连通性；
- 错误日志不得记录明文邀请码、Supabase secret key、完整 Cookie 或草稿正文；
- Supabase Security Advisor、Performance Advisor、浏览器角色撤权和服务端双邀请码隔离测试纳入发布检查；
- 付费 Supabase 项目使用其每日备份；Free 项目必须另做定期 `pg_dump` 离线备份。季度执行一次恢复演练，不能只证明“备份存在”；
- 每月安排依赖更新窗口，每季度做许可/死链/恢复/账号清理复核。

建议的初始服务目标（需所有者批准）：月可用性 99.5%，恢复时间目标 RTO 4 小时，数据恢复点目标 RPO 24 小时。对当前 10 人阶段不建议购买昂贵的秒级 PITR。

官方运行依据：

- [Supabase 生产检查清单](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Supabase 数据库备份](https://supabase.com/docs/guides/platform/backups)
- [Supabase 数据库测试](https://supabase.com/docs/guides/database/testing)
- [Vercel 部署环境](https://vercel.com/docs/deployments/overview)
- [Vercel Observability](https://vercel.com/docs/observability)

### 3.6 私有起步与未来开源

已确认先使用 GitHub 私有仓库，未来条件成熟后转为公开。仓库从第一次应用提交起就按公开标准维护，不能把“当前私有”当作提交凭据或用户数据的理由。

开源准备分为四条边界：

1. **提交历史可公开**：`.env*`、`.local/` 明文邀请码、Supabase secret key、访问 token、学习草稿、数据库备份和生产日志永不进入 Git；首次提交与转公开前分别执行历史级密钥扫描。GitHub 把私有仓库转公开后，代码、活动及 Actions 历史/日志会对外可见，因此只检查当前工作树不够。
2. **代码与内容分许可**：根许可证只覆盖本站原创程序代码；`content/raw/`、中文译文、练习和其他学习加工按逐篇来源、公版状态或 CC 条款处理。CC BY-SA 改编必须保留署名、许可链接、改动说明和同方式共享，不能被软件许可证重新覆盖。
3. **贡献治理先准备后启用**：公开前提供 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`、`SUPPORT.md`、Issue/PR 模板、第三方内容说明和内容贡献许可检查表；安全漏洞通过私下渠道报告，不要求公开 Issue 披露。
4. **公开门禁**：依赖与许可证审计、所有历史密钥扫描、内容来源抽查、Actions 日志审查、README 安装复现、全量 CI、生产配置隔离全部通过后，才允许切换 visibility。公开后启用 Dependabot、secret scanning、push protection 和 CodeQL，并重新建立适用的 branch ruleset。

推荐许可证组合（等待所有者确认）：

- 本站原创程序代码：MIT，简短、宽松，便于学习者和贡献者复用；
- 本站原创普通文档：CC BY 4.0；
- 每篇第三方原文及其改编：继续遵守 `content/corpus-manifest.json`、原文头和来源台账记录的独立许可；需要 ShareAlike 的学习加工继续使用对应 BY-SA/IGO 许可；
- 项目名称、Logo 和域名不自动随代码许可开放，未来另写商标/品牌说明。

真实替代方案是给程序代码使用 AGPL-3.0：它要求通过网络提供修改版服务时向用户提供对应源代码，更能保证托管改进回流，但会提高企业采用和贡献门槛。当前以学习、协作和传播为优先，因此推荐 MIT；如果所有者更重视“任何托管修改也必须开源”，则选择 AGPL-3.0。

依据：

- [GitHub：更改仓库可见性的后果](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [GitHub：健康开源贡献项目文件](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [GitHub：仓库安全快速入门](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository)
- [MIT License 说明](https://choosealicense.com/licenses/mit/)
- [GNU AGPLv3 说明](https://choosealicense.com/licenses/agpl-3.0/)
- [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## 4. 分阶段实施顺序

| 阶段 | 交付结果 | 依赖 | 预计工作量 |
| --- | --- | --- | --- |
| M0 所有者决策与基线 | 账号模式、代码许可、域名、预算、数据规则确定；完成密钥/许可审计后将暂存内容形成首个可审阅基线，并连接 GitHub 私有远端 | 所有者输入 | 0.5–1 天 |
| M1 生产基础设施 | Supabase 生产/测试项目、迁移、server-only secret key、Vercel、域名、DNS 和环境隔离完成 | M0、外部账号 | 1–2 天 |
| M2 邀请码闭环（单邀请码已验收） | 生成、哈希注册、登录、签名会话、停用检查、退出、服务端用户 ID、远端保存与恢复已验证；仍待双邀请码交叉隔离验收 | M1 | 0.5 天双用户验收 |
| M3 点词释义 MVP（单邀请码已验收） | DeepSeek 服务端代理、任意单词切分/按钮、释义卡片、PowerShell 临时 Key、输入输出保护、回归测试与真实调用均已完成 | M0、邀请码、DeepSeek Key | 生产部署后复验 |
| M3b 个性化材料与客观练习（原有链路已验收） | TXT/文本输入、AI 按想法/主题写文章、预览后转换、等级/重点选择、结构化生成、按用户复看、选择/短填空练习、确定性批改、长期答题记录、主动清理及 402 充值提示均已实现；新增 AI 文章仍待真实调用，整体仍随 M2 等待双用户隔离验收 | M0、邀请码、DeepSeek Key、Supabase 两份迁移 | 0.5 天真实文章 + 双用户验收 |
| M4 内容发布流水线 | PowerShell 内容审计、候选状态、发布清单、CI gate 和维护节奏落地 | M0 | 1–2 天 |
| M5 上线与运维 | 健康检查、监控告警、备份、恢复演练、故障手册、上线验收完成 | M1–M4 | 1–2 天 |

单人顺序执行的粗略估计是 7–12 个工作日，不包含域名 DNS 或外部服务等待时间。M3 与 M1/M2 在设计冻结后可独立推进，但上线前必须在 M5 汇合验证。

## 5. 验收矩阵

| 能力 | 必须证明的证据 |
| --- | --- |
| 邀请码认证 | 正确代码建立 HttpOnly 会话；错误、篡改、过期和停用状态均失败；明文不进入 Git 或日志 |
| 用户隔离 | 两个真实邀请码只看到各自 `reading_progress`；浏览器角色不能直接访问表；本人操作成功 |
| 点词释义 | 非 OpenStax 材料中识别出的西语词可点击且原文未变；三篇 OpenStax 材料前后端均禁用 DeepSeek 并显示原始说明；登录、Key、限流、超时与错误边界可验证；真实调用返回词元、词性、中英义与语法说明；键盘和触屏可用 |
| 个性化材料 | 未确认外部处理时不发送；输入与生成结构边界可验证；AI 文章先预览且转换前不入库；转换后真实 A1/A2/B1/B2 样本均生成与段落一一对应的完整读写材料，并可在下次登录复看、出题和删除 |
| 内容发布 | 新增一篇样例材料从候选走完许可、哈希、教学加工、测试和发布全链路 |
| 部署 | Preview 与 Production 环境隔离；CI 失败不能进入生产；自定义 HTTPS 域名可访问 |
| 监控 | 人为触发受控测试错误后能在日志/告警中定位，且不泄露敏感内容 |
| 恢复 | 从备份恢复到独立测试环境，抽查用户进度与行数一致，记录实际 RTO/RPO |

## 6. 失败与回退策略

- 邀请码泄露：立即把对应注册表记录设为 `active: false` 并重启，再生成新身份；当前旧进度迁移需人工处理；
- 认证代码异常：回退到前一 Vercel deployment；保留 `.local/` 管理副本和哈希注册表，不删除用户进度；
- DeepSeek、Key 或 AI 释义代码异常：保留纯原文、中文学习译文和右侧人工重点词汇，明确显示查询失败，不影响阅读与进度保存；
- 个性化生成失败：保留用户输入供其重试，不显示半成品，不把失败请求或结果写入数据库；
- 新材料许可存疑：立即从发布数据移除但保留内部审计记录，不删除既有来源证据；
- Supabase 故障：阅读材料仍可匿名访问，进度保存明确提示失败，不伪装成功；
- 数据损坏：停止写入、保留现场、按恢复手册恢复到测试项目验证后再切换。

## 7. 需要项目所有者解决或拍板的事项

| 优先级 | 事项 | 推荐默认值 | 你需要做什么 |
| --- | --- | --- | --- |
| 已决定 | 账号开放方式 | 每人一个可重复使用的个人邀请码 | 已实现；明文与本机哈希注册表存在 Git 忽略文件，公开仓库仅存空模板，生产哈希注册表通过加密环境变量注入 |
| 已决定 | Git 远端与未来公开 | GitHub 私有仓库起步，按 public-ready 维护 | 已由项目所有者确认；仍需创建/指定空仓库，并另行授权连接和首次推送 |
| 已决定 | 开源许可证组合 | 软件与未另行声明的原创项目文档 MIT；第三方与衍生内容逐篇继承许可 | 已由项目所有者确认并创建 `LICENSE`、`NOTICE.md`；版权标识使用现有公开 Git 作者姓名 |
| P0 | DeepSeek 账户与成本 | 由项目所有者持有 Key；本地临时输入，生产使用 Vercel 加密变量 | 创建 API Key 并控制账户余额；不要把真实 Key 提供到仓库、前端变量或聊天中 |
| P0 | 正式域名 | 购买一个独立域名 | 确认域名；后续你需要在 DNS 控制台添加 Vercel 所需记录 |
| P0 | Supabase | 生产项目 + 独立测试项目 | 创建项目；把 URL 与 `sb_secret_...` 分别放入本地和 Vercel 服务端环境变量，绝不提交或发送到聊天 |
| P0 | 预算 | 若要求持续在线，优先 Supabase 付费层；Vercel 按项目用途选计划 | 给出可接受的月预算和项目是否商业使用 |
| P1 | 数据规则 | 草稿保留至删号；删号级联删除 | 确认隐私政策、数据保留期、是否允许用户导出/删除账号 |
| 已决定 | 个性化材料历史 | 转换后的原文与学习材料按邀请码用户保存，允许查看和删除；AI 文章草稿在转换前不保存 | 导出、保留期与删号联动规则仍待确认 |
| P1 | 服务目标 | 99.5% / RTO 4h / RPO 24h | 接受或修改这三个目标，它们会影响付费备份和告警方案 |
| P2 | 材料路线 | 优先补 A1/A2，每月 2–4 篇 | 确认近期主题、等级和地区变体优先级 |
| 已决定 | 点词覆盖 | 人工重点词汇作稳定支架；非 OpenStax 材料的任意单词由 DeepSeek 提供带风险标识的上下文释义 | OpenStax 三篇已按原始说明禁用；其余材料上线前需用真实账号抽查准确率、延迟和费用 |

## 8. 批准边界与第一步

批准本草案只授权把它转换为正式计划并拆任务，不自动授权购买服务、创建外部账号、配置 DNS、推送仓库、切换公开可见性或生产部署。账号方式已经冻结为项目内个人邀请码，不使用邮箱；仓库方式已经冻结为 GitHub 私有起步并为未来公开做准备，许可证组合与 DeepSeek 任意单词释义方向也已确认；创建正式许可证文件仍需版权持有人署名。
