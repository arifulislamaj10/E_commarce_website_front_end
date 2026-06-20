'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function RegisterInner() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ ...form, phone: form.phone || undefined });
      router.push(next);
    } catch (err) {
      setError(err.message + (err.details ? ` — ${err.details.join(', ')}` : ''));
      setBusy(false);
    }
  }

  const field = 'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-matte">Create your account</h1>
          <p className="mt-1 text-sm text-ink/60">Join VelouraX — track orders &amp; earn loyalty points</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Full name</label>
            <input className={field} required value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
            <input className={field} type="email" required value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Phone (optional)</label>
            <input className={field} value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Password</label>
            <input className={field} type="password" required minLength={6} value={form.password} onChange={set('password')} />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-gold-soft hover:text-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container-px py-16 text-center text-ink/50">Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}
