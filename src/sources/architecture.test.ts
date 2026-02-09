import getArchitecture from './architecture'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('architecture', () => {
    it("doesn't fail", () => {
      const result = getArchitecture()
      expect([127, 255]).toContain(result)
    })

    it('returns a stable value', () => {
      const first = getArchitecture()
      const second = getArchitecture()
      expect(second).toBe(first)
    })
  })
})