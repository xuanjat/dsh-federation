# arXiv投稿元数据（v4，2026-11-09；IEEEtran journal，8页3图31refs；状态：正式发布——作者 Lifeng Tian + Chengxu Han）

按arXiv提交表单逐项准备。v4 起所有【拍板】项已由 tlf 定稿（2026-11-09）。

| 表单项 | 值 |
| --- | --- |
| License | CC BY 4.0（与仓库 NOTICE 一致） |
| Primary category | cs.MA (Multiagent Systems) |
| Cross lists | cs.DC (Distributed, Parallel, and Cluster Computing); cs.AI |
| Title | Murmuration: Federating LLM Agents Across Machines with Nothing but Text |
| Authors | Lifeng Tian (corresponding; xuanjat77@gmail.com); Chengxu Han (chengxuhan0313@163.com) |
| Abstract | 见 abstract.txt（纯文本，无TeX命令） |
| Comments | 8 pages, 3 figures, 31 references (IEEEtran journal template, 2026-11-09); sanitized field deployment; source and artifacts: https://github.com/xuanjat/murmuration |
| ACM class | I.2.11（可选） |
| Journal ref / DOI / Report number | 无 |

## 提交步骤（tlf本人操作，需其arXiv账号）

1. arxiv.org 注册/登录，姓名与论文作者一致（Lifeng Tian）。
2. Start new submission → 上传源码包 `paper/arxiv/arxiv-source.tar.gz`（内含 `main.tex` 与 `figures/fig1-overview.pdf`、`figures/fig2-field-dashboard.pdf`、`figures/fig3-ablation.pdf`）。arXiv 的 AutoTeX 会自动以 pdflatex 编译两遍；参考文献为内联 thebibliography，无需 bibtex/bbl。
3. 按上表填 metadata；abstract 粘贴 abstract.txt 全文。
4. 首次投稿 cs.MA 可能需要 endorsement（背书）：若账号此前无该领域成功投稿，系统会提示找一位 arXiv 已有论文的作者背书；合作者/导师邮箱最快。
5. Preview PDF 核对（应 8 页、无乱码；fig1/fig2/fig3 为双栏跨页 figure*）→ Submit。审核通常 1–2 个工作日；避开周五美东时间提交（顺延到下周一公告）。
6. 公告后把 arXiv 编号回填 README / paper/ 与仓库 topics，并按 R-15 走外交官在房间发公告。

## 复现构建（本机）

```
cd paper/arxiv
pdflatex -interaction=nonstopmode main.tex   # 跑两遍
```

已知处理：∎→\blacksquare；ref[31] 中文标题译为英文并注 (in Chinese)（保 pdflatex 全平台可编，arXiv AutoTeX 无需 CJK 字体）；作者块改为 IEEEtran \author + \thanks（含通讯邮箱与仓库链接）。

## 打包

```
cd paper/arxiv && tar -czf arxiv-source.tar.gz main.tex figures
```
