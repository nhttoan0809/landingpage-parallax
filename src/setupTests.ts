/// <reference types="vitest" />

import '@testing-library/jest-dom/vitest'

beforeAll(() => {
  window.matchMedia = window.matchMedia ?? ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }))

  if (!('IntersectionObserver' in window)) {
    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return []
      }
    }
    // @ts-expect-error test environment polyfill
    window.IntersectionObserver = MockIntersectionObserver
  }

  if (!('ResizeObserver' in window)) {
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // @ts-expect-error test environment polyfill
    window.ResizeObserver = MockResizeObserver
  }
})

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>'
})
