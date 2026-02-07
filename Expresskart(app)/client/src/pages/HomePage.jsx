import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  ShoppingBagIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const HomePage = () => {
  const categories = [
    { name: 'Groceries', icon: '🛒', color: 'bg-green-100 text-green-800' },
    { name: 'Fruits & Vegetables', icon: '🥬', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Dairy & Bakery', icon: '🥛', color: 'bg-blue-100 text-blue-800' },
    { name: 'Meat & Fish', icon: '🥩', color: 'bg-red-100 text-red-800' },
    { name: 'Household', icon: '🏠', color: 'bg-purple-100 text-purple-800' },
    { name: 'Personal Care', icon: '🧴', color: 'bg-pink-100 text-pink-800' },
  ]

  const features = [
    {
      icon: <MapPinIcon className="w-8 h-8" />,
      title: 'Local Vendors',
      description: 'Connect with nearby vendors in your neighborhood'
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered within hours, not days'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Quality Assured',
      description: 'All products are verified and quality-checked'
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Support Local',
      description: 'Help small businesses grow in your community'
    }
  ]

  return (
    <>
      <Helmet>
        <title>ExpressKart - Your Local Marketplace</title>
        <meta name="description" content="Discover amazing products from local vendors. Fast delivery, quality assured, support local businesses." />
      </Helmet>

      <div className="min-h-screen bg-[var(--vibe-light)] selection:bg-[var(--vibe-accent)] selection:text-[var(--charcoal)]">
        {/* Hero Section with Background Image */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2574&auto=format&fit=crop"
              alt="Artisan Marketplace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="absolute inset-0 mesh-gradient opacity-30" />
          </div>

          <div className="relative z-10 container-custom section-padding">
            <div className="max-w-3xl text-left">
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter text-[var(--charcoal)]">
                Local <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vibe-accent)] to-[var(--charcoal)]">Marketplace</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-stone-600 font-medium max-w-xl leading-relaxed">
                Discover curated local gems from vendors near you.
                Experience shopping that supports your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/products"
                  className="btn-premium px-10 py-5 text-lg shadow-2xl shadow-vibe-accent/30"
                >
                  <ShoppingBagIcon className="w-6 h-6" />
                  Explore Shop
                </Link>
                <Link
                  to="/register"
                  className="px-10 py-5 text-lg font-black uppercase tracking-widest text-[11px] rounded-2xl bg-white text-[var(--charcoal)] border-2 border-[var(--vibe-border)] hover:bg-[var(--vibe-gray)] transition-all shadow-sm flex items-center justify-center hover:border-[var(--vibe-accent)]"
                >
                  Join as Vendor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section-padding bg-white relative bg-subtle-dots">
          <div className="container-custom">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-[var(--charcoal)] mb-6 tracking-tight">
                Shop Essentials
              </h2>
              <div className="w-20 h-1.5 bg-[var(--vibe-accent)] rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <div className="bg-white rounded-3xl p-8 text-center border border-[var(--vibe-border)] shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-500 hover-lift group-hover:border-[var(--vibe-accent)] group-hover:bg-[var(--vibe-gray)]">
                    <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-500">{category.icon}</div>
                    <h3 className="font-bold text-[var(--charcoal)] text-sm uppercase tracking-widest group-hover:translate-y-[-2px] transition-all">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-[var(--vibe-gray)] bg-subtle-dots">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center group p-8 rounded-3xl bg-white border border-[var(--vibe-border)] transition-all duration-500 hover-lift hover:shadow-xl hover:shadow-black/5">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[var(--vibe-gray)] rounded-2xl shadow-sm text-[var(--charcoal)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md border border-[var(--vibe-border)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black text-[var(--charcoal)] mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--charcoal)] opacity-95" />
          <div className="absolute inset-0 mesh-gradient opacity-10" />
          <div className="container-custom text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Ready to Upgrade Your <br /> Shopping Experience?
            </h2>
            <p className="text-xl mb-12 text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Join thousands of community members supporting local artisans and businesses.
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="btn-premium px-12 py-5 shadow-2xl"
              >
                Create Free Account
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                Browse Shop
                <ShoppingBagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
