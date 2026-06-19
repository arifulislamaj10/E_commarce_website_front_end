'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';

export default function AddToCartButton({ product }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const cartProduct = {
    productId: product._id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail || product.images?.[0] || null,
    stock: product.stock,
  };

  function handleAdd() {
    add(cartProduct, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (outOfStock) {
    return <button className="btn-outline w-full cursor-not-allowed opacity-60" disabled>Out of stock</button>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-ink">Quantity</span>
        <div className="flex items-center rounded-md border border-matte/15">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg leading-none hover:text-gold" aria-label="decrease">−</button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-lg leading-none hover:text-gold" aria-label="increase">+</button>
        </div>
        <span className="text-xs text-ink/60">{product.stock} in stock</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={handleAdd} className="btn-dark flex-1">
          {added ? '✓ Added to cart' : 'Add to cart'}
        </button>
        <button
          onClick={() => {
            add(cartProduct, qty);
            router.push('/checkout');
          }}
          className="btn-gold flex-1"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
