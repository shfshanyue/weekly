# 开发者 AI 周刊 #66 预筛清单

- 期号：#66（文件 `src/content/blog/weekly-66.md`，**未写**）。仓库与线上最新已发布是 #65（`weekly-65.md`，pubDate 2026-11-06）。
- pubDate：默认 **2026-11-13**（周五，Asia/Singapore）
- 素材窗口：约 **2026-11-06 ～ 2026-11-12**；来源：TLDR AI 每日刊（11-06、11-09～11-11）、HN 本周热帖、官方 changelog（Claude Code / GitHub / Vercel / Cursor）、阮一峰周刊 #418、各厂商博客原文
- 合计 **34** 条：AI 开发者 **27** 条（**79%**），其他 **7** 条（非 AI 开发 4 条，AI 非开发向 3 条）
- 标记：【AI】= AI 开发者主题；【其他·非 AI】/【其他·AI 非开发向】= 其余
- 链接核对：全部用 `curl -L` 跟随重定向核对，结果见文末「链接核对」。
- 去重：#62 卷首已讲过「决策模型」（OpenAI Decisions API、Jev 等），本期 Gemini Decisions API 与 Amazon 用 Strands Decider 替换 Sonnet 只作为**新进展**收短卡，不再当卷首。#65 已收的 Fireworks Nexus/Forge 不再收，本期只收其**安全事件波及 Notion** 的后续。
- 通用 GitHub 工具：**modern-web-guidance**、**Stroq** 两个（AWS Emulator 为 AWS 官方产品，不计配额）。

## 卷首候选

1. **Agent 写代码，工程师写「能放心砸的环境」。** AWS 发布 [AWS Emulator](https://github.com/aws/aws-emulator)，Werner Vogels 博客里 Swami 讲了它怎么来的：给 Agent 一份「服务该怎么表现」的描述，再给它真服务做对照，按 fidelity tests（从公开 API 模型推出的端到端客户场景）让 Agent 自己搭出本地版 AWS 服务。同一周 Vercel Sandbox 快照中位耗时从 4.4s 降到 0.4s，Firenook 把 Firebase 模拟器写入提速约 40 倍；反面例子是 Claroc 测到 35,578 个 Grok 生成的应用对任何人公开。论点：Agent 写得比人审得快，瓶颈从「写」挪到「能不能便宜、安全地验」；保留意见：模拟器保真度总有缺口，最后一公里仍要真环境回归。（推荐）
2. **Agent 记忆要靠「睡后整理」，不是越存越多。** Anthropic《The Components of Agent Memory》把记忆拆成「当场记录」和「离线整理（dreaming）」：dreaming 从 2 个会话扩到 128 个，25 道题的得分从 13% 升到 48%；wiki + 搜索组合比只用搜索高（61% vs 53%），但只靠 wiki 生成的简报一开始漏了 28% 的事实。LoreKit 同周呼吁统一 Agent 记忆格式（AGENTS.md、/memories、Copilot 记忆、MCP 知识图谱互不相通）。保留意见：整理本身要花 token，记错的东西会被固化。

副标题候选（只写卷首那一件事）：

- `开发者 AI 周刊 #66: AWS Emulator，给 Agent 一个能放心砸的环境`（推荐，对应卷首 1）
- `开发者 AI 周刊 #66: Agent 写代码，工程师造测试环境`（对应卷首 1）
- `开发者 AI 周刊 #66: Agent 记忆要靠睡后整理`（对应卷首 2）

## 本周快讯（13）

1. 【AI】[Claude Fable 5.2 / Mythos 5.2 发布](https://www.anthropic.com/claude-fable-and-mythos-5-2)：同一底座两个版本，Fable 带网安/生物防护面向所有用户；输出比 5.1 快最多 30%，降价到输入 $8 / 输出 $40 每百万 token。落地建议：Claude Code 2.1.321 已把它设为默认 Fable 模型，长任务先比每任务成本再全量切。
2. 【AI】[Gemini 4 Carbon 开放 API](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/)：所有付费开发者可用，首发价与 Gemini 4 Argon 相同（$2 / $10 每百万 token），GitHub Copilot 同日接入。落地建议：做「主力模型 + 便宜子模型」分工的，可把它放进架构设计、审计类角色试。
3. 【AI】[Meta Muse Ember](https://research.meta.ai/blog/muse-ember)：Meta 最小的推理模型，主打工具调用、编码子任务、路由与抽取；已在 Meta Model API 上线，$0.10 / $0.50 每百万 token，自称追平 Claude Haiku 5.5 最佳分时成本约三分之一。落地建议：Agent 里高频的路由/抽取子任务可以拿它跑一轮成本对比。
4. 【AI】[Thinking Machines Inkling 2 Small](https://thinkingmachines.ai/news/inkling-2-small/)：594B 总参 / 17B 激活的 MoE，支持图像输入与可调推理档位。落地建议：关注视觉反馈类 Agent（看截图改 UI）的可用性。
5. 【AI】[Cursor 可直接构建并分享线上应用](https://cursor.com/changelog/build-live-apps)（11-05）：云端 Agent 建应用、配数据库和鉴权、跑安全检查并部署，用链接分享给同事。落地建议：内部小工具可以试，但先确认默认访问范围只在组织内。
6. 【AI】[Cursor 与 Agent 实时语音通话](https://cursor.com/changelog/voice-chat)：在 Agents 窗口、IDE、网页与 iOS 上和 Agent 语音对话、听进度。落地建议：适合离开键盘时追问长任务进度，不适合口述精确代码改动。
7. 【AI】[Claude Code 2.1.321 修多处权限与 MCP OAuth 问题](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)：修复 MCP OAuth 在重定向时把 refresh token 发到别的主机、只读 Bash 命令绕开沙箱不提示等。落地建议：用 MCP OAuth 或沙箱模式的团队尽快升级。
8. 【AI】[GitHub 秘密扫描覆盖 Actions 日志](https://github.blog/changelog/2026-11-09-secret-scanning-detects-secrets-in-github-actions-workflow-logs)：workflow 日志里泄漏的密钥也会被检出。落地建议：Agent 在 CI 里跑命令、爱打印环境变量的仓库，开起来。
9. 【AI】[Fireworks 安全事件波及 Notion](https://www.notion.com/help/security-incident-involving-a-third-party-ai-vendor)：Fireworks 内部凭证 10 月被滥用，Notion 称影响不到 1% 的工作区。落地建议：把推理供应商列进第三方风险清单，确认它们是否留存你的提示词。
10. 【AI】[社区测试：Opus 5.5 推理模式 11-03 后变了](https://threadreaderapp.com/thread/2119192075505893695.html)：有用户对比发现思考过程的样式在 11 月 3 日前后明显不同（HN 800+ 分）。落地建议：依赖某模型行为的流水线，要有固定 eval 集定期回归，别靠体感。
11. 【AI】[Apple 被曝在做本地推理应用 Harbor](https://9to5mac.com/2026/11/10/apple-has-new-mac-app-coming-to-make-running-local-ai-models-easy/)：爆料称它能把一台或多台 Mac 变成私有推理服务器（尚未官宣）。落地建议：用 Mac mini/Studio 跑本地模型的，先观望，等官宣后看是否提供 OpenAI 兼容接口。
12. 【其他·AI 非开发向】[美联航禁止 AI Agent 代订机票](https://www.cbsnews.com/news/united-airlines-bans-ai-agents-booking-flights/)：航司开始在条款层面拒绝 Agent 代用户下单。落地建议：做消费类 Agent 的，把「目标网站条款是否允许」列进上线检查。
13. 【其他·非 AI】[Val Town 宣布关停](https://blog.val.town/winding-down)：停止计费，提供迁移到 Cloudflare / Vercel / Netlify / Render 的指南。落地建议：在 Val Town 上跑定时任务或 webhook 的，按官方时间表尽早迁。

## 技术文章（10）

1. 【AI】[The Components of Agent Memory](https://www.anthropic.com/research/components-of-agent-memory)（Anthropic）：记忆分「当场记录」和「离线整理」；dreaming 从 2 个会话扩到 128 个，得分 13%→48%；wiki + 搜索 61% 对比只用搜索 53%。落地建议：长期运行的 Agent 先加一个空闲时整理日志、写笔记的任务，再考虑上向量库。
2. 【AI】[AWS Emulator 与「Agent 写代码时工程师干什么」](https://www.allthingsdistributed.com/2026/11/aws-emulator-and-the-engineers-job-when-agents-write-the-code.html)（Werner Vogels 博客）：用 fidelity tests + 真服务对照，让 Agent 自己搭出本地版 AWS 服务。落地建议：自家内部服务也可以照这个思路，让 Agent 按规格+对照测试生成 mock。
3. 【AI】[Amazon 用 Strands Decider 替换 Sonnet 4.6 打工单标签](https://strandsagents.com/blog/amazon-saves-millions-replacing-sonnet-with-strands-decider/)：20 类标签，成本降 98%，平均每次调用 4,215ms→897ms，每单 token 6,724→2,010。落地建议：固定选项的分类任务，拿现有标注集对比一次决策模型（#62 讲过这个品类，这是生产数据）。
4. 【AI】[JS 框架的 AI 成本](https://nolanlawson.com/2026/10/28/the-ai-cost-of-javascript-frameworks/)（Nolan Lawson，阮刊 #418 转载）：让 Claude Code 用不同框架完成同一任务，比费用、耗时和 token；Hono+htmx、Astro、Nuxt 靠前，Angular 垫底。落地建议：新项目选型时，可以把「Agent 写起来贵不贵」当成一个维度，但样本只有一个任务。
5. 【AI】[3.5 万个 Grok 生成的应用对任何人公开](https://blog.claroc.io/ghostshares-grok-build-apps)（Claroc）：测试 37,571 个在线应用，35,578 个（94.7%）无需登录即可打开，其中有员工内部资料。落地建议：做「一句话生成并发布应用」的产品，默认访问权限必须是私有。
6. 【AI】[ChatGPT 跟进调用被静默路由到另一个连接器](https://community.openai.com/t/security-follow-up-tool-call-silently-routed-to-a-different-connector/1413053)（OpenAI 开发者社区）：开了两个连接器时，带一次性确认码的跟进调用走了另一个连接器，用户不知情。落地建议：做 Apps SDK 连接器的，确认码要绑定连接器身份，不要只认码。
7. 【AI】[Glasswing 七个月：发现多、修复少](https://www.vulncheck.com/blog/anthropic-glasswing-november-update)（VulnCheck）：Anthropic 报出 37,966 个问题，公开 7,349 个，标记修复仅 217 个；归因 CVE 442 个，在野利用 2 个。落地建议：开源维护者用 AI 扫漏洞时先定分诊流程，别让报告量压垮修复。
8. 【AI】[Agent 信任框架：身份、信誉、问责](https://blog.cloudflare.com/trusted-agent-delegation)（Cloudflare）：Agent 代人上网时，网站失去识别、服务、追责用户的能力，需要新的委托机制。落地建议：做面向 Agent 开放的网站，先想清楚怎么区分「哪个用户委托的哪个 Agent」。
9. 【AI】[Agent 记忆需要它的 OpenTelemetry 时刻](https://www.lorekit.io/blog/open-agent-memory-format)（LoreKit）：AGENTS.md、/memories、Copilot 记忆、MCP 知识图谱四种格式互不相通，呼吁开放格式。落地建议：团队先约定一个仓库内的记忆位置（如 AGENTS.md），避免同一条经验散落多处。
10. 【其他·AI 非开发向】[AI 让代码库变脆](https://evanxmerz.com/post/ai-usage-generates-a-fragile-codebase/)（Evan X. Merz）：前 Meta 工程师称 90% 代码由 AI 生成，但产出没翻倍，重度依赖者的代码问题更隐蔽。落地建议：把 AI 生成代码的 review 标准写成清单，别只看测试是否通过（观点文，可删）。

## 工具推荐（11）

1. 【AI】[Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)：Gemini Decision 1 一次前向打分，端到端 150–250ms，单次最多 1,000 个是非/选择/评分问题，支持多模态和 16K 上下文，不收输出 token。落地建议：已用 OpenAI Decisions API 的可以并跑对比校准度。
2. 【AI】[OpenRouter 新 Auto / Auto Code 路由](https://openrouter.ai/blog/announcements/auto-and-auto-code-routers/)：重写的路由比旧版最高好 4 倍，p90 路由快 3 倍；beta 中无效工具调用降到四分之一。落地建议：用同一 eval 集比较固定模型和 Auto Code 的每任务成本。
3. 【AI】[Antigravity /swarm](https://antigravity.google/docs/swarm/)：协调者把任务拆给多个具名 worker，在共享消息板上协作，再由 verifier 审查测试；预览版，Pro/Ultra 可用，配额消耗快。落地建议：只给能按文件或包干净拆开的任务用。
4. 【AI】[GitHub Next Ace](https://ace.githubnext.com/)：在本地和队友、Agent 一起写代码；每个工作单元是一个独立 worktree 分支（lane），团队边界由 Tailscale 网络决定。落地建议：多人多 Agent 并行改同一仓库的团队可以试，先在小仓库验证。
5. 【AI】[Devin Review 2.0](https://devin.ai/blog/devin-review-2)：每个 PR 审查成本比 8 月降 82%，通常 $0.25–$0.75。落地建议：PR 量大、人工 review 成瓶颈的团队，可以按 PR 成本算一笔账。
6. 【AI】[ExecuTorch WebGPU](https://pytorch.org/blog/executorch-webgpu-pytorch-models-on-the-gpu-in-the-browser/)：PyTorch 模型导出成 .pte 直接在浏览器 GPU 上跑，比 Wasm 路径 prefill 快 4–7 倍、decode 快 2–10 倍（M1 Pro 上测）。落地建议：要在前端本地跑 Whisper、小 LLM 的，可以对比 transformers.js。
7. 【AI】[AWS Emulator](https://github.com/aws/aws-emulator)：本地模拟 AWS API，不需要 AWS 账号，可用于本地和 CI。落地建议：让编码 Agent 在 CI 里对它跑集成测试，少碰真账号。
8. 【AI】[Vercel Sandbox 快照提速 10 倍](https://vercel.com/changelog/vercel-sandbox-snapshot-creation-is-now-up-to-10x-faster)：中位快照时间 4.4s→0.4s，恢复 p50 500ms→250ms。落地建议：Agent 需要频繁回滚环境的，可以多打快照。
9. 【AI】[Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance)（Chrome 团队）：给编码 Agent 的 skills，带浏览器兼容数据，帮 Agent 不写过时的 JS 写法；支持 Claude / Codex / Cursor / Gemini 等插件格式。落地建议：前端仓库装上，看看 Agent 改完的代码是否少用 polyfill 和旧 API。（通用 GH 工具 1/2）
10. 【AI】[Stroq](https://github.com/AGGIB/Stroq)：扫描 Claude Code / Codex / Cursor 会话记录里的已知密钥，并用本地 hook 把危险命令追溯到触发它的内容；开源无遥测。落地建议：跑过很多 Agent 会话的机器先扫一遍历史。（通用 GH 工具 2/2）
11. 【其他·非 AI】[Firenook](https://firenook.dev/)：Firebase 本地模拟器的替代品，保留 firebase.json 和 SDK；写入中位 5.1ms 对 208.2ms，峰值内存 2.11 GiB 对 22.57 GiB。落地建议：CI 里 Firebase 模拟器慢的项目可以直接换。

备选（未计入 34）：【AI】[Gemini 健康版 Agent](https://cloud.google.com/blog/products/ai-machine-learning/gemini-for-healthcare)；【AI】[Vercel Workflow SDK 改用 WebSocket 写入](https://vercel.com/changelog/workflow-writes-now-use-websockets-on-vercel)；【其他·AI 非开发向】[Claude Sheets / Whiteboards / Data](https://claude.com/resources/articles/sheets-whiteboards-data)；【其他·非 AI】[Tim Peters 逝世](https://discuss.python.org/t/in-memoriam-tim-peters-1952-2026/110028)；【其他·非 AI】[Rune：Rust GPU 渲染 UI 框架](https://github.com/anomalyco/rune)。

## 来源备注（跳过 / 失败）

- **TLDR AI** 11-12 当日刊抓取时尚未出刊；11-07、11-08 为周末无刊。
- **Latent Space AINews**、**AI 开发者日报**：页面抓不到条目列表（同上期），本轮未引用。
- **JavaScript Weekly** `issues/latest` 返回 404，本轮未用。
- **Vercel changelog RSS** 为空，改从 changelog 页面取链接。
- 融资估值（OpenAI $11B、Anthropic IPO 路演）、Nvidia CEO 新闻按规则排除。

## 链接核对

- 2026-11-12 15:40（Asia/Singapore）用 `curl -L` 核对清单内全部 39 个链接，均返回 200，无需改写为跳转后地址。

## 待你决定

1. 保留 / 删除哪些（快讯、文章、工具各标号即可；备选要不要升正选）
2. 卷首选 **1**（AWS Emulator / 能放心砸的环境）还是 **2**（Agent 记忆睡后整理）
3. 标题选哪个（或自拟）
4. 发布日默认 **2026-11-13（周五）**，除非另说
