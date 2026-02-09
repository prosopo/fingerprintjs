import getSessionStorage from './session_storage'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('sessionStorage', () => {
    it('returns boolean', () => {
      expect(typeof getSessionStorage()).toBe('boolean')
    })
  })
})
