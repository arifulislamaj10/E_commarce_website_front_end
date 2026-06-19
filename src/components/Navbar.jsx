'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cart';

const links = [
  { href: '/?category=fashion', label: 'Fashion' },
  { href: '/?category=cosmetics', label: 'Cosmetics' },
  { href: '/?category=perfumes', label: 'Perfumes' },
  { href: '/?category=mobile-accessories', label: 'Accessories' },
];

export default function Navbar() {
  const count = useCart((s) => s.count());
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  // Close the mobile menu on navigation (covers category links that change the query too).
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-matte text-white">
      <div className="container-px flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
          Veloura<span className="text-gold">X</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-white/80 transition hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link href="/track" className="hidden text-sm text-white/70 transition hover:text-gold sm:block">
            Track order
          </Link>
          <Link href="/cart" className="relative inline-flex items-center gap-2 text-sm font-medium hover:text-gold">
            <span aria-hidden>🛍️</span>
            <span className="hidden sm:inline">Cart</span>
            {mounted && count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-matte">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-white transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="border-t border-white/10 bg-matte md:hidden">
          <div className="container-px flex flex-col py-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-sm font-medium text-white/80 hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Link href="/track" onClick={() => setOpen(false)} className="py-3 text-sm font-medium text-white/80 hover:text-gold">
              Track order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
