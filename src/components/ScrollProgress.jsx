import React, { useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'service', label: 'SERVICE' },
  { id: 'project', label: 'PROJECT' },
  { id: 'game', label: 'ARCADE' },
  { id: 'contact', label: 'CONTACT' }
];

export default function ScrollProgress() {
  const wrapperRef = useRef(null);
  const fillRef = useRef(null);
  const chipRef = useRef(null);

  useEffect(() => {
    let maxScroll = 0;
    let cachedSections = [];
    let current = 0;
    let target = 0;
    let rafId = null;
    let lastTime = 0;
    let isDragging = false;
    let dragStartX = 0;
    let hasDragged = false;

    // Check prefers-reduced-motion
    const motionQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let prefersReduced = motionQuery ? motionQuery.matches : false;

    const onMotionChange = (e) => {
      prefersReduced = e.matches;
      if (prefersReduced) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        current = target;
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${current})`;
        }
      }
    };

    if (motionQuery?.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (motionQuery?.addListener) {
      motionQuery.addListener(onMotionChange);
    }

    const measure = () => {
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      if (wrapperRef.current) {
        wrapperRef.current.style.display = maxScroll <= 0 ? 'none' : '';
      }

      cachedSections = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        return {
          id: sec.id,
          label: sec.label,
          top: el ? window.scrollY + el.getBoundingClientRect().top : 0
        };
      });

      // Recalculate target and update current fill
      if (maxScroll > 0) {
        target = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      } else {
        target = 0;
      }
      current = target;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${current})`;
      }
    };

    const getSectionLabel = (targetScroll) => {
      if (maxScroll > 0 && targetScroll >= maxScroll - 50) {
        return 'CONTACT';
      }
      let label = SECTIONS[0].label;
      for (let i = 0; i < cachedSections.length; i++) {
        if (targetScroll >= cachedSections[i].top - 80) {
          label = cachedSections[i].label;
        }
      }
      return label;
    };

    const tick = (now) => {
      if (!lastTime) lastTime = now;
      const dt = Math.max(1, Math.min(now - lastTime, 64));
      lastTime = now;

      const factor = 1 - Math.pow(1 - 0.18, dt / 16.67);
      current += (target - current) * factor;

      if (Math.abs(target - current) < 0.0005) {
        current = target;
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${current})`;
        }
        rafId = null;
        return;
      }

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${current})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (maxScroll <= 0) return;
      target = Math.max(0, Math.min(1, window.scrollY / maxScroll));

      if (isDragging) {
        current = target;
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${current})`;
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        return;
      }

      if (prefersReduced) {
        current = target;
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${current})`;
        }
        return;
      }

      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    // Initial measurement
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        measure();
      });
      resizeObserver.observe(document.body);
    }

    // Pointer interactions (mouse only)
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateChip = (clientX) => {
      if (!chipRef.current || !wrapperRef.current || maxScroll <= 0) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetScroll = ratio * maxScroll;
      const sectionLabel = getSectionLabel(targetScroll);
      const percent = Math.round(ratio * 100);

      chipRef.current.textContent = `${sectionLabel} ${percent}%`;
      const clampedX = Math.max(48, Math.min(rect.width - 48, clientX - rect.left));
      chipRef.current.style.left = `${clampedX}px`;
      chipRef.current.style.opacity = '1';
    };

    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || maxScroll <= 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      hasDragged = false;
      try {
        wrapper.setPointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
      updateChip(e.clientX);
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      if (isDragging) {
        if (!hasDragged && Math.abs(e.clientX - dragStartX) > 2) {
          hasDragged = true;
        }
        if (hasDragged && wrapperRef.current && maxScroll > 0) {
          const rect = wrapperRef.current.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          window.scrollTo({ top: ratio * maxScroll, behavior: 'instant' });
        }
      }
      updateChip(e.clientX);
    };

    const onPointerUp = (e) => {
      if (e.pointerType !== 'mouse') return;
      if (isDragging) {
        try {
          wrapper.releasePointerCapture(e.pointerId);
        } catch (err) {
          // ignore
        }
        isDragging = false;
        if (!hasDragged && wrapperRef.current && maxScroll > 0) {
          const rect = wrapperRef.current.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          window.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' });
        }
        hasDragged = false;
      }

      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          if (chipRef.current) chipRef.current.style.opacity = '0';
        }
      }
    };

    const onPointerCancel = (e) => {
      if (isDragging) {
        try {
          wrapper.releasePointerCapture(e.pointerId);
        } catch (err) {
          // ignore
        }
        isDragging = false;
        hasDragged = false;
      }
      if (chipRef.current) chipRef.current.style.opacity = '0';
    };

    const onPointerLeave = (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!isDragging && chipRef.current) {
        chipRef.current.style.opacity = '0';
      }
    };

    wrapper.addEventListener('pointerdown', onPointerDown);
    wrapper.addEventListener('pointermove', onPointerMove);
    wrapper.addEventListener('pointerup', onPointerUp);
    wrapper.addEventListener('pointercancel', onPointerCancel);
    wrapper.addEventListener('pointerleave', onPointerLeave);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (motionQuery?.removeEventListener) {
        motionQuery.removeEventListener('change', onMotionChange);
      } else if (motionQuery?.removeListener) {
        motionQuery.removeListener(onMotionChange);
      }

      wrapper.removeEventListener('pointerdown', onPointerDown);
      wrapper.removeEventListener('pointermove', onPointerMove);
      wrapper.removeEventListener('pointerup', onPointerUp);
      wrapper.removeEventListener('pointercancel', onPointerCancel);
      wrapper.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="group absolute left-0 right-0 top-16 h-3 cursor-pointer"
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-transparent transition-[height,background-color] duration-200 ease-out group-hover:h-1 group-hover:bg-white/10 motion-reduce:transition-none">
        <div
          ref={fillRef}
          className="h-full w-full origin-left bg-gradient-to-r from-white/40 via-white/80 to-white"
          style={{ transform: 'scaleX(0)', willChange: 'transform' }}
        />
      </div>
      <div
        ref={chipRef}
        className="pointer-events-none absolute top-3 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9] opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
      />
    </div>
  );
}

