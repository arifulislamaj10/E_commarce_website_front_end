'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cart';
import { bdt } from '@/lib/format';

const FREE_SHIPPING_OVER = 3000;
const SHIPPING_FEE = 60;

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <p className="text-6xl">🛍️</p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-matte">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Discover the VelouraX premium collection.</p>
        <Link href="/" className="btn-gold mt-6">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-matte">Shopping Cart</h1>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-soft">
                {item.thumbnail && <Image src={item.thumbnail} alt={item.title} fill sizes="96px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-medium text-matte hover:text-gold-soft">{item.title}</Link>
                <p className="text-sm text-ink/60">{bdt(item.price)} each</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-matte/15">
                    <button onClick={() => setQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 hover:text-gold">−</button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => setQuantity(item.productId, Math.min(item.stock, item.quantity + 1))} className="px-3 py-1.5 hover:text-gold">+</button>
                  </div>
                  <button onClick={() => remove(item.productId)} className="text-sm text-ink/50 hover:text-red-600">Remove</button>
                </div>
              </div>
              <div className="whitespace-nowrap pl-1 font-bold text-matte">{bdt(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="mb-4 font-serif text-xl font-bold text-matte">Order Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd className="font-medium">{bdt(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/70">Shipping</dt><dd className="font-medium">{shipping === 0 ? 'Free' : bdt(shipping)}</dd></div>
            {subtotal < FREE_SHIPPING_OVER && (
              <p className="text-xs text-emerald-brand">Add {bdt(FREE_SHIPPING_OVER - subtotal)} more for free shipping.</p>
            )}
            <div className="flex justify-between border-t border-black/5 pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-matte">{bdt(total)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn-gold mt-6 w-full">Proceed to checkout</Link>
          <Link href="/" className="mt-3 block text-center text-sm text-ink/60 hover:text-gold-soft">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
