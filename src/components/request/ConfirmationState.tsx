'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';
import { useRequestStore } from '@/store/requestStore';
import { useConversationStore } from '@/store/conversationStore';
import { Button } from '@/components/ui/Button';

export function ConfirmationState() {
  const { referenceNumber } = useRequestStore();
  const resetConv = useConversationStore((s) => s.reset);
  const resetReq = useRequestStore((s) => s.reset);
  const [copied, setCopied] = useState(false);

  const handleNewRequest = () => {
    resetConv();
    resetReq();
  };

  const handleCopy = async () => {
    if (!referenceNumber) return;
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = referenceNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-[280px]">
        Our logistics team will review your request and reach out shortly.
      </p>

      {referenceNumber && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-5"
        >
          <div className="px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Your Tracking Code
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              <p className="text-[17px] font-semibold text-gray-900 font-mono tracking-wide">
                {referenceNumber}
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Copy tracking code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-2.5">
            Save this code to check your request status anytime
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6 flex flex-col gap-2.5 w-full max-w-[220px]"
      >
        {referenceNumber && (
          <Link
            href={`/track?ref=${encodeURIComponent(referenceNumber)}`}
            className="inline-flex items-center justify-center gap-2 h-[40px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-all"
          >
            Track Your Request
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
        <Button variant="secondary" size="sm" onClick={handleNewRequest}>
          New Request
        </Button>
      </motion.div>
    </motion.div>
  );
}
