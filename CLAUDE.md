# defer-tools

## Before committing

**Version bumps**: in the same commit as any change to `plugins/defer-tools/`:

1. `plugins/defer-tools/.claude-plugin/plugin.json`: the plugin's `version`.
2. `.claude-plugin/marketplace.json`: the matching per-plugin `version` entry.
3. `.claude-plugin/marketplace.json`: the top-level `metadata.version`.

**Tool list**: a change to `DEFERRED_TOOLS` updates the table in `README.md`.
