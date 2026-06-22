'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { bdt } from '@/lib/format';

const TIER_STYLE = {
  Silver: 'from-slate-400 to-slate-600',
  Gold: 'from-gold to-gold-soft',
  Platinum: 'from-slate-700 to-matte',
};

export default function AccountPage() {
  const { user, loading, logout, resendVerification } = useAuth();
  const router = useRouter();
  const [loyalty, setLoyalty] = useState(null);
  const [orders, setOrders] = useState([]);
  const [verifyMsg, setVerifyMsg] = useState(null);

  async function handleResendVerify() {
    try {
      await resendVerification();
      router.push('/verify-email?next=/account');
    } catch (err) {
      setVerifyMsg(err.message);
    }
  }

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/account');
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      api('/loyalty/me').then(setLoyalty).catch(() => {});
      api('/orders/mine').then((d) => setOrders(d.slice(0, 4))).catch(() => {});
    }
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (loading || !user) {
    return <div className="container-px py-24 text-center text-ink/50">Loading…</div>;
  }

  return (
    <div className="container-px py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-matte">My Account</h1>
          <p className="mt-1 text-sm text-ink/60">{user.name} · {user.email}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-ink/50 hover:text-red-600">Sign out</button>
      </div>

      {/* Email-verification prompt */}
      {!user.isEmailVerified && (
        <div className="mb-6 flex flex-col gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-matte/80">
            📧 Your email isn't verified yet. {verifyMsg && <span className="text-red-600">{verifyMsg}</span>}
          </span>
          <button onClick={handleResendVerify} className="self-start font-semibold text-gold-soft hover:text-gold sm:self-auto">
            Verify now →
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Loyalty card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${TIER_STYLE[loyalty?.tier?.name] || 'from-matte to-ink'} p-6 text-white shadow-luxe`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">VelouraX Rewards</p>
          <p className="mt-1 text-sm font-bold">{loyalty?.tier?.name || '—'} member</p>
          <p className="mt-6 text-4xl font-bold">{loyalty?.balance ?? 0}<span className="ml-1 text-base font-normal text-white/70">points</span></p>
          <p className="text-sm text-white/80">= {bdt(loyalty?.valueBDT || 0)} off your next order</p>
          {loyalty?.tier?.next && (
            <p className="mt-4 text-xs text-white/70">{loyalty.tier.next.pointsAway} points to {loyalty.tier.next.name}</p>
          )}
          <p className="mt-1 text-xs text-white/60">{loyalty?.tier?.perk}</p>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <Link href="/account/orders" className="card flex flex-col justify-between p-5 hover:shadow-luxe">
            <span className="text-2xl">🧾</span>
            <div className="mt-4"><p className="font-semibold text-matte">My Orders</p><p className="text-sm text-ink/60">History &amp; invoices</p></div>
          </Link>
          <Link href="/wishlist" className="card flex flex-col justify-between p-5 hover:shadow-luxe">
            <span className="text-2xl">♥</span>
            <div className="mt-4"><p className="font-semibold text-matte">Wishlist</p><p className="text-sm text-ink/60">Saved items</p></div>
          </Link>
          <Link href="/support" className="card flex flex-col justify-between p-5 hover:shadow-luxe">
            <span className="text-2xl">💬</span>
            <div className="mt-4"><p className="font-semibold text-matte">Support</p><p className="text-sm text-ink/60">Get help</p></div>
          </Link>
          <Link href="/" className="card flex flex-col justify-between p-5 hover:shadow-luxe">
            <span className="text-2xl">🛍️</span>
            <div className="mt-4"><p className="font-semibold text-matte">Continue shopping</p><p className="text-sm text-ink/60">Browse collection</p></div>
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-matte">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-gold-soft hover:text-gold">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-black/10 p-8 text-center text-ink/50">No orders yet.</p>
        ) : (
          <div className="card divide-y divide-black/5">
            {orders.map((o) => (
              <Link key={o._id} href={`/account/orders/${o._id}`} className="flex items-center justify-between p-4 hover:bg-soft/60">
                <div>
                  <p className="font-medium text-matte">{o.orderNumber}</p>
                  <p className="text-xs text-ink/50">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? '' : 's'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-matte">{bdt(o.total)}</p>
                  <span className="text-xs text-gold-soft">{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
