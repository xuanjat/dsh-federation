# 对抗性反方审查（adversarial-review）

立场：假设"存在与 murmuration 完全相同的公开方案"，按六个类别系统性找反例。引文均来自仓库官方描述/论文摘要（短引，注明出处）；裁决用语：**非同构**（差异成立）或 **⚠️覆盖某维度**（我方相应主张需让步）。检索窗口 2026-11-02，详见 [search-log.md](search-log.md)。

## 类别①：个人多机 agent 组织（fleet/federation/farm/ranch）

**候选 1：claude-swarm 家族（cj-vana/claude-swarm，⭐117）**
- 官方描述："MCP server for orchestrating parallel Claude Code worker swarms with protocol-based behavioral governance"（topics 含 tmux）。
- 差异：tmux 编排=单机多窗；无跨机拓扑、无常设组织、无手册治理、无交付完整性、无值守节律。
- 裁决：**非同构**。⚠️它覆盖了④角色蜂群与⑤"行为治理"的字面（但其"治理"指 worker 行为协议，非组织运行手册）。另注：任务书所指 john-palmer/claude-swarm 经典帖本轮未能定位原始出处，⚠️未核实；cj-vana 为已核验的同名实现。

**候选 2：claude-squad（smtg-ai）与 vibe-kanban（BloopAI）**
- claude-squad："Manage multiple AI terminal agents like Claude Code, Codex…"——tmux+git worktrees 并行任务管理，单机。
- vibe-kanban：看板驱动多个 coding agent，本机服务器形态。
- 裁决：**非同构**。⚠️覆盖④（并行分工）与③的弱形态（任务看板跨会话），但均为单机。

**候选 3：OpenClaw（openclaw/openclaw，⭐393,706）**
- 官方描述："The AI that really does things. Any OS. Any Platform."——个人助理常驻网关（原 Clawdbot），单机守护进程+多消息渠道。
- 差异：单机常驻个人助理；非多机组织；无手册治理/交付协议/错峰值守；守护进程监听 ≠ turn-driven 值守。
- 裁决：**非同构**。⚠️覆盖③长期性（个人 agent 常驻）的最强近邻。

**候选 4：ai-night-shift（JudyaiLab）**
- 官方描述："Multi-agent autonomous framework — let your AI work while you sleep 🌙"。
- 差异：夜间批次自动化；"人不在时工作"与值守同向，但非"常设多机组织的定时唤醒轮值"，细节未核实。
- 裁决：**非同构**。⚠️覆盖⑦的最接近公开近邻（连同 covey 的 lifecycle-scheduling spec、run-kit 的 cron 唤醒文档、业界"AI on-call"讨论），我方对⑦的表述应保持"组合内要素"而非"概念独有"。

**类别裁决：未发现"跨异构机的常设个人 agent 组织"公开实践。**

## 类别②：邮箱 + 黑板类（inbox/outbox、共享记忆）

**候选 1：mcp-agent-mail（Dicklesworthstone/mcp_agent_mail）**
- 描述：给 agent 配邮件式收件箱做异步通信（SQLite 存储，PyPI 镜像存在）。
- 差异：单机工具、通信原语层面；无跨机联邦、无治理、无交付完整性、无常设组织。
- 裁决：**非同构**。⚠️覆盖②的"共享收件箱数据库"与 room/inbox 协议的形似（我方 room 协议的差异化在：跨机 append-only + mid 规范 + data 指针 + 岗位游标）。

**候选 2：OACP（kiloloop/oacp，⭐15，oacp.dev）**
- 官方描述："Coordinate AI agents with human-in-the-loop control — YAML-based protocol, no server, any runtime"；含 inbox_outbox 协议文档。
- 差异：单机 YAML 协调协议，HITL 为卖点；无跨机组织、治理手册、交付协议、值守。
- 裁决：**非同构**。⚠️覆盖⑧（HITL 协议化）与②的文件协议形似。

**候选 3：Letta 共享记忆块（letta-ai/letta，⭐25,320；docs.letta.com shared-memory）**
- 差异：多 agent 共享 memory blocks 属单服务器能力组件；非跨机联邦底座，无组织治理/交付/值守。
- 裁决：**非同构**。⚠️覆盖②"共享记忆作协作底座"的组件级实现（Mem0/Zep 同理）。

**候选 4：IoA（OpenBMB/IoA，⭐838；arXiv 2407.07061）**
- 描述："enabling diverse, distributed agents to team up"——互联网式异构 agent 组网协作。
- 差异：按任务组队（非常设组织）；消息客户端-服务器底座；无治理手册/交付完整性/值守。
- 裁决：**非同构**。⚠️覆盖①（跨机组网）。

**类别裁决：黑板/收件箱协作模式公开存在（多为单机组件或按任务协议）；"共享上下文数据库为多机常设组织唯一底座+room 协议"未见公开同构。**

## 类别③：治理框架（handbook/red lines/incident-driven）

**候选 1：microsoft/agent-governance-toolkit（⭐6,506）**
- 官方描述："AI Agent Governance Toolkit — Policy enforcement, zero-trust identity, execution sandboxing, and reliability e[valuation]"；docs 含 incident-response-workflow。
- 差异：组织级合规工具箱（策略/沙箱/审计），治理对象是"企业内 agent 部署"；非跨机协作组织的运行手册，无版本化主编制度/ack 追踪/催办。
- 裁决：**非同构**。⚠️覆盖⑤的强形式（政策执行+事故响应工作流）与⑨（合规边界）——我方⑤主张应限定为"版本化运行手册+事故驱动演化"的具体机制，而非"治理"一词本身。

**候选 2：agentic-ai-governance-toolkit（leonkoellerwirth-arch，⭐1）**
- 描述："Practical governance artifacts for AI agents in regulated organizations — lifecycle models, risk scoring, EU AI Act"。
- 裁决：**非同构**（合规工件集，非协作运行治理）。

**候选 3：学术制度设计（arXiv 2610.10468 "A Society of Researchers"）**
- 摘要主张："populations [of research agents] will acquire an organization whether or not its designers provide one, so designers should provide it explicitly"。
- 裁决：**非同构**（论文级主张，与本项目"组织需要显式治理"的直觉同向，可引为理念佐证而非反例）。⚠️概念上覆盖⑤③。

**类别裁决：治理工具/论文存在，但"版本化手册 v1→v2.x + 主编 + ack + 48h 催办 + 事故驱动红线演化"作为公开运行机制未见同构。**

## 类别④：中文社区（多智能体协作房间/共享记忆/治理手册）

- 检索"多智能体 协作 房间 共享记忆 治理手册/智能体 值守 定时唤醒"等词：命中的是框架中文文档（AgentScope 分布式教程、agentUniverse、Coze Studio 开源公告、AverNet 媒体报道）与 CSDN 泛教程，**未发现"房间协议+共享记忆库+治理手册"的中文开源实践**。
- 最接近：AverNet（见类别⑥）与 AgentScope（分布式教程完备但属框架能力）。
- 裁决：**未发现同构**；中文社区对"值守/on-call for AI agents"的讨论亦未见成体系开源物。

## 类别⑤：DSH / Claude Code 生态社区插件与编排

**候选 1：ruflo（原 claude-flow，ruvnet，⭐80,597）**
- 官方描述："The original agent harness. Deploy intelligent multi-player swarms, coordinate autonomous workflows"；swarm 包含 hierarchical/mesh coordinator 拓扑；历史版本含 SQLite/Neo4j 记忆与行为协议。
- 差异：单机 swarm 编排为主；无跨机联邦、无手册治理、无 sha256 交付纪律、无常设值守节律。
- 裁决：**非同构**。⚠️覆盖④⑤（蜂群角色+行为治理）的字面；生态体量远大于本项目——对外必须承认其存在并做维度对比，不可回避。

**候选 2：Claude Code Agent Teams（官方，code.claude.com/docs/en/agent-teams）与 subagents**
- 描述："Orchestrate teams of Claude Code sessions"——官方多会话团队（lead/teammate、共享任务板），单机。
- 裁决：**非同构**（单机）。⚠️与 DSH 内置 Agent Teams 同构度最高；本项目定位必须写成"单机团队机制的跨机联邦补充"，否则会被官方功能覆盖。

**候选 3：The Hive 家族**
- 任务书名号 "The Hive(munder-difflin)" 未找到对应仓库（munder-difflin 是另一医学文档项目的组织名，⚠️未核实）；已核验同类：tt-a1i/hive（⭐582，浏览器 hive-mind 编排 CLI coding agents）。
- 裁决：**非同构**（单机 UI 编排）。

**类别裁决：生态内最接近组合 = ruflo + cj-vana/claude-swarm + CC Agent Teams；三者合计仍缺 ①跨机个人联邦 ③常设 ⑤手册治理 ⑥交付完整性 ⑦turn-driven 值守。**

## 类别⑥（附加）：大型平台与学术"组织/基底"路线

**候选 1：AverNet（蚂蚁 inclusionAI，2026-08 开源，媒体称"让人与智能体像组织一样高效协作"）**
- 仓库描述："Distributed agent coordination platform where agents live, connect, coordinate, execute, and evolve together — like an organization."
- 这是全检索中**定位重合度最高**的项目：分布式+组织隐喻+大厂开源。
- **2026-11-02 复核**（经云端服务器走 GitHub API 读取 README）：AverNet 是**平台基础设施**路线——trusted core（Identity/Auth=Available，Permissions=Partial，Security=Planned，Audit=In progress）、执行设施（异构运行时/容器/集群）、协调网络（发现/关系/组队/路由），蚂蚁 12 BG 生产（自述 90%+ 任务完成率）；治理=权限/审计**组件**，非版本化运行手册；未见 sha256 交付指针协议与 turn-driven 值守节律；协作底座是**协调网络**而非共享上下文数据库；另 2026-09 提供 DeepSeek Harness channel 插件（DSH bots 以 manager-worker 任务工具加入）。
- 裁决：**判定非同构，但仍是头号近邻**。对外策略：README 主动对标 AverNet 并写明差异（"平台基础设施 vs 零基础设施方法框架；协调网络 vs 共享上下文数据库"）；若其后续公开手册治理/交付纪律/值守方法，主张降档到 L3/L4。

**候选 2：Substrate-Centric Coordination（arXiv 2610.16120）**
- 摘要：主张多智能体扩展性问题源于 agent-centric 设计，应转向"以协调基底为中心"。
- 裁决：**非同构**（理念论文）。⚠️理念上与"共享上下文数据库为底座"同向——可引用以说明设计选择有学术呼应，同时说明本项目是该理念的一个小规模真实实现。

**候选 3：Project Sid（arXiv 2411.00114）**
- 千级 agent 文明模拟，涌现治理（宗教/法律）。
- 裁决：**非同构**（模拟社会，非真实工作组织）。⚠️覆盖③⑤的模拟形态与⑩的规模实证。

## 分类裁决总表

| 类别 | 最接近候选 | 覆盖了我方哪些维度 | 是否构成完整同构 | 我方让步 |
|---|---|---|---|---|
| ①个人多机组织 | OpenClaw / claude-swarm 家族 / ai-night-shift | ③长期性（单机）、④蜂群、⑦夜间值守雏形 | 否 | ⑦不宣称概念独有，只作为组合要素 |
| ②邮箱+黑板 | mcp-agent-mail / OACP / Letta / IoA | ②共享收件箱·记忆·文件协议的组件级实现、①（IoA）、⑧（OACP） | 否 | ②主张限定为"多机常设组织唯一底座+room 协议"的组合 |
| ③治理框架 | microsoft/agent-governance-toolkit / 学术论文 | ⑤政策执行与事故响应、⑨合规边界 | 否 | ⑤主张限定为"版本化手册+主编+ack+催办+事故演化"机制 |
| ④中文社区 | AverNet（同⑥）/ AgentScope | ①分布式框架能力 | 否 | — |
| ⑤DSH/CC 生态 | ruflo / CC Agent Teams | ④角色、⑤行为治理（字面）、单机团队 | 否 | README 主动并列对比，定位"跨机联邦补充" |
| ⑥平台/学术 | AverNet / arXiv 2610.16120 / Project Sid | ①③⑤（理念/平台级）、⑩规模实证 | 否（AverNet 待复查） | AverNet 列为头号复查对象，主张维持 L2 限定措辞 |

## 总结论

1. **未找到完整同构的公开方案**；六个类别均只覆盖部分维度，且相互分散在不同项目。
2. 我方最硬的三块：⑥交付完整性协议（sha256+通道纪律，本轮最空维度）、⑤版本化手册治理机制、⑦turn-driven 值守节律；最不硬的：①跨机（多项目具备）、⑧HITL（OACP 卖点）。
3. 头号风险=AverNet：定位重合度高但关键维度未核实——**发布前必须复查一次其 README/文档**，并保持 L2 的"据检索（2026-11）+未发现完整同构"措辞，任何时候不升格为"唯一/首创"。
4. 对抗审查本身应随仓库开源：欢迎社区提交反例 issue，先改矩阵、再定是否降档——这既是诚实，也是这个项目"治理先行"风格的自我示范。
