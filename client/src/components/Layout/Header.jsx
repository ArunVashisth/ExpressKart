import { Fragment, useState, useContext, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { CartContext } from '../../context/CartContext.jsx'

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext)
  const { getCartItemCount } = useContext(CartContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const userMenuItems = [
    { label: 'Profile', href: '/dashboard', icon: UserIcon },
    { label: 'Orders', href: '/orders', icon: ShoppingCartIcon }
  ]

  if (user?.role === 'admin') userMenuItems.push({ label: 'Admin Panel', href: '/admin/dashboard', icon: UserIcon })
  if (user?.role === 'vendor') userMenuItems.push({ label: 'Vendor Panel', href: '/vendor/dashboard', icon: UserIcon })

  return (
    <header className={`sticky top-0 z-[60] transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`container-custom !max-w-7xl mx-auto rounded-3xl transition-all duration-700 ease-out ${scrolled
        ? 'bg-white/95 backdrop-blur-3xl border border-stone-100 shadow-[0_30px_70px_rgba(0,0,0,0.06)] scale-[0.98]'
        : 'bg-gradient-to-r from-[var(--vibe-accent)]/10 via-[var(--vibe-light)] to-[var(--vibe-accent)]/10 backdrop-blur-xl border border-white shadow-md'}`}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-[var(--charcoal)]/60 hover:text-[var(--charcoal)] hover:bg-[var(--vibe-gray)] transition-all active:scale-95 shadow-sm hover:shadow-md border border-transparent hover:border-[var(--vibe-border)]"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Link to="/" className="group flex items-center gap-3">
              <div className="w-12 h-12 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                <img src="/logo.svg" alt="ExpressKart Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--charcoal)] hidden sm:block">
                ExpressKart
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[var(--vibe-gray)] border border-[var(--vibe-border)] rounded-2xl shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${location.pathname === link.path
                  ? 'text-[var(--charcoal)] bg-[var(--vibe-accent)] shadow-xl shadow-vibe-accent/30 scale-[1.05]'
                  : 'text-[var(--charcoal)]/60 hover:text-[var(--charcoal)] hover:bg-[var(--vibe-hover)]/10 hover:scale-[1.02]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
              <input
                type="text"
                placeholder="Find unique gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 xl:w-60 bg-[var(--vibe-gray)] border border-[var(--vibe-border)] rounded-xl px-5 py-2.5 text-xs text-[var(--charcoal)] placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-vibe-accent/20 focus:w-80 transition-all duration-700 font-bold shadow-inner"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute right-4 pointer-events-none group-focus-within:text-[var(--charcoal)] transition-colors duration-500" />
            </form>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-3 rounded-xl text-vibe-charcoal/60 hover:text-vibe-charcoal hover:bg-[var(--vibe-accent)] transition-all relative active:scale-95 group shadow-sm hover:shadow-md border border-transparent hover:border-[var(--soft-gray)]"
            >
              <ShoppingCartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--vibe-accent)] text-[var(--charcoal)] text-[9px] font-black rounded-lg flex items-center justify-center shadow-lg border-2 border-[var(--vibe-light)]">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-1 rounded-xl bg-white border border-stone-200 hover:border-vibe-accent/30 transition-all active:scale-95 group shadow-sm hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--vibe-gray)] flex items-center justify-center text-[var(--charcoal)] group-hover:bg-[var(--vibe-accent)] transition-colors">
                    <UserIcon className="w-5 h-5 group-hover:text-[var(--charcoal)] transition-colors" />
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-4 w-72 bg-white border border-stone-200 rounded-3xl shadow-2xl z-50 overflow-hidden">
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Profile Hub</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.label}
                              to={item.href}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-4 px-6 py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-stone-500" />
                              </div>
                              <span className="uppercase tracking-wide text-xs">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-stone-200 mx-4" />

                      {/* Sign Out Button */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-4 w-full px-6 py-3 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                            <XMarkIcon className="w-4 h-4 text-rose-400" />
                          </div>
                          <span className="uppercase tracking-wide text-xs">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--charcoal)]/60 hover:text-[var(--charcoal)] transition-all hover:bg-[var(--vibe-gray)] rounded-xl">SignIn</Link>
                <Link to="/register" className="btn-premium !rounded-xl !px-6">Join</Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  )
}

export default Header

