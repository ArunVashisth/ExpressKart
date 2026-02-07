// Import MeshGradient
import MeshGradient from './MeshGradient.jsx'

import React, { memo } from 'react'

// Lightweight decorative left panel component
const AuthLeftPanel = memo(({ title, description, benefits, icon: Icon }) => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--vibe-light)]">
    <div className="absolute inset-0 bg-noise opacity-10" />
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--vibe-accent)]/10 via-transparent to-[var(--charcoal)]/20" />
    <MeshGradient />

    <div className="relative z-10 w-full flex flex-col justify-center p-24 text-[var(--charcoal)]">
      <div className="space-y-8 max-w-lg">
        <div className="w-20 h-20 rounded-[2.5rem] bg-[var(--vibe-accent)]/10 backdrop-blur-3xl border border-[var(--vibe-accent)]/20 flex items-center justify-center shadow-2xl">
          <Icon className="w-10 h-10 text-[var(--vibe-accent]" />
        </div>
        <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-[var(--charcoal)]">{title}</h1>
        <p className="text-[var(--charcoal)]/70 text-xl leading-relaxed font-medium">{description}</p>

        <div className="space-y-5 pt-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default">
              <div className="w-6 h-6 rounded-full bg-[var(--vibe-accent)]/20 flex items-center justify-center text-[var(--vibe-accent)] group-hover:bg-[var(--vibe-accent)] group-hover:text-white transition-all duration-500 shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[var(--charcoal)]/80 font-bold text-sm tracking-tight">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
))

AuthLeftPanel.displayName = 'AuthLeftPanel'

export default AuthLeftPanel
