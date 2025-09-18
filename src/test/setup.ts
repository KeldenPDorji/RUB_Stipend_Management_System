import '@testing-library/jest-dom'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  cb: any;
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() { return []; }
};
