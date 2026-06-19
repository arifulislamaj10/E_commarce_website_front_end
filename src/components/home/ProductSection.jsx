import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

/**
 * A titled product rail. `tone` controls the background band so adjacent
 * sections stay visually distinct ('white' | 'soft').
 */
export default function ProductSection({ id, eyebrow, title, items = [], viewAllHref, cols = 4, tone = 'soft' }) {
  if (!items.length) return null;
  const grid = cols === 4 ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-3';
  const band = tone === 'white' ? 'bg-white border-y border-black/5' : 'bg-soft';

  return (
    <section id={id} className={band}>
      <div className="container-px py-16 md:py-20">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">{eyebrow}</p>}
            <h2 className="mt-2 font-serif text-3xl font-bold text-matte md:text-4xl">{title}</h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-gold" />
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="hidden shrink-0 text-sm font-medium text-gold-soft hover:text-gold sm:block">
              View all →
            </Link>
          )}
        </div>
        <div className={`grid grid-cols-2 gap-5 ${grid}`}>
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
