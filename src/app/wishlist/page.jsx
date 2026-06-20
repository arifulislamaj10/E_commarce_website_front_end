'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWishlist } from '@/store/wishlist';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch — wishlist lives in localStorage (client only).
  if (!mounted) {
    return <div className="container-px py-16 text-center text-ink/50">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <p className="text-6xl">♡</p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-matte">Your wishlist is empty</h1>
        <p className="mt-2 text-ink/60">Tap the heart on any product to save it for later.</p>
        <Link href="/" className="btn-gold mt-6">Discover products</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-matte">My Wishlist</h1>
          <p className="mt-1 text-sm text-ink/60">{items.length} saved item{items.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={clear} className="text-sm text-ink/50 hover:text-red-600">Clear all</button>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
