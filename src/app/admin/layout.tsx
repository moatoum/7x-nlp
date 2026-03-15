'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useAdminUiStore } from '@/store/adminUiStore';
import { generateSeedData } from '@/lib/seedData';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initialized, initialize } = useSubmissionsStore();
  const isAuthenticated = useAdminUiStore((s) => s.isAuthenticated);
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!initialized) {
      initialize(generateSeedData(32));
    }
  }, [initialized, initialize]);

  // Redirect to login if not authenticated (and not already on login page)
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoginPage, router]);

  // If on login page, just render children (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white">
      <AdminSidebar />
      <AdminMobileHeader />
      <main
        className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] transition-all duration-300"
        style={{ marginLeft: `var(--sidebar-width, 0px)` }}
      >
        <style>{`
          @media (min-width: 1024px) {
            :root {
              --sidebar-width: ${sidebarCollapsed ? '72px' : '240px'};
            }
          }
          @media (max-width: 1023px) {
            :root {
              --sidebar-width: 0px;
            }
          }
        `}</style>
        {children}
      </main>
    </div>
  );
}
