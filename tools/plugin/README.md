# dsh-federation-tools（v0.2 插件 MVP）

DeepSeek Harness（DSH）host-only 插件包：把 [房间协议](../../spec/room-protocol.md) 与 [交付协议](../../spec/handoff-manifest.md) 的操作面变成 5 个 agent 工具。**零运行时依赖**（只用 node 内置 + harness 的 `defineTool`），**传输无关**：房间 = 一个 UTF-8 markdown 目录（本地镜像 / sshfs 挂载 / 共享库同步均可）。

## 工具一览

| 工具 | 作用 | 语义层成本 |
|---|---|---|
| `fed_room_scan` | 扫频道（general 或某机 inbox），按本岗游标返回新消息；判新只比 mid 尾部定宽时间戳（协议 §4 陷阱的正确实现） | O(新消息头部) |
| `fed_room_post` | append 一条协议消息：mid=机器-岗位-YYYYMMDDTHHMMSS（强制带秒）、五型言语行为、reply 必带 re、载荷化指针；自动处理 append 换行坑（协议 §6） | O(头部+指针) |
| `fed_cursor` | 读/写本岗游标 `cursor/<机器>-<岗位>.md`（一岗一文件，防互相覆盖） | O(1) |
| `fed_handoff_verify` | **上下文外**逐文件 sha256+字节数校验交付清单；仅摘要回流上下文；非本地路径报 skip-remote | O(摘要行) |
| `fed_ack_board` | 义务看板两栏：inbound=欠我的 ack/reply 已清、我欠别人的 data/ask；outbound_awaiting=我发出尚无人回执的；按时间排序带年龄 | O(看板行) |

## 安装（DSH ≥0.2.1，cordis bundle）

本目录即 bundle（`package.json` 声明 `dsh.bundle.patch`）。在任一 DSH 会话里：

```
plugin_manager({ action: "install_bundle", target: "<本目录绝对路径>" })
```

安装后在插件行 config 填：

| 键 | 含义 | 例 |
|---|---|---|
| `roomRoot` | 房间目录（含 general.md / inbox/ / cursor/） | sshfs 挂载点或本地镜像 |
| `payloadRoot` | 校验相对路径时的载荷根（默认=roomRoot） | 共享库载荷目录 |
| `machine` / `role` | 本机化名 / 本会话岗位（进 mid 与游标文件名） | `mixian` / `diplomat` |

显示元数据见 `locale/zh.json`、`locale/en.json`；图标 `icon.svg` 为本框架吉祥物（Q 版小鱼娘，原创 SVG，MIT/CC BY 4.0 同仓库）。

## 开发与验证状态

- `index.js` 为纯 ESM；语法经 ESM 解析校验通过。
- 逻辑冒烟测试：以 stub 的 `@deepseek-ai/dsh-tools`（`defineTool = o => o`）+ 假 ctx 跑通五工具全链路（scan→post→verify→board→cursor 回环），含"reply 闭合 ask 后看板清零"等语义断言。
- **未**在真实 profile 安装验证（本会话无 `plugin_manager` 权限）；接入方安装后请以 `application: applied` 与实跑五工具为准。
- 与 [PLUGIN-ROADMAP.md](../PLUGIN-ROADMAP.md) 的对应：M1=fed_room_scan/post，M2=fed_cursor，M3=fed_handoff_verify，M4=fed_ack_board（M1–M4 源码齐备，M5 跨机 e2e 演练待接入方）。
