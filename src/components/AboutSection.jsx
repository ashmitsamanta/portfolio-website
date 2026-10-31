import React, { useState } from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';
import ScrubText from './ScrubText';
import StackMarquee from './StackMarquee';
import EducationSection from './EducationSection';

export default function AboutSection({
  config = PORTFOLIO_CONFIG,
  showToast
}) {
  const [introGlow, setIntroGlow] = useState({ x: 50, y: 50 });

  // 2. ABOUT ME ("Intro" + Glass Bio Card) & 4-ROW "THE STACK" MARQUEE 
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div
            data-reveal="copy"
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8A8A8A] mb-3"
          >
            ABOUT ME
          </div>
          <div data-intro-parallax className="overflow-hidden pb-2">
            <h2
              data-reveal="heading"
              className="metallic-wordmark text-6xl sm:text-8xl md:text-[112px] font-black tracking-tighter leading-none select-none"
            >
              Intro
            </h2>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div
            data-bio-card
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setIntroGlow({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100
              });
            }}
            className="relative rounded-3xl bg-[#0B0B0B] border border-white/10 p-7 sm:p-10 overflow-hidden shadow-2xl"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25 transition-opacity"
              style={{
                background: `radial-gradient(circle 260px at ${introGlow.x}% ${introGlow.y}%, rgba(255,255,255,0.18), transparent 70%)`
              }}
            />
            <p className="relative z-10 text-base sm:text-lg leading-relaxed text-neutral-300">
              <ScrubText text={config.personal.bio} />
            </p>
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <EducationSection config={config} embedded />

      {/* 4-ROW "THE STACK" MARQUEE */}
      <StackMarquee config={config} showToast={showToast} />
    </section>
  );
}
