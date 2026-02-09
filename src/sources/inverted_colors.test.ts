import { withMockMatchMedia } from '../../tests/utils'
import areColorsInverted from './inverted_colors'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('invertedColors', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(areColorsInverted())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'inverted-colors': [undefined] }, true, () =>
        expect(areColorsInverted()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'inverted-colors': ['none'] }, true, () => expect(areColorsInverted()).toBe(false))
      await withMockMatchMedia({ 'inverted-colors': ['inverted'] }, true, () => expect(areColorsInverted()).toBe(true))
    })
  })
})
