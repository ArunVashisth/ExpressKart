import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  TagIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { CartContext } from '../../context/CartContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const EnhancedCart = () => {
  const navigate = useNavigate()
  const { cartItems: cart, removeFromCart, updateQuantity, clearCart, loading: cartLoading } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [error, setError] = useState(null)

  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [deliveryOption, setDeliveryOption] = useState('standard')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [showDiscountForm, setShowDiscountForm] = useState(false)

  // Group cart items by vendor
  const groupedCart = cart.reduce((groups, item) => {
    const vendorId = item.vendor || 'unknown'
    if (!groups[vendorId]) {
      groups[vendorId] = {
        vendor: item.vendorName || 'Unknown Vendor',
        items: [],
        subtotal: 0,
        deliveryFee: 50 // Mock delivery fee per vendor
      }
    }
    groups[vendorId].items.push(item)
    // Handle both object and number price formats
    const itemPrice = item.price && typeof item.price === 'object'
      ? item.price.sellingPrice
      : item.price
    groups[vendorId].subtotal += itemPrice * item.quantity
    return groups
  }, {})

  const calculateSubtotal = () => {
    return Object.values(groupedCart).reduce((total, group) => total + group.subtotal, 0)
  }

  const calculateDeliveryFees = () => {
    return Object.values(groupedCart).reduce((total, group) => total + group.deliveryFee, 0)
  }

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0
    return (calculateSubtotal() * appliedDiscount.percentage) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFees() - calculateDiscount()
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      setError(null)
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
      setError('Failed to update item quantity. Please try again.')
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      setError(null)
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing item:', error)
      setError('Failed to remove item from cart. Please try again.')
      toast.error('Failed to remove item')
    }
  }

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code')
      return
    }

    // Mock discount codes
    const mockDiscounts = {
      'WELCOME10': { percentage: 10, description: '10% off for new customers' },
      'SAVE20': { percentage: 20, description: '20% off on orders above ₹500' },
      'FREEDEL': { percentage: 0, description: 'Free delivery on orders above ₹1000', freeDelivery: true }
    }

    const discount = mockDiscounts[discountCode.toUpperCase()]
    if (discount) {
      setAppliedDiscount(discount)
      toast.success(`Discount applied: ${discount.description}`)
      setDiscountCode('')
      setShowDiscountForm(false)
    } else {
      toast.error('Invalid discount code')
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    toast.success('Discount removed')
  }

  const handleProceedToCheckout = () => {
    try {
      setError(null)

      if (!user) {
        toast.error('Please login to proceed to checkout')
        return
      }

      if (cart.length === 0) {
        toast.error('Your cart is empty')
        return
      }

      // Navigate to checkout
      navigate('/checkout')
      toast.success('Proceeding to checkout...')
    } catch (error) {
      console.error('Error proceeding to checkout:', error)
      setError('Failed to proceed to checkout. Please try again.')
      toast.error('Failed to proceed to checkout')
    }
  }

  // Show loading state
  if (cartLoading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)]"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading your cart...</h2>
          <p className="text-gray-600 mb-8">Please wait while we fetch your cart items.</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Show empty cart state
  if (cart.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TruckIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12 bg-[var(--vibe-light)] min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-[var(--charcoal)] flex items-center justify-center shadow-lg shadow-black/10">
          <ShoppingBagIcon className="w-6 h-6 text-[var(--vibe-accent)]" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">Your Collection</h1>
          <p className="text-stone-500 font-medium">Review your hand-picked artifacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(groupedCart).map(([vendorId, group]) => (
            <div key={vendorId} className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
              {/* Vendor Header */}
              <div className="bg-stone-50/50 px-8 py-5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900 tracking-tight uppercase text-xs tracking-[0.1em]">{group.vendor}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Expedited: 30-45 min</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-[var(--vibe-accent)]/20 border border-[var(--vibe-accent)]/30 rounded-lg">
                  <span className="text-[10px] font-black text-[var(--charcoal)] uppercase tracking-widest">
                    Dispatch: ₹{group.deliveryFee}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-stone-50">
                {group.items.map((item) => (
                  <div key={item.id} className="p-8 group hover:bg-stone-50/30 transition-colors">
                    <div className="flex items-center gap-8">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-stone-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-stone-100 group-hover:scale-105 transition-transform duration-700 shadow-sm">
                        <img
                          src={item.image || 'https://via.placeholder.com/80x80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="text-xl font-black text-stone-900 truncate tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                          Unit: ₹{item.price && typeof item.price === 'object' ? item.price.sellingPrice : item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4 mt-4">
                          <div className="flex items-center bg-stone-50 rounded-xl border border-stone-100 p-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all text-stone-400 hover:text-stone-900 hover:shadow-sm"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-stone-900 font-black text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all text-stone-400 hover:text-stone-900 hover:shadow-sm"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="text-right space-y-4">
                        <p className="text-2xl font-black text-stone-900 tracking-tighter">
                          ₹{(item.price && typeof item.price === 'object' ? item.price.sellingPrice : item.price) * item.quantity}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Discard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Cart Actions */}
          <div className="flex justify-between items-center pt-8">
            <button
              onClick={clearCart}
              className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all"
            >
              Purge Collection
            </button>
            <Link
              to="/products"
              className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--charcoal)] hover:bg-[var(--vibe-accent)]/20 transition-all flex items-center gap-2"
            >
              Continue Exploration
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10 sticky top-32 shadow-2xl shadow-stone-900/5">
            <h2 className="text-2xl font-black text-stone-900 mb-8 tracking-tight">Valuation</h2>

            {/* Delivery Options */}
            <div className="mb-10 space-y-5">
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Logistics Tier</h3>
              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${deliveryOption === 'standard' ? 'border-[var(--charcoal)] bg-[var(--vibe-accent)]/10' : 'border-stone-50 hover:border-stone-100'}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryOption === 'standard'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryOption === 'standard' ? 'bg-[var(--charcoal)] text-[var(--vibe-accent)]' : 'bg-stone-50 text-stone-400'}`}>
                      <TruckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Standard Sync</span>
                      <p className="text-[10px] text-stone-400 font-bold mt-0.5">30-45 MIN • ₹50</p>
                    </div>
                  </div>
                </label>
                <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${deliveryOption === 'express' ? 'border-[var(--charcoal)] bg-[var(--vibe-accent)]/10' : 'border-stone-50 hover:border-stone-100'}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryOption === 'express'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryOption === 'express' ? 'bg-[var(--charcoal)] text-[var(--vibe-accent)]' : 'bg-stone-50 text-stone-400'}`}>
                      <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Priority Pulse</span>
                      <p className="text-[10px] text-stone-400 font-bold mt-0.5">15-20 MIN • ₹100</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Discount Code */}
            <div className="mb-10">
              {!showDiscountForm ? (
                <button
                  onClick={() => setShowDiscountForm(true)}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 w-full text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-[var(--charcoal)] transition-all group"
                >
                  <TagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Apply Privilege Code
                </button>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-[10px] font-black tracking-widest uppercase focus:ring-4 focus:ring-[var(--vibe-accent)]/20 focus:border-[var(--charcoal)]/30 outline-none transition-all"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-6 py-3 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-all"
                    >
                      Auth
                    </button>
                  </div>
                  <button
                    onClick={() => setShowDiscountForm(false)}
                    className="text-[9px] font-black text-stone-400 hover:text-stone-900 uppercase tracking-widest px-2"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Applied Discount */}
            {appliedDiscount && (
              <div className="mb-10 p-5 bg-orange-50/50 border border-orange-100 rounded-[1.5rem] animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TagIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-[11px] font-black text-orange-800 uppercase tracking-widest">
                      {appliedDiscount.description}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveDiscount}
                    className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-all"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="text-stone-400">Artifact Sum</span>
                <span className="text-stone-900">₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="text-stone-400">Logistics Sum</span>
                <span className="text-stone-900">₹{calculateDeliveryFees()}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                  <span>Privilege Rebate</span>
                  <span>-₹{calculateDiscount()}</span>
                </div>
              )}
              <div className="border-t border-stone-100 pt-6 mt-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-xs">Final Valuation</span>
                    <p className="text-4xl font-black text-stone-900 tracking-tighter">₹{calculateTotal()}</p>
                  </div>
                </div>
                <p className="text-[9px] text-stone-400 font-bold uppercase mt-4 tracking-widest">
                  Inclusive of all community levies
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="btn-premium w-full py-5 !rounded-2xl !text-xs !tracking-[0.3em] shadow-xl shadow-premium-violet/20"
            >
              Initialize Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCart
