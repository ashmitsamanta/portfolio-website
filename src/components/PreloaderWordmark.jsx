import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TARGET_LETTERS = ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'];
const INITIAL_LETTERS = ['A', 'S', 'H', 'M', 'I', 'T'];

export default function PreloaderWordmark({
  runId = 0,
  onSlideDown,
  onComplete,
  heroTilt = { rx: 0, ry: 0 }
}) {
  const wordmarkRef = useRef(null);
  const dotRef = useRef(null);
  const letterRefs = useRef([]);
  const [isSlidDown, setIsSlidDown] = useState(false);

  // Stable callback refs so re-renders in parent never interrupt GSAP
  const onSlideDownRef = useRef(onSlideDown);
  onSlideDownRef.current = onSlideDown;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setIsSlidDown(false);

    const dot = dotRef.current;
    const wordmark = wordmarkRef.current;
    if (!dot || !wordmark) return;

    // Bypass preloader animation if reduced motion is requested
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsSlidDown(true);
      gsap.set(wordmark, { y: 0, scale: 1 });
      gsap.set(dot, { opacity: 0, display: 'none' });
      for (let i = 0; i < 9; i++) {
        if (letterRefs.current[i]) {
          letterRefs.current[i].textContent = TARGET_LETTERS[i];
          gsap.set(letterRefs.current[i], { display: 'inline-block', opacity: 1, scale: 1 });
        }
      }
      if (onSlideDownRef.current) onSlideDownRef.current();
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Lock scroll during preloader animation
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Safety fallback: guaranteed unlock after 4.5s maximum so visitor is never trapped
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setIsSlidDown(true);
      if (onSlideDownRef.current) onSlideDownRef.current();
    }, 4500);

    // Reset letters & kill any ongoing tweens
    gsap.killTweensOf([dot, wordmark, ...letterRefs.current]);

    // Calculate vertical offset so wordmark sits dead-center in the hero section during Stage 1
    const heroEl = document.getElementById('home') || document.documentElement;
    const heroH = heroEl.clientHeight || window.innerHeight;
    const centerOffsetY = -(heroH * 0.34);

    // Initial positioning in exact vertical center of hero
    gsap.set(wordmark, { y: centerOffsetY, scale: 0.94 });
    gsap.set(dot, { opacity: 0, scale: 1, scaleX: 1, scaleY: 1 });

    // Initial 6 letters of ASHMIT
    for (let i = 0; i < 6; i++) {
      if (letterRefs.current[i]) {
        letterRefs.current[i].textContent = INITIAL_LETTERS[i];
        gsap.set(letterRefs.current[i], { display: 'inline-block', opacity: 1, scale: 1 });
      }
    }

    // Trailing 3 letters ("L", "I", "O") start hidden
    for (let i = 6; i < 9; i++) {
      if (letterRefs.current[i]) {
        letterRefs.current[i].textContent = TARGET_LETTERS[i];
        gsap.set(letterRefs.current[i], { display: 'none', opacity: 0, scale: 0 });
      }
    }

    // Measure letter coordinates relative to wordmark container after fonts & DOM settle
    let cancelled = false;
    let timerId;

    const fontReadyPromise = typeof document !== 'undefined' && document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();

    const timeoutPromise = new Promise((resolve) => {
      timerId = setTimeout(resolve, 1500);
    });

    Promise.race([fontReadyPromise, timeoutPromise]).then(() => {
      if (cancelled) return;
      clearTimeout(timerId);

      const parentBox = wordmark.getBoundingClientRect();
      const dotW = 14;

      const getLetterPos = (idx) => {
        const el = letterRefs.current[idx];
        if (!el) return { x: 0, y: 0 };
        const box = el.getBoundingClientRect();
        return {
          x: box.left - parentBox.left + box.width / 2 - dotW / 2,
          y: box.top - parentBox.top - 8
        };
      };

      const p0 = getLetterPos(0);
      gsap.set(dot, { x: p0.x, y: p0.y - 45, opacity: 0 });

      const tl = gsap.timeline();

      // Hop 0: Drop in & squash impact onto letter 0 ("A" -> "P")
      // Keyframe physics:
      tl.to(dot, { scaleX: 0.74, duration: 0.05 })
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.36, ease: 'elastic.out' })
        .to(dot, { opacity: 1, y: p0.y, duration: 0.34, ease: 'power2.in' }, '<')
        .to(dot, { scaleX: 0.86, scaleY: 1.16, duration: 0.24, ease: 'power1.in' })
        // Squash impact on letter contact
        .to(dot, {
          scaleX: 1.32,
          scaleY: 0.64,
          duration: 0.06,
          onStart: () => {
            const el = letterRefs.current[0];
            if (el) {
              el.textContent = 'P';
              gsap.fromTo(el, { scale: 1.25, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.2 });
            }
          }
        })
        .to(dot, { scaleX: 1.12, duration: 0.13 })
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.05 });

      // Hops 1 through 5: Sequential 6-hop bouncing dot squash-and-stretch ("ASHMIT" -> "PORTFO")
      for (let i = 1; i < 6; i++) {
        const targetPos = getLetterPos(i);
        const prevPos = getLetterPos(i - 1);
        const midY = Math.min(prevPos.y, targetPos.y) - 24;
        const midX = (prevPos.x + targetPos.x) / 2;

        // Upward launch & mid-air stretch
        tl.to(dot, {
          x: midX,
          y: midY,
          scaleX: 0.86,
          scaleY: 1.16,
          duration: 0.10,
          ease: 'power2.out'
        })
        // Re-normalization in flight
        .to(dot, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.12
        })
        // Drop to next letter
        .to(dot, {
          x: targetPos.x,
          y: targetPos.y,
          duration: 0.10,
          ease: 'power2.in'
        })
        // Squash impact on letter contact
        .to(dot, {
          scaleX: 1.32,
          scaleY: 0.64,
          duration: 0.06,
          onStart: () => {
            const el = letterRefs.current[i];
            if (el) {
              el.textContent = TARGET_LETTERS[i];
              gsap.fromTo(el, { scale: 1.25, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.2 });
            }
          }
        })
        // Final bounce settle
        .to(dot, {
          scaleX: 1.12,
          duration: 0.13
        })
        .to(dot, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.05
        });
      }

      // Immediately after Hop 5 ("PORTFO"), trailing characters stagger ("L", "I", "O")
      tl.call(() => {
        const trailing = [letterRefs.current[6], letterRefs.current[7], letterRefs.current[8]].filter(Boolean);
        gsap.set(trailing, { display: 'inline-block' });
        gsap.fromTo(
          trailing,
          { scale: 1.25, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.28,
            stagger: 0.04,
            ease: 'power2.out'
          }
        );
      });

      // Once "PORTFOLIO" is fully formed in the center, fade and scale out .preloader-dot
      tl.to(dot, {
        opacity: 0,
        scale: 0,
        duration: 0.22,
        delay: 0.15
      });

      // Animate the "PORTFOLIO" heading container down from vertical center to lower third
      tl.to(wordmark, {
        y: 0,
        scale: 1,
        duration: 0.95,
        ease: 'power3.inOut',
        onStart: () => {
          setIsSlidDown(true);
          if (onSlideDownRef.current) onSlideDownRef.current();
        },
        onComplete: () => {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      clearTimeout(safetyTimer);
      gsap.killTweensOf([dot, wordmark, ...letterRefs.current]);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [runId]);

  return (
    <div
      className="relative z-20 w-full flex justify-center pointer-events-none mb-3 sm:mb-5"
      style={{
        transform: isSlidDown ? `translate3d(${heroTilt.ry * -0.4}px, 0, 0)` : 'none',
        transition: isSlidDown ? 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
      }}
    >
      <div ref={wordmarkRef} className="relative inline-block select-none">
        {/* The 6-hop bouncing dot */}
        <div
          ref={dotRef}
          className="preloader-dot absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)] pointer-events-none"
          style={{ width: 14, height: 14, zIndex: 30 }}
        />

        <h1
          aria-label="PORTFOLIO"
          className="select-none text-[15.2vw] sm:text-[14.2vw] xl:text-[184px] font-black uppercase tracking-[-0.045em] leading-[0.84] text-center whitespace-nowrap"
        >
          {TARGET_LETTERS.map((_, idx) => (
            <span
              key={idx}
              ref={(el) => (letterRefs.current[idx] = el)}
              className="metallic-wordmark inline-block"
            >
              {idx < 6 ? INITIAL_LETTERS[idx] : TARGET_LETTERS[idx]}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
