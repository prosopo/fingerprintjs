import { withMockMatchMedia } from '../../tests/utils'
import isTransparencyReduced from './reduced_transparency'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('reducedTransparency', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(isTransparencyReduced())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'prefers-reduced-transparency': [undefined] }, true, () =>
        expect(isTransparencyReduced()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'prefers-reduced-transparency': ['no-preference'] }, true, () =>
        expect(isTransparencyReduced()).toBe(false),
      )
      await withMockMatchMedia({ 'prefers-reduced-transparency': ['reduce'] }, true, () =>
        expect(isTransparencyReduced()).toBe(true),
      )
    })
  })
})
