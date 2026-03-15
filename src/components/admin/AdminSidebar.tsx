'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, ArrowLeft, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/ui/Logo';
import { useAdminUiStore } from '@/store/adminUiStore';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Submissions', href: '/admin/submissions', icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useAdminUiStore((s) => s.setSidebarCollapsed);
  const logout = useAdminUiStore((s) => s.logout);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-gray-100 bg-white z-30 transition-all duration-300',
        sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo + Admin label */}
      <div className={cn(
        'flex items-center h-[64px] border-b border-gray-100 transition-all duration-300',
        sidebarCollapsed ? 'justify-center px-2' : 'gap-2.5 px-5'
      )}>
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
          <Logo color="white" className="h-3 w-auto" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[14px] font-semibold text-gray-900 whitespace-nowrap">7X</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded whitespace-nowrap">
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        'flex-1 py-4 space-y-1 transition-all duration-300',
        sidebarCollapsed ? 'px-2' : 'px-3'
      )}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                onMouseEnter={() => sidebarCollapsed ? setHoveredItem(item.href) : null}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'flex items-center rounded-xl text-sm transition-all duration-200',
                  sidebarCollapsed
                    ? 'justify-center w-12 h-10 mx-auto'
                    : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <item.icon className={cn('shrink-0', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                {!sidebarCollapsed && item.label}
              </Link>
              {/* Tooltip when collapsed */}
              {sidebarCollapsed && hoveredItem === item.href && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn(
        'border-t border-gray-100 py-3 space-y-1 transition-all duration-300',
        sidebarCollapsed ? 'px-2' : 'px-3'
      )}>
        {/* Back to Dashboard */}
        <div className="relative">
          <Link
            href="/"
            onMouseEnter={() => sidebarCollapsed ? setHoveredItem('back') : null}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'flex items-center rounded-xl text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200',
              sidebarCollapsed
                ? 'justify-center w-12 h-10 mx-auto'
                : 'gap-3 px-3 py-2'
            )}
          >
            <ArrowLeft className={cn('shrink-0', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!sidebarCollapsed && 'Back to Dashboard'}
          </Link>
          {sidebarCollapsed && hoveredItem === 'back' && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
              Back to Dashboard
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="relative">
          <button
            onClick={handleLogout}
            onMouseEnter={() => sidebarCollapsed ? setHoveredItem('logout') : null}
            onMouseLeave={() => setHoveredItem(null)}
            className={cn(
              'flex items-center rounded-xl text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full',
              sidebarCollapsed
                ? 'justify-center w-12 h-10 mx-auto'
                : 'gap-3 px-3 py-2'
            )}
          >
            <LogOut className={cn('shrink-0', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!sidebarCollapsed && 'Logout'}
          </button>
          {sidebarCollapsed && hoveredItem === 'logout' && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
              Logout
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'flex items-center rounded-xl text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 w-full mt-2',
            sidebarCollapsed
              ? 'justify-center w-12 h-10 mx-auto'
              : 'gap-3 px-3 py-2'
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
