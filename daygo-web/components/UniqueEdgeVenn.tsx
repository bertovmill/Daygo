'use client'

import { useState, useEffect } from 'react'

export function UniqueEdgeVenn() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [animStep, setAnimStep] = useState(0)

  useEffect(() => {
    if (!isExpanded) {
      setAnimStep(0)
      return
    }
    const t1 = setTimeout(() => setAnimStep(1), 50)
    const t2 = setTimeout(() => setAnimStep(2), 600)
    const t3 = setTimeout(() => setAnimStep(3), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isExpanded])

  return (
    <section className="mb-10 -mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-4 group w-full text-left"
      >
        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400 group-hover:text-slate-500 transition-colors">
          My Unique Edge
        </h2>
        <svg className={`w-3 h-3 text-slate-300 transition-transform duration-200 ml-auto ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isExpanded && (
        <div className="relative flex flex-col items-center pb-2">
          <svg viewBox="0 0 320 300" className="w-full max-w-[360px]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Gradient fills for each circle */}
              <radialGradient id="grad-fitness" cx="50%" cy="40%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.22)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.06)" />
              </radialGradient>
              <radialGradient id="grad-ai" cx="50%" cy="40%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.22)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.06)" />
              </radialGradient>
              <radialGradient id="grad-network" cx="50%" cy="40%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.22)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.06)" />
              </radialGradient>
              {/* Center glow */}
              <radialGradient id="center-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
                <stop offset="40%" stopColor="rgba(168, 85, 247, 0.12)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* ---- CIRCLES ---- */}
            {/* Health & Fitness — top left */}
            <circle
              cx="130" cy="115" r="72"
              fill="url(#grad-fitness)"
              stroke="rgba(59, 130, 246, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="transition-all duration-[1200ms] ease-out"
              style={{
                opacity: animStep >= 1 ? 1 : 0,
                transform: animStep >= 1 ? 'scale(1)' : 'scale(0)',
                transformOrigin: '130px 115px',
              }}
            />
            {/* AI Knowledge — top right */}
            <circle
              cx="190" cy="115" r="72"
              fill="url(#grad-ai)"
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="transition-all duration-[1200ms] ease-out"
              style={{
                opacity: animStep >= 1 ? 1 : 0,
                transform: animStep >= 1 ? 'scale(1)' : 'scale(0)',
                transformOrigin: '190px 115px',
                transitionDelay: '150ms',
              }}
            />
            {/* Network — bottom center */}
            <circle
              cx="160" cy="168" r="72"
              fill="url(#grad-network)"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="transition-all duration-[1200ms] ease-out"
              style={{
                opacity: animStep >= 1 ? 1 : 0,
                transform: animStep >= 1 ? 'scale(1)' : 'scale(0)',
                transformOrigin: '160px 168px',
                transitionDelay: '300ms',
              }}
            />

            {/* ---- CENTER GLOW ---- */}
            <circle
              cx="160" cy="135" r="28"
              fill="url(#center-glow)"
              className="transition-opacity duration-700"
              style={{ opacity: animStep >= 3 ? 1 : 0 }}
            />

            {/* ---- ICONS inside each circle ---- */}
            {/* Dumbbell icon — Health */}
            <g
              className="transition-all duration-700 ease-out"
              style={{ opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? 'translateY(0)' : 'translateY(6px)' }}
            >
              <g transform="translate(100, 88)">
                <line x1="4" y1="10" x2="16" y2="10" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" strokeLinecap="round" />
                <rect x="1" y="6" width="5" height="8" rx="1" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.5" />
                <rect x="14" y="6" width="5" height="8" rx="1" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.5" />
              </g>
              <text x="110" y="112" textAnchor="middle" fill="rgba(59, 130, 246, 0.85)" fontSize="10.5" fontWeight="600" fontFamily="system-ui">Health & Fitness</text>
              <text x="110" y="124" textAnchor="middle" fill="rgba(59, 130, 246, 0.5)" fontSize="8" fontStyle="italic" fontFamily="system-ui">train every day</text>
            </g>

            {/* Brain/chip icon — AI */}
            <g
              className="transition-all duration-700 ease-out"
              style={{ opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? 'translateY(0)' : 'translateY(6px)', transitionDelay: '120ms' }}
            >
              <g transform="translate(200, 86)">
                <rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3" fill="none" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="1.5" />
                <line x1="10" y1="0" x2="10" y2="3" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" />
                <line x1="10" y1="17" x2="10" y2="20" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" />
                <line x1="0" y1="10" x2="3" y2="10" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" />
                <line x1="17" y1="10" x2="20" y2="10" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" />
              </g>
              <text x="210" y="112" textAnchor="middle" fill="rgba(168, 85, 247, 0.85)" fontSize="10.5" fontWeight="600" fontFamily="system-ui">AI Knowledge</text>
              <text x="210" y="124" textAnchor="middle" fill="rgba(168, 85, 247, 0.5)" fontSize="8" fontStyle="italic" fontFamily="system-ui">deep work at 5am</text>
            </g>

            {/* People icon — Network */}
            <g
              className="transition-all duration-700 ease-out"
              style={{ opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? 'translateY(0)' : 'translateY(6px)', transitionDelay: '240ms' }}
            >
              <g transform="translate(148, 192)">
                <circle cx="6" cy="5" r="3" fill="none" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1.5" />
                <path d="M0 15c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="18" cy="5" r="3" fill="none" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1.5" />
                <path d="M12 15c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <text x="160" y="220" textAnchor="middle" fill="rgba(245, 158, 11, 0.85)" fontSize="10.5" fontWeight="600" fontFamily="system-ui">Network</text>
              <text x="160" y="232" textAnchor="middle" fill="rgba(245, 158, 11, 0.5)" fontSize="8" fontStyle="italic" fontFamily="system-ui">top 1% in Toronto</text>
            </g>

            {/* ---- CENTER LABEL ---- */}
            <g
              className="transition-all duration-700 ease-out"
              style={{ opacity: animStep >= 3 ? 1 : 0, transform: animStep >= 3 ? 'scale(1)' : 'scale(0.7)', transformOrigin: '160px 135px' }}
            >
              {/* Tiny sparkle */}
              <text x="160" y="126" textAnchor="middle" fontSize="12" fill="rgba(168, 85, 247, 0.7)">&#10022;</text>
              <text x="160" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui" className="fill-slate-700 dark:fill-slate-100">
                You
              </text>
              <text x="160" y="152" textAnchor="middle" fontSize="7.5" fontFamily="system-ui" className="fill-slate-400">
                the intersection
              </text>
            </g>
          </svg>

          {/* Bottom tagline */}
          <p
            className="text-[11px] text-slate-400 text-center max-w-[280px] leading-relaxed transition-opacity duration-700 -mt-2"
            style={{ opacity: animStep >= 3 ? 1 : 0, transitionDelay: '200ms' }}
          >
            Most people struggle with one. You do all three daily. Work where they overlap.
          </p>
        </div>
      )}
    </section>
  )
}
