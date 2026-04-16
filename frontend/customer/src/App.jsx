import { useState, useReducer, useCallback, useMemo } from 'react'
import { ShoppingCart, Bell, User, MapPin, Sparkles, Trash2, X, Check } from 'lucide-react'

// Cart reducer for state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, { ...action.payload, cartId: Date.now() }]
    case 'REMOVE_ITEM':
      return state.filter(item => item.cartId !== action.payload)
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

// Product data
const products = [
  { id: '1', name: 'Jollof Rice', price: 20.00, description: 'Traditional Ghanaian jollof rice with grilled chicken & plantain', emoji: '🍛', isPopular: true, preparationTime: 15 },
  { id: '2', name: 'Fried Chicken', price: 25.00, description: 'Crispy buttermilk fried chicken (4 pcs) with spicy mayo', emoji: '🍗', isPopular: true, preparationTime: 20 },
  { id: '3', name: 'Banku & Tilapia', price: 35.00, description: 'Grilled tilapia with spiced banku, fresh veggies & shito', emoji: '🐟', preparationTime: 25 },
  { id: '4', name: 'Waakye', price: 18.00, description: 'Rice & beans with spaghetti, boiled egg, salad & meat', emoji: '🍚', preparationTime: 15 },
  { id: '5', name: 'Kelewele', price: 12.00, description: 'Spicy fried plantain cubes with groundnut', emoji: '🍌', isPopular: true },
  { id: '6', name: 'Fufu & Light Soup', price: 30.00, description: 'Pounded cassava with goat meat light soup', emoji: '🥘', preparationTime: 30 }
]

// MoMo networks
const momoNetworks = [
  { id: 'mtn', name: 'MTN MoMo', color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500', icon: '📱' },
  { id: 'vodafone', name: 'Vodafone Cash', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', icon: '📱' },
  { id: 'airteltigo', name: 'AirtelTigo Money', color: 'bg-red-600', hoverColor: 'hover:bg-red-700', icon: '📱' }
]

function App() {
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [activeView, setActiveView] = useState('menu')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState('network') // network, phone, otp, success
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orders, setOrders] = useState([])
  const [addedItems, setAddedItems] = useState(new Set())

  // Cart calculations
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price, 0), [cart]
  )
  const deliveryFee = 5.00
  const serviceFee = useMemo(() => subtotal * 0.10, [subtotal])
  const grandTotal = useMemo(() => subtotal + deliveryFee + serviceFee, [subtotal, serviceFee])

  // Add to cart with animation
  const handleAddToCart = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    setAddedItems(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 500)
  }, [])

  const handleRemoveFromCart = useCallback((cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId })
  }, [])

  const handleCheckout = () => {
    setShowPaymentModal(true)
    setPaymentStep('network')
  }

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network)
    setPaymentStep('phone')
  }

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }

  const handlePhoneSubmit = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setPaymentStep('otp')
  }

  const handleOtpSubmit = async () => {
    setIsProcessing(true)
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setPaymentStep('success')
    
    // Create order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: grandTotal,
      paymentMethod: selectedNetwork.name,
      status: 'preparing',
      timestamp: new Date().toISOString(),
      estimatedTime: 35
    }
    setOrders(prev => [newOrder, ...prev])
    
    // Clear cart and close modal after delay
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' })
      setShowPaymentModal(false)
      setActiveView('orders')
      setPaymentStep('network')
      setSelectedNetwork(null)
      setPhoneNumber('')
      setOtpCode('')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-[#FFF9F5] via-[#FFEFE6] to-[#FFE5D9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50 hover:scale-105 transition-transform cursor-pointer group">
                <span className="text-2xl group-hover:animate-bounce">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] bg-clip-text text-transparent tracking-tight">
                  PaaJim Customer
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600 cursor-pointer transition-colors group">
                  <MapPin size={12} />
                  <span className="group-hover:hidden">Effiduasi, Ghana</span>
                  <span className="hidden group-hover:inline">Change location</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="w-11 h-11 rounded-full hover:bg-orange-50/80 hover:scale-105 transition-all flex items-center justify-center">
                <Bell size={20} className="text-gray-600" />
              </button>
              
              <button className="relative w-11 h-11 rounded-full hover:bg-orange-50/80 hover:scale-105 transition-all flex items-center justify-center">
                <ShoppingCart size={20} className="text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm animate-scale-pop">
                    {cart.length}
                  </span>
                )}
              </button>
              
              <button className="w-11 h-11 rounded-full hover:bg-orange-50/80 hover:scale-105 transition-all flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-md border-b border-orange-100/50 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 relative">
            <button
              onClick={() => setActiveView('menu')}
              className={`relative py-4 px-4 font-semibold transition-all ${
                activeView === 'menu' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Menu
              {activeView === 'menu' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-slide-in" />
              )}
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`relative py-4 px-4 font-semibold transition-all ${
                activeView === 'orders' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              My Orders
              {activeView === 'orders' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-slide-in" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'menu' ? (
          <div className="animate-fade-in">
            {/* Title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={28} className="text-orange-500" />
                <h2 className="text-4xl font-bold text-gray-900">Our Menu</h2>
              </div>
              <p className="text-lg text-gray-600">Fresh, delicious meals prepared just for you</p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-orange-100/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Area */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50/30 flex items-center justify-center overflow-hidden group">
                    <span className="text-7xl drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {product.emoji}
                    </span>
                    {product.isPopular && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-orange-600">GH₵{product.price.toFixed(2)}</span>
                        {product.preparationTime && (
                          <span className="text-xs text-gray-400">~{product.preparationTime} mins</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        {addedItems.has(product.id) ? '✓ Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h2>
              <p className="text-lg text-gray-600">Track your delicious journey</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 text-center border border-orange-100/50">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
                  <ShoppingCart size={48} className="text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
                <p className="text-gray-600 mb-6">Your delicious journey starts here</p>
                <button
                  onClick={() => setActiveView('menu')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-orange-100/50 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order {order.id}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                        {order.status === 'preparing' ? '👨‍🍳 Preparing' : order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="flex-1 text-gray-700">{item.name}</span>
                          <span className="font-semibold text-gray-900">GH₵{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Paid via {order.paymentMethod}</p>
                        <p className="text-xs text-gray-400">Est. delivery: {order.estimatedTime} mins</p>
                      </div>
                      <span className="text-2xl font-black text-orange-600">GH₵{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 pb-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-t-3xl border-t-2 border-orange-400 shadow-2xl p-6">
              {/* Cart Items */}
              <div className="mb-4 max-h-32 overflow-y-auto space-y-2">
                {cart.map(item => (
                  <div key={item.cartId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">GH₵{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>GH₵{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee (10%)</span>
                  <span>GH₵{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-orange-600">GH₵{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                Checkout with MoMo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            {/* Network Selection */}
            {paymentStep === 'network' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
                <p className="text-gray-600 mb-6">Choose your Mobile Money network</p>
                
                <div className="space-y-3">
                  {momoNetworks.map(network => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className={`w-full ${network.color} ${network.hoverColor} text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl">{network.icon}</span>
                        <span>{network.name}</span>
                      </span>
                      <span className="text-2xl">→</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-orange-50 rounded-2xl">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Amount to Pay</p>
                  <p className="text-3xl font-black text-orange-600">GH₵{grandTotal.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Phone Number Input */}
            {paymentStep === 'phone' && (
              <div>
                <button
                  onClick={() => setPaymentStep('network')}
                  className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
                >
                  ← Back
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Phone Number</h2>
                <p className="text-gray-600 mb-6">We'll send a payment request to this number</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {selectedNetwork?.name} Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="024 XXX XXXX"
                    maxLength={12}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="mb-6 p-4 bg-orange-50 rounded-2xl">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Amount to Pay</p>
                  <p className="text-3xl font-black text-orange-600">GH₵{grandTotal.toFixed(2)}</p>
                </div>

                <button
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.replace(/\s/g, '').length !== 10 || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Request Payment'
                  )}
                </button>
              </div>
            )}

            {/* OTP Input */}
            {paymentStep === 'otp' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-6">Check your phone for the 6-digit code</p>
                
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-3xl font-mono tracking-widest focus:outline-none focus:border-orange-500 transition-colors mb-6"
                />

                <button
                  onClick={handleOtpSubmit}
                  disabled={otpCode.length !== 6 || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
              </div>
            )}

            {/* Success */}
            {paymentStep === 'success' && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center animate-scale-pop">
                  <Check size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your order has been confirmed</p>
                <div className="p-4 bg-green-50 rounded-2xl">
                  <p className="text-sm text-gray-700 mb-1">Amount Paid</p>
                  <p className="text-3xl font-black text-green-600">GH₵{grandTotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Redirecting to your orders...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes slide-in {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-pop { animation: scale-pop 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
        .animate-fade-up { animation: fade-up 0.4s ease-out forwards; opacity: 0; }
        .animate-scale-in { animation: scale-in 0.25s ease-out; }
        .active\\:scale-98:active { transform: scale(0.98); }
        .bg-gradient-radial { background: radial-gradient(circle at center, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  )
}

export default App
