# Super-agent对照笔记（2026-11-08）

> 来源：DeepSeek Harness官方团队《Super-agent设计探索：迈向更自主的Agent系统》（2026-11-01发布，原型插件dsh-superagent-prototype，"仅验证路线，非产品"）。
> 报道核读：[DoNews](https://www.donews.com/news/detail/1/6760986.html)、[PChome](https://article.pchome.net/news/16524.html)；另见其沙盒基础设施论文DSec（arXiv，2026-09，单集群日跑300万沙盒、防AI"作弊"，与本文主题不同，仅备查）。
> 本笔记用途：①功能对照（我们已有什么、缺什么）；②论文写作手法学习清单；③对插件路线与paper/main.md的修订输入。

## 一、Super-agent要点速记

- 动机观察（量化）：主流Agent以单一Session为单位；人通常只能同时跟进3~5个活跃Session；"单任务上限看模型，多任务上限看人的注意力"；CLI/MCP扩展仍卡在单会话同步阻塞、多任务上下文混乱、设备离线即停。
- 四特征（设计契约）：连续（IM/GitHub评论等多渠道同一Agent）、高效（并行多复杂任务）、主动（持续观察环境事件自行推进）、持久（始终在线、异常自恢复）。
- 五架构件：①双层架构Router/Worker（Router承接人类交互+全局上下文+分派；Worker隔离会话并发执行、不直接回用户、向Router汇报）；②事件驱动（Trigger=群聊/邮件日程/评审评论/CI结果；程序规则过滤→LLM判断；Worker订阅Thread后事件直通、绕过Router）；③面向人的交互（异步ReAct Loop：start()/stop()、Started状态、后台结果作为新事件；投机执行：按环境信号提前干活）；④计算/状态/环境分离（计算与持久状态在云、执行环境留本地轻量daemon；BYOM=自带机器接入）；⑤Watchdog独立Session外部控制回路（监控基础设施报错+判断Worker是否实质进展/偏离目标并介入修复）。
- 上下文机制：Inline & Spill（近期信息入窗、超预算/低频留窗外按需读）；链式召回Chain of Recall（Trigger/Thread/Worker Session间引用关系，沿关联ID找回历史）。
- 实验（小而全）：合成负载约300条消息/次、约20条工作请求、每方案5次重复；Super-agent完成时间p50/p95=12.4/15.7分钟，中性提示单Session方案p95=29.5分钟；Router压测Trigger 1→40条/分钟时批处理1.0→2.8、单请求2.5s→3.9s、单决定分摊推理6.4s→1.6s（突发时合并积压提吞吐）。明示"合成负载+简化环境，只评调度协作，不衡量单任务执行能力"。
- 自报开放问题：Router随规模扩展、跨月长程记忆、脱离Session的人机协作、Agent实例间A2A通信、安全隐私（提示词注入、端侧凭据泄露、跨设备权限）。

## 二、功能对照表（Super-agent件 ↔ murmuration现状）

| Super-agent件 | 我们已有 | 差距/备注 |
| --- | --- | --- |
| Router/Worker双层 | 外交官岗位（统一对外发声、记账、汇总回执）+各会话Worker；inbox寻址 | Router是"人设岗位+规矩"，非程序层；全局上下文靠手册与游标，非Router维护 |
| 事件驱动Trigger+程序过滤+LLM判断 | 房间inbox append+值守节律轮询（白天1h/夜间2h）+schedule定时唤醒 | 我们是pull无push；无"规则过滤→LLM判断"两级流水线（插件可补，见路线） |
| Thread订阅事件直通 | cursor/<机器>-<岗位>.md游标分账+inbox点对点 | 点对点通道已有但仍轮询消费 |
| Inline & Spill | billion-context compress/decompress（窗外按需读）+手册索引find/show | 概念同族，我们已在会话内落地 |
| 链式召回 | 消息re:字段+指针manifest+事故索引I-xxx互引 | 已有等价物，未命名传播 |
| 异步ReAct/投机执行 | pwsh后台job、subagent、watcher自动补跑链（ch6实验c_watch/g2_chain/olmoe_chain） | DSH原生能力+我们的值守链已实践 |
| 计算/状态/环境分离+BYOM | 跨机异构（Windows米线/云Linux云吞/局域网糯米/宿舍月饼/离线饭团）+ssh隧道+sshfs/scp-rsync通道+工作区映射 | 我们的核心强项：跨架构、跨框架实例联邦；他们限于单组织云+本地daemon |
| Watchdog判断回路 | 值守节律+watcher聚合回拉+48小时升级规则 | 有实践；缺"模型判断Worker是否实质进展"的独立Watchdog会话 |
| 实例间A2A通信 | 房间协议R-15（五performatives+四坐标身份+指针交付）正是A2A规范层 | 他们列为开放问题，我们已给出规范+11天字段证据 |
| 量化实验 | 11天5机字段台账（45经验/13事故/千级文件交付零未检损坏） | 我们是字段存在性证据；他们是合成负载调度基准；口径不同、互不替代 |

结论：Super-agent=单组织内"单实例多会话"的架构内改；murmuration=跨机跨框架"多实例"的组织层改。动机同源（注意力瓶颈、会话即焚），单位不同；其开放问题（A2A、跨Session协作）恰为我们的规范面。paper/main.md §7已补(d)邻近项、§1已补定位段、§8已补口径限定、参考文献[31]。

## 三、论文写作手法学习清单（对照其文风）

1. 开场把瓶颈量化成可感事实（"3~5个活跃Session"）——动机不是形容词而是数字；我们可引该数+自家台账数（11天/5机/45经验/13事故）。
2. 先立形态契约再讲架构：四特征逐条对应架构件（特征→机制映射表）；我们可在§1末加"联邦四性质↔五机制"小映射表（跨机异构/零基础设施/可审计/持久接力 ↔ 房间/指针/手册/值守）。
3. 机制名词化命名（Inline & Spill、Chain of Recall、BYOM、Trigger/Thread）——可引用、可传播；我们已有Room/Pointer/Claim Ladder/Time-Triggered Watchkeeping，继续坚持命名纪律。
4. 范围诚实自宣（原型"仅验证路线非产品"；实验"合成负载只评调度"）——我们的claim ladder与§8同族，保持并在对照处再声明一次口径差。
5. 实验小而全：5次重复+p50/p95+消融（去事件直通）+压测敏感性曲线；我们缺消融——可用"无外交官/无游标时期的丢消息事故"作自然消融证据（事故档案I-xxx即反事实）。
6. 局限写成研究议程（Router扩展/长程记忆/A2A/安全隐私）——我们§8已列，可把A2A一条指向自家规范作为"已答一半"。
7. 可信度闭环："内部实例已持续运行参与自身迭代"+原型开源；我们对应物=11天字段部署+全库开源+案例台账脱敏摘录。

## 四、对插件与后续工作的输入

- 插件v0.3（tlf已拍板都做，v0.3.0落地2026-11-08）：fed_trigger_watch（规则过滤→LLM判断两级Trigger流水线，补push缺口的pull侧近似）、fed_watchdog_note（Watchdog判断回执模板：实质进展progress/偏离deviation/介入intervention三态，一岗一档append-only）；其余维持MVP五工具不动。
- 命名纪律：新工具与文档机制一律先命名后描述。
- 实验补强：case-study加一节"自然消融"（事故反事实表），不新造合成基准。
