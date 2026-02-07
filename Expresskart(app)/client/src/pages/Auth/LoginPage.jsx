import React, { useState, useContext, useCallback, useMemo, lazy, Suspense } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { AuthContext } from '../../context/AuthContext.jsx'
import { authAPI } from '../../services/api.js'
import toast from 'react-hot-toast'

// Lazy load only heavy components
const AuthLeftPanel = lazy(() => import('../../components/Auth/AuthLeftPanel.jsx'))
const AuthBackground = lazy(() => import('../../components/Auth/AuthBackground.jsx'))

// Import lightweight components directly to avoid Suspense overhead
import AuthInput from '../../components/Auth/AuthInput.jsx'
import LoadingSpinner from '../../components/Auth/LoadingSpinner.jsx'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.login(formData)
      const { token, user } = response.data.data || response.data

      // Clear any existing cart data on new login
      localStorage.removeItem('cart')

      // Store token and user data
      login(token, user)

      // Success feedback
      toast.success(`Welcome back, ${user.name}! 🎉`)

      // Navigate to intended destination
      navigate(from, { replace: true })

    } catch (error) {
      console.error('Login failed:', error)

      // Handle different error scenarios
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message

        switch (status) {
          case 401:
            toast.error('Invalid email or password. Please try again.')
            break
          case 404:
            toast.error('No account found with this email. Please register first.')
            break
          case 403:
            toast.error('Your account has been deactivated. Please contact support.')
            break
          default:
            toast.error(message || 'Login failed. Please try again.')
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check your connection.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [formData, login, navigate, from])

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const demoCredentials = useMemo(() => ({
    email: 'admin@test.com',
    password: 'password123'
  }), [])

  return (
    <>
      <Helmet>
        <title>Sign In | ExpressKart Premium</title>
      </Helmet>

      <div className="min-h-screen flex bg-[var(--vibe-light)]">
        <Suspense fallback={
          <div className="hidden lg:flex lg:w-1/2 bg-[var(--vibe-light)]" />
        }>
          <AuthLeftPanel
            title="Elevate Your Shopping Experience."
            description="ExpressKart brings the finest local products directly to your doorstep with a premium, hand-crafted touch."
            benefits={[
              'Access to 10,000+ curated artifacts',
              'Proximity-based instant delivery sync',
              'Military-grade secured transactions',
              'Exclusive artisan member benefits'
            ]}
            icon={() => (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.783-1.81 0-2.38l2.8-2.034a1 1 0 00.364-1.118L2.98 2.89c-.3-.921.755-1.688 1.539-1.118l2.8 2.034a1 1 0 001.175 0l2.8-2.034c.784-.57 1.838.197 1.539 1.118l-1.07 3.292a1 1 0 00.364 1.118l2.8 2.034c.783.57.783 1.81 0 2.38l-2.8 2.034a1 1 0 01-.364 1.118l-1.07 3.292c-.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838.197-1.539-1.118l1.07-3.292a1 1 0 00.364-1.118l2.8-2.034c.783-.57.783-1.81 0-2.38z" />
              </svg>
            )}
          />
        </Suspense>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-[var(--vibe-light)]">
          <Suspense fallback={null}>
            <AuthBackground />
          </Suspense>

          <div className="w-full max-w-md space-y-12 relative z-10">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-4 group">
                <div className="w-14 h-14 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  <img src="/logo.svg" alt="ExpressKart Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[var(--charcoal)] font-black text-sm tracking-widest uppercase hover:text-[var(--charcoal)]/80 transition-colors">ExpressKart</span>
              </Link>
              <div className="space-y-3">
                <h2 className="text-5xl font-black text-[var(--charcoal)] tracking-tight">Welcome Back</h2>
                <p className="text-[var(--charcoal)]/60 font-medium text-lg">Sign in to your private collection.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AuthInput
                label="Credential Hub"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@exclusive.com"
                required
              />

              <AuthInput
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium w-full py-5 !rounded-2xl !text-xs !tracking-[0.3em]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <LoadingSpinner />
                    Synchronizing...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    Unlock Account
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="bg-[var(--vibe-gray)] border border-[var(--vibe-border)] p-8 rounded-[2rem] shadow-sm">
              <p className="text-[10px] font-black text-[var(--charcoal)]/60 uppercase tracking-[0.2em] mb-4">Express Entry Access</p>
              <div className="grid grid-cols-1 gap-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--charcoal)]/60 font-medium">Identifier:</span>
                  <span className="text-[var(--charcoal)] font-black select-all">{demoCredentials.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--charcoal)]/60 font-medium">Secret:</span>
                  <span className="text-[var(--charcoal)] font-black select-all">{demoCredentials.password}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[var(--charcoal)]/40 font-bold uppercase text-[10px] tracking-[0.2em]">
              New to the circle? <Link to="/register" className="text-[var(--vibe-accent)] font-black hover:text-[var(--charcoal)] transition-colors ml-2 underline underline-offset-4">Create Identity</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage

