import { Fragment, useContext } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'

const Sidebar = ({ open, setOpen }) => {
  const { user } = useContext(AuthContext)

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Categories', href: '/categories', icon: '📂' },
    { name: 'Vendors', href: '/vendors', icon: '🏪' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' }
  ]

  const userNavigation = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Orders', href: '/orders', icon: '📦' },
    { name: 'Wishlist', href: '/wishlist', icon: '❤️' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ] : []

  const vendorNavigation = user?.role === 'vendor' ? [
    { name: 'Vendor Dashboard', href: '/vendor/dashboard', icon: '🏪' },
    { name: 'My Products', href: '/vendor/products', icon: '📦' },
    { name: 'Orders', href: '/vendor/orders', icon: '📋' },
    { name: 'Analytics', href: '/vendor/analytics', icon: '📈' }
  ] : []

  const adminNavigation = user?.role === 'admin' ? [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: '👑' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Vendors', href: '/admin/vendors', icon: '🏪' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '📋' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
  ] : []

  return (
    <>
      {/* Backdrop overlay */}
      <Transition
        show={open}
        as={Fragment}
        enter="ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      </Transition>

      {/* Sidebar */}
      <Transition
        show={open}
        as={Fragment}
        enter="transform transition ease-in-out duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--vibe-light)] border-r border-[var(--soft-gray)] shadow-2xl shadow-black/5">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[var(--soft-gray)]/30 bg-white/50 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img src="/logo.svg" alt="ExpressKart Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-black text-[var(--charcoal)] tracking-tight">ExpressKart</span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-orange-50 transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 pt-6">
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="group flex gap-x-4 rounded-xl p-3 text-sm leading-6 font-bold text-[var(--charcoal)]/60 hover:text-[var(--vibe-coral)] hover:bg-[var(--vibe-accent)]/30 hover:shadow-sm border border-transparent hover:border-[var(--vibe-accent)]/50 transition-all duration-300"
                            onClick={() => setOpen(false)}
                          >
                            <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* User Navigation */}
                  {userNavigation.length > 0 && (
                    <li>
                      <div className="text-[10px] font-black leading-6 text-stone-400 uppercase tracking-[0.2em] px-3">
                        My Studio
                      </div>
                      <ul role="list" className="mt-2 space-y-1">
                        {userNavigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className="group flex gap-x-4 rounded-xl p-3 text-sm leading-6 font-bold text-[var(--charcoal)]/60 hover:text-[var(--vibe-coral)] hover:bg-[var(--vibe-accent)]/30 hover:shadow-sm border border-transparent hover:border-[var(--vibe-accent)]/50 transition-all duration-300"
                              onClick={() => setOpen(false)}
                            >
                              <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}

                  {/* Vendor Navigation */}
                  {vendorNavigation.length > 0 && (
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">
                        Vendor Tools
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {vendorNavigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                              onClick={() => setOpen(false)}
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}

                  {/* Admin Navigation */}
                  {adminNavigation.length > 0 && (
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">
                        Admin Tools
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {adminNavigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                              onClick={() => setOpen(false)}
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}

                  {/* Become a Vendor */}
                  {!user && (
                    <li className="mt-auto">
                      <Link
                        to="/register?role=vendor"
                        className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-[var(--vibe-coral)] hover:bg-[var(--vibe-accent)]/20 transition-all duration-200"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg">🏪</span>
                        Become a Vendor
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}

export default Sidebar
