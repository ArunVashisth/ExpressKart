import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext.jsx'
import { productAPI } from '../../services/api.js'
import {
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ProductListPage = () => {
  const { addToCart } = useContext(CartContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const minRating = searchParams.get('minRating') || ''
    const sortBy = searchParams.get('sortBy') || 'newest'
    const search = searchParams.get('search') || ''
    const page = searchParams.get('page') || '1'

    setFilters({ category, minPrice, maxPrice, minRating, sortBy })
    setSearchQuery(search)
    setPagination(prev => ({ ...prev, currentPage: parseInt(page) }))
  }, [searchParams])

  useEffect(() => {
    loadProducts()
  }, [filters, pagination.currentPage])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => console.log('Location access denied:', error)
      )
    }
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...filters,
        ...(searchQuery && { search: searchQuery })
      }
      const response = await productAPI.getAllProducts(params)
      if (response.data && response.data.success) {
        const productData = response.data.data || response.data.products || [];
        setProducts(productData);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: productData.length,
          hasNextPage: false,
          hasPrevPage: false
        })
      } else {
        const productData = response.data?.data || response.data?.products || [];
        setProducts(productData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: productData.length,
          hasNextPage: false,
          hasPrevPage: false
        })
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, currentPage: 1 }))

    if (query.length >= 2) {
      try {
        const response = await productAPI.getSearchSuggestions(query)
        if (response.data && response.data.success) {
          setSuggestions(response.data.data || [])
          setShowSuggestions(true)
        } else {
          setSuggestions(response.data?.data || [])
          setShowSuggestions(true)
        }
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      setSearchQuery(suggestion.text)
      setFilters(prev => ({ ...prev, category: suggestion.category }))
    } else if (suggestion.type === 'category') {
      setFilters(prev => ({ ...prev, category: suggestion.text }))
    } else if (suggestion.type === 'vendor') {
      navigate(`/vendors?search=${suggestion.text}`)
    }
    setShowSuggestions(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    if (searchQuery) params.set('search', searchQuery)
    if (pagination.currentPage > 1) params.set('page', pagination.currentPage.toString())
    setSearchParams(params)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', minRating: '', sortBy: 'newest' })
    setSearchQuery('')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    setSearchParams({})
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  const handleAddToCart = async (product) => {
    try {
      let imageUrl = null
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].url || product.images[0]
      } else if (product.image) {
        imageUrl = product.image
      }

      await addToCart({
        productId: product._id,
        name: product.title,
        price: product.sellingPrice || product.price,
        image: imageUrl,
        vendor: product.vendor?._id,
        vendorName: product.vendor?.shopName || product.vendor?.businessName,
        quantity: 1
      })
      toast.success(`${product.title} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-3 h-3 text-[var(--vibe-coral)]" />)
    }
    const remainingStars = 5 - fullStars
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarOutlineIcon key={`empty-${i}`} className="w-3 h-3 text-stone-300" />)
    }
    return stars
  }

  const categories = [
    'groceries', 'fruits-vegetables', 'dairy-bakery', 'meat-fish',
    'beverages', 'snacks', 'household', 'personal-care', 'electronics',
    'home-decor', 'health-wellness'
  ]

  return (
    <>
      <Helmet>
        <title>Explore Marketplace | ExpressKart Premium</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--vibe-light)] text-stone-900 pb-24">
        {/* Hero Banner Section */}
        <div className="relative pt-32 pb-16 overflow-hidden border-b border-[var(--soft-gray)]/50">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--vibe-accent)]/10 via-transparent to-[var(--soft-gray)]/20" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--vibe-accent)]/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="container-custom relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--vibe-accent)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Curated Boutique</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-[var(--charcoal)]">Discover <br />Crafted Quality.</h1>
                <p className="text-[var(--charcoal)]/60 font-medium max-w-md">Browse through our hand-picked collection of premium products from top-rated local artisans.</p>
              </div>

              {/* Enhanced Search */}
              <div className="relative w-full max-w-xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--vibe-accent)]/30 to-[var(--soft-gray)]/30 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white border border-[var(--soft-gray)] rounded-[2rem] flex items-center p-2 shadow-sm focus-within:shadow-xl transition-all duration-700">
                  <MagnifyingGlassIcon className="w-5 h-5 ml-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search for your next gem..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-transparent border-none focus:ring-0 text-stone-900 font-bold px-4 placeholder:text-stone-400"
                  />
                  {searchQuery && (
                    <button onClick={() => handleSearch('')} className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><XMarkIcon className="w-4 h-4" /></button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${showFilters ? 'bg-[var(--charcoal)] text-[var(--vibe-accent)] shadow-lg' : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
                  >
                    <FunnelIcon className="w-4 h-4" />
                    Filters
                  </button>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && suggestions && Object.keys(suggestions).length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-3xl border border-stone-100 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.12)] p-5 z-50 animate-in fade-in zoom-in-95 duration-500">
                    {Object.entries(suggestions).map(([type, items]) => (
                      items.length > 0 && (
                        <div key={type} className="mb-4 last:mb-0">
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 px-3">{type}</p>
                          <div className="space-y-1">
                            {items.map((item, index) => (
                              <button key={index} onClick={() => handleSuggestionClick(item)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-stone-50 text-sm font-bold text-stone-600 hover:text-[var(--charcoal)] transition-all">
                                {item.text}
                                {item.category && <span className="text-[10px] text-stone-400 ml-2 font-medium">— {item.category}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Glassmorphic Filters Panel */}
            {showFilters && (
              <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] mb-12 p-10 border border-white shadow-2xl shadow-black/5 animate-in slide-in-from-top-4 duration-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Collection</label>
                    <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="w-full bg-white border border-[var(--soft-gray)] rounded-2xl px-4 py-3 text-xs font-bold text-stone-700 focus:ring-4 focus:ring-[var(--vibe-accent)]/20 transition-all">
                      <option value="">All Tastes</option>
                      {categories.map(c => <option key={c} value={c} className="uppercase">{c.replace(/-/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Min Value (₹)</label>
                    <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className="w-full bg-white border border-[var(--soft-gray)] rounded-2xl px-4 py-3 text-xs font-bold text-stone-700 focus:ring-4 focus:ring-[var(--vibe-coral)]/20 transition-all" placeholder="0" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Max Value (₹)</label>
                    <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className="w-full bg-white border border-[var(--soft-gray)] rounded-2xl px-4 py-3 text-xs font-bold text-stone-700 focus:ring-4 focus:ring-vibe-coral/20 transition-all" placeholder="99,999" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Experience</label>
                    <select value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} className="w-full bg-white border border-[var(--soft-gray)] rounded-2xl px-4 py-3 text-xs font-bold text-stone-700 focus:ring-4 focus:ring-[var(--vibe-coral)]/20 transition-all">
                      <option value="">Any Satisfaction</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Sort Order</label>
                    <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} className="w-full bg-white border border-[var(--soft-gray)] rounded-2xl px-4 py-3 text-xs font-bold text-stone-700 focus:ring-4 focus:ring-vibe-accent/20 transition-all">
                      <option value="newest">Recently Curated</option>
                      <option value="price_asc">Value: Low to High</option>
                      <option value="price_desc">Value: High to Low</option>
                      <option value="rating">Top Rated Only</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-8 mt-10 pt-10 border-t border-stone-100">
                  <button onClick={clearFilters} className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Reset Hub</button>
                  <button onClick={applyFilters} className="btn-premium px-10 py-4 !shadow-2xl">Apply Selections</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
              Showing <span className="text-stone-900 ml-1">{products.length} of {pagination.totalProducts} artifacts</span>
            </p>
            {userLocation && (
              <button onClick={() => navigate('/products/nearby')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--vibe-accent)] hover:text-[var(--vibe-hover)] transition-all hover:scale-105">
                <MapPinIcon className="w-4 h-4" />
                Local Proximity Sync
              </button>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[var(--charcoal)]/10 border-t-[var(--charcoal)] rounded-full animate-spin mb-6" />
              <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing Curated Selection...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {products.map((product) => {
                  const price = product.price && typeof product.price === 'object'
                    ? (product.price.sellingPrice || product.price.mrp || 0)
                    : (typeof product.price === 'number' ? product.price : 0);

                  return (
                    <div key={product._id} className="group relative bg-white border border-stone-100 rounded-[2.5rem] p-4 flex flex-col transition-all duration-700 hover-lift hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-900/5">
                      {/* Product Image */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]?.url || product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Fallback & Loading State */}
                        <div className={`absolute inset-0 bg-stone-50 flex items-center justify-center text-5xl font-black text-stone-200 uppercase ${product.images && product.images.length > 0 ? 'hidden' : 'flex'}`}>
                          {product.title?.substring(0, 1)}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 z-20">
                          <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="w-12 h-12 rounded-2xl bg-white text-[var(--charcoal)] flex items-center justify-center shadow-2xl hover:bg-[var(--charcoal)] hover:text-[var(--vibe-accent)] transition-all transform hover:scale-110">
                            <ShoppingBagIcon className="w-6 h-6" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/products/${product._id}`); }} className="w-12 h-12 rounded-2xl bg-white text-stone-700 flex items-center justify-center shadow-2xl hover:bg-stone-900 hover:text-white transition-all transform hover:scale-110">
                            <AdjustmentsHorizontalIcon className="w-6 h-6" />
                          </button>
                        </div>

                        {/* Status Tag */}
                        <div className="absolute bottom-6 left-6 z-20">
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all group-hover:bg-white/90 group-hover:text-stone-900">
                            {product.category}
                          </div>
                        </div>
                      </div>

                      {/* Product Meta */}
                      <div className="space-y-4 px-3 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 min-h-[14px]">
                          <div className="flex gap-0.5">{renderStars(product.rating?.average || product.ratings?.average || 0)}</div>
                          <span className="text-[11px] font-black text-stone-400">{(product.rating?.average || product.ratings?.average || 0).toFixed(1)}</span>
                        </div>
                        <h3 className="font-black text-stone-900 text-lg leading-tight line-clamp-2 min-h-[3.5rem] transition-colors cursor-pointer group-hover:text-[var(--charcoal)]" onClick={() => navigate(`/products/${product._id}`)}>
                          {product.title}
                        </h3>
                        <div className="mt-auto pt-4 flex flex-col">
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Market Value</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-stone-900 tracking-tighter">₹{price.toLocaleString()}</span>
                            {product.price?.mrp > product.price?.sellingPrice && (
                              <span className="text-xs font-bold text-stone-300 line-through">₹{product.price.mrp.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-24 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="w-14 h-14 rounded-3xl bg-white border border-stone-200 text-stone-400 flex items-center justify-center disabled:opacity-20 hover:border-[var(--charcoal)] hover:text-[var(--charcoal)] transition-all shadow-sm hover:shadow-xl"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-14 h-14 rounded-3xl font-black text-xs uppercase tracking-widest transition-all duration-500 ${page === pagination.currentPage
                        ? 'bg-[var(--charcoal)] text-white shadow-2xl shadow-coral-900/20 scale-110'
                        : 'bg-white border border-[var(--soft-gray)] text-stone-400 hover:text-[var(--charcoal)] hover:border-[var(--charcoal)]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="w-14 h-14 rounded-3xl bg-white border border-stone-200 text-stone-400 flex items-center justify-center disabled:opacity-20 hover:border-[var(--charcoal)] hover:text-[var(--charcoal)] transition-all shadow-sm hover:shadow-xl"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-32 flex flex-col items-center text-center space-y-8">
              <div className="w-28 h-28 rounded-[2.5rem] bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300">
                <ShoppingBagIcon className="w-14 h-14" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-stone-900 tracking-tight">Hand-picked Gems Missing</h3>
                <p className="text-stone-500 font-medium max-w-xs mx-auto text-lg leading-relaxed">Our curators couldn't find artifacts matching your criteria. Try expanding your search.</p>
              </div>
              <button onClick={clearFilters} className="btn-premium px-12 py-5 !shadow-xl">Refresh Inventory</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductListPage

