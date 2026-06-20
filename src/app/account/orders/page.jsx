'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { bdt } from '@/lib/format';

const STATUS_STYLE = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/account/orders');
  }, [loading, user, router]);

  useEffect(() => {
    if (user) api('/orders/mine').then(setOrders).catch(() => setOrders([]));
  }, [user]);

  if (loading || !user || orders === null) {
    return <div className="container-px py-24 text-center text-ink/50">Loading…</div>;
  }

  return (
    <div className="container-px py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/account" className="hover:text-gold-soft">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-matte">Orders</span>
      </nav>
      <h1 className="mb-8 font-serif text-3xl font-bold text-matte">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/10 p-12 text-center">
          <p className="text-ink/50">You haven’t placed any orders yet.</p>
          <Link href="/" className="btn-gold mt-5">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} href={`/account/orders/${o._id}`} className="card flex flex-col gap-4 p-5 hover:shadow-luxe sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-matte">{o.orderNumber}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink/60">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? '' : 's'} · {o.paymentMethod}
                </p>
                <p className="mt-1 truncate text-sm text-ink/50">{o.items.map((i) => i.title).join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-matte">{bdt(o.total)}</p>
                {o.pointsEarned > 0 && <p className="text-xs text-emerald-brand">+{o.pointsEarned} points</p>}
                <span className="text-sm text-gold-soft">View invoice →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
