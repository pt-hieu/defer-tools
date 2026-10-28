# defer-tools

defer-tools is a Claude Code mod that moves rarely used built-in tools behind ToolSearch. Claude sees each moved tool's name and loads its full schema the first time it calls the tool, so a session that leaves these tools unused keeps their schemas out of context.

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

This repo is also the marketplace that lists the mod. From any Claude Code session:

```
/plugin install defer-tools --marketplace pt-hieu/defer-tools
```

Answer `y` to add the marketplace, then pick a scope. The mod moves the tools when Claude Code builds a session's first request, so run `/context` after your first message to see the result.

## How it works

The mod hooks `tool.describe` for each listed tool and answers with the engine's description and `isDeferred: true`, and Claude Code announces the moved tools to Claude as new deferred tools. To change the list, edit `DEFERRED_TOOLS` in `plugins/defer-tools/hooks/register.ts`.

## Development

Clone the repo and load the mod from its folder for one session:

```
claude --plugin-dir <path to this repo>/plugins/defer-tools
```

The engine writes the mod's API types to `plugins/defer-tools/.claude-plugin/types/` when it first loads the mod, and `typecheck` reads them, so start that session once before running the checks:

```
bun install
bun run validate
bun run test
bun run typecheck
```

## License

MIT
