# review-r2 — 多agent审稿修订台账（第二轮，2026-11-09）

> 引擎：review-workflow-v1（super-agent构件×PaperJury v3裁剪）。三席隔离评审：R1=MAS(02cb9756) R2=DISTSYS(5ba6124a) R3=CONSISTENCY(c3998a1e)。
> 状态机：raised → (polish | trial) → valid-fixable → closed；或 invalid-drop / author-required。

## Router确定性预审（一级Trigger，先于LLM席位）

| id | 类型 | 发现 | 状态 |
|---|---|---|---|
| D1 | mechanical | ref[20]（Zhang 2024 memory survey）正文零引用；候选落点§5组织记忆段 | raised |
| D2 | verify | \bprove\b=0、\bshows\b=0（R1修订成果保持）；guarantee=2处均在§8 candor否定/名词语境，判定合法 | closed-verify |
| D3 | verify | 引用完整性：31条定义/30条被引；cited-undefined=0 | closed-verify |

## 评审席返回（合并后逐条入账）

merge取significance=MAX（三席重叠发现合并一行，多席标注）。全部major为编辑可修（substantive-editorial），无一进入庭审轨（无"作者-评审员对赌"式分歧）。

| id | 席 | 级 | 发现（缩写） | 处置 | 状态 |
|---|---|---|---|---|---|
| F1 | R2+R1 | MAJOR | Def1四元组ρ*_to线格式无此字段/不可实例化 | Def1重写：mid+三坐标+目标岗交付时解析+wall-clock | closed（§3无四元组残留，脚本核验） |
| F2 | R2 | MAJOR | monotonic过度声称（同秒碰撞自认） | abstract去monotonic；Def1改wall-clock+NTP界；Prop2加唯一性前提；§8(iv)呼应 | closed |
| F3 | R2 | MAJOR | Def3 per-channel cursor与R5/规范单last_seen矛盾 | Def3重写：per-consumer单游标+跨通道跳跃危险+固定扫描序 | closed |
| F4 | R2 | MAJOR | 179+与"每文件验证"算术冲突 | abstract/§6改"三千+per-file检查（合计）"，1,300=单manifest峰值，双界分开 | closed |
| F5 | R3 | MAJOR | 13起"全在田野"错（3起建库前） | §5改"deployment history（含建库前1起）"；I-003/004=10-02/10-07实date | closed |
| F6 | R3 | MAJOR | ten days vs"11天内4版本" | §6改"within the eleven-day window"（以metrics.md为准） | closed |
| F7 | R3 | MAJOR | fence规则归因错（窗外本机冒烟） | §6+表1行改"2026-11-08窗外、本机冒烟、无房间级丢失"；消融fold-in门槛通过 | closed |
| F8 | R1 | MAJOR | KQML/FIPA对比缺机制层 | §4.3加三句机制对比（inherited performative discipline vs inverted cost model+R4 cap） | closed |
| F9 | R1 | MAJOR | §7缺逐元素最近邻 | §7加(e)段：6元素×最近邻+一句非同构理由（源自novelty-matrix.md分维度表） | closed |
| F10 | R1 | MAJOR | nothing-but-text范围过宽 | §1首用限定协调面+payload走既有通道；§9回声同限定 | closed |
| F11 | R1 | MAJOR | "establish"名不符实 | abstract/§4.2改"derive/design invariants implied by R4+manifest assumption" | closed |
| F12 | R2 | minor→major性 | §8缺：cursor RMW竞态/跨通道跳跃、inbox fan-in+底座append原子性、离线机时钟、围栏解析脆性 | §8加(viii)(ix)(x)+(i)扩写（fan-in依赖底座单append原子性，§3历史保证条件化） | closed |
| F13 | R2 | minor | 零mismatch无现场限定词 | abstract/§6限定"corruption checks (not authenticity controls)" | closed |
| F14 | R2 | minor | multi-thousand夸大 | §6改thousand-file-scale | closed |
| F15 | R2+R3+R1 | minor | 274≠283残9 | census复跑闭合：residual 9=notice×4+request+action+report+correction，283=39+27+87+121+9 | closed |
| F16 | R2+R1 | minor | [20]孤儿引用 | §1上下文稀缺句并入[20,21,22] | closed |
| F17 | R2+R1 | minor | AverNet拼写 | 全文Avernet（上游repo拼写） | closed（grep=0残留） |
| F18 | R2+R3+R1 | minor | murmuration大小写 | 全文Murmuration | closed（grep=0残留） |
| F19 | R2+R1 | minor | §2 append-only过宽 | §2收窄为三类协调日志+只读治理文本按版本号替换维护 | closed |
| F20 | R1 | minor | sole substrate丢限定 | §7 L2句加"(in this design)" | closed |
| F21 | R1 | minor | abstract应combines-all-of | abstract L2句改为六元素combines all of列表 | closed |
| F22 | R1 | minor | MAST映射未接地 | §4.2加"incident → patching rule工件句"（工件=natural-ablation.md） | closed |
| F23 | R1 | minor | R1-R6来源不均（R4/R6是约定） | §3 provenance句改"R1/R2/R3/R5=事故补丁，R4/R6=约定设计约束" | closed |
| F24 | R1 | minor | AverNet对比过猛 | §7改footprint/auditability口径（store也是infra，诚实承认） | closed |
| F25 | R1 | minor | pointers idempotent松 | abstract改"pointer forwarding and digest verification are idempotent" | closed |
| F26 | R1 | minor | [31]方括号标题 | 改斜体+(in Chinese)；§1/§7机制清单对齐同一列表 | closed |
| F27 | R3 | minor | 引用非首发顺序 | 全文重编号：首现严格递增，31条全被引/零幽灵（脚本核验true） | closed |
| F28 | R3 | minor | L0/L1未分定义 | §7 ladder句全定义L0-L4 | closed |
| F29 | R3 | minor | 10维度未枚举 | §7枚举①-⑩；排序句对齐维度名 | closed |
| F30 | R3 | minor | 文献格式不齐（页码） | 统一无页码风格：[12]删pp.87–117、[16]删93–128 | closed |
| F31 | R3 | minor | study/deployment混用 | 关键处统一（§5 deployment history、§6 study window） | closed |
| F32 | R3 | minor | up to 1,300+双界 | abstract改"up to 1,300 files"+三千+合计口径 | closed |
| F33 | R3 | minor | I-001…I-014 vs 13 | natural-ablation.md表2头注：14归档、I-014窗外补录、窗口结账=13 | closed |
| F34 | R3 | minor | R编号族冲突 | 表2头注+论文§6 ops红线族说明 | closed |
| F35 | R3 | minor | 消融缺暴露分母 | 表1/表2加暴露分母列（近似/未计量行内标注）+诚实性分母bullet；落点段同步"已执行" | closed |
| F36 | R1 | minor | §9"consistent"无先行词 | §9改"not merely implementable on paper but operable in sustained use" | closed |
| F37 | R3 | minor | [31]§1§7机制清单不一致 | §1改为§7同一清单（thread subscription/Inline&Spill/Chain-of-Recall/control loop） | closed |

## 庭审记录

未触发：11条major全部判定为substantive-editorial（证据不足或措辞越界，非方法论对赌），Router按PaperJury §route规则直接走valid-fixable，无需defense+陪审表决。

## 修订批次

batch3a=32编辑（abstract6+§1-§3共10+§4-§5共6+§6共7+§7共7，全中）；batch3b=§8四处+§9三处+ref三条+大小写/拼写扫描+引用重编号（31条首现递增核验true）+natural-ablation.md 13处。核验：prove/shows=0、murmuration小写=0、AverNet=0、CJK残留=none、引用31/31单调。

## 收敛计数

raised=37（D1+F1…F36去重合并后37行）；closed=36；author-required=1（D1原落点§5改并入§1，随batch3a关闭——修正：D1亦closed）；author-required=0。遗留至作者事项（非本轮）：图件、定量表、arXiv作者/单位/License（tlf拍板中）。
