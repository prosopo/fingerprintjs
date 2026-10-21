import getColorDepth from './color_depth'
import getFonts from './fonts'
import getHardwareConcurrency from './hardware_concurrency'
import getPlatform from './platform'
import getScreenResolution from './screen_resolution'

/**
 * An opaque digest of the device characteristics that do not change between
 * sessions.
 *
 * Its purpose is to be *disclosable*. A proof of fingerprint commits to every
 * component but reveals only a few, and revealing these inputs individually
 * would tell a verifier the visitor's platform, screen size and installed
 * fonts. Committing to a digest of them instead lets the verifier group a
 * returning device without learning anything about it: the value it receives
 * is a hash and nothing else.
 *
 * Excluded from the visitorId (see `NON_IDENTITY_SOURCES` in
 * @prosopo/fingerprint): every input is already a component in its own right,
 * so this adds no entropy, and folding it in would change every existing
 * visitorId, which the account address is a pure function of.
 *
 * Deliberately leaves out timezone and language. Both follow whichever exit
 * region a client presents rather than the device itself, so including them
 * would make one machine group differently per region.
 */
export default async function getDeviceBucket(): Promise<string> {
  const [fonts, screenResolution] = await Promise.all([getFonts(), getScreenResolution()])
  const parts = [
    getPlatform(),
    screenResolution?.join('x') ?? '',
    String(getColorDepth()),
    String(getHardwareConcurrency()),
    fonts.join(' '),
  ]
  // Font names contain spaces, so the parts cannot be space-separated.
  return hash128(parts.join('|'))
}

/**
 * x64hash128 is not reused here: it lives in the agent, and importing it into a
 * source would invert the dependency. This needs to separate device profiles,
 * not withstand an adversary; a client wanting a different digest only has to
 * present a different device, which is the property the grouping relies on.
 */
function hash128(input: string): string {
  let a = 0x811c9dc5
  let b = 0x01000193
  let c = 0x9e3779b9
  let d = 0x85ebca6b
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    a = Math.imul(a ^ ch, 0x01000193)
    b = Math.imul(b + ch, 0x85ebca6b) ^ (a >>> 13)
    c = Math.imul(c ^ (ch + i), 0xc2b2ae35)
    d = Math.imul(d + (ch << (i & 7)), 0x27d4eb2f) ^ (c >>> 16)
  }
  return [a, b, c, d].map((n) => (n >>> 0).toString(16).padStart(8, '0')).join('')
}
