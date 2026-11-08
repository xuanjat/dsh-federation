# arXiv投稿元数据（v1，2026-11-08）

按arXiv提交表单逐项准备；【拍板】项需tlf确认后填写。

| 表单项 | 值 |
| --- | --- |
| License | 【拍板】建议 CC BY 4.0（与仓库NOTICE一致；默认arXiv non-exclusive亦可） |
| Primary category | cs.MA (Multiagent Systems) |
| Cross lists | cs.DC (Distributed, Parallel, and Cluster Computing); cs.AI |
| Title | dsh-federation: A Semantic-Level Coordination and Transport Plane for Heterogeneous Cross-Machine LLM-Agent Federations |
| Authors | 【拍板】当前TeX内为 Lifeng Tian（arXiv要求真名，不接受化名；单位建议 Independent Researcher 或 China University of Geosciences (Wuhan)，二者选一；可加ORCID） |
| Abstract | 见 abstract.txt（纯文本，无TeX命令） |
| Comments | 7 pages, 31 references; field study sanitized |
| ACM class | I.2.11（可选） |
| Journal ref / DOI / Report number | 无 |

## 提交步骤（tlf本人操作，需其arXiv账号）

1. arxiv.org注册/登录（邮箱建议用机构或常用邮箱；姓名与论文作者一致）。
2. Start new submission → 上传源码包 `main.tex`（arXiv只收源码自行编译；本目录main.tex自包含：无外部依赖、无图、参考文献为内联thebibliography风格列表）。
3. 按上表填metadata；abstract粘贴abstract.txt全文。
4. 首次投稿cs.MA可能需要endorsement（背书）：若账号此前无该领域成功投稿，系统会提示找一位arXiv已有论文的作者背书；有论文合作者/导师邮箱可用时最快。
5. Preview PDF核对（应7页、无乱码）→ Submit。审核通常1-2个工作日；避开周五美东时间提交（顺延到下周一公告）。
6. 公告后把arXiv编号回填README/paper/仓库topics，并在房间发公告（走外交官）。

## 复现构建（本机）

```
pandoc paper/arxiv/main.md -f markdown+tex_math_dollars -t latex -s -o main.tex \
  -V documentclass=article -V fontsize=11pt -V geometry:margin=1in \
  -V "title=..." -V "author=Lifeng Tian" --metadata date="November 2026"
pdflatex -interaction=nonstopmode main.tex  # 跑两遍
```

已知处理：∎→\blacksquare；ref[31]中文标题译为英文并注(in Chinese)（保pdflatex全平台可编，arXiv AutoTeX无需CJK字体）。
