'use client';

import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { ConversationPanel } from '@/components/conversation/ConversationPanel';
import { RequestPanel } from '@/components/request/RequestPanel';

export function AppShell() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex min-h-0">
        {/* Left: Conversation */}
        <div className="flex-1 min-w-0">
          <ConversationPanel />
        </div>

        {/* Right: Request Panel (desktop) */}
        <div className="hidden lg:block w-[420px] border-l border-gray-100 flex-shrink-0">
          <RequestPanel />
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer />
    </div>
  );
}
