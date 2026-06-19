import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-px py-24 text-center">
      <p className="font-serif text-7xl font-bold text-gold">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-matte">Page not found</h1>
      <p className="mt-2 text-ink/60">The page or product you’re looking for doesn’t exist.</p>
      <Link href="/" className="btn-gold mt-6">Back to shop</Link>
    </div>
  );
}
