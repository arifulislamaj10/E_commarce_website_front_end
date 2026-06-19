'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // Newsletter capture is a Phase-2 integration (email service). For now we
    // acknowledge locally so the UX is complete.
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  }

  return (
    <section className="container-px py-16">
      <div className="rounded-3xl border border-gold/20 bg-white p-8 text-center shadow-luxe md:p-12">
        <h2 className="font-serif text-3xl font-bold text-matte">Join the VelouraX circle</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/60">
          Be first to know about new arrivals, exclusive drops and members-only offers.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-md border border-matte/15 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button type="submit" className="btn-dark px-8">Subscribe</button>
        </form>
        {done && <p className="mt-4 text-sm text-emerald-brand">✓ You’re on the list — welcome to VelouraX.</p>}
      </div>
    </section>
  );
}
