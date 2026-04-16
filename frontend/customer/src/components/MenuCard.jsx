import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MenuCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    await onAddToCart(product);
    setIsAdding(false);
  };

  return (
    <div className="card card-hover animate-fade-in">
      {/* Product Image */}
      <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-neutral-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-500">
              GH₵{product.price.toFixed(2)}
            </span>
            {product.preparationTime && (
              <span className="text-xs text-neutral-500">
                ~{product.preparationTime} mins
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.isAvailable || isAdding}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
