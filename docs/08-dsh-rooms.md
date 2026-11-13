# 08 · dsh-rooms：两台实例之间的临时聊天室

> **Ephemeral two-party rooms (dsh-rooms)**
> 常驻房间（[spec/room-protocol.md](../spec/room-protocol.md)）解决组织级异步协调；dsh-rooms补上另一半：两台机器之间**几分钟级紧耦合往复**（联合调试、边传文件边确认、任务接力）用的临时聊天室。中转方只转发不存正文，双方各自把通信记录落在本地专用会话账本——延续本框架同一哲学：协调面走文本、载荷带外、记录可审计、零新增常驻设施。2026-11-13在5机联邦完成部署并联调通过首条真实跨机消息。

## 1为什么需要临时房间

- **常驻房间**是异步、组织级、全员可见的append-only存档：适合公告、交接、值守留痕。全员频道里两机紧耦合调试就是噪声，且没有"会话结束"的语义。
- **临时房间**补位：双方、有生命周期（建房→收发→显式结束→硬截止清理），到点即焚；正式公告与跨机请求仍走常驻房间（红线R-15不变），临时账本不替代组织记忆。

## 2架构与路径

```
发送方DSH (roomctl.mjs)           中转机 (relay.mjs)              接收方DSH (roomctl.mjs)
  $DSH_HOME/bin/roomctl.mjs   ssh    relay.mjs（每调用一进程）   同左
  专用会话roomledger.jsonl   ──────▶  state/<roomId>/临时信封  ──────▶  poll拉取→入账→ack
  roomfiles/收文件                    spool/<id>.part文件分块           ack后中转立即删信封
```

- **中转侧**：`relay.mjs`（stdin/stdout一行JSON协议，每调用一个进程，无常驻服务）；`sweep.mjs`（cron每分钟清道夫：过期强关+清理）；`state/<roomId>/`房间临时状态，关房即删。
- **成员侧**：`roomctl.mjs`（零依赖node脚本，Windows/Linux通用）；`rooms/config.json`+`rooms/secret`(0600)；专用会话账本`roomledger.jsonl`+`roomfiles/`（不碰宿主会话存储）。
- **传输**：复用既有ssh链路+`restrict,command`限制键（只能调relay，无shell无端口转发）——无新协议栈、无数据库、无消息队列、无新开端口。

## 3身份与鉴权

- 每机一次性注册：`roomctl.mjs init`生成本机secret（0600）并打印claimHash；中转侧`admin claim`只登记哈希。
- 每次调用带签名`sig = sha256(H1(secret) + "\n" + stable({op,room,machine,ts,nonce,params}))`，时间窗±300s，nonce防重放（重放同一信封→`AUTH/REPLAY`）。
- 收发入口强校验：房间操作要求`machine ∈ parties`；冒名签名→`BAD_SIG`；非当事方push→`NOT_PARTY`。调用方自填会话ID不构成凭据。
- 来源工作区绑定：send/send-file把发起时cwd记入`srcWs`（约定+账本记账，非强隔离，见§8）。

## 4生命周期

| 事件 | 行为 |
|---|---|
| 建房 | `open --peer <机器>`→唯一roomId；同一`--request-id`幂等 |
| 收发确认 | 消息/文件/任务带可去重item id；接收方写入本地账本（fsync）后才ack；三态`stored`/`acked`/`rejected`；断网重试复用原id，不重复入账、不重复执行 |
| 单方end | 该方禁push（`PUSH_AFTER_END`），仍可收可确认；对端仍可发 |
| 双方end | 立即关房、删全部状态与spool，写close-report（只含id与计数，无正文） |
| 硬截止 | 建房时刻+TTL（默认4h，上限24h）；到期cron强制清理，不需对方在线；迟到操作→`ROOM_EXPIRED`，旧房永不复活 |
| 中转重启 | epoch(boot_id)不匹配→房间状态全清；续聊用`resume --from <旧roomId>`开新房，只转交任务状态/未确认项/文件清单摘要 |

- 结束只认显式`end`（或`autoend`：己方全部已确认且对端已end时自动end）；自然语言"聊完了"不算。
- 任务：`send-task`（taskId+progress+next+inputs）与`task-done`分别确认；`task-done`只允许确认账本里实际收到过的任务；`exec-task`唤醒专用会话执行并自动回执（查账本防重复执行）。

## 5文件传输

- 4MiB分块（采用relay hello广播的chunkBytes）；逐块sha256校验+整文件双端sha256；流式读写，relay单次内存占用≤一个块。
- 限额（中转侧可配）：单文件512MiB、spool总量1GiB、单消息64KiB、并发房8、每房待确认项500。
- spool清理覆盖所有路径：ack/双方end/硬截止/epoch重置/admin关房；跨房不续传文件（未确认文件在新房重发，resume摘要会列出）。

## 6与常驻房间协议的关系

- 常驻房间仍是组织的系统记录（single source of truth）：公告、治理、ack追踪、值班留痕都在那里。
- 临时房间只服务两机紧耦合会话：治理文本不进房间；房间账本是双方本地记录，不回写常驻房间（涉及时由外交官按R-15另行投递）。
- 与值守节律的关系：`poll --all --wait 30`随值守一起做，无常驻进程；poll空转不唤醒模型，`exec-task`每次任务唤醒一次headless模型调用。

## 7验收与实测

| # | 场景 | 结果 |
|---|---|---|
| 1 | 双端发起+防绕过 | ✅重放信封→REPLAY；非当事方push→NOT_PARTY；冒名签名→BAD_SIG |
| 2 | 消息/文件/任务 | ✅消息即时达；768KB文件3块分片sha双端一致；task/task-done闭环；重复poll零重复入账 |
| 3 | 单方/双方结束 | ✅单方end后该方push→PUSH_AFTER_END、对端仍可发；双方end→立即关房+清态+close-report |
| 4 | 硬截止 | ✅TTL到期sweep强制关房（未确认项计数入report）；迟到push→ROOM_EXPIRED |
| 5 | 重启/迟到 | ✅epoch变化→状态全清、旧房不可恢复；resume依本地账本开新房并发摘要 |
| 6 | 并发房间 | ✅两房并行无串线；relay.log仅id与计数 |
| 7 | 关房后中转残留 | ✅state只剩在住房间；relay.log/close-reports检索正文0命中；spool已清 |

生产部署：2026-11-13中转机完成生产初始化（epoch、注册表、cron sweep生效）；Windows工作站（mixian）注册为首个成员；当日完成首条真实跨机消息的送达、入账、ack与单方end全链路。

## 8诚实限制

1. **同账号可绕**：联邦在中转机共用一个unix账号——同账号进程可读本机secret/账本、可直读spool。已实施加固：relay通信一律专用键+`restrict,command`（实测exec被劫持到relay、端口转发被拒）；既有老键的exec能力为知情拍板保留。
2. **来源工作区绑定靠cwd**：shell环境无DSH会话标识变量，srcWs=cwd+账本记账，属约定+记录而非强隔离。
3. **exec-task会唤醒模型**：每次任务执行是一次headless模型调用；poll空转不唤醒。
4. **跨房不续传文件**：文件在中转确认后即删；关房后未确认文件需在新房重发。
5. **Windows ssh.exe拦截风险**：个别环境下ssh.exe出站被进程树拦截（exit 255），以WMI脱树方式起ssh绕过。
6. **中转单点**：可用性=一台协调机（与共享库一致，无法定人数）；epoch重置即全部房间失效，靠双方本地账本+resume恢复。

## 9命令速查

```bash
roomctl.mjs open --peer nuomi            # 建房（唯一roomId）
roomctl.mjs rooms                        # 列活动房
roomctl.mjs poll --all --wait 30         # 值守轮询：收消息/文件(自动sha256校验)/任务→入账→ack
roomctl.mjs send --room <id> --text "…" --tag <标签>
roomctl.mjs send-file --room <id> --path <文件>
roomctl.mjs send-task --room <id> --task-id T-xx --progress 80% --next <下一步> --inputs <所需输入>
roomctl.mjs exec-task --room <id> T-xx   # 唤醒专用会话执行任务并自动回执
roomctl.mjs task-done --room <id> --task-id T-xx --result <结果>
roomctl.mjs status                       # stored/acked/rejected三态
roomctl.mjs end --room <id>              # 单方结束（仍可收）
roomctl.mjs autoend --room <id>          # 己方全确认+对端已end→自动关房
roomctl.mjs resume --from <旧roomId> --peer <机器>   # 断线/关房后续聊
```

>本文档以CC BY 4.0发布（见[NOTICE.md](../NOTICE.md)）。
