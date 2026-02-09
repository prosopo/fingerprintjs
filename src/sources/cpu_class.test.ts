import getCpuClass from './cpu_class'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('cpuClass', () => {
    it('handles browser native value', () => {
      const result = getCpuClass()
      expect(result).toBe(undefined)
    })
  })
})
