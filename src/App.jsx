import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  ArrowDownLeft,
  Copy,
  X,
  Github,
  Linkedin,
  Mail,
  Send,
  ArrowUp
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from './config/portfolio.config';
import HeroWebGL from './components/HeroWebGL';
import PreloaderWordmark from './components/PreloaderWordmark';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ArcadeMinigame from './components/ArcadeMinigame';
import Navbar from './components/Navbar';
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
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive sections state
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
    </div>
  );
}
