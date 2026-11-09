# murmuration-tools — 沙盒测试蓝图（v0.3.2）

> 给任何想在**沙盒 DSH**里验证本插件的人（含各机代理）。生产房间、生产 profile 不参与：全程自建演示房间、自建 profile。

## 0. 环境准备（一次性）

1. 沙盒原则：**新开专用会话**执行本蓝图；不装进生产 profile，不动生产房间。DSH 可以是全新安装或现有安装——插件装进**新建 profile**即天然隔离：
   ```
   dsh plugin --profile fedtest add <repo>/tools/plugin
   ```
   （或 clone 仓库后 add 本地路径；repo: github.com/xuanjat/dsh-federation，基线 commit `09fb1b4`。）
2. 自建演示房间（本地目录即可，协议是纯文件）：
   ```
   mkdir -p fedroom/room/inbox fedroom/room/cursor
   ```
   初始化 `general.md`（可空）与 `cursor/<机器>-<岗位>.md`（内容 `last_seen: <mid>`，可先不建——空游标=fed_room_scan 返回全部）。
3. profile 级 `cordis.patch.yml`（`<home>/profiles/fedtest/cordis.patch.yml`）尾部插入：
   ```yaml
   - id: fed-tools
     name: "murmuration-tools"
     config:
       roomRoot: '<沙盒房间绝对路径>/room'
       payloadRoot: '<同上>'
       machine: <测试机名>
       role: tester
   ```
4. **重启 DSH 后新开会话**再验证（会话工具清单创建时固化；H-088：重启宿主才重新加载 profile）。

## 1. 测试矩阵

| # | 项 | 步骤 | 预期 |
|---|---|---|---|
| T1 | 注册 | 新会话工具清单探针 | fed_room_scan / fed_room_post / fed_cursor / fed_handoff_verify / fed_ack_board / fed_trigger_watch / fed_watchdog_note **7/7 在册** |
| T2 | post→scan 回环 | fed_room_post 一条 note 到 general，再 fed_room_scan | 返回该条，mid=`<机器>-tester-YYYYMMDDTHHMMSS`（带秒）；文件真实 append |
| T3 | 判新 | 写游标 last_seen 为上一条 mid，再 scan | new_count 只算尾部时间戳**更大**的消息（不比字典序） |
| T4 | 围栏解析 | general.md 手工混入“围栏式”（`---\n头部\n---\n正文`）与无围栏两种消息 | parseMessages 两种都解析，body 不丢（v0.2.1 修复的回归点） |
| T5 | 游标守卫 | fed_cursor 传 `{}` | 返回 `{"error":"set requires value"}`；传 value 后写入 `cursor/<机器>-tester.md` |
| T6 | 交付校验 | 造两个文件+清单（path/sha256/bytes），fed_handoff_verify | 逐文件 OK；篡改 1 字节→FAIL；路径不存在→skip-remote；**上下文只回流摘要行** |
| T7 | ack 看板 | 造 ask（他人发给我）与我发的 data 各一条 | fed_ack_board inbound/outbound_awaiting 两栏计数正确，带年龄 |
| T8 | 未配置守卫 | roomRoot 置空再加载 | 工具调用返回 `fed-tools not configured: set roomRoot...`，不抛异常 |
| T9 | 值守触发 | fed_trigger_watch：规则 type=ask + 超龄义务 | 产出候选带 reasons；传 advance=true 顺手推游标 |
| T10 | 值守回执 | fed_watchdog_note 三态各写一条 | append 到 `cursor/<机器>-tester.watch.md`；recent 读最近回执 |

## 2. 已知事实（勿重复踩坑）

- **H-088**：插件内禁止 bare import `@deepseek-ai/*`（profile 依赖树无该 scope→整包 failed to import 被静默跳过，0 工具在册）。v0.3.2 已修复；加载失败线索=launch stderr 的 `dsh: skipping profile bundle "murmuration-tools": <reason>`。
- 插件**按 profile 隔离**：装在哪个 profile，只有该 profile 的宿主加载（H-086）。
- 版本门：旧 CLI（<0.2.1-rc.2）对部分官方包有 exit 1 兼容告警，与本包无关。
- 判新只认 mid 尾部定宽时间戳 `\d{8}T\d{6}`（协议 §4）；append 前自动补换行（协议 §6 坑）。

## 3. 判定与回报

- 全部 T1–T10 通过 → 本蓝图结论区记“PASS @<机器> @<日期>”。
- 任何 FAIL → 附 stderr 与复现步骤发 issue 或房间消息（type: data，勿贴隐私）。
