'use client';

import { motion } from 'framer-motion';
import { useRequestStore } from '@/store/requestStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SummaryField } from './SummaryField';
import { RecommendedServices } from './RecommendedServices';

export function RequestSummary() {
  const {
    serviceCategory,
    serviceSubcategory,
    urgency,
    businessType,
    originLocation,
    destinationLocation,
    frequency,
    specialRequirements,
    contactName,
    contactEmail,
    companyName,
    completionPercent,
    recommendedServices,
    stage,
  } = useRequestStore();

  const hasServiceInfo = serviceCategory || serviceSubcategory;
  const hasDetails = urgency || originLocation || destinationLocation || frequency;
  const hasBusiness = businessType;
  const hasContact = contactName || contactEmail || companyName;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Progress</span>
          <span className="text-[11px] font-medium text-gray-500">{completionPercent}%</span>
        </div>
        <ProgressBar percent={completionPercent} />
      </div>

      {/* Service Type */}
      {hasServiceInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Service</h4>
          <SummaryField label="Category" value={serviceCategory} />
          <SummaryField label="Type" value={serviceSubcategory} />
        </motion.div>
      )}

      {/* Details */}
      {hasDetails && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Details</h4>
          <SummaryField label="Urgency" value={urgency} />
          <SummaryField label="Origin" value={originLocation} />
          <SummaryField label="Destination" value={destinationLocation} />
          <SummaryField label="Volume / Frequency" value={frequency} />
        </motion.div>
      )}

      {/* Special Requirements */}
      {specialRequirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Special Requirements</h4>
          <div className="flex flex-wrap gap-1.5">
            {specialRequirements.map((req) => (
              <span key={req} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-blue/5 text-brand-blue text-xs font-medium">
                {req}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Business */}
      {hasBusiness && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Business</h4>
          <SummaryField label="Industry" value={businessType} />
        </motion.div>
      )}

      {/* Recommended Services */}
      {recommendedServices.length > 0 && (
        <RecommendedServices services={recommendedServices} />
      )}

      {/* Contact */}
      {hasContact && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Contact</h4>
          <SummaryField label="Name" value={contactName} />
          <SummaryField label="Email" value={contactEmail} />
          <SummaryField label="Company" value={companyName} />
        </motion.div>
      )}

      {/* Review indicator */}
      {stage === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2"
        >
          <p className="text-xs text-gray-500">Use the chat to submit your request</p>
        </motion.div>
      )}
    </motion.div>
  );
}
