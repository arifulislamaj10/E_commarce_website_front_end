'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

function Stars({ value = 0, size = 'text-base' }) {
  const full = Math.round(value);
  return (
    <span className={`${size} leading-none text-gold`}>
      {'★'.repeat(full)}
      <span className="text-ink/20">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1 text-2xl leading-none">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={(hover || value) >= n ? 'text-gold' : 'text-ink/25'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const EMPTY_FORM = { name: '', rating: 0, title: '', comment: '' };

export default function ProductReviews({ productId }) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await api(`/reviews/product/${productId}?limit=20`));
    } catch (e) {
      setLoadError(e.message);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setFormError(null);
    if (!form.rating) return setFormError('Please select a star rating.');
    if (!form.name.trim()) return setFormError('Please enter your name.');
    setSubmitting(true);
    try {
      await api(`/reviews/product/${productId}`, {
        method: 'POST',
        body: {
          name: form.name.trim(),
          rating: form.rating,
          title: form.title || undefined,
          comment: form.comment || undefined,
        },
      });
      setForm(EMPTY_FORM);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
      await load();
    } catch (err) {
      setFormError(err.message + (err.details ? ` — ${err.details.join(', ')}` : ''));
    } finally {
      setSubmitting(false);
    }
  }

  const summary = data?.summary;
  const total = summary?.count || 0;

  return (
    <section className="mt-16 border-t border-black/5 pt-12">
      <h2 className="font-serif text-2xl font-bold text-matte">Customer Reviews</h2>

      {loadError && <p className="mt-4 text-sm text-red-600">Couldn’t load reviews: {loadError}</p>}

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Summary + distribution */}
        <div className="lg:col-span-1">
          {summary && (
            <div className="card p-6 text-center">
              <p className="text-4xl font-bold text-matte">{summary.average.toFixed(1)}</p>
              <div className="mt-1 flex justify-center"><Stars value={summary.average} size="text-xl" /></div>
              <p className="mt-1 text-sm text-ink/60">{total} review{total === 1 ? '' : 's'}</p>

              <div className="mt-5 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const c = summary.distribution[star] || 0;
                  const pct = total ? (c / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-ink/60">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-right text-ink/50">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Write a review */}
          <form onSubmit={submit} className="card mt-6 space-y-3 p-6">
            <h3 className="font-serif text-lg font-bold text-matte">Write a review</h3>
            <StarInput value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            <input className="w-full rounded-md border border-matte/15 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" placeholder="Your name *" value={form.name} onChange={set('name')} />
            <input className="w-full rounded-md border border-matte/15 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" placeholder="Title (optional)" value={form.title} onChange={set('title')} />
            <textarea className="w-full rounded-md border border-matte/15 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" rows={3} placeholder="Share your experience…" value={form.comment} onChange={set('comment')} />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {done && <p className="text-sm text-emerald-brand">✓ Thanks for your review!</p>}
            <button type="submit" disabled={submitting} className="btn-gold w-full">{submitting ? 'Submitting…' : 'Submit review'}</button>
          </form>
        </div>

        {/* Review list */}
        <div className="space-y-5 lg:col-span-2">
          {data && total === 0 && (
            <p className="rounded-lg border border-dashed border-black/10 p-8 text-center text-ink/50">
              No reviews yet — be the first to review this product.
            </p>
          )}
          {data?.items.map((r) => (
            <article key={r._id} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-matte text-sm font-bold text-gold">
                    {r.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-matte">{r.name}</p>
                    {r.verifiedPurchase && <span className="text-xs font-medium text-emerald-brand">✓ Verified purchase</span>}
                  </div>
                </div>
                <span className="text-xs text-ink/50">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-3"><Stars value={r.rating} /></div>
              {r.title && <p className="mt-2 font-medium text-matte">{r.title}</p>}
              {r.comment && <p className="mt-1 text-sm leading-relaxed text-ink/80">{r.comment}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
