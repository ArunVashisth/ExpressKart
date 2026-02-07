import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { CheckCircleIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const OrderSuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Confirmed - ExpressKart</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>

      <div className="min-h-screen bg-[var(--vibe-light)] flex flex-col justify-center py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--vibe-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Celebratory Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--vibe-accent)] to-[var(--vibe-hover)] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[var(--vibe-accent)]/20 animate-bounce">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-5xl font-black text-stone-900 mb-6 tracking-tight">
              Transaction Secured.
            </h1>
            <p className="text-xl text-stone-500 font-medium mb-12 leading-relaxed">
              Your hand-picked artifacts are being synchronized for dispatch. Welcome to the elite circle of curated commerce.
            </p>

            {/* Order Details */}
            <div className="glass-card !bg-white/80 border border-stone-100 p-10 mb-10 shadow-xl shadow-stone-900/5">
              <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 text-left border-b border-stone-50 pb-4">Manifest Details</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Identification</span>
                  <span className="text-sm font-black text-stone-900 font-mono tracking-tighter">#EK{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Chronicle Date</span>
                  <span className="text-sm font-black text-stone-900 tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Est. Synchronization</span>
                  <span className="text-sm font-black text-[var(--vibe-accent)] tracking-tight">Varies by Courier Agency</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-stone-900 rounded-[2rem] p-10 mb-12 text-left shadow-2xl">
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Synchronization Protocol</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--vibe-accent)] mt-1.5" />
                  <p className="text-sm font-medium text-stone-300 tracking-tight">Confirmation beacon sent to your primary terminal</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" />
                  <p className="text-sm font-medium text-stone-300 tracking-tight">Real-time tracking pulse initialized upon dispatch</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5" />
                  <p className="text-sm font-medium text-stone-300 tracking-tight">Elite 24/7 support standing by for directives</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/"
                className="btn-premium px-10 py-5 !rounded-2xl !text-[10px] group"
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  Return to Hub
                </div>
              </Link>
              <Link
                to="/dashboard"
                className="px-10 py-5 rounded-2xl border-2 border-stone-200 text-stone-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-50 hover:border-stone-900 hover:text-stone-900 transition-all flex items-center gap-3"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                View Archive
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-16 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
              <p>Inquiry: <span className="text-[var(--vibe-accent)] underline underline-offset-4">concierge@expresskart.space</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSuccessPage
