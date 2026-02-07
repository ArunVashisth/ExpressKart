import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { AuthContext } from '../../context/AuthContext.jsx'
import { CartContext } from '../../context/CartContext.jsx'
import { productAPI, reviewAPI, vendorAPI } from '../../services/api.js'
import ProductImageGallery from '../../components/ProductImageGallery.jsx'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    loadProductDetails()
  }, [id])

  const loadProductDetails = async () => {
    setLoading(true)
    try {
      if (!id) return navigate('/products')

      const productRes = await productAPI.getProductById(id)
      const productData = productRes.data?.data || productRes.data
      if (!productData) throw new Error('Invalid data')

      setProduct(productData)

      try {
        const reviewsRes = await reviewAPI.getProductReviews(id)
        let reviewsData = reviewsRes.data?.data ?? reviewsRes.data ?? []
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      } catch (err) {
        setReviews([])
      }

      const vendorId = productData.vendorId?._id || productData.vendorId || productData.vendor?._id || productData.vendor
      if (vendorId) {
        try {
          const vendorRes = await vendorAPI.getVendorById(vendorId)
          setVendor(vendorRes.data?.data || vendorRes.data)
        } catch (err) {
          setVendor(null)
        }
      }
    } catch (err) {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) return navigate('/login')

    const imageUrl = product.images?.[0]?.url || product.images?.[0] || product.images?.primary
    addToCart({
      id: product._id,
      name: product.title,
      price: product.price?.sellingPrice || product.price,
      image: imageUrl,
      vendor: product.vendorId?._id || product.vendorId,
      vendorName: vendor?.businessName || vendor?.shopName || 'Premium Seller',
      quantity
    })
    toast.success('Added to cart')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login')
    try {
      await reviewAPI.createReview({
        productId: product._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      })
      toast.success('Review submitted')
      setShowReviewForm(false)
      loadProductDetails()
    } catch (err) {
      toast.error('Failed to submit')
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolid key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-[var(--vibe-accent)]' : 'text-white/10'}`} />
    ))
  }

  if (loading) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--vibe-accent)]/20 border-t-[var(--vibe-accent)] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Calibrating Experience...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center space-y-6 max-w-xs">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
          <ShoppingBagIcon className="w-10 h-10 text-gray-600" />
        </div>
        <h1 className="text-2xl font-black">Artifact Not Found</h1>
        <button onClick={() => navigate('/products')} className="btn-premium w-full py-4 text-xs font-black uppercase tracking-widest">Back to Gallery</button>
      </div>
    </div>
  )

  const price = product.price?.sellingPrice || product.price || 0
  const mrp = product.price?.mrp || price
  const productTitle = product?.title || 'Product'

  return (
    <>
      <Helmet>
        <title>{product.title} | ExpressKart Premium</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--vibe-light)] text-[var(--charcoal)] pt-24 pb-32">
        <div className="container-custom">
          {/* Breadcrumb / Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--charcoal)] transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              Return to Marketplace
            </button>
            <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600">
              <Link to="/" className="hover:text-[var(--charcoal)] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-[var(--charcoal)] transition-colors">Marketplace</Link>
              <span>/</span>
              <span className="text-[var(--vibe-accent)]">{product.category}</span>
            </div>
          </div>

          {/* Product Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Gallery Column */}
            <div className="space-y-6">
              <div className="glass-card p-4 border-[var(--vibe-border)] bg-white">
                <ProductImageGallery product={product} isOwner={false} onImageDeleted={() => { }} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center bg-white/[0.01]">
                  <TruckIcon className="w-5 h-5 text-[var(--vibe-accent)]" />
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Priority Logistics</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center bg-white/[0.01]">
                  <ShieldCheckIcon className="w-5 h-5 text-[var(--vibe-accent)]" />
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Asset Protection</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center bg-white/[0.01]">
                  <CheckCircleIcon className="w-5 h-5 text-[var(--vibe-accent)]" />
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Certified Origin</p>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="space-y-8">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-[var(--vibe-accent)]/10 border border-[var(--vibe-accent)]/20 text-[10px] font-black uppercase text-[var(--vibe-accent)] tracking-widest leading-none">
                    {product.brand || 'Premium Selection'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {renderStars(product.rating?.average || 0)}
                    <span className="text-xs font-bold text-gray-500 ml-1">({reviews.length})</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--charcoal)]">{product.title}</h1>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xl text-lg">
                  {product.shortDescription || product.description?.substring(0, 160) + '...'}
                </p>
              </div>

              <div className="glass-card p-8 border-[var(--vibe-border)] bg-white space-y-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Market Valuation</p>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-[var(--charcoal)]">₹{price.toLocaleString()}</span>
                      {mrp > price && (
                        <span className="text-xl font-bold text-gray-400 line-through">₹{mrp.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  {mrp > price && (
                    <div className="px-3 py-1 bg-[var(--vibe-accent)]/10 border border-[var(--vibe-accent)]/30 rounded-lg text-[var(--vibe-accent)] text-[10px] font-black uppercase">
                      Efficiency Bonus: {Math.round((1 - price / mrp) * 100)}%
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Allocation</p>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-black text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Availability Matrix</p>
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-[var(--vibe-gray)] border border-[var(--vibe-border)] rounded-xl">
                      <div className={`w-2 h-2 rounded-full ${(product.inventory?.stock > 0 || product.stock > 0) ? 'bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--charcoal)]">
                        {(product.inventory?.stock > 0 || product.stock > 0) ? `${product.inventory?.stock || product.stock} units in reserve` : 'Allocation Depleted'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!(product.inventory?.stock > 0 || product.stock > 0)}
                    className="btn-premium flex-1 py-5 uppercase font-black tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-[var(--vibe-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Acquire Artifact
                  </button>
                  <button
                    onClick={() => setIsInWishlist(!isInWishlist)}
                    className={`w-16 h-16 glass-card border-[var(--vibe-border)] flex items-center justify-center hover:bg-[var(--vibe-gray)] transition-all group ${isInWishlist ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <HeartIcon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Vendor Teaser */}
              {vendor && (
                <div className="flex items-center justify-between p-7 glass-card border-[var(--vibe-border)] hover:border-[var(--vibe-accent)] transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--vibe-accent)] to-[var(--vibe-hover)] flex items-center justify-center font-black text-white text-xl shadow-lg">
                      {vendor.businessName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Authenticated Merchant</p>
                      <h4 className="font-black text-[var(--charcoal)] text-lg group-hover:text-[var(--vibe-accent)] transition-colors">
                        {vendor.businessName || vendor.shopName || 'Premium Seller'}
                      </h4>
                    </div>
                  </div>
                  <Link
                    to={`/vendors/${vendor._id || vendor.id}`}
                    className="w-10 h-10 glass-card border-[var(--vibe-border)] flex items-center justify-center group-hover:bg-[var(--vibe-accent)] group-hover:text-white transition-all"
                  >
                    <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Specifications & Intelligence */}
          <div className="space-y-12">
            <div className="flex border-b border-white/5 gap-12 overflow-x-auto no-scrollbar pb-px">
              {['details', 'specifications', 'intelligence'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap px-2 ${activeTab === tab ? 'text-[var(--charcoal)]' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--vibe-accent)] shadow-[0_0_10px_rgba(244,180,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {activeTab === 'details' && (
                <div className="glass-card p-12 md:p-16 border-[var(--vibe-border)] bg-white space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="max-w-4xl space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-1 bg-[var(--vibe-accent)] h-8 rounded-full" />
                      <h3 className="text-2xl font-black tracking-tight text-[var(--charcoal)]">Product Manifesto</h3>
                    </div>
                    <p className="text-gray-600 font-medium leading-[2.2] text-xl">
                      {product.description}
                    </p>
                  </div>
                  {product.keyFeatures && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
                      {(Array.isArray(product.keyFeatures) ? product.keyFeatures : product.keyFeatures.split(',')).map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                          <CheckCircleIcon className="w-6 h-6 text-[var(--vibe-accent)] mt-0.5 group-hover:scale-110 transition-transform" />
                          <span className="text-lg font-bold text-gray-600 group-hover:text-[var(--charcoal)] transition-colors">{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="glass-card p-12 border-[var(--vibe-border)] bg-white animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-4">
                    {Object.entries({
                      'Brand Identifier': product.brand,
                      'System Category': product.category,
                      'Resource Allocation': `${product.inventory?.stock || product.stock || 0} units remaining`,
                      'Artifact ID': product._id,
                      'Origin Point': vendor?.businessName || 'Verified Vault',
                      'Asset Integrity': 'New / Pristine',
                      'Market Status': (product.inventory?.stock > 0 || product.stock > 0) ? 'Active Deployment' : 'Restocking Phase',
                      'Category Depth': product.subcategory || 'Main Cluster'
                    }).map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center py-6 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
                        <span className="text-base font-bold text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'intelligence' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-[var(--charcoal)] mb-1">Community Intel</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{reviews.length} Validated Log Entries</p>
                    </div>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn-premium px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--vibe-accent)]/10 border-[var(--vibe-accent)]/20"
                    >
                      Log Findings
                    </button>
                  </div>

                  {showReviewForm && (
                    <div className="glass-card p-10 border-[var(--vibe-accent)]/30 bg-[var(--vibe-accent)]/[0.03] space-y-8">
                      <h4 className="text-lg font-black uppercase tracking-widest">Initialization of Sentiment Data</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Quality Rating</label>
                          <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                                className="transition-all hover:scale-125 focus:outline-none"
                              >
                                <StarSolid className={`w-10 h-10 ${s <= reviewForm.rating ? 'text-[var(--vibe-accent)] drop-shadow-[0_0_8px_rgba(244,180,0,0.4)]' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Transcript</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            className="input-premium py-5 h-40 text-lg"
                            placeholder="Share your technical findings regarding this acquisition..."
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-4">
                          <button type="button" onClick={() => setShowReviewForm(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--charcoal)] transition-colors">Abort</button>
                          <button type="submit" className="btn-premium px-10 py-4 text-xs font-black uppercase tracking-[0.2em]">Transmit Intelligence</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.length > 0 ? reviews.map(review => (
                      <div key={review._id} className="glass-card p-10 border-[var(--vibe-border)] bg-white space-y-6 hover:border-[var(--vibe-accent)] transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--vibe-gray)] flex items-center justify-center text-gray-400 group-hover:bg-[var(--vibe-accent)]/20 group-hover:text-[var(--vibe-accent)] transition-colors">
                              <UserIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="text-base font-black group-hover:text-[var(--charcoal)] transition-colors">{review.userId?.name || 'Anonymous Intelligence'}</h5>
                              <div className="flex gap-1 mt-0.5">{renderStars(review.rating)}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase mt-1">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-gray-600 text-base font-medium leading-loose italic">
                          "{review.comment}"
                        </p>
                      </div>
                    )) : (
                      <div className="col-span-full py-32 text-center glass-card border-dashed border-white/10 bg-transparent">
                        <ChatBubbleLeftIcon className="w-16 h-16 mx-auto text-gray-800 mb-6" />
                        <h4 className="text-lg font-black text-gray-600 uppercase tracking-[0.3em]">No Intel Fragments Detected</h4>
                        <p className="text-sm font-bold text-gray-700 mt-2 uppercase tracking-widest">System awaiting initial deployment feedback</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
