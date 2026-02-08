import React, { useState, useEffect, useContext, useCallback, useMemo, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { AuthContext } from '../../context/AuthContext.jsx'
import { authAPI } from '../../services/api.js'
import { toast } from 'react-hot-toast'

// Lazy load only heavy components
const AuthLeftPanel = lazy(() => import('../../components/Auth/AuthLeftPanel.jsx'))

// Import lightweight components directly
import Input from '../../components/Auth/Input.jsx'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await authAPI.checkAdmin()
        setAdminExists(response.data.data.adminExists)
      } catch (error) {
        setAdminExists(false)
      }
    }
    checkAdmin()
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Comprehensive client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields')
      return
    }

    // Name validation
    if (formData.name.length < 2 || formData.name.length > 50) {
      toast.error('Name must be between 2 and 50 characters')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumber = /[0-9]/.test(formData.password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error('Password must contain uppercase, lowercase, and numbers')
      return
    }

    setIsLoading(true)

    try {
      const { name, email, phone, role, password } = formData

      // Normalize phone number: remove all spaces and non-digit chars, keep optional +
      const normalizedPhone = phone
        ? phone.replace(/\s/g, '').replace(/^(\+?)(\D*)/, '$1').replace(/\D/g, (m, i, s) => s[i - 1] === '+' && i === 1 ? '' : m)
          .replace(/[^\d+]/g, '')
          .replace(/^(?!\+)/, '')
          .replace(/\+(?!\d)/g, '')
          .replace(/\++/g, '+')
        : ''
      
      // Cleaner approach: extract + and digits only, or undefined if empty
      const cleanPhone = phone && phone.trim()
        ? (phone.match(/\+/g)?.[0] || '') + phone.replace(/\D/g, '')
        : undefined

      // Make API call based on role
      let response = role === 'admin'
        ? await authAPI.createAdmin({ name, email, phone: cleanPhone, password })
        : await authAPI.register({ name, email, phone: cleanPhone, role, password })

      const { token, user } = response.data.data || response.data

      // Clear cart and login
      localStorage.removeItem('cart')
      login(token, user)

      // Success feedback
      toast.success(`Welcome to ExpressKart, ${user.name}! 🎉`)
      navigate('/dashboard')

    } catch (error) {
      console.error('Registration failed:', error)

      // Handle different error scenarios
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message

        switch (status) {
          case 400:
            if (message?.includes('already exists')) {
              toast.error('An account with this email already exists. Please login instead.')
            } else {
              toast.error(message || 'Invalid registration data. Please check your inputs.')
            }
            break
          case 409:
            toast.error('This email is already registered. Please use a different email.')
            break
          default:
            toast.error(message || 'Registration failed. Please try again.')
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check your connection.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [formData, login, navigate])

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev)
  }, [])

  const availableRoles = useMemo(() =>
    adminExists ? ['user', 'vendor'] : ['user', 'vendor', 'admin'],
    [adminExists]
  )

  return (
    <>
      <Helmet>
        <title>Create Account | ExpressKart Premium</title>
      </Helmet>

      <div className="min-h-screen flex bg-[var(--vibe-light)]">
        <Suspense fallback={
          <div className="hidden lg:flex lg:w-1/2 bg-[var(--vibe-light)]" />
        }>
          <AuthLeftPanel
            title="Join Our Community of Excellence."
            description="Start your journey with ExpressKart and experience the new standard of premium local commerce."
            benefits={[
              'Access to 10,000+ curated artifacts',
              'Proximity-based instant delivery sync',
              'Military-grade secured transactions',
              'Exclusive artisan member benefits'
            ]}
            icon={() => (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 012.87-3.78zM12 18a8.963 8.963 0 008.963-8.964 8.964 8.964 0 00-8.964-8.964A8.964 8.964 0 003 9.036 8.963 8.963 0 0012 18z" />
              </svg>
            )}
          />
        </Suspense>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden bg-[var(--vibe-light)]">
          {/* Decorative Glows - Optimized blur */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--vibe-accent)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 will-change-auto" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--vibe-accent)]/20 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2 will-change-auto" />

          <div className="w-full max-w-xl space-y-10 relative z-10 py-12">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-4 group">
                <div className="w-14 h-14 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  <img src="/logo.svg" alt="ExpressKart Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[var(--charcoal)] font-black text-sm tracking-widest uppercase hover:text-[var(--charcoal)]/80 transition-colors">ExpressKart</span>
              </Link>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-[var(--charcoal)] tracking-tight">Create Identity</h2>
                <p className="text-[var(--charcoal)]/60 font-medium text-lg">Join the most exclusive local marketplace.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@exclusive.com"
                required
              />

              <Input
                label="Mobile Contact"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 00000 00000"
              />

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--charcoal)]/60 uppercase tracking-[0.2em] pl-2">Member Tier</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border-2 border-[var(--vibe-border)] rounded-2xl text-[var(--charcoal)] focus:outline-none focus:ring-4 focus:ring-[var(--vibe-accent)]/30 focus:border-[var(--vibe-accent)]/50 transition-all duration-500 appearance-none font-medium"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role} className="text-stone-900 font-bold">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Security Key"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="•••••••"
                showPasswordToggle
                onTogglePassword={togglePassword}
                showPassword={showPassword}
                required
              />

              <Input
                label="Confirm Key"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                showPasswordToggle
                onTogglePassword={toggleConfirmPassword}
                showPassword={showConfirmPassword}
                required
              />

              <div className="md:col-span-2 pt-6">
                <button type="submit" disabled={isLoading} className="btn-premium w-full py-5 !rounded-2xl !text-xs !tracking-[0.3em] group">
                  {isLoading ? 'Synchronizing Identity...' : (
                    <div className="flex items-center gap-3">
                      Initialize Account
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-[var(--charcoal)]/40 font-bold uppercase text-[10px] tracking-[0.2em]">
              Already in the circle? <Link to="/login" className="text-[var(--vibe-accent)] font-black hover:text-[var(--charcoal)] transition-colors ml-2 underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage

