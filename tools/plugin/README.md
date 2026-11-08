# murmuration-tools（v0.3.0：MVP五工具+值守两件套）

DeepSeek Harness（DSH）host-only 插件包：把 [房间协议](../../spec/room-protocol.md) 与 [交付协议](../../spec/handoff-manifest.md) 的操作面变成 5 个 agent 工具。**零运行时依赖**（只用 node 内置 + harness 的 `defineTool`），**传输无关**：房间 = 一个 UTF-8 markdown 目录（本地镜像 / sshfs 挂载 / 共享库同步均可）。

## 工具一览

| 工具 | 作用 | 语义层成本 |
|---|---|---|
| `fed_room_scan` | 扫频道（general 或某机 inbox），按本岗游标返回新消息；判新只比 mid 尾部定宽时间戳（协议 §4 陷阱的正确实现） | O(新消息头部) |
| `fed_room_post` | append 一条协议消息：mid=机器-岗位-YYYYMMDDTHHMMSS（强制带秒）、五型言语行为、reply 必带 re、载荷化指针；自动处理 append 换行坑（协议 §6） | O(头部+指针) |
| `fed_cursor` | 读/写本岗游标 `cursor/<机器>-<岗位>.md`（一岗一文件，防互相覆盖） | O(1) |
| `fed_handoff_verify` | **上下文外**逐文件 sha256+字节数校验交付清单；仅摘要回流上下文；非本地路径报 skip-remote | O(摘要行) |
| `fed_ack_board` | 义务看板两栏：inbound=欠我的 ack/reply 已清、我欠别人的 data/ask；outbound_awaiting=我发出尚无人回执的；按时间排序带年龄 | O(看板行) |
| `fed_trigger_watch` | 值守触发器（两级流水线一级）：按游标扫频道→规则过滤（type/收件人/关键词/超龄义务）→产出带 reasons 的触发候选，二级判断（act/defer/ignore）交给调用方 LLM；可选顺手推进游标 | O(候选头部) |
| `fed_watchdog_note` | 值守回执（Watchdog 三态）：progress=实质进展 / deviation=偏离计划 / intervention=需人介入；append 到 `cursor/<机器>-<岗位>.watch.md`（一岗一档），`recent` 读最近回执保持值守连续性 | O(回执行) |

## 安装（DSH ≥0.2.1，cordis bundle）

本目录即 bundle（`package.json` 声明 `dsh.bundle.patch`）。两种已验证/设计内安装方式：

```
# 方式一：会话内插件管理器
plugin_manager({ action: "install_bundle", target: "<本目录绝对路径>" })

# 方式二：CLI（profile 级，2026-11-08 于本机 web profile 实测）
dsh plugin --profile web add <本目录绝对路径>
```

方式二落地三件套：`profiles/<profile>/package.json` 的 dependencies（`link:<路径>`）+`dsh.profile.bundles` 追加包名 +`node_modules/<包名>` 链接副本。注意：用旧版 npx CLI（0.2.1-rc.2）安装时，exit=1 的告警文本可能是**profile 里其他插件**对该 CLI 版本的兼容门（如 dsh-client-ui-skin-center@0.4.15 vs 0.2.1），不代表本包失败——以三件套核验为准；运行中的新服务端（0.2.2-rc.1）不受该门影响。插件 UI/工具列表需重启 DSH 并刷新页面才出现（技能目录热生效、插件不热生效）。

安装后在插件行 config 填：

| 键 | 含义 | 例 |
|---|---|---|
| `roomRoot` | 房间目录（含 general.md / inbox/ / cursor/） | sshfs 挂载点或本地镜像 |
| `payloadRoot` | 校验相对路径时的载荷根（默认=roomRoot） | 共享库载荷目录 |
| `machine` / `role` | 本机化名 / 本会话岗位（进 mid 与游标文件名） | `mixian` / `diplomat` |

显示元数据见 `locale/zh.json`、`locale/en.json`；图标 `icon.svg` 为本框架图标（简笔彩色歌姬像，原创 SVG，风格致敬公开角色设定，MIT/CC BY 4.0 同仓库）。

## 开发与验证状态

- `index.js` 为纯 ESM；语法经 ESM 解析校验通过。
- 逻辑冒烟测试：以 stub 的 `@deepseek-ai/dsh-tools`（`defineTool = o => o`）+ 假 ctx 跑通五工具全链路（scan→post→verify→board→cursor 回环），含"reply 闭合 ask 后看板清零"等语义断言。
- v0.3.0（2026-11-08）：新增 `fed_trigger_watch` 与 `fed_watchdog_note`（docs/superagent-comparison.md §四两候选，tlf拍板都做）；stub冒烟19项全PASS（含过滤/超龄/游标推进/三态守卫/未配置guard）。安装为 link: 符号链接（profiles/web/node_modules → 仓库目录），仓库改动即安装态，重启DSH生效。
- v0.2.1（2026-11-08）：修复 `parseMessages` 围栏 bug——旧实现按所有 `\n---\n` 切块，导致 `fed_room_post` 自写的围栏格式消息体丢失（只剩头部块）；现按 `\n---\n(?=mid:)` 切分并容忍围栏/无围栏两种序列化，冒烟复测 scan 全量消息含 body。
- 真实 profile 安装已验证（2026-11-08，web profile）：三件套齐备、node_modules 副本与仓库 index.js sha256 前12位全等（2ea80884e366）；stub 冒烟五工具全链路通过（scan 判新/post 追加/游标守卫/未配置 guard）。会话内实跑待 DSH 重启后由接入方确认。
- 与 [PLUGIN-ROADMAP.md](../PLUGIN-ROADMAP.md) 的对应：M1=fed_room_scan/post，M2=fed_cursor，M3=fed_handoff_verify，M4=fed_ack_board（M1–M4 源码齐备，M5 跨机 e2e 演练待接入方）。
