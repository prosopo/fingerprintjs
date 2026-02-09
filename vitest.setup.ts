// Copyright 2021-2026 Prosopo (UK) Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock WebGLRenderingContext for instanceof checks BEFORE creating getContext mock
if (typeof WebGLRenderingContext === 'undefined') {
  ;(global as any).WebGLRenderingContext = class WebGLRenderingContext {}
}

// Mock Canvas getContext to prevent warnings
const mockGetContext = vi.fn((contextId: string) => {
  if (contextId === '2d') {
    return {
      fillStyle: '',
      strokeStyle: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      arcTo: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      quadraticCurveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      isPointInPath: vi.fn(() => true), // Changed to true for canvas winding test
      isPointInStroke: vi.fn(() => false),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
    }
  }
  if (contextId === 'webgl' || contextId === 'experimental-webgl') {
    // Create a proper WebGLRenderingContext instance
    const glContext = Object.create(WebGLRenderingContext.prototype)
    Object.assign(glContext, {
      canvas: {},
      drawingBufferWidth: 300,
      drawingBufferHeight: 150,
      getContextAttributes: vi.fn(() => ({})),
      isContextLost: vi.fn(() => false),
      getSupportedExtensions: vi.fn(() => []),
      getExtension: vi.fn(() => null),
      getParameter: vi.fn((param: number) => {
        // Return reasonable defaults for common parameters
        if (param === 37445) return 'WebKit WebGL' // VENDOR
        if (param === 37446) return 'WebKit' // RENDERER
        return null
      }),
      getShaderPrecisionFormat: vi.fn(() => ({
        rangeMin: 127,
        rangeMax: 127,
        precision: 23,
      })),
    })
    return glContext
  }
  return null
})

HTMLCanvasElement.prototype.getContext = mockGetContext as any
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')

// Mock screen dimensions
Object.defineProperty(window.screen, 'width', {
  writable: true,
  value: 1920,
})
Object.defineProperty(window.screen, 'height', {
  writable: true,
  value: 1080,
})

// Mock touch support (no touch support by default in jsdom)
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  configurable: true,
  value: 0,
})

// Ensure no touch events in window
if ('ontouchstart' in window) {
  delete (window as any).ontouchstart
}
if ('TouchEvent' in window) {
  delete (window as any).TouchEvent
}

// Mock AudioContext for audio tests
if (typeof AudioContext === 'undefined') {
  ;(global as any).AudioContext = class AudioContext {
    baseLatency = 0.01
    sampleRate = 44100
    createOscillator() {
      return {
        frequency: { value: 1000 },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
    }
    createDynamicsCompressor() {
      return {
        threshold: { value: -50 },
        knee: { value: 40 },
        ratio: { value: 12 },
        reduction: { value: -20 },
        attack: { value: 0 },
        release: { value: 0.25 },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }
    }
    createAnalyser() {
      return {
        fftSize: 2048,
        frequencyBinCount: 1024,
        connect: vi.fn(),
        disconnect: vi.fn(),
        getFloatFrequencyData: vi.fn(),
      }
    }
    get destination() {
      return {
        maxChannelCount: 2,
      }
    }
  }
}
