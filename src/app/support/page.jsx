'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const CATEGORIES = [
  { v: 'order', l: 'Order issue' },
  { v: 'payment', l: 'Payment' },
  { v: 'delivery', l: 'Delivery' },
  { v: 'product', l: 'Product question' },
  { v: 'return', l: 'Return / refund' },
  { v: 'other', l: 'Other' },
];

const field = 'w-full rounded-md border border-matte/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

function Thread({ ticket }) {
  return (
    <div className="space-y-3">
      {ticket.messages.map((m, i) => (
        <div key={i} className={`flex ${m.sender === 'staff' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === 'staff' ? 'bg-matte text-white' : 'bg-gold/15 text-matte'}`}>
            <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender === 'staff' ? `${m.name} · Support` : m.name}</p>
            <p className="leading-relaxed">{m.body}</p>
            <p className="mt-1 text-[10px] opacity-50">{new Date(m.at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SupportPage() {
  const [tab, setTab] = useState('new');

  // New ticket form
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: 'order', orderNumber: '', message: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createdTicket, setCreatedTicket] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Track
  const [trackNumber, setTrackNumber] = useState('');
  const [ticket, setTicket] = useState(null);
  const [trackError, setTrackError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);

  async function createTicket(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const t = await api('/support', { method: 'POST', body: { ...form, orderNumber: form.orderNumber || undefined } });
      setCreatedTicket(t);
      setForm({ name: '', email: '', subject: '', category: 'order', orderNumber: '', message: '' });
    } catch (err) {
      setCreateError(err.message + (err.details ? ` — ${err.details.join(', ')}` : ''));
    } finally {
      setCreating(false);
    }
  }

  async function lookup(e, number) {
    e?.preventDefault();
    const tn = (number || trackNumber).trim();
    if (!tn) return;
    setLoading(true);
    setTrackError(null);
    setTicket(null);
    try {
      setTicket(await api(`/support/track/${tn}`));
      setTrackNumber(tn);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplying(true);
    try {
      const updated = await api(`/support/track/${ticket.ticketNumber}/reply`, {
        method: 'POST',
        body: { name: ticket.name, body: reply.trim() },
      });
      setTicket(updated);
      setReply('');
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setReplying(false);
    }
  }

  return (
    <div className="container-px max-w-3xl py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">We’re here to help</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-matte">Support Center</h1>
        <p className="mt-2 text-ink/60">Open a ticket and our team will get back to you. Already have a ticket? Track it below.</p>
      </div>

      <div className="mx-auto mt-8 flex w-fit rounded-lg border border-matte/15 p-1">
        <button onClick={() => setTab('new')} className={`rounded-md px-5 py-2 text-sm font-medium ${tab === 'new' ? 'bg-matte text-white' : 'text-ink/60'}`}>New request</button>
        <button onClick={() => setTab('track')} className={`rounded-md px-5 py-2 text-sm font-medium ${tab === 'track' ? 'bg-matte text-white' : 'text-ink/60'}`}>Track ticket</button>
      </div>

      {/* New ticket */}
      {tab === 'new' && (
        <div className="mt-8">
          {createdTicket ? (
            <div className="card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-brand text-3xl text-white">✓</div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-matte">Ticket created</h2>
              <p className="mt-2 text-ink/60">We’ve received your request and will reply by email. Save your ticket number to track the conversation.</p>
              <div className="mx-auto mt-4 inline-block rounded-lg border border-gold/40 bg-gold/5 px-6 py-3">
                <p className="text-xs uppercase tracking-wide text-ink/60">Ticket number</p>
                <p className="text-xl font-bold text-matte">{createdTicket.ticketNumber}</p>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => { setTrackNumber(createdTicket.ticketNumber); setTab('track'); lookup(null, createdTicket.ticketNumber); }} className="btn-gold">Track this ticket</button>
                <button onClick={() => setCreatedTicket(null)} className="btn-outline">New request</button>
              </div>
            </div>
          ) : (
            <form onSubmit={createTicket} className="card space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={field} placeholder="Your name *" required value={form.name} onChange={set('name')} />
                <input className={field} type="email" placeholder="Email *" required value={form.email} onChange={set('email')} />
              </div>
              <input className={field} placeholder="Subject *" required value={form.subject} onChange={set('subject')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <select className={field} value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                </select>
                <input className={field} placeholder="Order number (optional)" value={form.orderNumber} onChange={set('orderNumber')} />
              </div>
              <textarea className={field} rows={5} placeholder="How can we help? *" required value={form.message} onChange={set('message')} />
              {createError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{createError}</p>}
              <button type="submit" disabled={creating} className="btn-gold w-full">{creating ? 'Submitting…' : 'Submit ticket'}</button>
            </form>
          )}
        </div>
      )}

      {/* Track ticket */}
      {tab === 'track' && (
        <div className="mt-8">
          <form onSubmit={lookup} className="flex gap-3">
            <input className={field} placeholder="Ticket number e.g. VX-T-XXXX-123" value={trackNumber} onChange={(e) => setTrackNumber(e.target.value)} />
            <button className="btn-gold shrink-0" disabled={loading}>{loading ? '…' : 'Track'}</button>
          </form>
          {trackError && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{trackError}</p>}

          {ticket && (
            <div className="card mt-6 p-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div>
                  <p className="font-semibold text-matte">{ticket.subject}</p>
                  <p className="text-xs text-ink/50">{ticket.ticketNumber}</p>
                </div>
                <span className={`badge rounded-full px-3 py-1 text-xs font-semibold ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{ticket.status}</span>
              </div>
              <div className="mt-5"><Thread ticket={ticket} /></div>

              {ticket.status !== 'CLOSED' ? (
                <form onSubmit={sendReply} className="mt-5 flex gap-3 border-t border-black/5 pt-4">
                  <input className={field} placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
                  <button className="btn-dark shrink-0" disabled={replying}>{replying ? '…' : 'Send'}</button>
                </form>
              ) : (
                <p className="mt-5 border-t border-black/5 pt-4 text-center text-sm text-ink/50">This ticket is closed.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
