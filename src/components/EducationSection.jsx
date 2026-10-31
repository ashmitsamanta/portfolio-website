import React from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

export default function EducationSection({
  config = PORTFOLIO_CONFIG,
  embedded = false
}) {
  const education = config.education || [];
  if (!education.length) return null;

  const content = (
    <>
      <div className="mb-12">
        <div className="overflow-hidden pb-2">
          <h2
            id="education-heading"
            data-reveal="heading"
            className="metallic-wordmark text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9]"
          >
            Education
          </h2>
        </div>
      </div>

      <div className="border-t border-b border-white/10">
        {education.map((item, idx) => (
          <div
            key={idx}
            data-reveal="copy"
            className="px-4 md:px-12 py-6 md:py-8 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-14"
          >
            <span className="w-28 sm:w-36 flex-shrink-0 font-mono text-xs sm:text-sm text-[#8A8A8A] leading-none">
              {item.period}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide leading-none text-white break-words">
                {item.institution}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-300">
                {item.degree}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) {
    return (
      <section
        id="education"
        aria-labelledby="education-heading"
        className="mt-24 pt-20 border-t border-white/[0.08]"
      >
        {content}
      </section>
    );
  }

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]"
    >
      {content}
    </section>
  );
}
