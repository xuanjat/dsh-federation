# dshmarket submission draft (P0 propaganda item)

Status: materials ready, PR not yet filed — filing a PR to `dsh-market/dsh-market`
needs the repo owner's GitHub account (tlf). Everything below is copy-paste ready.

## 1. What we submit

Plugin bundle: `tools/plugin` → published name **murmuration-tools** (v0.3.1, 7 tools:
fed_room_scan / fed_room_post / fed_cursor / fed_handoff_verify / fed_ack_board /
fed_trigger_watch / fed_watchdog_note).

Repo: https://github.com/xuanjat/dsh-federation (renaming to `murmuration`; old URLs redirect).

## 2. Catalog entry (format-1, per dshmarket index.json)

```json
{
  "name": "murmuration-tools",
  "version": "0.3.1",
  "description": "Seven room-protocol tools (scan/post/cursor/verify/ack board/trigger watch/watchdog note) that let DSH agents on multiple machines coordinate through a plain-text append-only store — pointers and digests in the room, payloads over the channels you already have.",
  "repository": "https://github.com/xuanjat/dsh-federation",
  "install": "dsh plugin --profile web add <path-to-repo>/tools/plugin",
  "keywords": ["multi-agent", "coordination", "federation", "agents", "protocol"]
}
```

(Exact field names: mirror an existing entry in
https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json at PR time.)

## 3. Steps for tlf

1. (already pending) Rename repo to `murmuration` in Settings.
2. Fork `dsh-market/dsh-market`, add the entry above to the catalog index, open PR
   titled `add murmuration-tools v0.3.1`, linking docs/OPEN-LETTER.en.md + docs/DEMO.md.
3. After merge: check the plugin page renders the icon (tools/plugin/icon.svg).
