'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const field =
  'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

function ResetPasswordInner() {
  const { resetPassword, forgotPassword } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      router.push('/account');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setNotice(null);
    try {
      await forgotPassword(email.trim());
      setNotice('A new reset code has been sent.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-matte">Reset password</h1>
          <p className="mt-1 text-sm text-ink/60">Enter the code from your email and choose a new password.</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
            <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Reset code</label>
            <input
              className={field}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">New password</label>
            <input className={field} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Confirm password</label>
            <input className={field} type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}
          <button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? 'Resetting…' : 'Reset password'}</button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-ink/60">
          <button onClick={resend} className="font-semibold text-gold-soft hover:text-gold">Resend code</button>
          <Link href="/login" className="hover:text-gold">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-px py-16 text-center text-ink/50">Loading…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
