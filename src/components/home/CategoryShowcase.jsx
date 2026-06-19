import Link from 'next/link';
import { getCategories } from '@/lib/api';

// Brand-tinted gradient per category for an editorial look without needing art.
const TINTS = {
  fashion: 'from-matte to-ink',
  cosmetics: 'from-[#7a2f4a] to-matte',
  perfumes: 'from-emerald-brand to-matte',
  'mobile-accessories': 'from-[#3b2f10] to-matte',
};

export default async function CategoryShowcase() {
  let categories = [];
  try {
    categories = await getCategories();
  } catch {
    return null;
  }
  if (!categories.length) return null;

  return (
    <section id="categories" className="container-px py-16 md:py-20">
      <div className="mb-9 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">Browse</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-matte md:text-4xl">Shop by category</h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gold" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/?category=${c.slug}`}
            className={`group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${TINTS[c.slug] || 'from-matte to-ink'} p-6 text-white shadow-luxe transition`}
          >
            {c.image && (
              <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-110 group-hover:opacity-50" />
            )}
            <div className="absolute right-5 top-5 h-10 w-10 rounded-full border border-gold/40 text-center text-gold transition group-hover:bg-gold group-hover:text-matte">
              <span className="leading-10">→</span>
            </div>
            <div className="relative">
              <h3 className="font-serif text-2xl font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-white/70">{c.description || 'Explore the collection'}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
