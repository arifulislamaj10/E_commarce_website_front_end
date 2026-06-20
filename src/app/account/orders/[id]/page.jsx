'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { bdt } from '@/lib/format';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=/account/orders/${id}`);
  }, [loading, user, id, router]);

  useEffect(() => {
    if (user) api(`/orders/${id}`).then(setOrder).catch((e) => setError(e.message));
  }, [user, id]);

  if (loading || !user) return <div className="container-px py-24 text-center text-ink/50">Loading…</div>;
  if (error) return <div className="container-px py-24 text-center text-red-600">{error}</div>;
  if (!order) return <div className="container-px py-24 text-center text-ink/50">Loading order…</div>;

  const placed = new Date(order.createdAt).toLocaleString();

  return (
    <div className="container-px py-10">
      {/* Screen-only nav + actions (hidden when printing) */}
      <div className="no-print mb-6 flex items-center justify-between">
        <nav className="text-sm text-ink/50">
          <Link href="/account/orders" className="hover:text-gold-soft">My Orders</Link>
          <span className="mx-2">/</span>
          <span className="text-matte">{order.orderNumber}</span>
        </nav>
        <button onClick={() => window.print()} className="btn-dark">🖨️ Print / Save invoice</button>
      </div>

      {/* Invoice */}
      <div className="invoice mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex items-start justify-between border-b border-black/10 pb-6">
          <div>
            <p className="font-serif text-2xl font-bold text-matte">Veloura<span className="text-gold">X</span></p>
            <p className="mt-1 text-xs text-ink/50">Premium E-Commerce · Bangladesh</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-matte">INVOICE</p>
            <p className="text-sm text-ink/60">{order.orderNumber}</p>
            <p className="text-xs text-ink/50">{placed}</p>
          </div>
        </div>

        <div className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/50">Billed to</p>
            <p className="font-medium text-matte">{order.shipping?.name}</p>
            <p className="text-sm text-ink/70">{order.shipping?.phone}</p>
            {order.shipping?.email && <p className="text-sm text-ink/70">{order.shipping.email}</p>}
            <p className="mt-1 text-sm text-ink/70">{order.shipping?.line1}</p>
            <p className="text-sm text-ink/70">{[order.shipping?.area, order.shipping?.city, order.shipping?.district].filter(Boolean).join(', ')}</p>
          </div>
          <div className="sm:text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/50">Order details</p>
            <p className="text-sm text-ink/70">Status: <span className="font-medium text-matte">{order.status}</span></p>
            <p className="text-sm text-ink/70">Payment: <span className="font-medium text-matte">{order.paymentMethod} ({order.paymentStatus})</span></p>
            {order.pointsEarned > 0 && <p className="text-sm text-emerald-brand">Points earned: +{order.pointsEarned}</p>}
            {order.pointsRedeemed > 0 && <p className="text-sm text-ink/70">Points redeemed: {order.pointsRedeemed}</p>}
          </div>
        </div>

        <table className="w-full border-t border-black/10 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="py-3">Item</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Price</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {order.items.map((it, i) => (
              <tr key={i}>
                <td className="py-3 text-matte">{it.title}</td>
                <td className="py-3 text-center">{it.quantity}</td>
                <td className="py-3 text-right">{bdt(it.price)}</td>
                <td className="py-3 text-right font-medium">{bdt(it.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-5 w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-ink/70"><span>Subtotal</span><span>{bdt(order.subtotal)}</span></div>
          <div className="flex justify-between text-ink/70"><span>Shipping</span><span>{order.shippingFee ? bdt(order.shippingFee) : 'Free'}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-brand"><span>Points discount</span><span>−{bdt(order.discount)}</span></div>
          )}
          <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold text-matte"><span>Total</span><span>{bdt(order.total)}</span></div>
        </div>

        <p className="mt-8 border-t border-black/10 pt-5 text-center text-xs text-ink/50">
          Thank you for shopping with VelouraX. For help, visit our Support Center.
        </p>
      </div>
    </div>
  );
}
