import React, { memo } from 'react'

// Lightweight decorative background component
const AuthBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--vibe-accent)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 will-change-auto" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--vibe-accent)]/15 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2 will-change-auto" />
  </div>
))

AuthBackground.displayName = 'AuthBackground'

export default AuthBackground
