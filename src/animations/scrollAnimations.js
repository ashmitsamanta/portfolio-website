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
      gsap.set(
        '[data-reveal], [data-reveal="heading"], [data-reveal="copy"], [data-reveal="card"], [data-reveal="heading-base"], [data-reveal="italic"], [data-card-num], [data-card-title], [data-card-desc], [data-card-buttons], [data-card-image], [data-card-parallax]',
        {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          clearProps: 'all'
        }
      );
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
  const headings = rootEl.querySelectorAll('[data-reveal="heading"]');

  headings.forEach((heading) => {
    const triggerEl = heading.closest('.overflow-hidden') || heading.parentElement || heading;
    const section = heading.closest('section');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: START,
        once: true
      }
    });

    const baseWord = heading.querySelector('[data-reveal="heading-base"]');
    const italicWord = heading.querySelector('[data-reveal="italic"]');

    if (baseWord && italicWord) {
      tl.fromTo(
        baseWord,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DURATION,
          ease: EASE
        },
        0
      );
      tl.fromTo(
        italicWord,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DURATION,
          ease: EASE
        },
        STAGGER
      );
    } else {
      tl.fromTo(
        heading,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DURATION,
          ease: EASE
        },
        0
      );
    }

    if (section) {
      const copyEls = section.querySelectorAll('[data-reveal="copy"]');
      if (copyEls && copyEls.length > 0) {
        tl.fromTo(
          copyEls,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION,
            ease: EASE,
            stagger: STAGGER
          },
          STAGGER
        );
      }
    }
  });

  // Mobile card animations handled in Phase 2
  setupCardsMobile(rootEl);
}

function setupHeadingsDesktop(rootEl) {
  const headings = rootEl.querySelectorAll('[data-reveal="heading"]');

  headings.forEach((heading) => {
    const triggerEl = heading.closest('.overflow-hidden') || heading.parentElement || heading;
    const section = heading.closest('section');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: START,
        once: true
      }
    });

    const baseWord = heading.querySelector('[data-reveal="heading-base"]');
    const italicWord = heading.querySelector('[data-reveal="italic"]');

    if (baseWord && italicWord) {
      // Split heading: base part slides up at 0
      tl.fromTo(
        baseWord,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: DURATION,
          ease: EASE
        },
        0
      );
      // Italic serif word starts STAGGER later
      tl.fromTo(
        italicWord,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: DURATION,
          ease: EASE
        },
        STAGGER
      );
    } else {
      // Entire h2 animated as one unit to preserve .metallic-wordmark background-clip:text gradient
      tl.fromTo(
        heading,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: DURATION,
          ease: EASE
        },
        0
      );
    }

    // Copy and buttons beside or under the heading in this section
    if (section) {
      const copyEls = section.querySelectorAll('[data-reveal="copy"]');
      if (copyEls && copyEls.length > 0) {
        tl.fromTo(
          copyEls,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION,
            ease: EASE,
            stagger: STAGGER
          },
          STAGGER
        );
      }
    }
  });
}

function setupCardsDesktop(rootEl) {
  const cards = rootEl.querySelectorAll('[data-reveal="card"]');

  cards.forEach((card, idx) => {
    const numEl = card.querySelector('[data-card-num]');
    const titleEl = card.querySelector('[data-card-title]');
    const descEl = card.querySelector('[data-card-desc]');
    const buttonsEl = card.querySelector('[data-card-buttons]');
    const imageEl = card.querySelector('[data-card-image]');
    const parallaxEl = card.querySelector('[data-card-parallax]');

    // One ScrollTrigger per card, scrubbed from START to END
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: START,
        end: END,
        scrub: SCRUB
      }
    });

    // Number and title scrub from opacity DIM_OPACITY to 1
    if (numEl) {
      tl.fromTo(numEl, { opacity: DIM_OPACITY }, { opacity: 1, ease: 'none', duration: 0.6 }, 0);
    }
    if (titleEl) {
      tl.fromTo(titleEl, { opacity: DIM_OPACITY }, { opacity: 1, ease: 'none', duration: 0.6 }, 0);
    }

    // Description and buttons scrub with a slight delay, from DIM_OPACITY to 0.7 for description and 1 for buttons
    if (descEl) {
      tl.fromTo(descEl, { opacity: DIM_OPACITY }, { opacity: 0.7, ease: 'none', duration: 0.8 }, 0.2);
    }
    if (buttonsEl) {
      tl.fromTo(buttonsEl, { opacity: DIM_OPACITY }, { opacity: 1, ease: 'none', duration: 0.8 }, 0.2);
    }

    // Image panel scrubs from brightness-like dimming (opacity DIM_OPACITY to 1) and gentle vertical parallax +-PARALLAX_PX against text
    if (imageEl) {
      tl.fromTo(imageEl, { opacity: DIM_OPACITY }, { opacity: 1, ease: 'none', duration: 1.0 }, 0);
    }
    if (parallaxEl) {
      const py = idx % 2 === 0 ? PARALLAX_PX : -PARALLAX_PX;
      tl.fromTo(parallaxEl, { y: py }, { y: -py, ease: 'none', duration: 1.0 }, 0);
    }
  });
}

function setupCardsMobile(rootEl) {
  const cards = rootEl.querySelectorAll('[data-reveal="card"]');

  cards.forEach((card) => {
    // Ensure inner elements default to full opacity on mobile
    gsap.set(
      card.querySelectorAll(
        '[data-card-num], [data-card-title], [data-card-desc], [data-card-buttons], [data-card-image], [data-card-parallax]'
      ),
      { opacity: 1, y: 0, clearProps: 'transform,opacity' }
    );

    // Simplified, un-scrubbed fade-up (one-shot, once: true)
    gsap.fromTo(
      card,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: EASE,
        scrollTrigger: {
          trigger: card,
          start: START,
          once: true
        }
      }
    );
  });
}
