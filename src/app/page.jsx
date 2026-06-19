import Link from 'next/link';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import ProductSection from '@/components/home/ProductSection';
import PromoBanner from '@/components/home/PromoBanner';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export const dynamic = 'force-dynamic';

/** Focused listing shown when a category filter or search is active. */
async function FilteredListing({ category, q }) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (q) params.set('q', q);
  params.set('limit', '24');

  let data = { items: [], pagination: {} };
  let error = null;
  try {
    data = await getProducts(params.toString());
  } catch (e) {
    error = e.message;
  }

  const heading = q
    ? `Results for “${q}”`
    : category.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

  return (
    <div className="container-px py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/" className="hover:text-gold-soft">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-matte">{heading}</span>
      </nav>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-serif text-3xl font-bold text-matte">{heading}</h1>
        <p className="text-sm text-ink/60">{data.pagination?.total ?? 0} products</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Couldn’t load products: {error}. Is the API running on <code>{process.env.NEXT_PUBLIC_API_URL}</code>?
        </div>
      )}
      {!error && data.items.length === 0 && <p className="py-20 text-center text-ink/50">No products found.</p>}

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default async function HomePage({ searchParams }) {
  const category = searchParams?.category || '';
  const q = searchParams?.q || '';

  if (category || q) {
    return <FilteredListing category={category} q={q} />;
  }

  // Landing page — fetch the rails in parallel; tolerate API errors gracefully.
  const [featured, newest] = await Promise.all([
    getProducts('featured=true&limit=8').catch(() => ({ items: [] })),
    getProducts('sort=newest&limit=8').catch(() => ({ items: [] })),
  ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryShowcase />
      <ProductSection
        eyebrow="Handpicked"
        title="Featured Collection"
        items={featured.items}
        viewAllHref="#catalog"
        tone="white"
      />
      <PromoBanner />
      <ProductSection
        id="catalog"
        eyebrow="Fresh in"
        title="New Arrivals"
        items={newest.items}
        viewAllHref="/?category=fashion"
        tone="soft"
      />
      <Testimonials />
      <Newsletter />
    </>
  );
}
