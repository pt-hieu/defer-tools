import type { Register } from 'claude-code'

export const DEFERRED_TOOLS = [
  'Workflow',
  'ScheduleWakeup',
  'ListAgents',
  'CronCreate',
  'CronDelete',
  'CronList',
] as const

export const DEFERRED_SKILLS = ['terminal-browser'] as const

const nameOnly = (line: string) => {
  const skill = DEFERRED_SKILLS.find(name => line.startsWith(`- ${name}: `))

  return skill ? `- ${skill}` : line
}

export const register: Register = on => {
  for (const tool of DEFERRED_TOOLS) {
    on('tool.describe', { tool }, async ($, e, next) => ({
      ...(await next(e)),
      isDeferred: true,
    }))
  }

  on('prompt.attachment', { type: 'skill_listing' }, async ($, e, next) => {
    const { text } = await next(e)

    return { text: text === null ? null : text.split('\n').map(nameOnly).join('\n') }
  })
}
