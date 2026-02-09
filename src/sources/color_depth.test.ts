import getColorDepth from './color_depth'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('colorDepth', () => {
    it('handles browser native value', () => {
      const result = getColorDepth()
      expect([48, 36, 32, 30, 24, 18, 16, 15, 12, 8, 0]).toContain(result)
    })
  })
})
