import React from 'react';
import { ArrowUpRight, Eye } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';
import ProjectModal from './ProjectModal';

export default function ProjectsSection({
  config = PORTFOLIO_CONFIG,
  projectFilter = 'All',
  setProjectFilter,
  filteredProjects = config.projects,
  activeProjectModal,
  setActiveProjectModal
}) {
  // 4. - Left: Strikethrough "SELECTED" + italic serif "work"
  //    - Right: Short description + white "Read More ↗" pill
  //    - Below: 4 Alternating Left/Right Split-Screen Showcase Rows
  return (
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
                      setActiveProjectModal && setActiveProjectModal(proj);
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
                      setActiveProjectModal && setActiveProjectModal(proj);
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

      <ProjectModal
        activeProjectModal={activeProjectModal}
        onClose={() => setActiveProjectModal && setActiveProjectModal(null)}
        config={config}
      />
    </section>
  );
}
