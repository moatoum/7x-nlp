'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { RequestPanel } from '@/components/request/RequestPanel';

export function MobileDrawer() {
  const { mobileDrawerOpen, setDrawerOpen } = useUIStore();

  return (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-drawer max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-4 top-3 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RequestPanel />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
