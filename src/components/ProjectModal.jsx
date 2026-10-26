import React, { useEffect } from 'react';
import { X, Check, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

export default function ProjectModal({
  activeProjectModal,
  onClose,
  config = PORTFOLIO_CONFIG
}) {
  useEffect(() => {
    if (!activeProjectModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectModal, onClose]);

  if (!activeProjectModal) return null;

  // CASE STUDY MODAL
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
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
            onClick={onClose}
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
  );
}
