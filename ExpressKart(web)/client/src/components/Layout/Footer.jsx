import React from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="relative bg-[var(--charcoal)] border-t border-[var(--soft-gray)]/30 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--vibe-accent)]/5 blur-[120px] rounded-full" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 group-hover:scale-110 transition-transform">
                <img src="/logo.svg" alt="ExpressKart Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ExpressKart<span className="text-[var(--vibe-accent)]">.</span></span>
            </Link>
            <p className="text-stone-500 font-medium leading-relaxed">
              Redefining the local marketplace with a premium experience for both vendors and customers. Join the revolution.
            </p>
            <div className="flex items-center gap-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[var(--vibe-accent)] hover:bg-white/10 hover:border-white/20 transition-all group shadow-sm">
                  <span className="sr-only">{social}</span>
                  <i className={`fab fa-${social} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Navigation</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/products' },
                { name: 'Vendors', path: '/vendors' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/60 font-medium hover:text-[var(--vibe-accent)] hover:translate-x-1 inline-block transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--vibe-accent)] shrink-0">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <span className="text-white/60 text-sm font-medium leading-relaxed trackin-tight">
                  Rohini, <br />Delhi, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--vibe-accent)] shrink-0">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <span className="text-white/60 text-sm font-bold">+91 9205601869</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--vibe-accent)] shrink-0">
                  <EnvelopeIcon className="w-4 h-4" />
                </div>
                <span className="text-white/60 text-sm font-medium truncate">Arunvashisth80@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Newsletter</h3>
            <p className="text-white/60 text-sm font-medium">Subscribe to get special offers and project updates.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-4 pr-12 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]/20 transition-all placeholder:text-white/30"
              />
              <button className="absolute right-2 top-2 bottom-2 w-10 rounded-xl bg-[var(--vibe-accent)] flex items-center justify-center text-[var(--charcoal)] hover:bg-[var(--vibe-hover)] transition-colors shadow-lg shadow-vibe-accent/10">
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-stone-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
            © 2025 ExpressKart. <span className="hidden sm:inline">Project crafted with </span><span className="text-rose-400">❤</span> for the next generation.
          </p>
          <div className="flex items-center gap-8">
            <Link to="#" className="text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

