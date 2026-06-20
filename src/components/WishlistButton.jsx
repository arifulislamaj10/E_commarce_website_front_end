'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/store/wishlist';

// Snapshot of just the fields the wishlist page / cards need to render.
function toSnapshot(product) {
  return {
    productId: product._id,
    _id: product._id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    thumbnail: product.thumbnail || product.images?.[0] || null,
    category: product.category,
    rating: product.rating,
    numReviews: product.numReviews,
    isFeatured: product.isFeatured,
  };
}

/**
 * Heart toggle. `variant`:
 *  - 'icon' (default) → circular icon button, e.g. over a product card image
 *  - 'full' → labelled button for the product detail page
 */
export default function WishlistButton({ product, variant = 'icon' }) {
  const toggle = useWishlist((s) => s.toggle);
  const items = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted && items.some((i) => i.productId === product._id);

  function handleClick(e) {
    // Cards wrap the heart in a <Link> — don't navigate when toggling.
    e.preventDefault();
    e.stopPropagation();
    toggle(toSnapshot(product));
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-semibold transition ${
          active ? 'border-gold bg-gold/10 text-gold-soft' : 'border-matte/15 text-matte hover:border-gold'
        }`}
      >
        <span className={active ? 'text-gold' : ''}>{active ? '♥' : '♡'}</span>
        {active ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur transition hover:bg-white"
    >
      <span className={active ? 'text-gold' : 'text-ink/50'}>{active ? '♥' : '♡'}</span>
    </button>
  );
}
