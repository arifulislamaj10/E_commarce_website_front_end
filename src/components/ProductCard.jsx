import Link from 'next/link';
import Image from 'next/image';
import { bdt } from '@/lib/format';
import WishlistButton from '@/components/WishlistButton';

export default function ProductCard({ product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const rating = product.rating || 0;
  const fullStars = Math.round(rating);
  const numReviews = product.numReviews || 0;

  return (
    <Link href={`/products/${product.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-soft">
        <Image
          src={product.thumbnail || product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Badges stacked top-left */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="w-fit rounded-full bg-emerald-brand px-2.5 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="w-fit rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-matte">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist heart top-right */}
        <div className="absolute right-3 top-3">
          <WishlistButton product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-gold-soft">{product.category?.name}</p>
        <h3 className="mt-1 line-clamp-2 font-medium text-matte">{product.title}</h3>

        {/* Rating */}
        <div className="mt-1.5 flex flex-1 items-center gap-1.5">
          {numReviews > 0 ? (
            <>
              <span className="text-sm leading-none text-gold">
                {'★'.repeat(fullStars)}
                <span className="text-ink/20">{'★'.repeat(5 - fullStars)}</span>
              </span>
              <span className="text-xs text-ink/50">{rating.toFixed(1)} ({numReviews})</span>
            </>
          ) : (
            <span className="text-xs text-ink/35">No reviews yet</span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-matte">{bdt(product.price)}</span>
          {discount > 0 && <span className="text-sm text-ink/50 line-through">{bdt(product.compareAtPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
