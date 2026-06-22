'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const field =
  'w-full rounded-md border border-matte/15 px-3 py-2.5 text-center text-lg tracking-[0.4em] focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

function VerifyEmailInner() {
  const { user, loading, verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';

  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  // Must be signed in to verify; already-verified users skip straight through.
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent('/verify-email')}`);
    else if (user.isEmailVerified) router.replace(next);
  }, [user, loading, next, router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await verifyEmail(code.trim());
      router.push(next);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setNotice(null);
    try {
      await resendVerification();
      setNotice('A new code has been sent to your email.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-matte">Verify your email</h1>
          <p className="mt-1 text-sm text-ink/60">
            We sent a {`${6}`}-digit code to {user?.email ? <span className="font-semibold">{user.email}</span> : 'your inbox'}.
          </p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <input
            className={field}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}
          <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Verifying…' : 'Verify email'}</button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-ink/60">
          <button onClick={resend} className="font-semibold text-gold-soft hover:text-gold">Resend code</button>
          <Link href={next} className="hover:text-gold">Skip for now</Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="container-px py-16 text-center text-ink/50">Loading…</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
