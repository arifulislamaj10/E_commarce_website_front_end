'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { bdt } from '@/lib/format';

function TrackInner() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function lookup(e) {
    e?.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      setOrder(await api(`/orders/track/${orderNumber.trim()}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-px max-w-2xl py-16">
      <h1 className="font-serif text-3xl font-bold text-matte">Track your order</h1>
      <p className="mt-2 text-ink/60">Enter the order number from your confirmation.</p>
      <form onSubmit={lookup} className="mt-6 flex gap-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. VX-XXXXXX-1234"
          className="flex-1 rounded-md border border-matte/15 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button className="btn-gold" disabled={loading}>{loading ? 'Searching…' : 'Track'}</button>
      </form>

      {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {order && (
        <div className="card mt-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/60">Order</p>
              <p className="text-lg font-bold text-matte">{order.orderNumber}</p>
            </div>
            <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-matte">{order.status}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-ink/60">Payment</dt><dd className="font-medium">{order.paymentMethod} · {order.paymentStatus}</dd></div>
            <div><dt className="text-ink/60">Total</dt><dd className="font-medium">{bdt(order.total)}</dd></div>
          </dl>
          <ol className="mt-6 space-y-3 border-t border-black/5 pt-4">
            {order.statusHistory?.map((h, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-brand" />
                <span className="font-medium text-matte">{h.status}</span>
                <span className="text-ink/50">{new Date(h.at).toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container-px py-16">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}
