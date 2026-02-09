import getCookiesEnabled from './cookies_enabled'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('cookiesEnabled', () => {
    it('returns boolean', () => {
      expect(typeof getCookiesEnabled()).toBe('boolean')
    })
  })
})
