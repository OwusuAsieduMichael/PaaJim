import { Check, Clock, Package, Truck } from 'lucide-react';
import { clsx } from 'clsx';

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Package },
];

export default function OrderStatusTimeline({ currentStatus, timestamps }) {
  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-6">Order Status</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200" />
        <div 
          className="absolute left-6 top-0 w-0.5 bg-primary-500 transition-all duration-500"
          style={{ height: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const timestamp = timestamps[step.key.toLowerCase() + 'At'];

            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={clsx(
                    'relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-neutral-300 text-neutral-400'
                  )}
                >
                  <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <h4
                      className={clsx(
                        'font-semibold',
                        isCompleted ? 'text-neutral-900' : 'text-neutral-500'
                      )}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="badge badge-pending">Current</span>
                    )}
                  </div>
                  
                  {timestamp && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {new Date(timestamp).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}

                  {/* Special messages */}
                  {isCurrent && step.key === 'OUT_FOR_DELIVERY' && (
                    <p className="text-sm text-primary-600 mt-2 font-medium">
                      🚴 Rider will call you shortly
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Note */}
      {currentStatus === 'OUT_FOR_DELIVERY' && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-sm text-primary-900">
            <strong>Important:</strong> Please share the OTP code sent to your phone with the rider upon delivery.
          </p>
        </div>
      )}
    </div>
  );
}
