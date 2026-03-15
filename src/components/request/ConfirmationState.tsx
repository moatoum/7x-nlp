'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useRequestStore } from '@/store/requestStore';
import { useConversationStore } from '@/store/conversationStore';
import { Button } from '@/components/ui/Button';

export function ConfirmationState() {
  const { referenceNumber } = useRequestStore();
  const resetConv = useConversationStore((s) => s.reset);
  const resetReq = useRequestStore((s) => s.reset);

  const handleNewRequest = () => {
    resetConv();
    resetReq();
    // Re-trigger welcome — the ConversationPanel's useEffect detects started=false and auto-starts
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
        className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5"
      >
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </motion.div>

      <h3 className="text-lg font-semibold text-gray-900">Request Submitted</h3>
      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-[260px]">
        Our logistics team will review your request and reach out shortly.
      </p>

      {referenceNumber && (
        <div className="mt-5 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Reference</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5 font-mono">{referenceNumber}</p>
        </div>
      )}

      <Button variant="secondary" size="sm" className="mt-6" onClick={handleNewRequest}>
        New Request
      </Button>
    </motion.div>
  );
}
