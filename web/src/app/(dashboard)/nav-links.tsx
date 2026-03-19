'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Zap, Users, LayoutDashboard, User } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/devotional', label: 'Devotional', icon: BookOpen },
  { href: '/prayer', label: 'Prayer', icon: Zap },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
];

export function NavLinks({ variant }: { variant: 'sidebar' | 'mobile' }) {
  const pathname = usePathname();

  if (variant === 'sidebar') {
    return (
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/[0.07] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                size={18}
                className={active ? 'text-[#F59E0B]' : 'transition-colors'}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#0F172A]/95 backdrop-blur-xl"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 transition-colors ${
                active ? 'text-[#F59E0B]' : 'text-slate-500 hover:text-[#F59E0B]'
              }`}
            >
              <item.icon size={20} aria-hidden="true" />
              <span className="text-[10px] font-semibold" aria-hidden="true">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
