import Link from 'next/link';

/**
 * Premium hero with an animated background image (Ken Burns zoom).
 *
 * Ships with a tasteful default boutique/shopping photo so it looks great with
 * zero setup. To use YOUR OWN media, drop a file in `frontend/public/` and set
 * ONE of these in `.env.local`:
 *   NEXT_PUBLIC_HERO_VIDEO=/hero.mp4   → looping background video
 *   NEXT_PUBLIC_HERO_IMAGE=/hero.jpg   → background image
 */
const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=85';

const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO || '';
const HERO_IMAGE = process.env.NEXT_PUBLIC_HERO_IMAGE || DEFAULT_HERO_IMAGE;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-matte text-white">
      {/* Background layer (gradient base shows through if media fails to load) */}
      <div className="vx-hero-gradient absolute inset-0">
        {HERO_VIDEO ? (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={HERO_IMAGE}>
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <div
            className="vx-kenburns h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
        )}
        {/* Floating gold glow accents for motion + depth */}
        <div className="vx-orb absolute -left-20 top-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl md:h-72 md:w-72" />
        <div className="vx-orb absolute bottom-10 right-0 h-64 w-64 rounded-full bg-emerald-brand/20 blur-3xl" style={{ animationDelay: '6s' }} />
        {/* Readability overlay — darker on mobile where text sits over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-matte/95 via-matte/75 to-matte/40 sm:to-matte/30" />
      </div>

      {/* Content */}
      <div className="container-px relative grid min-h-[70vh] items-center py-16 sm:min-h-[80vh] sm:py-24">
        <div className="max-w-2xl">
          <p className="vx-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur sm:px-4 sm:text-xs">
             Premium · Exclusive · Trusted
          </p>
          <h1 className="vx-fade-up font-serif text-4xl font-bold leading-[1.08] sm:text-5xl md:text-7xl" style={{ animationDelay: '0.1s' }}>
            Where luxury meets <span className="vx-gold-shine">everyday</span>.
          </h1>
          {/* Long description is hidden on mobile to keep the hero clean */}
          <p className="vx-fade-up mt-5 hidden max-w-lg text-base text-white/75 sm:mt-6 sm:block sm:text-lg" style={{ animationDelay: '0.2s' }}>
            Curated fashion, cosmetics, perfumes and mobile accessories — delivered across Bangladesh with Cash on Delivery, bKash, Nagad &amp; cards.
          </p>
          {/* Much bigger gap above the buttons on mobile (description is hidden there) */}
          <div className="vx-fade-up mt-28 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:gap-4" style={{ animationDelay: '0.3s' }}>
            <Link href="#catalog" className="btn-gold px-8 py-3.5 text-base sm:py-3">Shop the collection</Link>
            <Link href="#categories" className="btn-outline border-white/30 px-8 py-3.5 text-base text-white hover:text-gold sm:py-3">Explore categories</Link>
          </div>
          {/* Stats row hidden on mobile
          <div className="vx-fade-up mt-10  flex-wrap gap-x-8 gap-y-3 text-sm text-white/60 sm:mt-12 sm:flex" style={{ animationDelay: '0.4s' }}>
            <span><strong className="text-white">10k+</strong> happy customers</span>
            <span><strong className="text-white">100%</strong> authentic</span>
            <span><strong className="text-white">Nationwide</strong> delivery</span>
          </div> */}
          <div className="vx-fade-up mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60" style={{ animationDelay: '0.4s' }}>
            <span><strong className="text-white">10k+</strong> happy customers</span>
            <span><strong className="text-white">100%</strong> authentic</span>
            <span><strong className="text-white">Nationwide</strong> delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
