import Link from 'next/link';
import { BookOpen, Zap, Users, LayoutDashboard, User, Star } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/devotional', label: 'Devotional', icon: BookOpen },
  { href: '/prayer', label: 'Prayer', icon: Zap },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 fixed h-full">
        <div className="px-6 h-16 flex items-center border-b border-white/5">
          <Link href="/dashboard">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">Christlete</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium group"
            >
              <item.icon size={18} className="group-hover:text-[#F59E0B] transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            href="/upgrade"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors text-sm font-semibold group"
          >
            <Star size={16} />
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
        </div>

        <div className="p-6 md:p-8 max-w-3xl">{children}</div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#0F172A]/95 backdrop-blur-xl">
          <div className="flex items-center justify-around h-16">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#F59E0B] transition-colors"
              >
                <item.icon size={20} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
