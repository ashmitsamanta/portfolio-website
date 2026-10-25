import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Copy,
  Pause,
  RotateCcw,
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

// 5x5 bitmap font for the Canvas Brick Breaker ("HELLO WORLD")
const PIXEL_FONT = {
  A: ['01110', '10001', '11111', '10001', '10001'],
  B: ['11110', '10001', '11110', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '11110', '10000', '11111'],
  F: ['11111', '10000', '11110', '10000', '10000'],
  G: ['01111', '10000', '10011', '10001', '01111'],
  H: ['10001', '10001', '11111', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '11100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001'],
  O: ['01110', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '11110', '10000', '10000'],
  Q: ['01110', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '11110', '10010', '10001'],
  S: ['01111', '10000', '01110', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10101', '11011', '10001'],
  X: ['10001', '01010', '00100', '01010', '10001'],
  Y: ['10001', '01010', '00100', '00100', '00100'],
  Z: ['11111', '00010', '00100', '01000', '11111'],
  ' ': ['000', '000', '000', '000', '000']
};

const DEFAULT_CONFIG = PORTFOLIO_CONFIG;

const PROJECT_ATLAS_IMAGES = [
  '/assets/veribyte.png',
  '/assets/cyberscope.png'
];

const CONTACT_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export default function App() {
  const config = DEFAULT_CONFIG;

  const [introRunId, setIntroRunId] = useState(0);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const heroSectionRef = useRef(null);
  const portraitAnchorRef = useRef(null);

  // Navigation & UI state
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive sections state
  const [introGlow, setIntroGlow] = useState({ x: 50, y: 50 });
  const [selectedStackCat, setSelectedStackCat] = useState('all');
  const [showStackGrid, setShowStackGrid] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);
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

  // Canvas Brick Breaker Game ("Break it if you can. It still ships.")
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [bricksLeft, setBricksLeft] = useState(0);
  const gameRef = useRef({
    paddleX: 260,
    paddleW: 116,
    paddleH: 10,
    ballX: 310,
    ballY: 260,
    vx: 4.2,
    vy: -4.2,
    ballR: 5,
    bricks: [],
    particles: [],
    keys: { left: false, right: false }
  });

  const buildWordBricks = useCallback(
    (width) => {
      const topWord = (config.personal.gameWordTop || 'HELLO').toUpperCase().slice(0, 8);
      const botWord = (config.personal.gameWordBottom || 'WORLD').toUpperCase().slice(0, 8);
      const words = [topWord, botWord];
      const bricks = [];

      const cellSize = Math.max(7, Math.min(13, Math.floor((width - 120) / 42)));
      const gap = 3;

      words.forEach((word, wordIdx) => {
        const chars = word.split('');
        const totalCols = chars.reduce(
          (acc, ch) => acc + (PIXEL_FONT[ch] || PIXEL_FONT[' '])[0].length + 1,
          -1
        );
        const rowWidth = totalCols * (cellSize + gap);
        const startX = Math.max(20, (width - rowWidth) / 2);
        const startY = 58 + wordIdx * (5 * (cellSize + gap) + 26);

        let colCursor = 0;
        chars.forEach((ch) => {
          const glyph = PIXEL_FONT[ch] || PIXEL_FONT[' '];
          const glyphCols = glyph[0].length;
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < glyphCols; c++) {
              if (glyph[r][c] === '1') {
                bricks.push({
                  x: startX + (colCursor + c) * (cellSize + gap),
                  y: startY + r * (cellSize + gap),
                  w: cellSize,
                  h: cellSize,
                  alive: true,
                  color: '#FFFFFF'
                });
              }
            }
          }
          colCursor += glyphCols + 1;
        });
      });

      return bricks;
    },
    [config.personal.gameWordTop, config.personal.gameWordBottom]
  );

  const initGameCanvas = useCallback(
    (startImmediately = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width));
      const h = 420;
      canvas.width = w;
      canvas.height = h;

      const bricks = buildWordBricks(w);
      gameRef.current = {
        paddleX: (w - 116) / 2,
        paddleW: 116,
        paddleH: 9,
        ballX: w / 2,
        ballY: h - 78,
        vx: 4.1 * (Math.random() > 0.5 ? 1 : -1),
        vy: -4.3,
        ballR: 5,
        bricks,
        particles: [],
        keys: { left: false, right: false }
      };
      setLives(3);
      setScore(0);
      setBricksLeft(bricks.length);
      setGameState(startImmediately ? 'playing' : 'idle');
    },
    [buildWordBricks]
  );

  useEffect(() => {
    initGameCanvas(false);
    const onResize = () => {
      if (gameState === 'idle') initGameCanvas(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [initGameCanvas, gameState]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'ArrowLeft') gameRef.current.keys.left = true;
      if (e.key === 'ArrowRight') gameRef.current.keys.right = true;
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft') gameRef.current.keys.left = false;
      if (e.key === 'ArrowRight') gameRef.current.keys.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    const renderFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const g = gameRef.current;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      if (gameState === 'playing') {
        if (g.keys.left) g.paddleX = Math.max(12, g.paddleX - 7);
        if (g.keys.right) g.paddleX = Math.min(w - g.paddleW - 12, g.paddleX + 7);

        g.ballX += g.vx;
        g.ballY += g.vy;

        if (g.ballX - g.ballR <= 4) {
          g.ballX = 4 + g.ballR;
          g.vx = Math.abs(g.vx);
        } else if (g.ballX + g.ballR >= w - 4) {
          g.ballX = w - 4 - g.ballR;
          g.vx = -Math.abs(g.vx);
        }
        if (g.ballY - g.ballR <= 4) {
          g.ballY = 4 + g.ballR;
          g.vy = Math.abs(g.vy);
        }

        const paddleTop = h - 34;
        if (
          g.vy > 0 &&
          g.ballY + g.ballR >= paddleTop &&
          g.ballY - g.ballR <= paddleTop + g.paddleH &&
          g.ballX >= g.paddleX - 4 &&
          g.ballX <= g.paddleX + g.paddleW + 4
        ) {
          const hitOffset = (g.ballX - (g.paddleX + g.paddleW / 2)) / (g.paddleW / 2);
          g.vx = hitOffset * 5.4;
          g.vy = -Math.max(3.8, Math.abs(g.vy));
          g.ballY = paddleTop - g.ballR - 1;
        }

        for (let i = 0; i < g.bricks.length; i++) {
          const b = g.bricks[i];
          if (!b.alive) continue;
          if (
            g.ballX + g.ballR > b.x &&
            g.ballX - g.ballR < b.x + b.w &&
            g.ballY + g.ballR > b.y &&
            g.ballY - g.ballR < b.y + b.h
          ) {
            b.alive = false;
            g.vy = -g.vy;
            for (let p = 0; p < 7; p++) {
              g.particles.push({
                x: b.x + b.w / 2,
                y: b.y + b.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1,
                color: b.color
              });
            }
            const remaining = g.bricks.filter((br) => br.alive).length;
            setBricksLeft(remaining);
            setScore((s) => s + 10);
            if (remaining === 0) {
              setGameState('won');
            }
            break;
          }
        }

        if (g.ballY - g.ballR > h) {
          setLives((prevLives) => {
            const nextLives = prevLives - 1;
            if (nextLives <= 0) {
              setGameState('gameover');
            } else {
              g.ballX = g.paddleX + g.paddleW / 2;
              g.ballY = h - 78;
              g.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
              g.vy = -4.2;
            }
            return nextLives;
          });
        }
      }

      g.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });

      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.04;
        if (pt.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = '#E5E5E5';
      ctx.beginPath();
      ctx.roundRect(g.paddleX, h - 34, g.paddleW, g.paddleH, 5);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, g.ballR, 0, Math.PI * 2);
      ctx.fill();

      if (gameState === 'playing') {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [gameState]);

  const handleCanvasPointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = clientX - rect.left;
    const g = gameRef.current;
    g.paddleX = Math.max(12, Math.min(canvas.width - g.paddleW - 12, relX - g.paddleW / 2));
  };

  // Filtered projects & stack items
  const filteredProjects =
    projectFilter === 'All'
      ? config.projects
      : config.projects.filter((p) => p.category === projectFilter);

  const visibleStackCategories =
    selectedStackCat === 'all'
      ? config.stackCategories
      : config.stackCategories.filter((c) => c.id === selectedStackCat);

  // 4 Marquee rows matching t=8.40s & t=9.80s in Screen Recording 2026-10-21 152553.mp4
  const marqueeRows = [
    [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Expo Router',
      'React Navigation',
      'Reanimated',
      'Gesture Handler',
      'Tailwind CSS',
      'React Native',
      'Expo'
    ],
    [
      'Python',
      'Django',
      'REST APIs',
      'Firebase',
      'Firestore',
      'Supabase',
      'PostgreSQL',
      'Node.js',
      'Express.js'
    ],
    [
      'Push Notifications',
      'RevenueCat',
      'react-native-iap',
      'AsyncStorage',
      'expo-local-authentication',
      'EAS Build',
      'Play Console',
      'Google Sign-In / OAuth'
    ],
    [
      'Postman',
      'VS Code',
      'Playwright',
      'GitHub Actions',
      'CI/CD',
      'Git',
      'GitHub',
      'Docker'
    ]
  ];


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
            className="font-black tracking-tight text-sm sm:text-base uppercase text-white hover:opacity-80 transition-opacity text-left"
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
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500 mb-3">
              ABOUT ME
            </div>
            <h2 className="metallic-wordmark text-6xl sm:text-8xl md:text-[112px] font-black tracking-tighter leading-none select-none">
              Intro
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div
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
                {config.personal.bio}
              </p>
            </div>
          </div>
        </div>

        {/* EXACT 4-ROW "THE STACK" MARQUEE (t=8.40s & t=9.80s in video) */}
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
                        onClick={() => showToast(`${tech} — Production Stack`)}
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
      </section>

      {/* 3. VIDEO-VERIFIED SERVICES SECTION (t=9.80s, t=11.20s, t=14.00s):
          - Right-aligned stacked metallic "WHAT WE / CAN DO" heading
          - 6 rows (01-06) with warm cream hover fill (`hover:bg-[#E2DDD2] hover:text-black`) exactly like t=11.20s */}
      <section id="service" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
        <div className="mb-12 flex justify-end">
          <h2 className="metallic-wordmark text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-right">
            WHAT WE
            <br />
            CAN DO
          </h2>
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
          <div className="flex items-baseline gap-3">
            <span className="relative text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
              SELECTED
              <span className="absolute left-0 right-0 top-1/2 h-[3px] bg-white" />
            </span>
            <span className="text-4xl sm:text-6xl font-serif italic font-normal text-neutral-200">
              work
            </span>
          </div>
        </div>

        {/* Alternating Split-Screen Project Rows */}
        <div className="space-y-24">
          {filteredProjects.map((proj, idx) => {
            const imageOnLeft = idx % 2 === 0;
            return (
              <div
                key={proj.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-7 ${
                    imageOnLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div
                    onClick={() => {
                      setActiveProjectModal(proj);
                    }}
                    className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#0B0B0B] border border-white/10 cursor-pointer"
                  >
                    <img
                      src={proj.image}
                      alt={`${proj.titlePrefix} ${proj.titleSuffix}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                </div>

                <div
                  className={`lg:col-span-5 space-y-5 ${
                    imageOnLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="font-mono text-xs text-neutral-500">
                    {proj.num || `0${idx + 1}`}
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[1.05] text-white">
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

                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
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
      <section id="game" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
        <div className="relative bg-[#000000] py-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-neutral-300 border-b border-neutral-500 pb-1">
              Break it if you can. It still ships.
            </span>
            <span className="font-mono text-xs text-neutral-500">
              SCORE: {score} • TILES: {bricksLeft}
            </span>
          </div>

          <div className="relative w-full overflow-hidden bg-[#000000]">
            <canvas
              ref={canvasRef}
              onMouseMove={handleCanvasPointerMove}
              onTouchMove={handleCanvasPointerMove}
              className="w-full h-[420px] block cursor-ew-resize touch-none"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full bg-white ${
                    i < lives ? 'opacity-90' : 'opacity-20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {gameState !== 'playing' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (gameState === 'gameover' || gameState === 'won') {
                      initGameCanvas(true);
                    } else {
                      setGameState('playing');
                    }
                  }}
                  className="px-6 py-2 rounded-lg border border-white/25 hover:border-white font-mono text-xs uppercase tracking-widest text-white transition-colors"
                >
                  {gameState === 'idle' ? 'PLAY' : 'REPLAY'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setGameState('paused');
                  }}
                  className="px-6 py-2 rounded-lg border border-white/40 font-mono text-xs uppercase tracking-widest text-white"
                >
                  PAUSE
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  initGameCanvas(false);
                }}
                aria-label="Reset Brick Breaker Game"
                className="p-2 rounded-lg border border-white/15 text-neutral-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIDEO-VERIFIED CONTACT SECTION & FOOTER (t=25.33s -> t=27.77s) */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-white/[0.08] py-24"
      >
        <div className="pointer-events-none absolute inset-0 liquid-marble-bg opacity-90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AVAILABLE FOR WORK</span>
              </div>

              <h2 className="metallic-wordmark text-5xl sm:text-7xl font-black tracking-tight leading-none">
                Get in touch
              </h2>

              <div className="flex flex-wrap items-center gap-3 pt-2">
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
              <div className="rounded-3xl bg-[#121212]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
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


                <div className="border-b border-white/[0.08] pb-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    BASED IN
                  </div>
                  <div className="text-sm sm:text-base text-white">{config.personal.location}</div>
                </div>

                <div>
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

          <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
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
