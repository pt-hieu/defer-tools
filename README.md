# defer-tools

A Claude Code mod, and the local marketplace that lists it, that moves rarely used built-in tools behind ToolSearch. Claude sees each tool's name and loads its full schema into context the first time it calls the tool, so sessions that leave these tools unused keep their schemas out of context.

On Claude Code 2.1.308 with Opus 5.5, the mod brought the System tools row of `/context` from 13.4k tokens to 3.1k.

## What it defers

| Tool | Used for |
| --- | --- |
| `Workflow` | Multi-agent orchestration, when you ask for it |
| `ScheduleWakeup` | Self-paced `/loop` |
| `ListAgents` | Finding sessions to message with `SendMessage`, itself deferred |
| `CronCreate`, `CronDelete`, `CronList` | `/loop` on a fixed interval |

Workflow's schema is most of the saving. A tool listed in `permissions.deny` is removed before the mod runs and stays removed.

## Install

From any Claude Code session:

```
/plugin install defer-tools --marketplace pt-hieu/defer-tools
```

Answer `y` to add the marketplace, then pick a scope.

The mod moves the tools when Claude Code builds the first request of a session, so check the result with `/context` after your first message.

For development, clone this repo and load the mod from its folder for one session:

```
claude --plugin-dir <path to this repo>/plugins/defer-tools
```

## How it works

The mod hooks `tool.describe` for each listed tool and answers with the engine's description and `isDeferred: true`. Claude Code then announces the moved tools to Claude as new deferred tools. To change the list, edit `DEFERRED_TOOLS` in `plugins/defer-tools/hooks/register.ts`.

## Development

```
bun install
bun run validate
bun run test
bun run typecheck
```

`typecheck` reads the API types in `plugins/defer-tools/.claude-plugin/types/`. The engine writes them when it loads the mod, and they are committed, so a fresh clone type checks as is. Commit them again when a Claude Code upgrade rewrites them.

## License

MIT
