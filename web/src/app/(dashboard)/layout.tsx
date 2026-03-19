import Link from 'next/link';
import { Star } from 'lucide-react';
import { NavLinks } from './nav-links';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#F59E0B] focus:text-[#0F172A] focus:font-bold focus:text-sm focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 fixed h-full" aria-label="Sidebar navigation">
        <div className="px-6 h-16 flex items-center border-b border-white/5">
          <Link href="/dashboard">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">Christlete</span>
          </Link>
        </div>
        <NavLinks variant="sidebar" />
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            href="/upgrade"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors text-sm font-semibold"
          >
            <Star size={16} aria-hidden="true" />
            Go Elite
          </Link>
          <p className="text-slate-700 text-[11px] italic px-3 pt-2">
            &ldquo;Whatever you do, work at it with all your heart.&rdquo; Col 3:23
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60">
        {/* Mobile header */}
        <div className="md:hidden h-14 border-b border-white/5 flex items-center justify-between px-5">
          <span className="text-[#F59E0B] font-bold text-lg">Christlete</span>
          <Link
            href="/upgrade"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold"
          >
            <Star size={12} aria-hidden="true" />
            Go Elite
          </Link>
        </div>

        <div id="main-content" className="p-6 md:p-8 max-w-3xl">{children}</div>

        <NavLinks variant="mobile" />
      </main>
    </div>
  );
}
