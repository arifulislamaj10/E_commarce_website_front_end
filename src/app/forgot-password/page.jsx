'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const field =
  'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      // Always proceed — the response is intentionally identical whether or not
      // the email exists, so we forward the user to enter the code they received.
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-matte">Forgot password</h1>
          <p className="mt-1 text-sm text-ink/60">Enter your email and we'll send you a reset code.</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
            <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Sending…' : 'Send reset code'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/60">
          Remembered it?{' '}
          <Link href="/login" className="font-semibold text-gold-soft hover:text-gold">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
