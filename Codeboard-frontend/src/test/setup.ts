import { expect, afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = vi.fn();
}

// Set up global mocks
beforeAll(() => {
  // Mock IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

  // Mock ResizeObserver
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock window.matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // Mock window.scrollTo
  window.scrollTo = vi.fn((xOrOptions?: number | ScrollToOptions, y?: number) => {});
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
