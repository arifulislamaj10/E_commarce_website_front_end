import { api } from '@/lib/api';

function Stars({ value }) {
  return <span className="text-gold">{'★'.repeat(value)}<span className="text-white/20">{'★'.repeat(5 - value)}</span></span>;
}

// Live testimonials sourced from real approved customer reviews.
export default async function Testimonials() {
  let reviews = [];
  try {
    reviews = await api('/reviews/highlights', { next: { revalidate: 120 } });
  } catch {
    return null;
  }
  if (!reviews || reviews.length < 3) return null;

  return (
    <section className="bg-matte py-20 text-white">
      <div className="container-px">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Loved by customers</p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">What our shoppers say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r._id} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Stars value={r.rating} />
              {r.title && <p className="mt-3 font-serif text-lg font-semibold text-gold-soft">“{r.title}”</p>}
              <blockquote className="mt-2 text-sm leading-relaxed text-white/80">{r.comment}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-matte">
                  {r.name?.[0]?.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-white/50">
                    {r.verifiedPurchase ? '✓ Verified purchase' : 'Customer'}
                    {r.product?.title ? ` · ${r.product.title}` : ''}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
