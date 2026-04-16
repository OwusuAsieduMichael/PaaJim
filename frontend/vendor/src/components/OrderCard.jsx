import { Clock, User, MapPin, Phone, Check } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function OrderCard({ order, onConfirm }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(order.id);
    } catch (error) {
      console.error('Failed to confirm order:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-pending', label: 'New Order' },
      CONFIRMED: { class: 'badge-confirmed', label: 'Confirmed' },
      OUT_FOR_DELIVERY: { class: 'badge-out-for-delivery', label: 'Out for Delivery' },
      DELIVERED: { class: 'badge-delivered', label: 'Delivered' },
    };
    const badge = badges[status] || badges.PENDING;
    return <span className={clsx('badge', badge.class)}>{badge.label}</span>;
  };

  return (
    <div className="card space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-900">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1">
            <Clock size={14} />
            Placed at {formatTime(order.placedAt)}
          </p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Customer Info */}
      <div className="p-4 bg-neutral-50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-neutral-900">
          <User size={18} className="text-neutral-600" />
          <span className="font-semibold">{order.customer.fullName}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-700">
          <Phone size={18} className="text-neutral-600" />
          <a href={`tel:${order.customer.phoneNumber}`} className="hover:text-primary-500">
            {order.customer.phoneNumber}
          </a>
        </div>
        <div className="flex items-start gap-2 text-neutral-700">
          <MapPin size={18} className="text-neutral-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{order.deliveryAddress}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
          Order Items
        </h4>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{item.productName}</p>
                {item.specialInstructions && (
                  <p className="text-sm text-neutral-600 mt-1 italic">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                <p className="font-semibold text-neutral-900">
                  GH₵{item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="space-y-2 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-neutral-700">
          <span>Subtotal</span>
          <span>GH₵{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-neutral-700">
          <span>Delivery Fee</span>
          <span>GH₵{order.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xl font-bold text-neutral-900 pt-2 border-t border-neutral-200">
          <span>Total</span>
          <span className="text-primary-500">GH₵{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Button */}
      {order.status === 'PENDING' && (
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="w-full btn btn-success btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConfirming ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <Check size={20} />
              Accept Order
            </>
          )}
        </button>
      )}

      {order.status === 'CONFIRMED' && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-sm text-blue-900 font-medium">
            ✓ Order confirmed. Waiting for rider assignment...
          </p>
        </div>
      )}

      {order.status === 'OUT_FOR_DELIVERY' && order.rider && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-900 font-medium mb-2">
            🚴 Out for Delivery
          </p>
          <p className="text-sm text-purple-800">
            Rider: {order.rider.fullName} ({order.rider.phoneNumber})
          </p>
        </div>
      )}

      {order.status === 'DELIVERED' && (
        <div className="p-4 bg-success-50 rounded-lg border border-success-200 text-center">
          <p className="text-sm text-success-900 font-medium">
            ✓ Delivered at {formatTime(order.deliveredAt)}
          </p>
        </div>
      )}
    </div>
  );
}
