import Link from 'next/link';
import Image from 'next/image';
import { bdt } from '@/lib/format';

export default function ProductCard({ product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

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
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-brand px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-matte">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-gold-soft">{product.category?.name}</p>
        <h3 className="mt-1 line-clamp-2 flex-1 font-medium text-matte">{product.title}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-matte">{bdt(product.price)}</span>
          {discount > 0 && <span className="text-sm text-ink/50 line-through">{bdt(product.compareAtPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
