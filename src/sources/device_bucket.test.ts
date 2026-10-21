import { withMockProperties } from '../../tests/utils'
import getDeviceBucket from './device_bucket'
import { describe, expect, it } from 'vitest'

describe('Sources', () => {
  describe('deviceBucket', () => {
    it('returns a 128 bit hex digest', async () => {
      await expect(getDeviceBucket()).resolves.toMatch(/^[0-9a-f]{32}$/)
    })

    it('returns the same digest for an unchanged device', async () => {
      const first = await getDeviceBucket()
      const second = await getDeviceBucket()

      expect(second).toBe(first)
    })

    it('changes when the platform changes', async () => {
      const before = await getDeviceBucket()

      await withMockProperties(navigator, { platform: { get: () => 'Nintendo 64' } }, async () => {
        await expect(getDeviceBucket()).resolves.not.toBe(before)
      })
    })

    it('changes when the core count changes', async () => {
      const before = await getDeviceBucket()

      await withMockProperties(navigator, { hardwareConcurrency: { get: () => 99 } }, async () => {
        await expect(getDeviceBucket()).resolves.not.toBe(before)
      })
    })

    it('ignores the timezone, which follows the exit region rather than the device', async () => {
      const before = await getDeviceBucket()
      const resolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions

      Intl.DateTimeFormat.prototype.resolvedOptions = function (): Intl.ResolvedDateTimeFormatOptions {
        return { ...resolvedOptions.call(this), timeZone: 'Pacific/Chatham' }
      }
      try {
        await expect(getDeviceBucket()).resolves.toBe(before)
      } finally {
        Intl.DateTimeFormat.prototype.resolvedOptions = resolvedOptions
      }
    })
  })
})
