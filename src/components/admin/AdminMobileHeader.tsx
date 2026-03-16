'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, FileText, Users, ArrowLeft, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdminUiStore } from '@/store/adminUiStore';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/ui/Logo';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Submissions', href: '/admin/submissions', icon: FileText },
  { label: 'Leads', href: '/admin/leads', icon: Users },
];

export function AdminMobileHeader() {
  const sidebarOpen = useAdminUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAdminUiStore((s) => s.setSidebarOpen);
  const logout = useAdminUiStore((s) => s.logout);
  const pathname = usePathname();

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile header bar */}
      <header className="lg:hidden flex items-center justify-between px-4 h-[56px] border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
            <Logo color="white" className="h-2.5 w-auto" />
          </div>
          <span className="text-[13px] font-semibold text-gray-900">7X</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile slide-in sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 flex flex-col shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-[56px] border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                    <Logo color="white" className="h-2.5 w-auto" />
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">7X</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded">
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                        isActive
                          ? 'bg-gray-900 text-white font-medium shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom section */}
              <div className="px-3 py-4 border-t border-gray-100 space-y-1">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-gray-700 transition-colors rounded-xl hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
