import React, { memo } from 'react'

// Optimized form input component
const AuthInput = memo(({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword
}) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-[var(--charcoal)]/60 uppercase tracking-[0.2em] pl-2">
      {label}
    </label>
    <div className="relative">
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 bg-white border-2 border-[var(--vibe-border)] rounded-2xl text-[var(--charcoal)] focus:outline-none focus:ring-4 focus:ring-[var(--vibe-accent)]/30 focus:border-[var(--vibe-accent)]/50 transition-all duration-500 placeholder:text-[var(--charcoal)]/40 font-medium"
        placeholder={placeholder}
        style={{ paddingRight: showPasswordToggle ? '3.5rem' : '1.25rem' }}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--charcoal)]/40 hover:text-[var(--charcoal)]/60 transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29-3.29" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  </div>
))

AuthInput.displayName = 'AuthInput'

export default AuthInput
