import React, { useState } from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

// 4 Marquee rows matching t=8.40s & t=9.80s in Screen Recording 2026-10-21 152553.mp4
const MARQUEE_ROWS = [
  [
    'React.js',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Vite',
    'Next.js',
    'HTML5 Canvas',
    'Redux',
    'REST APIs'
  ],
  [
    'Python',
    'FastAPI',
    'PostgreSQL',
    'SQLAlchemy',
    'Django',
    'Supabase',
    'Node.js',
    'Express.js',
    'Firebase'
  ],
  [
    'Graph Analysis',
    'NetworkX',
    'Pytest',
    'JWT / Auth',
    'OCR Pipelines',
    'Face Matching',
    'Deepfake Detection',
    'SSE Streaming'
  ],
  [
    'Docker',
    'Git',
    'GitHub Actions',
    'CI/CD',
    'Postman',
    'VS Code',
    'Linux',
    'Playwright'
  ]
];

export default function StackMarquee({
  config = PORTFOLIO_CONFIG,
  showToast
}) {
  const [selectedStackCat, setSelectedStackCat] = useState('all');
  const [showStackGrid, setShowStackGrid] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);

  const visibleStackCategories =
    selectedStackCat === 'all'
      ? config.stackCategories
      : config.stackCategories.filter((c) => c.id === selectedStackCat);

  const marqueeRows = MARQUEE_ROWS;

  // EXACT 4-ROW "THE STACK" MARQUEE (t=8.40s & t=9.80s in video)
  return (
    <div className="mt-24">
      <div className="flex items-center gap-6 mb-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-400 shrink-0">
          THE STACK
        </span>
        <div className="h-px flex-1 bg-white/10" />
        <button
          type="button"
          onClick={() => {
            setMarqueePaused((p) => !p);
          }}
          className="px-3 py-1 rounded-full bg-[#0D0D0D] border border-white/10 font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white shrink-0"
        >
          {marqueePaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowStackGrid((g) => !g);
          }}
          className="px-3 py-1 rounded-full bg-[#0D0D0D] border border-white/10 font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white shrink-0"
        >
          {showStackGrid ? 'Hide Layer Filter' : 'Filter by Layer'}
        </button>
      </div>

      <div className="space-y-3 overflow-hidden stack-edge-mask py-1">
        {marqueeRows.map((rowItems, rowIdx) => {
          const duplicated = [...rowItems, ...rowItems, ...rowItems];
          return (
            <div key={rowIdx} className="overflow-hidden w-full">
              <div
                className={
                  rowIdx % 2 === 0
                    ? 'animate-marquee-left gap-3'
                    : 'animate-marquee-right gap-3'
                }
                style={marqueePaused ? { animationPlayState: 'paused' } : {}}
              >
                {duplicated.map((tech, idx) => (
                  <button
                    key={`${tech}-${idx}`}
                    type="button"
                    onClick={() => showToast && showToast(`${tech} — Production Stack`)}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0E0E0E] hover:bg-[#181818] border border-white/[0.08] hover:border-white/25 text-xs sm:text-sm text-neutral-200 font-medium tracking-wide transition-colors shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    <span>{tech}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showStackGrid && (
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-6">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedStackCat('all')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase ${
                selectedStackCat === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#111] text-neutral-400 border border-white/10'
              }`}
            >
              All Layers ({config.stackCategories.length})
            </button>
            {config.stackCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedStackCat(cat.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase ${
                  selectedStackCat === cat.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#111] text-neutral-400 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleStackCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl bg-[#0B0B0B] border border-white/10 p-5"
              >
                <div className="font-mono text-xs uppercase text-neutral-400 mb-3">
                  {cat.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[#141414] border border-white/10 font-mono text-xs text-neutral-200"
                    >
                      • {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
