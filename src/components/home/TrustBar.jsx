const items = [
  { icon: '🚚', title: 'Cash on Delivery', sub: 'Pay when you receive' },
  { icon: '📦', title: 'Free shipping', sub: 'On orders over ৳3,000' },
  { icon: '✅', title: '100% Authentic', sub: 'Guaranteed genuine' },
  { icon: '↩️', title: 'Easy returns', sub: '7-day return policy' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-black/5 bg-white">
      <div className="container-px grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-xl">{i.icon}</span>
            <div>
              <p className="text-sm font-semibold text-matte">{i.title}</p>
              <p className="text-xs text-ink/60">{i.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
