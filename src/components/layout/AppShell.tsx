'use client';

import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { ConversationPanel } from '@/components/conversation/ConversationPanel';
import { RequestPanel } from '@/components/request/RequestPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function AppShell() {
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-white">
        <Header />
        {/* Spacer for fixed header on mobile */}
        <div className="h-[56px] flex-shrink-0 md:hidden" />
        <div className="flex-1 flex min-h-0">
          {/* Left: Conversation */}
          <div className="flex-1 min-w-0">
            <ErrorBoundary>
              <ConversationPanel />
            </ErrorBoundary>
          </div>

          {/* Right: Request Panel (desktop) */}
          <div className="hidden lg:block w-[420px] border-l border-gray-100 flex-shrink-0">
            <ErrorBoundary>
              <RequestPanel />
            </ErrorBoundary>
          </div>
        </div>

        {/* Mobile drawer */}
        <MobileDrawer />
      </div>
    </ErrorBoundary>
  );
}
