import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-block mb-12">
          <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">Christlete</span>
        </Link>
        <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-4">404</p>
        <h1 className="text-white text-4xl font-black mb-4">Page not found.</h1>
        <p className="text-slate-400 text-base leading-7 mb-10">
          Even detours have a purpose. This page does not exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#FBBF24] transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#1e3a6e] text-slate-300 font-bold text-sm px-6 py-3.5 rounded-xl hover:border-slate-500 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
