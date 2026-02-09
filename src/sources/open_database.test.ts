import getOpenDatabase from './open_database'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('openDatabase', () => {
    it('returns boolean', () => {
      expect(typeof getOpenDatabase()).toBe('boolean')
    })
  })
})
