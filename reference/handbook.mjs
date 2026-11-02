#!/usr/bin/env node
/**
 * DSH 通用工作经验手册 · 读写工具
 *
 * 手册文件：%DSH_HOME%\HANDBOOK.md（默认 %USERPROFILE%\.dsh\HANDBOOK.md）
 * 由用户级 AGENTS.md 规定：每个会话开工前 `index`，收工时 `add`。
 *
 * 用法：
 *   node handbook.mjs index                       # 索引（开工前先跑这个）
 *   node handbook.mjs find <关键词> [关键词2 ...]  # 按关键词查条目（命中即照做）
 *   node handbook.mjs show H-007                  # 看一条全文
 *   node handbook.mjs add --area 领域 --title 标题 --scene 场景 --conclusion 结论 \
 *        [--where 落地] [--source 来源] [--status 已验证|待复核] [--date yyyy-mm-dd]
 *   node handbook.mjs check                       # 自检：编号/索引/字段一致性
 *   node handbook.mjs stats                       # 数量与体量
 *   node handbook.mjs archive [--keep 60]         # 体积过大时把旧条目移到归档文件
 *
 * 约定：append-only。条目只增不改；纠错写新条目并在结论里指向旧编号。
 * 不写 token / 密码 / 私钥 / 一次性进度。
 */
import { readFileSync, writeFileSync, renameSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

const FILE = process.env.HANDBOOK_FILE
  || join(process.env.DSH_HOME || join(process.env.USERPROFILE || process.env.HOME || '.', '.dsh'), 'HANDBOOK.md');
const INDEX_BEGIN = '<!-- INDEX:BEGIN -->';
const INDEX_END = '<!-- INDEX:END -->';
const ENTRIES_MARK = '<!-- ENTRIES -->';
const MAX_BYTES = 200 * 1024;

const ID_RE = /^### (H-\d{3})\s+(.+?)\s*$/gm;

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function readText() {
  if (!existsSync(FILE)) {
    console.error(`手册不存在: ${FILE}`);
    process.exit(2);
  }
  return readFileSync(FILE, 'utf8');
}

/** 把文件解析成条目数组（id / title / raw / fields）。 */
function parseEntries(text) {
  const marks = [...text.matchAll(ID_RE)];
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].index;
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length;
    const raw = text.slice(start, end);
    const fields = {};
    for (const line of raw.split(/\r?\n/).slice(1)) {
      const m = /^- ([^:：]+)[:：]\s*(.*)$/.exec(line);
      if (m) fields[m[1].trim()] = m[2].trim();
    }
    out.push({ id: marks[i][1], title: marks[i][2].trim(), raw, fields });
  }
  return out;
}

function renderIndex(entries) {
  const rows = entries.map((e) =>
    `| ${e.id} | ${e.fields['领域'] || '-'} | ${e.title} | ${e.fields['状态'] || '-'} |`);
  return [
    INDEX_BEGIN,
    '| 编号 | 领域 | 主题 | 状态 |',
    '|---|---|---|---|',
    ...rows,
    INDEX_END,
  ].join('\n');
}

/** 用当前条目重建索引区；保留索引区之外的全部内容。 */
function rebuildIndex(text, entries) {
  const b = text.indexOf(INDEX_BEGIN);
  const e = text.indexOf(INDEX_END);
  if (b < 0 || e < 0) throw new Error('手册缺少 INDEX:BEGIN/INDEX:END 标记');
  return text.slice(0, b) + renderIndex(entries) + text.slice(e + INDEX_END.length);
}

function atomicWrite(text) {
  const tmp = `${FILE}.tmp-${process.pid}`;
  writeFileSync(tmp, text, 'utf8');
  renameSync(tmp, FILE);
}

function saveEntries(text, entries) {
  let next = rebuildIndex(text, entries);
  // 保证条目区标记存在
  if (!next.includes(ENTRIES_MARK)) {
    throw new Error('手册缺少 <!-- ENTRIES --> 标记');
  }
  atomicWrite(next);
}

function fail(msg) { console.error(msg); process.exit(2); }

function line(s) { return `- ${s}`; }

function renderEntry(e) {
  const lines = [
    `### ${e.id} ${e.title}`,
    line(`领域: ${e.fields['领域'] || '-'}`),
    line(`状态: ${e.fields['状态'] || '- '}`.trim()),
    line(`日期: ${e.fields['日期'] || today()}`),
    line(`场景: ${e.fields['场景'] || '-'}`),
    line(`结论: ${e.fields['结论'] || '-'}`),
  ];
  if (e.fields['落地']) lines.push(line(`落地: ${e.fields['落地']}`));
  if (e.fields['来源']) lines.push(line(`来源: ${e.fields['来源']}`));
  return `${lines.join('\n')}\n`;
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[key] = true;
      else { flags[key] = next; i++; }
    }
  }
  return flags;
}

const [cmd, ...rest] = process.argv.slice(2);
const text = readText();
const entries = parseEntries(text);

switch (cmd) {
  case 'index': {
    if (!entries.length) fail('手册里还没有条目。');
    const last = entries[entries.length - 1];
    console.log(`手册: ${FILE}`);
    console.log(`条目: ${entries.length} 条（最新 ${last.id} · ${last.fields['日期'] || '-'}）\n`);
    console.log('| 编号 | 领域 | 主题 | 状态 |');
    console.log('|---|---|---|---|');
    for (const e of entries) {
      console.log(`| ${e.id} | ${e.fields['领域'] || '-'} | ${e.title} | ${e.fields['状态'] || '-'} |`);
    }
    console.log('\n查详情: node handbook.mjs find <关键词>   或   show <编号>');
    break;
  }

  case 'find': {
    const kws = rest.filter((x) => !x.startsWith('--')).map((s) => s.toLowerCase());
    if (!kws.length) fail('用法: find <关键词> [关键词...]');
    const hits = entries.filter((e) => {
      const hay = `${e.id} ${e.title} ${JSON.stringify(e.fields)}`.toLowerCase();
      return kws.some((k) => hay.includes(k));
    });
    if (!hits.length) {
      console.log(`没有匹配 ${kws.join(' / ')} 的条目。先按现有结论做；若确有新坑，收工时用 add 入库。`);
      break;
    }
    for (const e of hits) {
      console.log(`${e.id} ${e.title}  [${e.fields['状态'] || '-'}]`);
      console.log(`  领域: ${e.fields['领域'] || '-'}`);
      console.log(`  场景: ${e.fields['场景'] || '-'}`);
      console.log(`  结论: ${e.fields['结论'] || '-'}`);
      if (e.fields['落地']) console.log(`  落地: ${e.fields['落地']}`);
      console.log('');
    }
    break;
  }

  case 'show': {
    const id = (rest[0] || '').toUpperCase();
    const e = entries.find((x) => x.id === id);
    if (!e) fail(`没有 ${id}`);
    console.log(e.raw.trimEnd());
    break;
  }

  case 'add': {
    const f = parseFlags(rest);
    if (!f.title || !f.area || !f.scene || !f.conclusion) {
      fail('用法: add --area 领域 --title 标题 --scene 场景 --conclusion 结论 [--where 落地] [--source 来源] [--status 已验证|待复核]');
    }
    const lastNum = entries.reduce((m, e) => Math.max(m, Number(e.id.slice(2))), 0);
    const nextId = `H-${String(lastNum + 1).padStart(3, '0')}`;
    const entry = {
      id: nextId,
      title: String(f.title).trim(),
      fields: {
        '领域': String(f.area).trim(),
        '状态': f.status === '待复核' ? '⚠️ 待复核' : '✅ 已验证',
        '日期': f.date ? String(f.date) : today(),
        '场景': String(f.scene).trim(),
        '结论': String(f.conclusion).trim(),
        '落地': f.where ? String(f.where).trim() : '',
        '来源': f.source ? String(f.source).trim() : '',
      },
    };
    let next = text;
    if (!next.endsWith('\n')) next += '\n';
    next = next.trimEnd() + '\n\n' + renderEntry(entry);
    saveEntries(next, [...entries, entry]);
    console.log(`已入库: ${nextId} ${entry.title}`);
    console.log(`文件: ${FILE} (${statSync(FILE).size} bytes, ${entries.length + 1} 条)`);
    break;
  }

  case 'check': {
    const problems = [];
    const seen = new Set();
    let prev = 0;
    for (const e of entries) {
      if (seen.has(e.id)) problems.push(`重复编号 ${e.id}`);
      seen.add(e.id);
      const n = Number(e.id.slice(2));
      if (n <= prev) problems.push(`编号未递增: ${e.id} 在 ${prev} 之后`);
      prev = Math.max(prev, n);
      for (const key of ['领域', '状态', '场景', '结论']) {
        if (!e.fields[key]) problems.push(`${e.id} 缺字段「${key}」`);
      }
      if (!/✅|⚠️/.test(e.fields['状态'] || '')) problems.push(`${e.id} 状态值不规范: ${e.fields['状态']}`);
    }
    const idxRows = [...text.matchAll(/^\| (H-\d{3}) \|/gm)].map((m) => m[1]);
    const ids = entries.map((e) => e.id);
    if (idxRows.join(',') !== ids.join(',')) {
      problems.push(`索引与条目不一致（索引 ${idxRows.length} 行 / 条目 ${ids.length} 条）→ 跑 add 会自动重建索引`);
    }
    const size = statSync(FILE).size;
    if (size > MAX_BYTES) problems.push(`手册 ${(size / 1024).toFixed(0)}KB 超过 ${MAX_BYTES / 1024}KB，建议 archive`);
    if (problems.length) {
      console.log('✗ 自检未通过:');
      for (const p of problems) console.log(`  - ${p}`);
      process.exit(1);
    }
    console.log(`✓ 自检通过: ${entries.length} 条, 索引一致, 字段齐全, ${(size / 1024).toFixed(1)}KB`);
    break;
  }

  case 'stats': {
    const byArea = {};
    for (const e of entries) byArea[e.fields['领域'] || '-'] = (byArea[e.fields['领域'] || '-'] || 0) + 1;
    console.log(`文件: ${FILE}`);
    console.log(`体量: ${(statSync(FILE).size / 1024).toFixed(1)}KB / 上限 ${MAX_BYTES / 1024}KB`);
    console.log(`条目: ${entries.length}`);
    console.log(`最新: ${entries.length ? entries[entries.length - 1].id + ' ' + entries[entries.length - 1].title : '-'}`);
    console.log('按领域:');
    for (const [k, v] of Object.entries(byArea).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
    break;
  }

  case 'archive': {
    const f = parseFlags(rest);
    const keep = Number(f.keep || 60);
    if (entries.length <= keep) { console.log(`只有 ${entries.length} 条，未超过 keep=${keep}，无需归档。`); break; }
    const oldOnes = entries.slice(0, entries.length - keep);
    const keepOnes = entries.slice(entries.length - keep);
    const archivePath = join(dirname(FILE), `HANDBOOK-ARCHIVE-${today()}.md`);
    const header = existsSync(archivePath) ? '' : `# DSH 经验手册归档（${today()}）\n\n> 由 handbook.mjs archive 生成；按编号可追溯。\n\n`;
    writeFileSync(archivePath, header + oldOnes.map((e) => e.raw.trimEnd() + '\n').join('\n'), { flag: 'a', encoding: 'utf8' });
    const b = text.indexOf(INDEX_BEGIN);
    const e2 = text.indexOf(INDEX_END);
    const head = text.slice(0, b);
    const tail = text.slice(e2 + INDEX_END.length);
    const bStart = text.indexOf(INDEX_BEGIN);
    const idxEnd = text.indexOf(INDEX_END) + INDEX_END.length;
    const markAt = text.indexOf(ENTRIES_MARK);
    if (bStart < 0 || markAt < 0) throw new Error('手册缺少 INDEX / ENTRIES 标记');
    const markEnd = markAt + ENTRIES_MARK.length;
    const rebuilt = text.slice(0, bStart)
      + renderIndex(keepOnes)
      + text.slice(idxEnd, markEnd)
      + '\n\n'
      + keepOnes.map((e) => e.raw.trimEnd() + '\n\n').join('');
    atomicWrite(rebuilt.trimEnd() + '\n');
    console.log(`归档文件: ${archivePath}`);
    console.log(`已归档 ${oldOnes.length} 条 → ${basename(archivePath)}；保留 ${keepOnes.length} 条。`);
    break;
  }

  default:
    console.log('用法见文件头注释。常用: index | find <关键词> | show H-001 | add ... | check');
    process.exit(cmd ? 2 : 0);
}
