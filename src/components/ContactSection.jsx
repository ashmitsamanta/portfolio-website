import React, { useState } from 'react';
import {
  Mail,
  Send,
  Copy,
  Linkedin,
  Github,
  ArrowUp,
  X
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

const CONTACT_ENDPOINT = 'https://formspree.io/f/mwlllqny';

export default function ContactSection({
  config = PORTFOLIO_CONFIG,
  showContactFormModal,
  setShowContactFormModal,
  copyText,
  showToast,
  scrollToSection
}) {
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Project Inquiry',
    message: '',
    botField: ''
  });
  const [contactStatus, setContactStatus] = useState('idle');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactStatus === 'sending' || contactStatus === 'sent') {
      return;
    }
    if (contactForm.botField) {
      return;
    }
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      if (showToast) {
        showToast('Please fill in your name, email, and message.');
      }
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
        setContactForm({
          name: '',
          email: '',
          subject: 'Project Inquiry',
          message: '',
          botField: ''
        });
        if (showToast) {
          showToast('Message sent! I will get back to you soon.');
        }
        setTimeout(() => {
          setContactStatus('idle');
          if (setShowContactFormModal) setShowContactFormModal(false);
        }, 1800);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setContactStatus('idle');
      if (showToast) {
        showToast('Unable to send message. Please use the email button directly.');
      }
    }
  };

  return (
    <>
      {/* 7. CONTACT SECTION & FOOTER */}
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
                    if (setShowContactFormModal) {
                      setShowContactFormModal(true);
                    }
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
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">
                      EMAIL
                    </div>
                    <div className="text-sm sm:text-base text-white break-all">
                      {config.socials.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText && copyText(config.socials.email, 'Email copied to clipboard')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                    title="Copy Email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>


                <div data-contact-row className="border-b border-white/[0.08] pb-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">
                    BASED IN
                  </div>
                  <div className="text-sm sm:text-base text-white">{config.personal.location}</div>
                </div>

                <div data-contact-row>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-3">
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

          <footer data-contact-footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8A8A8A]">
            <div>
              © {new Date().getFullYear()} {config.personal.name}. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => scrollToSection && scrollToSection('home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection && scrollToSection('about')}
                className="hover:text-white transition-colors"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection && scrollToSection('service')}
                className="hover:text-white transition-colors"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => scrollToSection && scrollToSection('project')}
                className="hover:text-white transition-colors"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => scrollToSection && scrollToSection('home')}
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
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowContactFormModal && setShowContactFormModal(false)}
        >
          <div
            className="max-w-lg w-full rounded-3xl bg-[#0D0D0D] border border-white/15 p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowContactFormModal && setShowContactFormModal(false)}
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
                disabled={contactStatus === 'sending' || contactStatus === 'sent'}
                className="w-full py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? 'Brief Sent ✓' : 'Send Brief'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
