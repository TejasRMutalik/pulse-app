'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, AudioLines, Library, PlusSquare } from 'lucide-react';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Pulse', href: '/pulse', icon: AudioLines },
  { name: 'Your Library', href: '/library', icon: Library },
  { name: 'Create', href: '/create', icon: PlusSquare },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around items-center h-[72px] bg-spotify-base border-t border-spotify-surface pb-safe pt-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href === '/pulse' && pathname.startsWith('/pulse'));
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-colors ${
              isActive ? 'text-spotify-text' : 'text-spotify-text-muted hover:text-spotify-text-subdued'
            }`}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? 'text-spotify-text' : ''}
            />
            <span className="text-[10px] font-medium tracking-wide">
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
