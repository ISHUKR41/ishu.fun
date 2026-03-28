/**
 * scrollOptimization.ts - Scroll Performance Utilities
 *
 * Collection of utilities to optimize scrolling performance across all devices
 */

/**
 * Prevents layout thrashing by batching DOM reads and writes
 */
export class ScrollOptimizer {
  private rafId: number | null = null;
  private scrollCallbacks: Set<() => void> = new Set();

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
  }

  private handleScroll() {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.scrollCallbacks.forEach((cb) => cb());
      this.rafId = null;
    });
  }

  public addListener(callback: () => void) {
    if (this.scrollCallbacks.size === 0) {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    this.scrollCallbacks.add(callback);
  }

  public removeListener(callback: () => void) {
    this.scrollCallbacks.delete(callback);
    if (this.scrollCallbacks.size === 0) {
      window.removeEventListener('scroll', this.handleScroll);
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  public destroy() {
    this.scrollCallbacks.clear();
    window.removeEventListener('scroll', this.handleScroll);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

/**
 * Debounces scroll events for heavy operations
 */
export const debounceScroll = (
  callback: () => void,
  delay: number = 100
): (() => void) => {
  let timeoutId: NodeJS.Timeout;

  const debouncedFn = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };

  return debouncedFn;
};

/**
 * Throttles scroll events to run at most once per interval
 */
export const throttleScroll = (
  callback: () => void,
  limit: number = 16
): (() => void) => {
  let inThrottle: boolean = false;

  return () => {
    if (!inThrottle) {
      callback();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Creates a passive scroll listener (better performance)
 */
export const addPassiveScrollListener = (
  element: Window | HTMLElement,
  handler: EventListener
) => {
  element.addEventListener('scroll', handler, { passive: true });

  return () => {
    element.removeEventListener('scroll', handler);
  };
};

/**
 * Detects if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Gets optimized scroll behavior based on user preference
 */
export const getScrollBehavior = (): ScrollBehavior => {
  return prefersReducedMotion() ? 'auto' : 'smooth';
};

/**
 * Smooth scroll to element with callback
 */
export const smoothScrollToElement = (
  selector: string,
  options?: ScrollIntoViewOptions,
  callback?: () => void
) => {
  const element = document.querySelector(selector);
  if (!element) return;

  const defaultOptions: ScrollIntoViewOptions = {
    behavior: getScrollBehavior(),
    block: 'start',
    inline: 'nearest',
  };

  element.scrollIntoView({ ...defaultOptions, ...options });

  if (callback) {
    // Wait for scroll to finish
    setTimeout(callback, 600);
  }
};

/**
 * Checks if element is in viewport
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Gets scroll percentage of the page
 */
export const getScrollPercentage = (): number => {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  return documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
};

/**
 * Lock scroll (useful for modals)
 */
export const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
};

/**
 * Unlock scroll
 */
export const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

// Global instance
export const scrollOptimizer = new ScrollOptimizer();
