import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Tunable animation constants
export const DURATION = 0.9;
export const EASE = 'power3.out';
export const STAGGER = 0.08;
export const SCRUB = 0.6;
export const DIM_OPACITY = 0.3;
export const START = 'top 85%';
export const END = 'top 40%';
export const PARALLAX_PX = 40;

/**
 * Refreshes ScrollTrigger instances (e.g. on font load or project filter changes).
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

/**
 * Initializes scroll-driven text and card animations scoped to rootEl.
 * Safe for React StrictMode (effects running twice in dev).
 *
 * @param {HTMLElement} rootEl
 * @returns {() => void} cleanup function
 */
export function initScrollAnimations(rootEl) {
  if (!rootEl) return () => {};

  // After document.fonts.ready resolves, refresh ScrollTrigger to recalculate metrics
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        ScrollTrigger.refresh();
      })
      .catch(() => {});
  }

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia(rootEl);

    // 1. (prefers-reduced-motion: reduce): create NO animations; everything is visible and static.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('[data-reveal]', {
        opacity: 1,
        x: 0,
        y: 0,
        clearProps: 'transform,opacity'
      });
    });

    // 2. (min-width: 1024px): full scrubbed effects.
    mm.add('(min-width: 1024px)', () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      setupDesktopAnimations(rootEl);
    });

    // 3. (max-width: 1023px): simplified, un-scrubbed fade-up (one-shot, once: true) for headings, copy and cards.
    mm.add('(max-width: 1023px)', () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      setupMobileAnimations(rootEl);
    });
  }, rootEl);

  return () => {
    ctx.revert();
  };
}

function setupDesktopAnimations(rootEl) {
  setupHeadingsDesktop(rootEl);
  setupCardsDesktop(rootEl);
}

function setupMobileAnimations(rootEl) {
  const targets = rootEl.querySelectorAll('[data-reveal="heading"], [data-reveal="copy"], [data-reveal="card"]');
  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: START,
          once: true
        }
      }
    );
  });
}

function setupHeadingsDesktop(rootEl) {
  // Handled in Phase 1
}

function setupCardsDesktop(rootEl) {
  // Handled in Phase 2
}
