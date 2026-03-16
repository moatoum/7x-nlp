'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRequestStore } from '@/store/requestStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SummaryField } from './SummaryField';
import { RecommendedServices } from './RecommendedServices';
import type { RequestFields } from '@/engine/types';

// Step labels for progress milestones
const STEPS = [
  { key: 'service', label: 'Service', fields: ['serviceCategory', 'serviceSubcategory'] },
  { key: 'details', label: 'Details', fields: ['urgency', 'originLocation', 'destinationLocation', 'frequency'] },
  { key: 'business', label: 'Business', fields: ['businessType'] },
  { key: 'contact', label: 'Contact', fields: ['contactName', 'contactEmail', 'companyName'] },
];

function isStepComplete(step: typeof STEPS[number], state: RequestFields): boolean {
  return step.fields.some((f) => {
    const v = state[f as keyof RequestFields];
    return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  });
}

export function RequestSummary() {
  const store = useRequestStore();
  const {
    entityType,
    serviceCategory,
    serviceSubcategory,
    urgency,
    businessType,
    originLocation,
    destinationLocation,
    frequency,
    specialRequirements,
    currentCourier,
    supplierStatus,
    supplierCountry,
    goodsCategory,
    incoterms,
    cargoVolume,
    customsRequired,
    contactName,
    contactEmail,
    companyName,
    completionPercent,
    recommendedServices,
    stage,
    highlightedFields,
    updateField,
  } = store;

  const isHL = useCallback(
    (field: string) => highlightedFields.has(field),
    [highlightedFields]
  );

  const handleEdit = useCallback(
    (fieldKey: string, newValue: string) => {
      updateField(fieldKey as keyof RequestFields, newValue);
    },
    [updateField]
  );

  const hasEntityType = !!entityType;
  const hasServiceInfo = serviceCategory || serviceSubcategory;
  const hasDetails = urgency || originLocation || destinationLocation || frequency;
  const hasBusiness = businessType;
  const hasImportDetails = supplierStatus || supplierCountry || goodsCategory || incoterms || cargoVolume || customsRequired;
  const hasCourier = !!currentCourier;
  const hasContact = contactName || contactEmail || companyName;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress with Step Milestones */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Progress</span>
          <span className="text-[11px] font-medium text-gray-500">{completionPercent}%</span>
        </div>
        <ProgressBar percent={completionPercent} />

        {/* Step indicators */}
        <div className="flex items-center justify-between mt-3">
          {STEPS.map((step, i) => {
            const complete = isStepComplete(step, store as unknown as RequestFields);
            return (
              <div key={step.key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  complete ? 'bg-brand-blue' : 'bg-gray-200'
                }`} />
                <span className={`text-[10px] font-medium transition-colors duration-300 ${
                  complete ? 'text-gray-700' : 'text-gray-350'
                }`}>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-4 h-px ml-1 ${complete ? 'bg-brand-blue/30' : 'bg-gray-150'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Entity Type */}
      {hasEntityType && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Entity</h4>
          <SummaryField label="Type" value={entityType} isHighlighted={isHL('entityType')} fieldKey="entityType" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Service Type */}
      {hasServiceInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Service</h4>
          <SummaryField label="Category" value={serviceCategory} isHighlighted={isHL('serviceCategory')} fieldKey="serviceCategory" onEdit={handleEdit} />
          <SummaryField label="Type" value={serviceSubcategory} isHighlighted={isHL('serviceSubcategory')} fieldKey="serviceSubcategory" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Import Details */}
      {hasImportDetails && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Import Details</h4>
          <SummaryField label="Supplier" value={supplierStatus} isHighlighted={isHL('supplierStatus')} fieldKey="supplierStatus" onEdit={handleEdit} />
          <SummaryField label="Supplier Country" value={supplierCountry} isHighlighted={isHL('supplierCountry')} fieldKey="supplierCountry" onEdit={handleEdit} />
          <SummaryField label="Goods" value={goodsCategory} isHighlighted={isHL('goodsCategory')} fieldKey="goodsCategory" onEdit={handleEdit} />
          <SummaryField label="Incoterms" value={incoterms} isHighlighted={isHL('incoterms')} fieldKey="incoterms" onEdit={handleEdit} />
          <SummaryField label="Volume" value={cargoVolume} isHighlighted={isHL('cargoVolume')} fieldKey="cargoVolume" onEdit={handleEdit} />
          <SummaryField label="Customs Help" value={customsRequired} isHighlighted={isHL('customsRequired')} fieldKey="customsRequired" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Details */}
      {hasDetails && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Details</h4>
          <SummaryField label="Urgency" value={urgency} isHighlighted={isHL('urgency')} fieldKey="urgency" onEdit={handleEdit} />
          <SummaryField label="Origin" value={originLocation} isHighlighted={isHL('originLocation')} fieldKey="originLocation" onEdit={handleEdit} />
          <SummaryField label="Destination" value={destinationLocation} isHighlighted={isHL('destinationLocation')} fieldKey="destinationLocation" onEdit={handleEdit} />
          <SummaryField label="Volume / Frequency" value={frequency} isHighlighted={isHL('frequency')} fieldKey="frequency" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Special Requirements */}
      {specialRequirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-xl border border-gray-100 p-4 transition-all duration-500 ${
            isHL('specialRequirements') ? 'ring-1 ring-brand-blue/20 bg-brand-blue/[0.02]' : ''
          }`}
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
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Business</h4>
          <SummaryField label="Industry" value={businessType} isHighlighted={isHL('businessType')} fieldKey="businessType" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Recommended Services */}
      {recommendedServices.length > 0 && (
        <RecommendedServices services={recommendedServices} />
      )}

      {/* Current Courier */}
      {hasCourier && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Current Courier</h4>
          <SummaryField label="Provider" value={currentCourier} isHighlighted={isHL('currentCourier')} fieldKey="currentCourier" onEdit={handleEdit} />
        </motion.div>
      )}

      {/* Contact */}
      {hasContact && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-4 group/field"
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Contact</h4>
          <SummaryField label="Name" value={contactName} isHighlighted={isHL('contactName')} fieldKey="contactName" onEdit={handleEdit} />
          <SummaryField label="Email" value={contactEmail} isHighlighted={isHL('contactEmail')} fieldKey="contactEmail" onEdit={handleEdit} />
          <SummaryField label="Company" value={companyName} isHighlighted={isHL('companyName')} fieldKey="companyName" onEdit={handleEdit} />
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
