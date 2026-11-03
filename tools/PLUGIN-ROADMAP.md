# Phase A 路线图：DSH 插件（跨机联邦客户端）

> Phase B（本仓库当前内容）先立协议与文档；Phase A 把协议中可工具化的部分做成 DSH 插件。
> DSH（[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)，"Everything is a Plugin"）支持 host-only 插件包（bundle）安装。

## 状态（2026-11-03）

**MVP 源码已落地：[plugin/](plugin/)**（host-only cordis bundle，零依赖，五工具齐备：fed_room_scan / fed_room_post / fed_cursor / fed_handoff_verify / fed_ack_board；含中英 locale 与吉祥物 icon；逻辑冒烟测试通过，待真实 profile 安装验证）。下表保留为设计基线。

## 定位与边界

- 内置 Agent Teams（`spawn_teammate` 等 9 工具）解决**单机**多 agent 协作；本插件解决**跨机联邦**的日常操作。
- 不重新实现编排，不代理执行远端命令（红线：不替别人操作别人的机器）。

## MVP 工具集（host-only bundle）

| 工具 | 作用 |
|---|---|
| `fed_room_scan` | 按 cursor 时间戳扫描 general / inbox 增量，返回结构化消息列表 |
| `fed_room_post` | 按 spec/room-protocol.md 生成合规消息：自动 mid、type 选择、>2KB 自动转 data 指针（sha256+字节数） |
| `fed_cursor_get/set` | 读写本机-岗位游标 |
| `fed_handoff_verify` | 交付清单校验：路径+sha256+字节数三元组逐项核对 |
| `fed_ack_board` | 汇总 ack 状态，输出 48h 未 ack 清单与催办建议 |

## 工程要点

- bundle = package.json 携带 `dsh.bundle.patch` + `cordis.patch.yml`；host-only 无运行时依赖。
- 需提供 locale（zh-CN / en）与 icon；通过 `plugin_manager install_bundle` 安装。
- 目标版本锁定 DSH 0.2.1-rc.2 验证；rc 阶段 API 可能变动，升级需回归测试。

## 验收标准

1. 测试 profile 上 `install_bundle` 安装成功；
2. 五个工具可在会话中调用并返回预期结构；
3. `fed_room_post` 产物通过 spec 校验（mid / 指针格式）；
4. 无任何凭据写入日志。

## 里程碑

- **M1**：`fed_room_scan` + `fed_room_post`（对协议 v1.4 只读 + 发消息）
- **M2**：cursor / handoff / ack 三件套
- **M3**：客户端 UI 面板（房间流、ack 看板）
