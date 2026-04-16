import { useState } from 'react'
import { Package, Bell, Phone, MapPin, Navigation } from 'lucide-react'

function App() {
  const [otpCode, setOtpCode] = useState('')

  const delivery = {
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+233 24 123 4567',
    deliveryAddress: '123 Main Street, Effiduasi',
    total: 45.00
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  PaaJim Rider
                </h1>
                <p className="text-sm text-neutral-600">Delivery Dashboard</p>
              </div>
            </div>
            
            <button className="relative p-3 hover:bg-orange-50 rounded-xl transition-all">
              <Bell size={22} className="text-neutral-700" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Active Deliveries</h2>
          <p className="text-lg text-neutral-600">1 delivery pending</p>
        </div>

        {/* Delivery Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Order #{delivery.orderNumber}</h3>
              <p className="text-sm text-neutral-600 mt-1">Started at {new Date().toLocaleTimeString()}</p>
            </div>
            <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 text-purple-800">
              In Progress
            </span>
          </div>

          {/* Customer Info */}
          <div className="p-4 bg-neutral-50 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Customer</p>
                <p className="text-lg font-bold text-neutral-900 mt-1">{delivery.customerName}</p>
                <p className="text-sm text-neutral-600">{delivery.customerPhone}</p>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2">
                <Phone size={18} />
                Call
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <MapPin size={20} className="text-orange-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Delivery Address</p>
                <p className="text-sm text-neutral-900 mt-1">{delivery.deliveryAddress}</p>
              </div>
            </div>
            <button className="w-full bg-white border-2 border-neutral-200 hover:border-orange-300 text-neutral-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Navigation size={18} />
              Open in Maps
            </button>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200 mb-6">
            <span className="text-sm font-semibold text-green-900">Order Total</span>
            <span className="text-2xl font-bold text-green-900">GH₵{delivery.total.toFixed(2)}</span>
          </div>

          {/* OTP Input */}
          <div className="border-t border-neutral-200 pt-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Enter OTP from Customer
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-4 border-2 border-neutral-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-orange-500 mb-4"
            />
            <button
              disabled={otpCode.length !== 6}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Confirm Delivery
            </button>
            <p className="text-xs text-neutral-500 text-center mt-3">
              Ask the customer for the 6-digit OTP code
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
