import { Phone, MapPin, Navigation, Package } from 'lucide-react';
import { useState } from 'react';

export default function DeliveryCard({ delivery, onVerifyOtp }) {
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleCall = () => {
    window.location.href = `tel:${delivery.customerPhone}`;
  };

  const handleOpenMaps = () => {
    const url = `https://maps.google.com/?q=${delivery.deliveryLatitude},${delivery.deliveryLongitude}`;
    window.open(url, '_blank');
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await onVerifyOtp(delivery.orderId, otpCode);
      setOtpCode('');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Order #{delivery.orderNumber}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Started at {formatTime(delivery.outForDeliveryAt)}
          </p>
        </div>
        <span className="badge badge-out-for-delivery">
          <Package size={14} className="mr-1" />
          In Progress
        </span>
      </div>

      {/* Customer Info */}
      <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700">Customer</p>
            <p className="text-base font-semibold text-neutral-900 mt-1">
              {delivery.customerName}
            </p>
            <p className="text-sm text-neutral-600">{delivery.customerPhone}</p>
          </div>
          <button
            onClick={handleCall}
            className="btn btn-primary flex items-center gap-2"
          >
            <Phone size={18} />
            Call
          </button>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Delivery Address</p>
            <p className="text-sm text-neutral-900 mt-1">{delivery.deliveryAddress}</p>
            {delivery.deliveryNotes && (
              <p className="text-sm text-neutral-600 mt-2 italic">
                Note: {delivery.deliveryNotes}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleOpenMaps}
          className="w-full btn btn-secondary flex items-center justify-center gap-2"
        >
          <Navigation size={18} />
          Open in Maps
        </button>
      </div>

      {/* Order Total */}
      <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg border border-success-200">
        <span className="text-sm font-medium text-success-900">Order Total</span>
        <span className="text-xl font-bold text-success-900">
          GH₵{delivery.total.toFixed(2)}
        </span>
      </div>

      {/* OTP Verification */}
      <div className="pt-4 border-t border-neutral-200 space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Enter OTP from Customer
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setOtpCode(value);
              setError('');
            }}
            placeholder="000000"
            className="input text-center text-2xl font-mono tracking-widest"
          />
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={otpCode.length !== 6 || isVerifying}
          className="w-full btn btn-success btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Confirm Delivery'
          )}
        </button>

        <p className="text-xs text-neutral-500 text-center">
          Ask the customer for the 6-digit OTP code sent to their phone
        </p>
      </div>
    </div>
  );
}
