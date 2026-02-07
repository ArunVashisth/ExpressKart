import React, { memo } from 'react'

// Optimized mesh gradient using CSS instead of multiple divs
const MeshGradient = memo(() => (
  <div
    className="absolute inset-0 opacity-20 pointer-events-none will-change-auto"
    style={{
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(244, 180, 0, 0.1) 0, transparent 50%),
        radial-gradient(at 50% 0%, rgba(246, 246, 246, 0.5) 0, transparent 50%),
        radial-gradient(at 100% 0%, rgba(244, 180, 0, 0.1) 0, transparent 50%),
        radial-gradient(at 50% 50%, rgba(244, 180, 0, 0.05) 0, transparent 50%),
        radial-gradient(at 0% 100%, #FFFFFF 0, transparent 50%),
        radial-gradient(at 100% 100%, rgba(246, 246, 246, 0.5) 0, transparent 50%)
      `,
      backgroundSize: '100% 100%'
    }}
  />
))

MeshGradient.displayName = 'MeshGradient'

export default MeshGradient
