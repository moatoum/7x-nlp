'use client';

import { useEffect } from 'react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { generateSeedData } from '@/lib/seedData';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { initialized, initialize } = useSubmissionsStore();

  useEffect(() => {
    if (!initialized) {
      initialize(generateSeedData(32));
    }
  }, [initialized, initialize]);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white">
      <AdminSidebar />
      <AdminMobileHeader />
      <main className="flex-1 min-h-0 overflow-y-auto bg-[#fafafa] lg:ml-[240px]">
        {children}
      </main>
    </div>
  );
}
