# 检索日志（search-log）

- 日期：2026-11-02（北京时间，21:13–21:30）；执行者：recon-agent。
- 平台：内置 web_search（多查询合并）+ web_fetch（页面/CDN/GitHub API）。
- 环境限制（影响取证方式，如实记录）：
  - raw.githubusercontent.com 被网络策略阻断（"web fetch failed: TypeError: fetch failed"）→ 改用 GitHub API（api.github.com/repos/&lt;repo&gt;）取仓库官方描述与星数；
  - cdn.jsdelivr.net 对 gh 文件返回 302 重定向至 raw.githubusercontent，同样不可用；
  - github.com 仓库主页 HTML 可通（提取 og:description）；export.arxiv.org 可通；api.github.com 可通；zhiding.cn 可通（GBK 编码乱码，仅标题可用）。
- 取舍原则：宁缺毋滥——每个入选矩阵的系统至少有一条可引 URL；仅有二手转述的标 ⚠️。

## 批次记录

| 批次 | 关键词（合并为一组查询） | 平台 | 结果概况 | 取舍 |
|---|---|---|---|---|
| A | AutoGen microsoft multi-agent framework / CrewAI roles tasks / LangGraph orchestration / MetaGPT SOP | web_search | 噪声大（命中 PyPI 镜像与二手列表），仅 microsoft/autogen 可用 | 转用 GitHub API 逐仓核验（批次 R1/R2） |
| B | ChatDev OpenBMB / CAMEL role-playing / Magentic-One / OpenAI Swarm | web_search | ChatDev ACL 论文、Magentic→微软 Agent Framework"Magentic 编排"文档、Swarm 镜像包 | 采纳 ACL 与 MS Learn 链接；Swarm 转批次 R2 核验 |
| C | Agent2Agent A2A protocol / Model Context Protocol / Agent Network Protocol ANP did:wba / Agora protocol | web_search | a2aproject/a2a、MCP 官方与 Anthropic 公告、ANP 的 npm 适配器与 W3C CG 线索、PyPI agora-protocol | A2A/MCP 采纳；ANP 转细节批；Agora ⚠️定位未核实 |
| D | ruvnet claude-flow / claude-swarm tmux / The Hive claude code / deepseek-harness | web_search | claude-flow 线索散落；cj-vana/claude-swarm；tt-a1i/hive 与 sreekar2403/hive；DSH 官网页+社区镜像 | 全部转 GitHub API 核验（批次 R1） |
| E | AgentScope distributed RPC / agentUniverse / AverNet 蚂蚁 / coze-studio | web_search | AgentScope 中文分布式教程、agentUniverse 仓库、**AverNet 开源媒体双源**、Coze 官方公告 | 全采纳；AverNet 列重点 |
| F | Letta shared memory blocks / Mem0 / Zep / IoA | web_search | Letta 官方 shared-memory 文档、mem0、graphzep（Zep 系）、IoA 论文 | 采纳；IoA 仓库转 R2 |
| G | john-palmer claude-swarm / munder-difflin hive / deepseek harness repo / claude-squad | web_search | munder-difflin 实为 HarnessMD 医学文档项目（agent-memory-atlas 收录）；DSH 社区镜像 batata-wqx；claude-squad 官方仓库 | "munder-difflin/the-hive" 判定不存在，矩阵记 ⚠️；claude-squad 采纳 |
| H | personal agent fleet / agents across multiple computers / agent inbox outbox / agent governance handbook | web_search | **microsoft/agent-governance-toolkit**、**kiloloop/oacp inbox_outbox**、**mcp-agent-mail（PyPI 镜像）**、leonkoellerwirth-arch/agentic-ai-governance-toolkit | 四项全部成为对抗审查核心候选 |
| I | OpenHands / AutoGPT platform / SuperAGI / XAgent | web_search | OpenHands（OpenHands/OpenHands）、AutoGPT 平台版、XAgent、SuperAGI 仅 topic 页 | 前三采纳；SuperAGI 标 ⚠️ |
| J | generative agents Stanford / Project Sid / ai-town / agent society | web_search | Project Sid arXiv 2411.00114、a16z-infra、AgentScope ACL 2025 论文、llm-ant-farm | 采纳三项入矩阵；llm-ant-farm 未深查 |
| K | OpenClaw / AgentOS buildermethods / BeeAI / vibe-kanban | web_search | openclaw/openclaw、agentos.to、i-am-bee/beeai-framework、BloopAI/vibe-kanban | 采纳；AgentOS 的 GitHub 仓库地址未核实 |
| L | Ormica / getzep zep / weizinglyu IoA / 框架文档站 | web_search | PyPI ormica（自组织 agent 殖民地协调层）、zep-cloud、openbmb.github.io/IoA | 采纳；IoA 仓库定 OpenBMB/IoA |
| M（细节） | AverNet github / claude-flow hive-mind 拓扑 / mcp-agent-mail / ANP did:wba | web_search | **inclusionAI/Avernet**、ruflo 内 swarm 拓扑包、mcp_agent_mail 仓库名（下划线）、ANP did:wba 规范与 W3C Adoption Tracker | 关键修正：claude-flow→ruflo；agent-mail 仓库名定位成功 |
| N（API 核验 R1+R2） | 24 个仓库逐一 api.github.com | web_fetch | 星数+官方描述全部固化（AG2 5.0k、CrewAI 60k、LangGraph 44k、MetaGPT 71k、CAMEL 18k、ChatDev 34k、AgentScope 35k、IoA 838、OpenHands 92k、Letta 25k、OpenClaw 393k、swarm 22k、AgentVerse 5.2k、coze-studio 21.8k、zep 5.0k、ruflo 80.6k、oacp 15、cj-swarm 117、hive 582、ANP 1463、ms-gov 6.5k、lw-gov 1 等） | 全部入矩阵；buildermethods/AgentOS 404 ⚠️ |
| O（反例核验） | OpenMOSS / AverNet / ai-night-shift / covey / arXiv 2610.10468 / 2610.16120 / claude-agent-teams 文档 | web_fetch+web_search | AverNet og 描述"…like an organization"固化；ai-night-shift 定位；两篇 arXiv 摘要到手；**Claude Code 官方 Agent Teams 文档 code.claude.com/docs/en/agent-teams 确认**；OpenMOSS/covey 页面 fetch 失败 | AverNet 列头号复查对象；CC Agent Teams 入矩阵第 31 行 |
| P（值守专题） | agent on-call / cron wake agent / 智能体 值守 定时唤醒 | web_search | run-kit cron 文档、entia.systems"AI on-call"文章、ai-night-shift、covey 调度 spec | 佐证⑦维度"概念存在、组合未见"；无成体系开源同构 |
| Q（学术专题） | persistent agent organization / shared substrate cross machine arxiv | web_search | 2610.10468、2610.16120、Moltbook Agent Society（2602.02613）等 | 前两篇入矩阵；Moltbook 未深查（模拟社会类，判定同 Project Sid） |

## 失败与未决清单（如实）

1. raw.githubusercontent.com / cdn.jsdelivr.net 阻断 → AverNet README 全文、ruflo README、mcp-agent-mail README 原文未取得；相应矩阵单元格标 ⚠️。（补：2026-11-02 复审时改经云端服务器走 api.github.com 成功取得 AverNet README 并核验，矩阵第 23 行/出处注/盲区声明/反方审查/主张阶梯已同步更新；ruflo、mcp-agent-mail 仍为间接证据。）
2. "The Hive(munder-difflin)"：按任务书名号检索无果，判定该归属不存在；以 tt-a1i/hive + cj-vana/claude-swarm 替代覆盖"swarm/hive 家族"。
3. john-palmer/claude-swarm（传闻中的 tmux+共享 markdown 经典帖）：未定位原始出处，未入矩阵。
4. OpenMOSS（uluckyXH）：仓库页两次 fetch 失败，仅有搜索结果标题，矩阵标 ⚠️。
5. Agora（pypi agora-protocol）、agt-team（pypi）、SuperAGI、AgentOS（buildermethods）、DSH 官方开源仓库地址：定位模糊或未核实，均标 ⚠️。
6. zhiding.cn AverNet 报道为 GBK 乱码：仅用标题；正文未取。

## 检索覆盖度自评

- 强覆盖：主流编排框架、Claude/DSH 生态工具、协议类（A2A/MCP/ANP）、记忆系统、治理工具、2025-2026 学术"agent 组织/基底"路线、中文大厂开源（AverNet/agentUniverse/AgentScope/Coze）。
- 弱覆盖：非中英社区、付费墙论文全文、Telegram/Discord/论坛级讨论、未打星个人仓库。上述盲区已写入 novelty-matrix.md 末节与 claim-ladder.md 风险清单。
