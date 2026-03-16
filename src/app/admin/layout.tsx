'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminUiStore } from '@/store/adminUiStore';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { useLeadsStore } from '@/store/leadsStore';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminUiStore((s) => s.isAuthenticated);
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSubmissions = useSubmissionsStore((s) => s.fetchSubmissions);
  const fetchLeads = useLeadsStore((s) => s.fetchLeads);

  // Redirect to login if not authenticated (and not already on login page)
  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      window.location.href = '/admin/login';
    }
  }, [mounted, isAuthenticated, isLoginPage]);

  // Fetch submissions & leads from DB when authenticated
  useEffect(() => {
    if (mounted && isAuthenticated && !isLoginPage) {
      fetchSubmissions();
      fetchLeads();
    }
  }, [mounted, isAuthenticated, isLoginPage, fetchSubmissions, fetchLeads]);

  // If on login page, just render children (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show blank screen until hydrated, or while redirecting to login
  if (!mounted || !isAuthenticated) {
    return <div className="h-screen bg-white" />;
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
