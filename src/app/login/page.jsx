'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function LoginInner() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.push(next);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const field = 'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-matte">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">Sign in to your VelouraX account</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
            <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Password</label>
            <input className={field} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/60">
          New to VelouraX?{' '}
          <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-gold-soft hover:text-gold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-px py-16 text-center text-ink/50">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
