import { withMockMatchMedia } from '../../tests/utils'
import isMotionReduced from './reduced_motion'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('reducedMotion', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(isMotionReduced())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'prefers-reduced-motion': [undefined] }, true, () =>
        expect(isMotionReduced()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'prefers-reduced-motion': ['no-preference'] }, true, () =>
        expect(isMotionReduced()).toBe(false),
      )
      await withMockMatchMedia({ 'prefers-reduced-motion': ['reduce'] }, true, () =>
        expect(isMotionReduced()).toBe(true),
      )
    })
  })
})
