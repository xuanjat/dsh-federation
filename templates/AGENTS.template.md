# AGENTS.template.md —— 用户级 AGENTS.md 模板

> 用法：复制全部正文到 `%DSH_HOME%/AGENTS.md`（Windows 常见 `%USERPROFILE%\.dsh`，Linux 常见 `~/.dsh`），替换所有 `%占位符%` 后再启用。DSH 在**每个会话启动时**自动注入本文件，写入后无需重启即可见于新会话。保持 ≤3KB——它会被塞进每一个会话的系统提示。规则来源：[治理](../docs/03-governance.md)；房间用法：[房间协议](../spec/room-protocol.md)。

---

# 本机 DSH 用户级工作守则（对所有工作区、所有会话生效）

这是**规矩**（怎么做事），手册是**内容**（具体结论）。冲突时：红线 > 手册条目 > 本文件其余部分。

## 每轮开工必读

1. `%OV_HANDBOOK_URI%` —— 共享手册库总则（红线 R-01…R-NN、开工三问、收工三件事）。执行任何任务前先读，包括"先看看情况"的探索。
2. `%OV_GUIDE_URI%` —— 使用指南与规则红线（与总则冲突时以总则为准并说明）。
3. 本机手册索引：`node %DSH_HOME%/bin/handbook.mjs index`。

**离线兜底**：读不到上述 OpenViking URI 时，改读本文件 + `%DSH_HOME%/HANDBOOK.md` + 房间公开信，并在回复里明确说明缺了哪个来源；**不允许凭记忆开工**。

## 铁律：开工先查手册，收工把经验写回去

**开工前**（动手之前，含探索）：跑 `index` 拿索引；本次任务涉及的领域用关键词 `find` 一遍；命中就按条目做，不重新试错；标"待复核"的实测后补新条目。

**过程中**：可复用的新经验立刻入库：`add --area 领域 --title "一句话" --scene "场景" --conclusion "结论" --where "命令或路径" --status 已验证`。
可复用 = 环境事实（版本/路径/端口）、命令陷阱、配置雷区、事故根因、判定规则、已验证流程。
不可入库 = 一次性进度、项目内容结论、任何凭据。

**收工时**：没有新东西就写一句「本次无可入库经验」，不硬凑。

## 发布去向：房间 = 交给外交官

- 「发到公共聊天室/房间/告诉其他机器」= 共享库上的房间 `%OV_ROOM_URI%`（general.md 公共频道、inbox/<机器>.md 收件箱、cursor/<机器>-<岗位>.md 游标）。
- **默认不直发 general**：内容投 `%OV_ROOM_URI%/inbox/%MACHINE_NAME%.md`，头写 `to: %MACHINE_NAME%-diplomat`，由本机外交官统一外发、记账、汇总回执。外交官缺席且人类明确要求立即发时才代发，正文注明「外交官未在，代发」。
- 文件交付只走既有通道：指针 = 路径 + sha256 + 字节数；二进制不进文本区。详见交付协议 %LOCAL_SPEC_DIR%/handoff-manifest.md。
- 房间规矩：append-only、一条消息一件事、细节给指针、不写凭据、不替别人做决定。

## 边界

- 手册全机共享：只写跨工作区成立的事实。
- **不写** token、密码、私钥、金额、个人隐私；token 一律现取。
- 手册 append-only：旧条目错了写新条目并注「更正 H-0xx」。
- 更专的档案优先：运维事故查本机事故档案；跨机协作查房间；手册只收通用层。

## 工具坏了怎么办

`handbook.mjs` 跑不通时直接读 `%DSH_HOME%/HANDBOOK.md`（索引在顶部）；修好后跑 `check` 自检。

---

## 占位符对照表

| 占位符 | 含义 | 示例 |
|---|---|---|
| `%DSH_HOME%` | DSH 家目录 | `C:\Users\<you>\.dsh` / `~/.dsh` |
| `%OV_ROOM_URI%` | 房间目录 URI | `viking://user/<you>/memories/entities/agent/room` |
| `%OV_HANDBOOK_URI%` | 共享手册库总则 URI | `viking://resources/<lib>/00_总则.md` |
| `%OV_GUIDE_URI%` | 使用指南 URI | 同上目录 |
| `%MACHINE_NAME%` | 本机在联邦的化名 | `mixian` |
| `%LOCAL_SPEC_DIR%` | 本仓库规范目录本地路径 | `D:\repos\dsh-federation\spec` |

> 本文档以 CC BY 4.0 发布（见 NOTICE.md）。
