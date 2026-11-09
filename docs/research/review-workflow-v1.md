# 多agent审稿修订工作流 v1（review workflow）

> 来源：本文档记录2026-11-09对paper/main.md执行的第二轮审稿修订循环的设计与运行口径。方法论双源：DeepSeek《Super-agent设计探索》五架构件（Router/Worker双层、Trigger两级流水线、Watchdog回路、Inline&Spill、Chain of Recall）×开源skill PaperJury（github.com/Spark-To-Paper-Skills/paperjury，1217★，投稿前审稿压力测试；三原语Skill/Workflow/Memory、v3法庭引擎、评审员隔离与反跳读规则）。skill正文已存本机`skills/paperjury/`（SKILL.md+references/reviewer-personas.md）。

## 架构映射（super-agent构件 → 本循环实现）

| Super-agent构件 | 本循环实现 |
|---|---|
| Router/Worker双层 | 主会话lead=Router（任务分解/分派/合并/预算）；每席评审员=独立subagent（隔离上下文，互不可见） |
| Trigger两级流水线 | 一级程序规则过滤（node脚本：禁词\bprove\b/\bshows\b、引用完整性、CJK残留、数字口径扫描）→二级LLM判断（三席评审员逐字引文输出） |
| Watchdog三态回路 | Router对每席返回核验：progress（schema合格+coverage全覆盖）/deviation（未按schema或越权读禁文件）/intervention（重派或Router代行） |
| Inline & Spill | 评审员只读论文全文+指定证据文件，不带全库；Router侧持ledger |
| Chain of Recall | review-r2.md的条目带verbatim quote+section锚点，修订后可回链核验 |

## PaperJury引擎步骤 → 本循环裁剪（N=3席、单轮）

1. **指派**：R1=MAS/协同（新颖性、claim ladder、贡献定位）；R2=分布式系统/安全（§4消息演算与成本模型、并发、integrity≠authenticity、§8完备性）；R3=写作与一致性（数字对台账、术语、摘要-正文对齐、参考文献）+natural-ablation并入评估。
2. **通读+反跳读**：每席必读全文；每条weakness必须含≥8词逐字引文（cannot quote = did not read）；输出per-section coverage。
3. **合并分诊**：Router去重，significance取MAX；mechanical/minor→直接润色轨；substantive/major→庭审轨。
4. **庭审**：对每条major指控——整篇辩护（defense）+去相关陪审团表决；判定≥80%存活且一边>60%方可关闭，否则author-required。
5. **召回审计+起草**：修订前复核强共识项；每条存活issue带close_criterion（一句可检验的编辑标准）。
6. **编辑安全链**：确定性守卫（禁词=0、引用[1]-[31]全被文内引用、CJK=0、中英间距规范）→pandoc+pdflatex×2零错→LEDGER记closed。
7. **书记员**：review-r2.md=台账（raised/trial/valid-fixable/closed/author-required）+收敛计数。

## 硬规则（沿用PaperJury，venue无关）

- 作者事先授权（tlf拍板"执行"即预授权；越出授权边界=语言级修订者方可自动落，需新数据/新实验的一律author-required）。
- 评审员隔离：新鲜眼睛、无前轮泄漏（不读review-r1.md）、互不可见台账。
- 无泄漏：审稿过程记录不进正文。
- 分歧先讨论后覆盖，覆盖必留痕。

## 运行记录

- 2026-11-09 R2轮：三席隔离评审返回（R1=MAS 5M8m、R2=DISTSYS 4M+minor、R3=CONSISTENCY 3M+minor+消融fold-in-with-changes判定）；Router合并去重37条；11条major全判substantive-editorial，未触发庭审；batch3a=32编辑、batch3b=§8/§9/refs/重编号/natural-ablation共20+处；台账=paper/review-r2.md（37行全closed）。
