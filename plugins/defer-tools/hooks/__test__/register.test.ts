import { expect, test } from 'claude-code/testing'

import { DEFERRED_SKILLS, DEFERRED_TOOLS } from '../register.ts'

const CORE = { plugin: 'engine', tier: 'core' } as const

test('each listed tool goes behind ToolSearch with its description kept', async ($, on) => {
  // Stands for the engine: it lists every tool in front.
  on('tool.describe', (_, e) => ({ description: e.description }))

  for (const tool of DEFERRED_TOOLS) {
    const result = await $.tool.describe({ tool, description: `${tool} text`, provider: CORE })

    expect(result).toEqual({ description: `${tool} text`, isDeferred: true })
  }
})

test('an unlisted tool keeps the placement beneath', async ($, on) => {
  on('tool.describe', (_, e) => ({ description: e.description }))

  const result = await $.tool.describe({ tool: 'Bash', description: 'Bash text', provider: CORE })

  expect(result).toEqual({ description: 'Bash text' })
})

const ENGINE = { kind: 'engine' } as const

test('each listed skill keeps its name in the listing and loses its description', async ($, on) => {
  // Stands for the engine: it lists every skill with its description.
  on('prompt.attachment', (_, e) => ({ text: e.text }))

  const listed = DEFERRED_SKILLS.map(skill => `- ${skill}: ${skill} text`)
  const text = ['Skills:', ...listed, '- commit: commit text'].join('\n')

  const result = await $.prompt.attachment({ type: 'skill_listing', text, origin: ENGINE })

  const named = DEFERRED_SKILLS.map(skill => `- ${skill}`)
  expect(result).toEqual({ text: ['Skills:', ...named, '- commit: commit text'].join('\n') })
})

test('another attachment keeps its text', async ($, on) => {
  on('prompt.attachment', (_, e) => ({ text: e.text }))

  const text = '- terminal-browser: a line that is not a skill listing'
  const result = await $.prompt.attachment({ type: 'todo_reminder', text, origin: ENGINE })

  expect(result).toEqual({ text })
})
