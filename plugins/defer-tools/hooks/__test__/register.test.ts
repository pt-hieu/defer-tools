import { expect, test } from 'claude-code/testing'

import { DEFERRED_TOOLS } from '../register.ts'

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
