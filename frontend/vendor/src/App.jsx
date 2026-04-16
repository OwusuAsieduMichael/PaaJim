import { useState, useEffect } from 'react'
import { ChefHat, Bell, Clock, CheckCircle } from 'lucide-react'

function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderId: 'ORD-001',
          customerName: 'John Doe',
          customerPhone: '+233 24 123 4567',
          status: 'PENDING',
          items: [
            { name: 'Jollof Rice', quantity: 2, price: 20.00 },
            { name: 'Fried Chicken', quantity: 1, price: 25.00 }
          ],
          totalAmount: 45.00,
          createdAt: new Date().toISOString()
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'CONFIRMED' } : order
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  PaaJim Vendor
                </h1>
                <p className="text-sm text-neutral-600">Order Management</p>
              </div>
            </div>
            
            <button className="relative p-3 hover:bg-orange-50 rounded-xl transition-all duration-200">
              <Bell size={22} className="text-neutral-700" />
              {orders.filter(o => o.status === 'PENDING').length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Incoming Orders</h2>
          <p className="text-lg text-neutral-600">
            {orders.filter(o => o.status === 'PENDING').length} pending orders
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <ChefHat size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Orders Yet</h3>
            <p className="text-neutral-600 text-lg">New orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{order.orderId}</h3>
                    <p className="text-base text-neutral-600 mt-1">{order.customerName}</p>
                    <p className="text-sm text-neutral-500">{order.customerPhone}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    order.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="border-t border-neutral-100 pt-6 mb-6">
                  <h4 className="font-semibold text-neutral-900 mb-4 text-lg">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                        <span className="text-neutral-700 font-medium">
                          <span className="inline-block w-8 h-8 bg-orange-100 text-orange-600 rounded-lg text-center leading-8 mr-3 font-bold">
                            {item.quantity}
                          </span>
                          {item.name}
                        </span>
                        <span className="font-bold text-neutral-900 text-lg">
                          GH₵{item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-200">
                    <span className="font-bold text-neutral-900 text-lg">Total</span>
                    <span className="font-bold text-orange-600 text-2xl">
                      GH₵{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6 bg-neutral-50 p-3 rounded-xl">
                  <Clock size={18} className="text-orange-500" />
                  <span>Ordered {new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>

                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-lg"
                  >
                    Accept Order
                  </button>
                )}

                {order.status === 'CONFIRMED' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={24} className="text-green-600" />
                      <p className="text-green-800 font-bold text-lg">
                        Order Accepted - Preparing for delivery
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
