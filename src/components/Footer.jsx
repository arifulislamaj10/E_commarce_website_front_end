import Link from 'next/link';

const shop = [
  { label: 'Fashion', href: '/?category=fashion' },
  { label: 'Cosmetics', href: '/?category=cosmetics' },
  { label: 'Perfumes', href: '/?category=perfumes' },
  { label: 'Accessories', href: '/?category=mobile-accessories' },
];

const support = [
  { label: 'Contact support', href: '/support' },
  { label: 'Track your order', href: '/track' },
  { label: 'Shopping cart', href: '/cart' },
  { label: 'Checkout', href: '/checkout' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-matte text-white/70">
      <div className="container-px grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link href="/" className="font-serif text-xl text-white">
            Veloura<span className="text-gold">X</span>
          </Link>
          <p className="mt-3 text-sm">Premium fashion, cosmetics, perfumes &amp; mobile accessories — crafted for Bangladesh.</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {shop.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="transition hover:text-gold">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            {support.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="transition hover:text-gold">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Payments</h4>
          <ul className="space-y-2 text-sm">
            <li>Cash on Delivery</li>
            <li>bKash · Nagad</li>
            <li>Cards via SSLCommerz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} VelouraX. Premium E-Commerce Platform.
      </div>
    </footer>
  );
}
