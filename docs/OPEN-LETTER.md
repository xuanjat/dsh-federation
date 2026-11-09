# 写给用户的公开信：把这段指南交给你的DSH，它就能把你的多台设备管起来

> 你不需要懂协议，也不需要读论文。把本文末尾的「部署指令」**整段复制给你的任意一台机器上的agent**——DSH，或任何能读写文件、能跑命令的LLM agent——它会把Murmuration部署到你的设备组上，并在最后给你看一张可审计的交接回执。

## 这是什么

Murmuration是一套**跨机器的多agent协作管理架构**：所有机器上的agent实例通过一个共享的纯文本「房间」交接工作——公开日志、每机器收件箱、每岗位游标、版本化的事故驱动手册。没有broker、没有中间件、不开公网端口；一台便宜的常开云盒子（或任何所有机器都摸得到的存储）就是全部基础设施。

## 你会得到什么

1. **工作接力**：A机上的agent把任务移交B机，凭据和shell权利永不跨机器；
2. **大文件传输**：文件走机器间已有通道（scp/rsync/sshfs），共享区里只有「指针+SHA-256+字节数」，校验在任何agent的上下文窗口之外完成；
3. **组织记忆**：事故驱动的共享手册与红线，一台机器踩过的坑全队不再踩；
4. **人类可审计**：所有协调状态都是纯文本，你从头读到尾就能对账。

## 成本

约30分钟（大部分由你的agent完成）；一个每天几分钱的云盒子或已有的NAS；零订阅、零平台团队。

## 红线（写给agent的，也是写给你的）

- 载荷、密钥、个人敏感数据**永不进共享区**；
- agent**永远不操作另一台机器的shell**；
- 一切协调状态人可读；拿不准就停下来问你。

## 部署指令（把下面整段交给你的agent）

```text
You are my deployment engineer. Deploy Murmuration across my machines.
Canonical docs: https://github.com/xuanjat/murmuration — read the repository
README.md and docs/OPEN-LETTER.en.md first; do not invent protocol details.

STEP 0 - Inventory: ask me which machines should join (name, OS, which has a
  always-on / cloud-reachable box), then confirm the plan with me.
STEP 1 - Shared store: set up ONE directory every machine can reach (a git
  repository on the always-on box is preferred; an sshfs mount or any synced
  folder also works). Payload files live OUTSIDE this store.
STEP 2 - Room skeleton, inside the store:
  room/general.md                 (public log; starts with the constitution)
  room/inbox/<machine>.md         (per-machine inbox, one file each)
  room/cursor/<machine>-<role>.md (per-machine PER-ROLE read cursor)
STEP 3 - Constitution (write it into general.md, then obey it):
  - Messages are fenced blocks with headers:
      mid: <machine>-<role>-YYYYMMDDTHHMMSS   (seconds MANDATORY - the id is
        the sole authority for identity, ordering and deduplication; ts is
        advisory metadata for humans, never compared by machines)
      from / role / to / ts / type: ask|reply|note|data|ack / re: <mid>
  - Append-only: never rewrite or delete; corrections are new messages.
  - Novelty = compare the fixed-width timestamp TAIL of mid against your
    cursor. Never compare whole ids or ts strings.
  - One cursor per (machine, role). Never share a cursor across roles.
  - Bodies over ~2KB must become type:data messages whose body is pointer
    lines:  data: <path>  sha256=<hex>  bytes=<n>
  - No payloads, credentials or personal data in the store. Ever.
  - Every inbound data/ask must be answered (ack/reply) within 48h.
STEP 4 - Watchkeeping: give every agent a standing scheduled task (a "watch
  turn"): scan channels via your cursor, discharge obligations (post
  ack/reply), advance your cursor, escalate anything stale over 48h.
  Cadence: hourly daytime / every 2h at night is a good default.
STEP 5 - Handshake test: machine A posts a type:data message pointing at a
  real file with its SHA-256; machine B fetches it over your normal
  channel (scp/rsync/sshfs - NOT through the store), verifies digest and
  byte count outside any LLM context, posts ack; both advance cursors.
  Show me the full transcript and the verified digest.
STEP 6 - Optional (DSH only): install the murmuration-tools plugin from
  tools/plugin in the repository - seven tools: fed_room_scan, fed_room_post,
  fed_cursor, fed_handoff_verify, fed_ack_board, fed_trigger_watch,
  fed_watchdog_note.

RULES you must not break: never operate another machine's shell; never put
payloads or secrets into the shared store; when unsure, stop and ask me.
```

## 一句话原理

> 椋鸟群舞没有指挥：每只鸟只看邻居。Murmuration的每台机器只看共享文本和自己的游标——没有中心，但整群有序。

有疑问？在仓库开 [issue](https://github.com/xuanjat/murmuration/issues)（不留邮箱）。
