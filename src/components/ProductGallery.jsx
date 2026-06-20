'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Product image gallery — clicking a thumbnail swaps the main image.
 */
export default function ProductGallery({ images = [], title = '' }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return <div className="aspect-square rounded-2xl bg-soft" />;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {gallery.slice(0, 6).map((img, i) => (
            <button
              type="button"
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
              className={`relative aspect-square overflow-hidden rounded-lg bg-soft ring-2 transition ${
                active === i ? 'ring-gold' : 'ring-black/5 hover:ring-gold/50'
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
