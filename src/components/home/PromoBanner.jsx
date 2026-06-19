import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="container-px py-8">
      <div className="relative overflow-hidden rounded-3xl bg-matte px-8 py-14 text-center text-white md:py-20">
        <div className="vx-hero-gradient absolute inset-0 opacity-60" />
        <div className="vx-orb absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Limited time</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight md:text-5xl">
            Up to <span className="vx-gold-shine">30% off</span> the premium collection
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">Indulge in luxury for less. Free delivery on orders over ৳3,000.</p>
          <Link href="#catalog" className="btn-gold mt-8 px-8 text-base">Shop now</Link>
        </div>
      </div>
    </section>
  );
}
