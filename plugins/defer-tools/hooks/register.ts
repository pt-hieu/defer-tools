import type { Register } from 'claude-code'

export const DEFERRED_TOOLS = [
  'Workflow',
  'ScheduleWakeup',
  'ListAgents',
  'CronCreate',
  'CronDelete',
  'CronList',
] as const

export const register: Register = on => {
  for (const tool of DEFERRED_TOOLS) {
    on('tool.describe', { tool }, async ($, e, next) => ({
      ...(await next(e)),
      isDeferred: true,
    }))
  }
}
