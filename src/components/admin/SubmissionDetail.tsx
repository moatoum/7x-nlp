'use client';

import Link from 'next/link';
import { ArrowLeft, User, Briefcase, MapPin, Package, Clock, MessageSquare, Layers, AlertTriangle, FileText, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { formatDate, formatDuration } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

import type { Submission } from '@/engine/types';

interface SubmissionDetailProps {
  id: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  submitted: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Submitted' },
  in_review: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'In Review' },
  approved: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Approved' },
  rejected: { color: 'text-red-600', bg: 'bg-red-50', label: 'Rejected' },
};

const STATUS_OPTIONS: { value: Submission['status']; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

function SectionCard({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <h3 className="text-[13px] font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-300 font-medium mb-1">
        {label}
      </p>
      <p className="text-[13px] text-gray-800 font-medium">{value || '—'}</p>
    </div>
  );
}

export function SubmissionDetail({ id }: SubmissionDetailProps) {
  const submission = useSubmissionsStore((s) =>
    s.submissions.find((sub) => sub.id === id)
  );
  const updateStatus = useSubmissionsStore((s) => s.updateStatus);
  const [copied, setCopied] = useState(false);

  if (!submission) {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-[14px] font-medium text-gray-400">Submission not found</p>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1.5 mt-4 text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Submissions
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[submission.status] || STATUS_CONFIG.submitted;

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(submission.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Back link */}
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-gray-900 font-mono tracking-tight">
                {submission.referenceNumber}
              </h1>
              <button
                onClick={handleCopyRef}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-300 hover:text-gray-500"
                title="Copy reference"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[13px] text-gray-400 mt-1">
              Submitted on {formatDate(submission.createdAt)}
            </p>
          </div>
          <span className={cn(
            'inline-flex items-center px-3 py-1.5 rounded-lg text-[12px] font-semibold',
            statusConfig.bg,
            statusConfig.color
          )}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Contact */}
          <SectionCard title="Contact Information" icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={submission.contactName} />
              <DetailRow label="Email" value={submission.contactEmail} />
              <DetailRow label="Phone" value={submission.contactPhone} />
              <DetailRow label="Company" value={submission.companyName} />
            </div>
          </SectionCard>

          {/* Request Details */}
          <SectionCard title="Request Details" icon={Package}>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label="Category"
                value={
                  submission.serviceCategory
                    ? CATEGORY_LABELS[submission.serviceCategory] || submission.serviceCategory
                    : null
                }
              />
              <DetailRow label="Subcategory" value={submission.serviceSubcategory} />
              <DetailRow label="Business Type" value={submission.businessType} />
              <DetailRow label="Urgency" value={submission.urgency} />
            </div>
          </SectionCard>

          {/* Route & Volume */}
          <SectionCard title="Route & Volume" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Origin" value={submission.originLocation} />
              <DetailRow label="Destination" value={submission.destinationLocation} />
              <DetailRow label="Frequency" value={submission.frequency} />
            </div>
          </SectionCard>

          {/* Special Requirements */}
          {submission.specialRequirements.length > 0 && (
            <SectionCard title="Special Requirements" icon={AlertTriangle}>
              <div className="flex flex-wrap gap-2">
                {submission.specialRequirements.map((req) => (
                  <span key={req} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[12px] font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Additional Notes */}
          {submission.additionalNotes && (
            <SectionCard title="Additional Notes" icon={FileText}>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {submission.additionalNotes}
              </p>
            </SectionCard>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status action — segmented control */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <h3 className="text-[13px] font-semibold text-gray-900">Update Status</h3>
            </div>
            <div className="p-5">
              <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = submission.status === opt.value;
                  const cfg = STATUS_CONFIG[opt.value];
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updateStatus(submission.id, opt.value)}
                      className={cn(
                        'flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold transition-all',
                        isActive
                          ? `bg-white shadow-sm ${cfg.color}`
                          : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Conversation metadata */}
          <SectionCard title="Conversation Insights" icon={MessageSquare}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[20px] font-bold text-gray-900">{formatDuration(submission.conversationDuration)}</p>
                <p className="text-[11px] text-gray-400 mt-1">Duration</p>
              </div>
              <div className="text-center">
                <p className="text-[20px] font-bold text-gray-900">{submission.totalMessages}</p>
                <p className="text-[11px] text-gray-400 mt-1">Messages</p>
              </div>
              <div className="text-center">
                <p className="text-[20px] font-bold text-gray-900">{submission.nodesVisited.length}</p>
                <p className="text-[11px] text-gray-400 mt-1">Steps</p>
              </div>
            </div>
          </SectionCard>

          {/* Recommended services */}
          {submission.recommendedServices.length > 0 && (
            <SectionCard title="Recommended Services" icon={Briefcase}>
              <div className="space-y-3">
                {submission.recommendedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] text-gray-900 font-medium">{service.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="ml-3 shrink-0">
                      <Badge variant="blue" className="text-[10px]">
                        {Math.round(service.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <h3 className="text-[13px] font-semibold text-gray-900">Activity</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[12px] text-gray-700 font-medium">Request submitted</p>
                    <p className="text-[11px] text-gray-400">{formatDate(submission.createdAt)}</p>
                  </div>
                </div>
                {submission.status !== 'submitted' && (
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-1.5 shrink-0',
                      submission.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                    )} />
                    <div>
                      <p className="text-[12px] text-gray-700 font-medium">
                        Status changed to {STATUS_CONFIG[submission.status]?.label}
                      </p>
                      <p className="text-[11px] text-gray-400">Updated by admin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
