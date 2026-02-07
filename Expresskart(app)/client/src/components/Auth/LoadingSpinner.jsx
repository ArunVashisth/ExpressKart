import React, { memo } from 'react'

// Lightweight loading spinner
const LoadingSpinner = memo(() => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
))

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
