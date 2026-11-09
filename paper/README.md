# paper/ —— 投稿级短文草稿（中文说明）

- **main.md**：英文短文草稿《murmuration: A Semantic-Level Coordination and Transport Plane for Heterogeneous Cross-Machine LLM-Agent Federations》。结构：摘要 / 引言（三动机：孤岛、上下文稀缺、远程 shell 红线）/ 设定与约束 / 房间工件与六条设计规则 R1-R6（每条可溯源到真实事故）/ 传输模型（定义 1-5 + 命题 1-3 及证明梗概 + MAST 对位声明为设计意图）/ 组织治理（角色、事故驱动手册、ack 义务、时间触发值守）/ 脱敏田野研究（5 机 11 天）/ 新颖性评估与主张阶梯（L2 口径）/ 局限 / 结论 / 参考文献 30 条。
- **定位**：workshop / short paper 草稿；非实证评测论文——所有"效能"表述均为设计意图或存在性证据，正文已自我标注。
- **转 LaTeX 建议**：ACL/IEEEtran 双栏模板均可；mermaid 图（README 与 docs/07）转 TikZ 或导出 PDF；公式已用行内 $...$ 与命题环境，迁移成本低。
- **投稿前必做**：①参考文献逐条核对卷期页码（arXiv 条目核对最终发表版）；②补作者单位与 ORCID 占位；③按目标会议页数裁剪（当前约 4.5 页双栏当量）；④伦理与脱敏声明复核（机器名为化名，无真实 IP/人名/机构）。
- **arXiv投稿包（2026-11-08）**：`arxiv/`——main.md（净化源）、main.tex（pandoc生成、自包含）、main.pdf（8页，pdflatex编译零Missing character、零未定义引用）、abstract.txt（纯文本摘要）、metadata.md（表单逐项+提交步骤+复现命令）。待tlf拍板：作者名/单位、License（建议CC BY 4.0）。
- **审稿修订循环R1（2026-11-08）**：paper-polish润色（5处语言级）→academic-paper-reviewer五席评审（结论Major Revision，3 CRITICAL/14 MAJOR）→修订39处编辑（Prop1重述带manifest假设与O(k·H)界、§8新增分布式系统坦诚段、全部31条文献正文化引用、AverNet/ruflo点名、claim ladder内联定义、[23]条目按arXiv元数据勘正、动词降级prove→establish/shows→suggests）。逐条处置与遗留项见 `review-r1.md`。arXiv包已按修订版重建（8页）。
- **与仓库关系**：§3 规则=spec/room-protocol.md；§4=docs/07-transport-model.md；§5=docs/03-governance.md+04-watchkeeping.md；§6=case-study/；§7=docs/research/。

## R2 loop (2026-11-09)

- 三席隔离评审（MAS/DISTSYS/CONSISTENCY）→37条合并→全部编辑关闭；台账见review-r2.md。
- 全文引用重编号（首现严格递增）、murmuration→Murmuration/Avernet拼写统一、文献统一无页码风格。
- arxiv包重建：main.pdf 11页281,553B零Missing character；abstract.txt、metadata.md（11 pages, 31 references）同步。
