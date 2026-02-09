import getIndexedDB from './indexed_db'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('indexedDB', () => {
    it('returns boolean or undefined depending on the browser', () => {
      const result = getIndexedDB()
      expect(['boolean', 'undefined']).toContain(typeof result)
    })
  })
})
