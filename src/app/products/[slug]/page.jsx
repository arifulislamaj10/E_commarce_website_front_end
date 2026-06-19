import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { bdt } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';
import ProductReviews from '@/components/ProductReviews';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch {
    notFound();
  }

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="container-px py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/" className="hover:text-gold-soft">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/?category=${product.category?.slug}`} className="hover:text-gold-soft">{product.category?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-matte">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">
            <Image src={product.images?.[0] || product.thumbnail} alt={product.title} fill sizes="50vw" className="object-cover" priority />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-soft ring-1 ring-black/5">
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gold-soft">{product.brand}</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-matte md:text-4xl">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-ink/70">
            <span className="text-gold">{'★'.repeat(Math.round(product.rating || 0))}<span className="text-ink/20">{'★'.repeat(5 - Math.round(product.rating || 0))}</span></span>
            <span>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-matte">{bdt(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-ink/40 line-through">{bdt(product.compareAtPrice)}</span>
                <span className="rounded-full bg-emerald-brand px-2.5 py-1 text-xs font-bold text-white">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/5 pt-6 text-center text-xs text-ink/70">
            <div><p className="text-lg">🚚</p>Cash on Delivery</div>
            <div><p className="text-lg">🔒</p>Secure Payment</div>
            <div><p className="text-lg">↩️</p>Easy Returns</div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
}
