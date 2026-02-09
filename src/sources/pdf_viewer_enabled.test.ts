import isPdfViewerEnabled from './pdf_viewer_enabled'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('pdvViewerEnabled', () => {
    it('returns boolean or undefined', () => {
      expect(['boolean', 'undefined']).toContain(typeof isPdfViewerEnabled())
    })
  })
})
