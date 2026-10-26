import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Copy,
  X,
  Github,
  Linkedin,
  Mail,
  Send,
  ArrowUp,
  Eye
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from './config/portfolio.config';
import HeroWebGL from './components/HeroWebGL';
import PreloaderWordmark from './components/PreloaderWordmark';
import AboutSection from './components/AboutSection';
import ArcadeMinigame from './components/ArcadeMinigame';
import { initScrollAnimations, refreshScrollTrigger } from './animations/scrollAnimations';

const DEFAULT_CONFIG = PORTFOLIO_CONFIG;

const PROJECT_ATLAS_IMAGES = [
  '/assets/veribyte.webp',
  '/assets/cyberscope.webp'
];

const CONTACT_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export default function App() {
  const config = DEFAULT_CONFIG;

  const [introRunId, setIntroRunId] = useState(0);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const heroSectionRef = useRef(null);
  const portraitAnchorRef = useRef(null);
  const rootRef = useRef(null);

  // Navigation & UI state
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive sections state
  const [openServiceId, setOpenServiceId] = useState(null);
  const [hoveredServiceId, setHoveredServiceId] = useState(null);
  const [projectFilter, setProjectFilter] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Hero 3D parallax state
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // Optional Brief Modal
  const [showContactFormModal, setShowContactFormModal] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'React Native App Project',
    message: '',
    botField: ''
  });
  const [contactStatus, setContactStatus] = useState('idle');


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




  // Track scroll position for navbar transparency transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactForm.botField) {
      return;
    }
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      showToast('Please fill in your name, email, and message.');
      return;
    }
    setContactStatus('sending');
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          subject: contactForm.subject,
          message: contactForm.message.trim()
        })
      });

      if (response.ok) {
        setContactStatus('sent');
        showToast('Message sent! I will get back to you soon.');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setContactStatus('idle');
      showToast('Unable to send message. Please use the email button directly.');
    }
  };


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
      <header
        style={{
          opacity: heroControlsVisible ? 1 : 0,
          pointerEvents: heroControlsVisible ? 'auto' : 'none',
          transform: heroControlsVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -16px, 0)',
          transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease'
        }}
        className={`fixed top-0 left-0 w-full z-40 ${
          scrolled || mobileMenuOpen
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="font-black tracking-tight text-sm sm:text-base uppercase text-white hover:opacity-80 transition-opacity text-left whitespace-nowrap flex items-center shrink-0"
          >
            {config.personal.name}
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'about', label: 'ABOUT' },
              { id: 'service', label: 'SERVICE' },
              { id: 'project', label: 'PROJECT' },
              { id: 'contact', label: 'CONTACT' }
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors pb-1 ${
                    isActive
                      ? 'text-white font-bold border-b border-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden px-3 py-1.5 rounded-full border border-white/15 font-mono text-xs uppercase"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0A0A] border-b border-white/10 px-4 py-3 flex flex-wrap gap-2">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'about', label: 'ABOUT' },
              { id: 'service', label: 'SERVICE' },
              { id: 'project', label: 'PROJECT' },
              { id: 'game', label: 'ARCADE' },
              { id: 'contact', label: 'CONTACT' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs uppercase text-neutral-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

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

      {/* 4. VIDEO-VERIFIED SELECTED WORK SECTION (t=12.60s & t=16.90s -> t=20.50s):
          - Left: Strikethrough "SELECTED" + italic serif "work"
          - Right: Short description + white "Read More ↗" pill
          - Below: 4 Alternating Left/Right Split-Screen Showcase Rows */}
      <section id="project" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]">
        <div className="mb-20">
          <h2
            data-reveal="heading"
            aria-label="SELECTED work"
            className="flex items-baseline gap-3"
          >
            <span className="overflow-hidden inline-block pb-2">
              <span
                data-reveal="heading-base"
                className="relative text-4xl sm:text-6xl font-black uppercase tracking-tight text-white inline-block"
              >
                SELECTED
                <span className="absolute left-0 right-0 top-1/2 h-[3px] bg-white" />
              </span>
            </span>
            <span className="overflow-hidden inline-block pb-2">
              <span
                data-reveal="italic"
                className="text-4xl sm:text-6xl font-serif italic font-normal text-neutral-200 inline-block"
              >
                work
              </span>
            </span>
          </h2>
        </div>

        {/* Alternating Split-Screen Project Rows */}
        <div className="space-y-24">
          {filteredProjects.map((proj, idx) => {
            const imageOnLeft = idx % 2 === 0;
            return (
              <div
                key={proj.id}
                data-reveal="card"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-7 ${
                    imageOnLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div data-card-parallax className="h-full">
                    <div
                      onClick={() => {
                        setActiveProjectModal(proj);
                      }}
                      className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#0B0B0B] border border-white/10 cursor-pointer"
                    >
                      <img
                        data-card-image
                        src={proj.image}
                        alt={`${proj.titlePrefix} ${proj.titleSuffix}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                <div
                  className={`lg:col-span-5 space-y-5 ${
                    imageOnLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div data-card-num className="font-mono text-xs text-neutral-500">
                    {proj.num || `0${idx + 1}`}
                  </div>

                  <h3 data-card-title className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[1.05] text-white">
                    {proj.titlePrefix}
                    {proj.titlePrefix?.endsWith('-') || proj.noTitleSpace ? '' : ' '}
                    {proj.titleItalic && (
                      <span className="font-serif italic font-normal lowercase text-neutral-300">
                        {proj.titleItalic}
                      </span>
                    )}
                    <br />
                    {proj.titleSuffix}
                  </h3>

                  <p data-card-desc className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    {proj.description}
                  </p>

                  <div data-card-buttons className="flex flex-wrap items-center gap-3 pt-2">
                    {proj.primaryLabel && proj.primaryUrl && (
                      <a
                        href={proj.primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-sans text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
                      >
                        <span>{proj.primaryLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-colors ${
                          !proj.primaryLabel
                            ? 'bg-white text-black font-sans font-bold tracking-wide hover:opacity-90'
                            : 'bg-[#111111] hover:bg-[#1B1B1B] border border-white/15 text-neutral-200 font-medium'
                        }`}
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveProjectModal(proj);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase text-neutral-400 hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. VIDEO-VERIFIED "HELLO WORLD" CANVAS BRICK BREAKER GAME (t=22.93s -> t=24.13s) */}
      <ArcadeMinigame
        config={config}
        activeProjectModal={activeProjectModal}
        showContactFormModal={showContactFormModal}
      />

      {/* 7. VIDEO-VERIFIED CONTACT SECTION & FOOTER (t=25.33s -> t=27.77s) */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-white/[0.08] py-24"
      >
        <div data-contact-bg className="pointer-events-none absolute inset-0 liquid-marble-bg opacity-90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div
                data-contact-pill
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-300"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AVAILABLE FOR WORK</span>
              </div>

              <div className="overflow-hidden pb-2">
                <h2
                  data-reveal="heading"
                  className="metallic-wordmark text-5xl sm:text-7xl font-black tracking-tight leading-none"
                >
                  Get in touch
                </h2>
              </div>

              <div data-contact-buttons className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`mailto:${config.socials.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-sans text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-opacity"
                >
                  <span>Send an email</span>
                  <Mail className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setShowContactFormModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 font-mono text-[11px] uppercase text-neutral-300"
                >
                  <Send className="w-3 h-3" />
                  <span>Quick Brief Form</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                data-contact-card
                className="rounded-3xl bg-[#121212]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 space-y-6 shadow-2xl"
              >
                <div data-contact-row className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                      EMAIL
                    </div>
                    <div className="text-sm sm:text-base text-white break-all">
                      {config.socials.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(config.socials.email, 'Email copied to clipboard')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                    title="Copy Email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>


                <div data-contact-row className="border-b border-white/[0.08] pb-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    BASED IN
                  </div>
                  <div className="text-sm sm:text-base text-white">{config.personal.location}</div>
                </div>

                <div data-contact-row>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
                    ELSEWHERE
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={config.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white hover:text-black border border-white/15 flex items-center justify-center text-neutral-300 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={config.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white hover:text-black border border-white/15 flex items-center justify-center text-neutral-300 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer data-contact-footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
            <div>
              © {new Date().getFullYear()} {config.personal.name}. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="hover:text-white transition-colors"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('service')}
                className="hover:text-white transition-colors"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('project')}
                className="hover:text-white transition-colors"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="inline-flex items-center gap-1 text-neutral-300 hover:text-white"
              >
                <span>Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </footer>
        </div>
      </section>
      </main>

      {/* QUICK BRIEF FORM MODAL */}
      {showContactFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#0D0D0D] border border-white/15 p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setShowContactFormModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <h3 className="text-xl font-black uppercase">Send Project Brief</h3>
              <input
                type="text"
                name="_gotcha"
                value={contactForm.botField}
                onChange={(e) => setContactForm({ ...contactForm, botField: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase font-bold"
              >
                {contactStatus === 'sent' ? 'Brief Sent ✓' : 'Send Brief'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CASE STUDY MODAL */}
      {activeProjectModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[88vh] rounded-2xl sm:rounded-3xl bg-[#0D0D0D] border border-white/15 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Banner (compact height so entire modal fits in screen) */}
            <div className="relative h-44 sm:h-56 w-full bg-black shrink-0 overflow-hidden">
              <img
                src={activeProjectModal.image}
                alt={activeProjectModal.titlePrefix}
                className="w-full h-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                aria-label="Close modal"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white border border-white/20 hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-7 space-y-3.5 overflow-y-auto flex-1 min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {activeProjectModal.category}
                {activeProjectModal.badge ? ` • ${activeProjectModal.badge}` : ''}
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                {activeProjectModal.titlePrefix}
                {activeProjectModal.titlePrefix?.endsWith('-') || activeProjectModal.noTitleSpace ? '' : ' '}
                {activeProjectModal.titleItalic && (
                  <span className="font-serif italic font-normal lowercase">
                    {activeProjectModal.titleItalic}
                  </span>
                )}{' '}
                {activeProjectModal.titleSuffix}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {activeProjectModal.detailsDescription || activeProjectModal.description}
              </p>

              <div className="space-y-2 pt-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                  KEY ARCHITECTURAL HIGHLIGHTS:
                </div>
                {activeProjectModal.highlights?.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-200">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: config.accentColor }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                {activeProjectModal.githubUrl && (
                  <a
                    href={activeProjectModal.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-sans text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
                  >
                    <span>View on GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {activeProjectModal.primaryLabel && activeProjectModal.primaryUrl && (
                  <a
                    href={activeProjectModal.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#111111] hover:bg-[#1B1B1B] border border-white/15 text-xs text-neutral-200 font-medium transition-colors"
                  >
                    <span>{activeProjectModal.primaryLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
