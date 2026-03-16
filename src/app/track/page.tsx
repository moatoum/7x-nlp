'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  Package,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  UserCheck,
  Zap,
  Building2,
  User,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { formatDate, timeAgo } from '@/lib/formatters';
import type { Submission } from '@/engine/types';

/* ── Status Steps ── */
const STEPS = [
  { key: 'submitted', label: 'Submitted', icon: Package },
  { key: 'under_review', label: 'Under Review', icon: ClipboardCheck },
  { key: 'assigned', label: 'Assigned', icon: UserCheck },
  { key: 'actioned', label: 'Actioned', icon: Zap },
  { key: 'closed', label: 'Closed', icon: CheckCircle2 },
] as const;

const STATUS_ORDER: Record<string, number> = {
  submitted: 0,
  under_review: 1,
  assigned: 2,
  actioned: 3,
  closed: 4,
};

function StatusStepper({ status }: { status: Submission['status'] }) {
  const currentStep = STATUS_ORDER[status] ?? 0;

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i <= currentStep;
        const isCurrent = i === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-black text-white shadow-md'
                    : isCompleted
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-gray-900'
                    : isCompleted
                      ? 'text-emerald-600'
                      : 'text-gray-300'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-10 sm:w-16 h-[2px] mx-1.5 sm:mx-2.5 mb-5 rounded-full transition-all ${
                  i < currentStep ? 'bg-emerald-300' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tracking Result ── */
function TrackingResult({ submission }: { submission: Submission }) {
  const categoryLabel =
    CATEGORY_LABELS[submission.serviceCategory as keyof typeof CATEGORY_LABELS] ??
    submission.serviceCategory ??
    '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="w-full max-w-lg mx-auto mt-8"
    >
      {/* Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg shadow-black/[0.03] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Tracking
              </p>
              <p className="text-[17px] font-semibold text-gray-900 font-mono tracking-wide mt-0.5">
                {submission.referenceNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Submitted
              </p>
              <p className="text-sm text-gray-700 mt-0.5">
                {formatDate(submission.createdAt)}
              </p>
            </div>
          </div>

          <StatusStepper status={submission.status} />
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {submission.companyName && (
              <DetailItem icon={Building2} label="Company" value={submission.companyName} />
            )}
            {submission.contactName && (
              <DetailItem icon={User} label="Contact" value={submission.contactName} />
            )}
            {submission.contactEmail && (
              <DetailItem icon={Mail} label="Email" value={submission.contactEmail} />
            )}
            {submission.serviceCategory && (
              <DetailItem icon={Package} label="Service" value={categoryLabel} />
            )}
            {(submission.originLocation || submission.destinationLocation) && (
              <DetailItem
                icon={MapPin}
                label="Route"
                value={[submission.originLocation, submission.destinationLocation]
                  .filter(Boolean)
                  .join(' → ') || '—'}
              />
            )}
            {submission.urgency && (
              <DetailItem icon={Clock} label="Urgency" value={submission.urgency} />
            )}
          </div>

          {submission.recommendedServices.length > 0 && (
            <div className="pt-3 border-t border-gray-100/80">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Matched Services
              </p>
              <div className="flex flex-wrap gap-1.5">
                {submission.recommendedServices.map((svc) => (
                  <span
                    key={svc.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 text-[11px] font-medium text-gray-600 border border-gray-100"
                  >
                    {svc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External notes / updates */}
          {(submission.notes || []).filter((n) => n.visibility === 'external').length > 0 && (
            <div className="pt-3 border-t border-gray-100/80">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Updates
              </p>
              <div className="space-y-2">
                {[...(submission.notes || [])]
                  .filter((n) => n.visibility === 'external')
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(note.createdAt)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-5">
        <Link
          href="/intake"
          className="inline-flex items-center gap-2 h-[40px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-all"
        >
          New Request
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-[40px] px-5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

/* ── Not Found ── */
function NotFound({ code }: { code: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 text-center"
    >
      <div className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white/70 backdrop-blur-md rounded-xl border border-gray-100">
        <XCircle className="w-4.5 h-4.5 text-gray-400" />
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">No request found</p>
          <p className="text-[12px] text-gray-400 mt-0.5">
            No match for <span className="font-mono font-medium text-gray-500">{code}</span>. Please check the code and try again.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Inner Content (uses useSearchParams) ── */
function TrackContent() {
  const searchParams = useSearchParams();
  const fetchByReference = useSubmissionsStore((s) => s.fetchByReference);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<Submission | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  // Pre-fill from query param
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setCode(ref);
      setSearching(true);
      fetchByReference(ref).then((found) => {
        if (found) {
          setResult(found);
        } else {
          setNotFound(true);
        }
        setSearched(true);
        setSearching(false);
      });
    }
  }, [searchParams, fetchByReference]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = code.trim();
      if (!trimmed) return;

      setSearching(true);
      const found = await fetchByReference(trimmed);
      if (found) {
        setResult(found);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
      setSearched(true);
      setSearching(false);
    },
    [code, fetchByReference]
  );

  return (
    <>
      <main className="flex-1 flex flex-col items-center px-5 pt-12 md:pt-20 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-[-0.02em] text-gray-900">
            Track Your Request
          </h1>
          <p className="text-[14px] md:text-[15px] text-gray-400 mt-2 max-w-sm mx-auto">
            Enter the tracking code you received when you submitted your request.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSearch}
          className="w-full max-w-md"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300 pointer-events-none" />
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (searched) {
                  setSearched(false);
                  setResult(null);
                  setNotFound(false);
                }
              }}
              placeholder="e.g. 7X-20260315-AB12"
              className="w-full h-[52px] pl-11 pr-28 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm text-[14px] text-gray-900 font-mono placeholder:text-gray-300 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-200 transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-[40px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-all disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Track'}
            </button>
          </div>
        </motion.form>

        {/* Results */}
        {result && <TrackingResult submission={result} />}
        {notFound && searched && <NotFound code={code} />}
      </main>

      <footer className="pb-5 pt-1 text-center relative z-10">
        <p className="text-[11px] text-gray-300/60 tracking-wide">
          &copy; 2026 7X &mdash; Emirates Post Group
        </p>
      </footer>
    </>
  );
}

/* ── Main Page ── */
export default function TrackPage() {
  return (
    <AuroraBackground className="min-h-screen">
      <DashboardHeader />
      <Suspense>
        <TrackContent />
      </Suspense>
    </AuroraBackground>
  );
}
