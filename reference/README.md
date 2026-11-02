# reference/ —— 参考工具

## handbook.mjs

生产环境（作者的工作站）实际使用的手册工具，原样收录。零第三方依赖，Node.js ≥ 18。

```bash
node handbook.mjs index                                  # 列出索引
node handbook.mjs find <关键词>                           # 检索条目
node handbook.mjs show H-001                             # 查看条目全文
node handbook.mjs add --area <领域> --title <标题> \
     --scene <场景> --conclusion <结论> \
     --where <命令或路径> --status <状态>                 # 追加条目（append-only）
node handbook.mjs check                                  # 自检编号与索引一致性
node handbook.mjs archive <H-NNN>                        # 归档条目
```

## 用法

1. 复制到 `~/.dsh/bin/handbook.mjs`（Windows: `C:\Users\<你>\.dsh\bin\handbook.mjs`）。
2. 用 [templates/AGENTS.template.md](../templates/AGENTS.template.md) 把"开工先查手册、收工写回、手册 append-only"注入用户级 AGENTS.md。
3. 手册本体放 `~/.dsh/HANDBOOK.md`，骨架见 [templates/HANDBOOK.template.md](../templates/HANDBOOK.template.md)。

## 设计要点

- **append-only**：发现旧条目错了，写新条目并在结论里标注"更正 H-0xx"，不修改旧条目——保证经验可追溯。
- **INDEX/ENTRIES 双标记**：文件顶部维护索引，正文按标记追加；`check` 自检两边一致性。
- **手册是全机共享的**：只写跨工作区成立的事实，不写一次性任务进度。
