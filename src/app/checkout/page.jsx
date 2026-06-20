'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { bdt } from '@/lib/format';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

const FREE_SHIPPING_OVER = 3000;
const SHIPPING_FEE = 60;

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', note: 'Pay when you receive', live: true },
  { id: 'bKash', label: 'bKash', note: 'Mobile banking', live: false },
  { id: 'Nagad', label: 'Nagad', note: 'Mobile banking', live: false },
  { id: 'SSLCommerz', label: 'Card / SSLCommerz', note: 'Online gateway', live: false },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState({ name: '', phone: '', email: '', line1: '', area: '', city: '', district: '', postcode: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Loyalty (logged-in only)
  const [loyalty, setLoyalty] = useState(null);
  const [usePoints, setUsePoints] = useState(false);

  // Prefill contact details + load points for logged-in shoppers
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: f.name || user.name || '', email: f.email || user.email || '', phone: f.phone || user.phone || '' }));
      api('/loyalty/me').then(setLoyalty).catch(() => {});
    }
  }, [user]);

  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;

  // Redeem the customer's full balance (capped so discount ≤ subtotal).
  const bdtPerPoint = loyalty?.rates?.bdtPerPoint || 0.5;
  const minRedeem = loyalty?.rates?.minRedeem || 100;
  const canRedeem = !!loyalty && loyalty.balance >= minRedeem;
  const redeemPoints = usePoints && canRedeem ? Math.min(loyalty.balance, Math.floor(subtotal / bdtPerPoint)) : 0;
  const discount = Math.round(redeemPoints * bdtPerPoint);
  const total = Math.max(0, subtotal + shipping - discount);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-matte">Your cart is empty</h1>
        <Link href="/" className="btn-gold mt-6">Browse products</Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping: form,
          paymentMethod,
          ...(redeemPoints > 0 ? { redeemPoints } : {}),
        },
      });
      clear();
      router.push(`/order-success?order=${order.orderNumber}`);
    } catch (err) {
      setError(err.message + (err.details ? ` — ${err.details.join(', ')}` : ''));
      setSubmitting(false);
    }
  }

  const field = 'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-matte">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6">
            <h2 className="mb-4 font-serif text-xl font-bold text-matte">Shipping Details</h2>
            {user ? (
              <p className="mb-4 text-sm text-ink/60">Signed in as <span className="font-medium text-matte">{user.name}</span> — this order will be saved to your account.</p>
            ) : (
              <p className="mb-4 text-sm text-ink/60">
                Guest checkout — no account needed.{' '}
                <Link href="/login?next=/checkout" className="font-medium text-gold-soft hover:text-gold">Sign in</Link> to earn points.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={field} placeholder="Full name *" required value={form.name} onChange={update('name')} />
              <input className={field} placeholder="Phone *" required value={form.phone} onChange={update('phone')} />
              <input className={field} placeholder="Email (optional)" type="email" value={form.email} onChange={update('email')} />
              <input className={field} placeholder="City *" required value={form.city} onChange={update('city')} />
              <input className={`${field} sm:col-span-2`} placeholder="Address line *" required value={form.line1} onChange={update('line1')} />
              <input className={field} placeholder="Area / Thana" value={form.area} onChange={update('area')} />
              <input className={field} placeholder="District" value={form.district} onChange={update('district')} />
              <input className={field} placeholder="Postcode" value={form.postcode} onChange={update('postcode')} />
              <textarea className={`${field} sm:col-span-2`} placeholder="Delivery notes (optional)" rows={2} value={form.notes} onChange={update('notes')} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 font-serif text-xl font-bold text-matte">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
                    paymentMethod === m.id ? 'border-gold bg-gold/5' : 'border-matte/15 hover:border-gold/50'
                  } ${!m.live ? 'opacity-60' : ''}`}
                >
                  <div>
                    <p className="font-medium text-matte">{m.label}</p>
                    <p className="text-xs text-ink/60">{m.note}{!m.live && ' · coming soon'}</p>
                  </div>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} disabled={!m.live} onChange={() => setPaymentMethod(m.id)} className="accent-gold" />
                </label>
              ))}
            </div>
          </section>

          {/* Loyalty redemption */}
          {user && loyalty && (
            <section className="card p-6">
              <h2 className="mb-1 font-serif text-xl font-bold text-matte">VelouraX Rewards</h2>
              <p className="mb-4 text-sm text-ink/60">You have <span className="font-semibold text-matte">{loyalty.balance} points</span> ({bdt(loyalty.valueBDT)} value).</p>
              {canRedeem ? (
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-matte/15 p-4 hover:border-gold/50">
                  <div>
                    <p className="font-medium text-matte">Redeem points on this order</p>
                    <p className="text-xs text-ink/60">Save {bdt(discount || Math.round(Math.min(loyalty.balance, Math.floor(subtotal / bdtPerPoint)) * bdtPerPoint))} now</p>
                  </div>
                  <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="h-5 w-5 accent-gold" />
                </label>
              ) : (
                <p className="text-xs text-ink/50">Collect at least {minRedeem} points to redeem.</p>
              )}
            </section>
          )}

          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="mb-4 font-serif text-xl font-bold text-matte">Your Order</h2>
          <ul className="space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-ink/70">{i.title} × {i.quantity}</span>
                <span className="font-medium">{bdt(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd>{bdt(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/70">Shipping</dt><dd>{shipping === 0 ? 'Free' : bdt(shipping)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-brand"><dt>Points discount ({redeemPoints} pts)</dt><dd>−{bdt(discount)}</dd></div>
            )}
            <div className="flex justify-between border-t border-black/5 pt-2 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-matte">{bdt(total)}</dd></div>
          </dl>
          <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
            {submitting ? 'Placing order…' : `Place order · ${bdt(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
