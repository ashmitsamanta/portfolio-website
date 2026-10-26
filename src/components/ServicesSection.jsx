import React, { useState } from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

export default function ServicesSection({
  config = PORTFOLIO_CONFIG
}) {
  const [openServiceId, setOpenServiceId] = useState(null);
  const [hoveredServiceId, setHoveredServiceId] = useState(null);

  // 3. VIDEO-VERIFIED SERVICES SECTION (t=9.80s, t=11.20s, t=14.00s):
  //    - Right-aligned stacked metallic "WHAT WE / CAN DO" heading
  //    - 6 rows (01-06) with warm cream hover fill (`hover:bg-[#E2DDD2] hover:text-black`) exactly like t=11.20s
  return (
    <section id="service" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
      <div className="mb-12 flex justify-end">
        <div className="overflow-hidden pb-2">
          <h2
            data-reveal="heading"
            className="metallic-wordmark text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-right"
          >
            WHAT WE
            <br />
            CAN DO
          </h2>
        </div>
      </div>

      <div className="border-t border-b border-white/10">
        {config.services.map((srv) => {
          const isOpen = openServiceId === srv.id;
          const isLit = isOpen || hoveredServiceId === srv.id;
          return (
            <div
              key={srv.id}
              onClick={() => {
                setOpenServiceId(isOpen ? null : srv.id);
              }}
              onMouseEnter={() => setHoveredServiceId(srv.id)}
              onMouseLeave={() => setHoveredServiceId(null)}
              className={`border-b border-white/10 px-4 md:px-12 py-6 md:py-8 cursor-pointer transition-colors duration-500 ease-out ${
                isLit ? 'bg-[#cfc9bc]' : 'bg-transparent'
              }`}
            >
              {/* 1. Header Bar: Number + Headline Title on Left, Rotating Arrow on Far Right */}
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-6 sm:gap-10 md:gap-14 min-w-0 flex-1">
                  <span
                    className={`w-8 sm:w-10 md:w-14 flex-shrink-0 text-xl sm:text-2xl md:text-3xl font-medium transition-colors duration-300 ease-in-out leading-none ${
                      isLit ? 'text-[#16150f]' : 'text-white'
                    }`}
                  >
                    {srv.id}
                  </span>

                  <h3
                    className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide leading-none transition-colors duration-300 ease-in-out break-words ${
                      isLit ? 'text-[#16150f]' : 'text-white'
                    }`}
                  >
                    {srv.title}
                  </h3>
                </div>

                {/* Arrow: ↘ when closed, ↗ when open */}
                <div className="flex-shrink-0 ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 transition-transform duration-300 ${
                      isLit ? 'text-[#16150f]' : 'text-white'
                    } ${isOpen ? '-rotate-45' : 'rotate-45'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* 2. Expandable Content Drawer: Two columns indented to match title */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                  isOpen ? 'max-h-[700px] opacity-100 mt-6 sm:mt-8' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="pl-0 sm:pl-[calc(2.5rem+2.5rem)] md:pl-[calc(3.5rem+3.5rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start pr-0 md:pr-12">
                  {/* Left Column: Square Bullet Items */}
                  <ul
                    className={`space-y-2.5 text-sm md:text-base font-normal transition-colors duration-300 ${
                      isLit ? 'text-[#2c2a22]' : 'text-gray-300'
                    }`}
                  >
                    {srv.tags.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span
                          className={`text-[9px] leading-none opacity-80 select-none flex-shrink-0 ${
                            isLit ? 'text-[#16150f]' : 'text-white/60'
                          }`}
                        >
                          ■
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Right Column: Description Text */}
                  <p
                    className={`text-sm md:text-base lg:text-lg leading-relaxed font-light transition-colors duration-300 ${
                      isLit ? 'text-[#2c2a22]' : 'text-gray-300'
                    }`}
                  >
                    {srv.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
