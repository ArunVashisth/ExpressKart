import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { productAPI } from '../../services/api.js'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      const [featuredRes, trendingRes] = await Promise.all([
        productAPI.getFeaturedProducts(),
        productAPI.getTrendingProducts()
      ])

      if (featuredRes.data?.success) setFeaturedProducts(featuredRes.data.data)
      if (trendingRes.data?.success) setTrendingProducts(trendingRes.data.data)
    } catch (error) {
      console.error('Error loading home data:', error)
      setFeaturedProducts([])
      setTrendingProducts([])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-[var(--vibe-accent)] fill-[var(--vibe-accent)]' : 'text-gray-600'}`}
          />
        ))}
      </div>
    )
  }

  const categories = [
    { name: 'Groceries', icon: '🛒', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', path: '/products?category=groceries' },
    { name: 'Fruits', icon: '🥬', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', path: '/products?category=fruits-vegetables' },
    { name: 'Dairy', icon: '🥛', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', path: '/products?category=dairy-bakery' },
    { name: 'Meat', icon: '🥩', color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20', path: '/products?category=meat-fish' },
    { name: 'Home', icon: '🏠', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', path: '/products?category=household' },
    { name: 'Care', icon: '🧴', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20', path: '/products?category=personal-care' },
  ]

  const features = [
    {
      icon: <TruckIcon className="w-6 h-6" />,
      title: 'Ultra Fast Delivery',
      desc: 'Local doorstep delivery in minutes.'
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'Verified Quality',
      desc: 'Only the best from top-tier local vendors.'
    },
    {
      icon: <StarIcon className="w-6 h-6" />,
      title: 'Support Local',
      desc: 'Empowering neighborhood businesses.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>ExpressKart | Premium Local Marketplace</title>
      </Helmet>

      <div className="space-y-24 pb-24">
        {/* Hero Section */}
        <section className="relative px-6 pt-12 lg:pt-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vibe-accent)]/10 border border-[var(--vibe-accent)]/20 text-[var(--vibe-accent)] text-sm font-bold tracking-wide uppercase animate-fadeIn">
                <SparklesIcon className="w-4 h-4" />
                Next Generation Marketplace
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                Shop Local. <br />
                <span className="text-premium">Think Premium.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Experience the finest selection of local products delivered with unmatched speed and care. Your neighborhood, curated.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/products" className="btn-premium px-8 py-4 text-lg">
                  Explore Shop
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/vendors" className="btn-premium-outline px-8 py-4 text-lg bg-white/5 border-white/10 hover:bg-white/10">
                  Find Vendors
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                {[
                  { label: 'Products', val: '10k+' },
                  { label: 'Vendors', val: '500+' },
                  { label: 'Cities', val: '50+' }
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.val}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--vibe-accent)] to-[var(--vibe-hover)] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-obsidian-lighter shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1024"
                  alt="Hero"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>

                {/* Floating Card UI */}
                <div className="absolute bottom-8 left-8 right-8 glass-card p-6 float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-premium-emerald/20 flex items-center justify-center text-premium-emerald">
                      <ShoppingBagIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-bold">New Delivery Confirmed</p>
                      <p className="text-gray-400 text-xs uppercase font-semibold">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Curated Categories</h2>
              <p className="text-gray-500">Discover the best from every niche</p>
            </div>
            <Link to="/products" className="text-premium-violet font-bold flex items-center gap-2 hover:gap-3 transition-all">
              See All <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`group relative p-6 rounded-3xl border ${cat.border} bg-gradient-to-b ${cat.color} hover:scale-[1.05] transition-all duration-300`}
              >
                <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform">{cat.icon}</div>
                <p className="font-bold text-white mb-1">{cat.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Explore</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="bg-white/5 py-24 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-premium-violet/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-premium-gold font-bold mb-2">
                  <FireIcon className="w-5 h-5" />
                  Trending Now
                </div>
                <h2 className="text-4xl font-bold text-white">Handpicked for You</h2>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map(product => (
                  <div key={product._id} className="group card-premium h-full flex flex-col">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-3 right-3 glass-card px-2 py-1 text-[10px] font-bold text-premium-rose uppercase tracking-wider">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-white line-clamp-1 group-hover:text-premium-violet transition-colors">{product.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-white">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        {renderStars(product.ratings?.average || 0)}
                        <Link to={`/products/${product._id}`} className="p-2 rounded-lg bg-white/10 hover:bg-premium-violet hover:text-white transition-all text-gray-400">
                          <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {features.map((f, i) => (
              <div key={i} className="group space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-premium-violet group-hover:bg-premium-violet group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-premium-violet to-[#5b21b6] p-12 lg:p-24 text-center">
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                Start Your Quality <br /> Shopping Journey
              </h2>
              <p className="text-violet-100 text-lg max-w-2xl mx-auto opacity-80 leading-relaxed">
                Join over 50,000 satisfied customers who prioritize quality and neighborhood growth. Get started in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <Link to="/register" className="bg-white text-premium-violet px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                  Join Now
                </Link>
                <Link to="/vendors" className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-all">
                  For Vendors
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage

