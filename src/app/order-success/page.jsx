import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage({ searchParams }) {
  const orderNumber = searchParams?.order;
  return (
    <div className="container-px py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-brand text-4xl text-white">✓</div>
      <h1 className="mt-6 font-serif text-3xl font-bold text-matte">Thank you for your order!</h1>
      <p className="mt-2 text-ink/70">Your order has been placed and confirmed.</p>
      {orderNumber && (
        <div className="mx-auto mt-6 inline-block rounded-lg border border-gold/40 bg-gold/5 px-6 py-3">
          <p className="text-xs uppercase tracking-wide text-ink/60">Order number</p>
          <p className="text-xl font-bold text-matte">{orderNumber}</p>
        </div>
      )}
      <p className="mt-6 text-sm text-ink/60">We’ll contact you on your phone to confirm delivery. Pay cash when you receive your items.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="btn-dark">Continue shopping</Link>
        {orderNumber && <Link href={`/track?order=${orderNumber}`} className="btn-outline">Track this order</Link>}
      </div>
    </div>
  );
}
