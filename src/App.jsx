import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { ArrowDownLeft } from 'lucide-react';
import { PORTFOLIO_CONFIG } from './config/portfolio.config';
import HeroWebGL from './components/HeroWebGL';
import PreloaderWordmark from './components/PreloaderWordmark';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ArcadeMinigame from './components/ArcadeMinigame';
import ContactSection from './components/ContactSection';
import Navbar from './components/Navbar';
import { initScrollAnimations, refreshScrollTrigger } from './animations/scrollAnimations';

const DEFAULT_CONFIG = PORTFOLIO_CONFIG;

const PROJECT_ATLAS_IMAGES = [
  '/assets/veribyte.webp',
  '/assets/cyberscope.webp'
];

export default function App() {
  const config = DEFAULT_CONFIG;

  const [introRunId, setIntroRunId] = useState(0);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const heroSectionRef = useRef(null);
  const portraitAnchorRef = useRef(null);
  const rootRef = useRef(null);

  // Navigation & UI state
  const [activeNav, setActiveNav] = useState('home');
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive sections state
  const [projectFilter, setProjectFilter] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Hero 3D parallax state
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // Optional Brief Modal
  const [showContactFormModal, setShowContactFormModal] = useState(false);


  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const copyText = useCallback(
    (text, label = 'Copied to clipboard') => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(text)
            .then(() => showToast(label))
            .catch(() => {
              const ta = document.createElement('textarea');
              ta.value = text;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
              showToast(label);
            });
          return;
        }
      } catch (e) {
        // fallback below
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(label);
    },
    [showToast]
  );


  const handleSlideDown = useCallback(() => {
    setHeroControlsVisible(true);
  }, []);




  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered projects & stack items
  const filteredProjects =
    projectFilter === 'All'
      ? config.projects
      : config.projects.filter((p) => p.category === projectFilter);

  // Initialize and refresh scroll-driven animations when preloader finishes or project list changes
  useLayoutEffect(() => {
    if (!heroControlsVisible) return;
    const cleanup = initScrollAnimations(rootRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, [heroControlsVisible, filteredProjects]);




  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#000000] text-[#F2EFE9] selection:bg-[#FF5C3D] selection:text-black relative overflow-x-hidden font-sans"
      style={{ '--accent': config.accentColor }}
    >
      {/* Keyframes for Infinite Marquee Ticker, Metallic Gradients & Liquid Marble Contact Background */}
      <style>{`
        @keyframes stackMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes stackMarqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes liquidWave {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50% { transform: translate3d(-2%, 2%, 0) scale(1.06) rotate(1.5deg); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: stackMarqueeLeft 30s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: stackMarqueeRight 34s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        .metallic-wordmark {
          background: linear-gradient(180deg, #FFFFFF 0%, #E4E4E7 42%, #9CA3AF 72%, #3F3F46 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 18px 50px rgba(0, 0, 0, 0.65);
        }
        .stack-edge-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .liquid-marble-bg {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%);
          background:
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,255,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 55%),
            repeating-radial-gradient(circle at 15% 85%, rgba(255,255,255,0.025) 0px, rgba(0,0,0,0.9) 28px, rgba(255,255,255,0.03) 56px);
          animation: liquidWave 16s ease-in-out infinite;
        }
      `}</style>


      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#141414] border border-white/15 text-[#F2EFE9] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: config.accentColor }}
          />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Fixed Top Navigation Bar (Transparent at top, smooth backdrop when scrolled) */}
      <Navbar
        config={config}
        activeNav={activeNav}
        scrollToSection={scrollToSection}
        heroControlsVisible={heroControlsVisible}
      />

      <main>
        {/* 1. EXACT PRELOADER ("ASHMIT" -> "PORTFOLIO") & WEBGL2 PORTRAIT TILE MOSAIC */}
        <section
          id="home"
          ref={heroSectionRef}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setHeroTilt({
              rx: py * 14,
              ry: px * 18,
              gx: (px + 0.5) * 100,
              gy: (py + 0.5) * 100
            });
          }}
          onMouseLeave={() => {
            setHeroTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
          }}
          className="relative min-h-screen w-full flex flex-col justify-end pb-8 sm:pb-12 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 50% 35%, #181818 0%, #050505 80%)' }}
        >
          <h1 className="sr-only">Ashmit - Full-Stack Developer</h1>
          {/* Soft center radial glow visible during preloader */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[340px] rounded-full blur-3xl transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)',
            opacity: heroControlsVisible ? 0.2 : 0.8
          }}
        />

        {/* Zoomed-in Anchor Cutout Portrait Image matching reference site (143vh on desktop, 110vh on mobile) */}
        <div className="absolute inset-x-0 top-[30vh] md:top-[2vh] z-10 text-center flex flex-col items-center w-full pointer-events-none">
          <img
            ref={portraitAnchorRef}
            src={config.personal.portrait || '/assets/portrait_cutout.webp'}
            alt=""
            aria-hidden="true"
            className="invisible w-auto max-w-none h-[110vh] md:h-[143vh]"
          />
        </div>

        {/* LAYER 1 (z-10): Exact WebGL2 (#version 300 es) Hero Portrait Particle / Tile Mosaic */}
        <HeroWebGL
          runId={introRunId}
          src={config.personal.portrait || '/assets/portrait_cutout.webp'}
          thumbs={PROJECT_ATLAS_IMAGES}
          anchorRef={portraitAnchorRef}
          play={heroControlsVisible}
          label="Portrait of Ashmit made of tiles from his projects"
          className="z-10"
        />

        {/* Hero Foreground Content wrapper constrained to max-w-7xl */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end">
          {/* LAYER 2 (z-20): Exact Preloader & Hero Name Animation ("ASHMIT" -> "PORTFOLIO") */}
          <PreloaderWordmark
            runId={introRunId}
            onSlideDown={handleSlideDown}
            onComplete={() => {}}
            heroTilt={heroTilt}
          />

          {/* LAYER 3 (z-30): Bottom Row — Left: Full-Stack Developer | Right: ↙ + Contact */}
          <div
            style={{
              opacity: heroControlsVisible ? 1 : 0,
              transform: heroControlsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl sm:text-3xl md:text-[34px] font-extrabold tracking-tight text-white">
                {config.personal.role}
              </span>
              <span className="text-xl sm:text-3xl md:text-[34px] font-serif italic font-light text-neutral-300">
                {config.personal.roleItalic}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                aria-label="Scroll to About Section"
                className="w-10 h-10 rounded-full bg-[#0A0A0A] hover:bg-white text-neutral-300 hover:text-black border border-white/20 flex items-center justify-center transition-all"
              >
                <ArrowDownLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="px-7 py-2.5 rounded-full bg-[#0A0A0A] hover:bg-white text-white hover:text-black border border-white/25 font-sans text-xs sm:text-sm font-medium tracking-wide transition-all"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VIDEO-VERIFIED ABOUT ME ("Intro" + Glass Bio Card) & 4-ROW "THE STACK" MARQUEE (t=8.40s & t=9.80s) */}
      <AboutSection config={config} showToast={showToast} />

      {/* 3. VIDEO-VERIFIED SERVICES SECTION (t=9.80s, t=11.20s, t=14.00s):
          - Right-aligned stacked metallic "WHAT WE / CAN DO" heading
          - 6 rows (01-06) with warm cream hover fill (`hover:bg-[#E2DDD2] hover:text-black`) exactly like t=11.20s */}
      <ServicesSection config={config} />

      {/* 4. VIDEO-VERIFIED SELECTED WORK SECTION (t=12.60s & t=16.90s -> t=20.50s):
          - Left: Strikethrough "SELECTED" + italic serif "work"
          - Right: Short description + white "Read More ↗" pill
          - Below: 4 Alternating Left/Right Split-Screen Showcase Rows */}
      <ProjectsSection
        config={config}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
        filteredProjects={filteredProjects}
        activeProjectModal={activeProjectModal}
        setActiveProjectModal={setActiveProjectModal}
      />

      {/* 6. VIDEO-VERIFIED "HELLO WORLD" CANVAS BRICK BREAKER GAME (t=22.93s -> t=24.13s) */}
      <ArcadeMinigame
        config={config}
        activeProjectModal={activeProjectModal}
        showContactFormModal={showContactFormModal}
      />

      {/* 7. VIDEO-VERIFIED CONTACT SECTION & FOOTER (t=25.33s -> t=27.77s) */}
      <ContactSection
        config={config}
        showContactFormModal={showContactFormModal}
        setShowContactFormModal={setShowContactFormModal}
        copyText={copyText}
        showToast={showToast}
        scrollToSection={scrollToSection}
      />
      </main>
    </div>
  );
}
