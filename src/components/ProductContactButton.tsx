import Link from 'next/link';

export function ProductContactButton({ productName }: { productName: string }) {
  return (
    <Link
      href={{ pathname: '/contacts', query: { product: productName } }}
      className="inline-flex w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-center text-sm font-medium text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
    >
      Связаться с инженером
    </Link>
  );
}
