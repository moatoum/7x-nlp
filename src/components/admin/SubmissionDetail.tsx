'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { CATEGORY_LABELS } from '@/engine/catalog';
import { formatDate, formatDuration } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';

import type { Submission } from '@/engine/types';

interface SubmissionDetailProps {
  id: string;
}

const STATUS_BADGE: Record<string, { variant: 'default' | 'blue' | 'green'; className?: string; label: string }> = {
  submitted: { variant: 'default', label: 'Submitted' },
  in_review: { variant: 'blue', label: 'In Review' },
  approved: { variant: 'green', label: 'Approved' },
  rejected: { variant: 'default', className: 'bg-red-50 text-red-600', label: 'Rejected' },
};

const STATUS_OPTIONS: { value: Submission['status']; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
      {children}
    </p>
  );
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-900">{children}</p>;
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value || '—'}</DetailValue>
    </div>
  );
}

export function SubmissionDetail({ id }: SubmissionDetailProps) {
  const submission = useSubmissionsStore((s) =>
    s.submissions.find((sub) => sub.id === id)
  );
  const updateStatus = useSubmissionsStore((s) => s.updateStatus);

  if (!submission) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-400">Submission not found</p>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Submissions
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_BADGE[submission.status] || STATUS_BADGE.submitted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Back link */}
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {submission.referenceNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(submission.createdAt)}
          </p>
        </div>
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Contact card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={submission.contactName} />
              <DetailRow label="Email" value={submission.contactEmail} />
              <DetailRow label="Phone" value={submission.contactPhone} />
              <DetailRow label="Company" value={submission.companyName} />
            </div>
          </div>

          {/* Request details card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Request Details</h3>
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
              <DetailRow label="Urgency" value={submission.urgency} />
              <DetailRow label="Business Type" value={submission.businessType} />
              <DetailRow label="Origin" value={submission.originLocation} />
              <DetailRow label="Destination" value={submission.destinationLocation} />
              <DetailRow label="Frequency" value={submission.frequency} />
            </div>
          </div>

          {/* Special requirements */}
          {submission.specialRequirements.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Special Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {submission.specialRequirements.map((req) => (
                  <Badge key={req} variant="blue">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional notes */}
          {submission.additionalNotes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Additional Notes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {submission.additionalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Conversation metadata card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Conversation Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <DetailLabel>Duration</DetailLabel>
                <DetailValue>{formatDuration(submission.conversationDuration)}</DetailValue>
              </div>
              <div>
                <DetailLabel>Messages</DetailLabel>
                <DetailValue>{submission.totalMessages}</DetailValue>
              </div>
              <div>
                <DetailLabel>Nodes Visited</DetailLabel>
                <DetailValue>{submission.nodesVisited.length}</DetailValue>
              </div>
            </div>
          </div>

          {/* Recommended services */}
          {submission.recommendedServices.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Recommended Services</h3>
              <div className="space-y-2">
                {submission.recommendedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-gray-900 font-medium">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-3 shrink-0">
                      {Math.round(service.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status action */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Update Status</h3>
            <select
              value={submission.status}
              onChange={(e) =>
                updateStatus(submission.id, e.target.value as Submission['status'])
              }
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-colors"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
