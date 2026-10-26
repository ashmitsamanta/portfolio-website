import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'service', label: 'SERVICE' },
  { id: 'project', label: 'PROJECT' },
  { id: 'contact', label: 'CONTACT' }
];

const MOBILE_NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'service', label: 'SERVICE' },
  { id: 'project', label: 'PROJECT' },
  { id: 'game', label: 'ARCADE' },
  { id: 'contact', label: 'CONTACT' }
];

export default function Navbar({
  config = PORTFOLIO_CONFIG,
  activeNav = 'home',
  scrollToSection,
  heroControlsVisible = true
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar transparency transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    if (scrollToSection) {
      scrollToSection(id);
    }
    setMobileMenuOpen(false);
  };

  // Fixed Top Navigation Bar (Transparent at top, smooth backdrop when scrolled)
  return (
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
          onClick={() => handleNavClick('home')}
          className="font-black tracking-tight text-sm sm:text-base uppercase text-white hover:opacity-80 transition-opacity text-left whitespace-nowrap flex items-center shrink-0"
        >
          {config.personal.name}
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
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
          {MOBILE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs uppercase text-neutral-200"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
