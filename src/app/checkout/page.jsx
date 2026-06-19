'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { bdt } from '@/lib/format';
import { api } from '@/lib/api';

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
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState({ name: '', phone: '', email: '', line1: '', area: '', city: '', district: '', postcode: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

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
            <p className="mb-4 text-sm text-ink/60">Guest checkout — no account needed.</p>
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
