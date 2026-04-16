import { useState, useEffect } from 'react'
import { Package, Bell } from 'lucide-react'
import DeliveryCard from './components/DeliveryCard'

function App() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch deliveries from API
    // For now, using mock data
    setTimeout(() => {
      setDeliveries([
        {
          id: 1,
          orderId: 'ORD-001',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          customerPhone: '+233 24 123 4567',
          deliveryAddress: '123 Main Street, Effiduasi',
          deliveryLatitude: 6.7833,
          deliveryLongitude: -1.4167,
          deliveryNotes: 'Please call when you arrive',
          status: 'OUT_FOR_DELIVERY',
          outForDeliveryAt: new Date().toISOString(),
          total: 45.00,
          items: [
            { name: 'Jollof Rice', quantity: 2 },
            { name: 'Fried Chicken', quantity: 1 }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
            
            <button className="relative p-3 hover:bg-orange-50 rounded-xl transition-all duration-200 group">
              <Bell size={22} className="text-neutral-700 group-hover:text-orange-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Active Deliveries</h2>
          <p className="text-lg text-neutral-600">
            {deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'} pending
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <Package size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Active Deliveries</h3>
            <p className="text-neutral-600 text-lg">You're all caught up! New deliveries will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {deliveries.map(delivery => (
              <DeliveryCard 
                key={delivery.id} 
                delivery={delivery}
                onVerifyOtp={(orderId, otp) => {
                  console.log('Verifying OTP:', orderId, otp);
                  // TODO: Call API to verify OTP
                  return Promise.resolve();
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
