'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SRC = 'https://accounts.google.com/gsi/client';

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')));
      return;
    }
    const s = document.createElement('script');
    s.src = GSI_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(s);
  });
}

/**
 * Renders Google's official "Sign in with Google" button.
 * On success, exchanges the ID token with our backend and redirects to `next`.
 * Renders nothing if NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.
 */
export default function GoogleSignInButton({ next = '/account', onError }) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const divRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGsiScript()
      .then(() => {
        if (cancelled || !divRef.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (response) => {
            try {
              await loginWithGoogle(response.credential);
              router.push(next);
            } catch (err) {
              onError?.(err.message || 'Google sign-in failed');
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'rectangular',
        });
        setReady(true);
      })
      .catch(() => onError?.('Could not load Google Sign-In'));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  if (!CLIENT_ID) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="my-4 flex w-full items-center gap-3 text-xs text-ink/40">
        <span className="h-px flex-1 bg-matte/10" />
        OR
        <span className="h-px flex-1 bg-matte/10" />
      </div>
      <div ref={divRef} className="flex min-h-[40px] justify-center" />
      {!ready && <p className="mt-2 text-xs text-ink/40">Loading Google…</p>}
    </div>
  );
}
