'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRequestStore } from '@/store/requestStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SummaryField } from './SummaryField';
import { RecommendedServices } from './RecommendedServices';
import { useTranslation } from '@/i18n/LocaleProvider';
import type { RequestFields } from '@/engine/types';

function isStepComplete(fields: string[], state: RequestFields): boolean {
  return fields.some((f) => {
    const v = state[f as keyof RequestFields];
    return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  });
}

export function RequestSummary() {
  const { t } = useTranslation();
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
    storageType,
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

  const STEPS = [
    { key: 'service', label: t('request.stepService'), fields: ['serviceCategory', 'serviceSubcategory'] },
    { key: 'details', label: t('request.stepDetails'), fields: ['urgency', 'originLocation', 'destinationLocation', 'frequency'] },
    { key: 'business', label: t('request.stepBusiness'), fields: ['businessType'] },
    { key: 'contact', label: t('request.stepContact'), fields: ['contactName', 'contactEmail', 'companyName'] },
  ];

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
  const isWarehousing = serviceCategory?.toLowerCase().includes('warehouse') || serviceCategory?.toLowerCase().includes('fulfilment') || serviceCategory?.toLowerCase().includes('fulfillment') || serviceCategory?.toLowerCase().includes('store');
  const hasWarehouseDetails = isWarehousing && (storageType || cargoVolume || frequency);
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
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t('request.progressLabel')}</span>
          <span className="text-[11px] font-medium text-gray-500">{completionPercent}%</span>
        </div>
        <ProgressBar percent={completionPercent} />

        {/* Step indicators */}
        <div className="flex items-center justify-between mt-3">
          {STEPS.map((step, i) => {
            const complete = isStepComplete(step.fields, store as unknown as RequestFields);
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
                  <div className={`w-4 h-px ms-1 ${complete ? 'bg-brand-blue/30' : 'bg-gray-150'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hasEntityType && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionEntity')}</h4>
          <SummaryField label={t('request.labelType')} value={entityType} isHighlighted={isHL('entityType')} fieldKey="entityType" onEdit={handleEdit} />
        </motion.div>
      )}

      {hasServiceInfo && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionService')}</h4>
          <SummaryField label={t('request.labelCategory')} value={serviceCategory} isHighlighted={isHL('serviceCategory')} fieldKey="serviceCategory" onEdit={handleEdit} />
          <SummaryField label={t('request.labelType')} value={serviceSubcategory} isHighlighted={isHL('serviceSubcategory')} fieldKey="serviceSubcategory" onEdit={handleEdit} />
        </motion.div>
      )}

      {hasImportDetails && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionImport')}</h4>
          <SummaryField label={t('request.labelSupplier')} value={supplierStatus} isHighlighted={isHL('supplierStatus')} fieldKey="supplierStatus" onEdit={handleEdit} />
          <SummaryField label={t('request.labelSupplierCountry')} value={supplierCountry} isHighlighted={isHL('supplierCountry')} fieldKey="supplierCountry" onEdit={handleEdit} />
          <SummaryField label={t('request.labelGoods')} value={goodsCategory} isHighlighted={isHL('goodsCategory')} fieldKey="goodsCategory" onEdit={handleEdit} />
          <SummaryField label={t('request.labelIncoterms')} value={incoterms} isHighlighted={isHL('incoterms')} fieldKey="incoterms" onEdit={handleEdit} />
          <SummaryField label={t('request.labelVolume')} value={cargoVolume} isHighlighted={isHL('cargoVolume')} fieldKey="cargoVolume" onEdit={handleEdit} />
          <SummaryField label={t('request.labelCustomsHelp')} value={customsRequired} isHighlighted={isHL('customsRequired')} fieldKey="customsRequired" onEdit={handleEdit} />
        </motion.div>
      )}

      {hasWarehouseDetails && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionWarehousing')}</h4>
          <SummaryField label={t('request.labelStorageType')} value={storageType} isHighlighted={isHL('storageType')} fieldKey="storageType" onEdit={handleEdit} />
          <SummaryField label={t('request.labelStorageVolume')} value={cargoVolume} isHighlighted={isHL('cargoVolume')} fieldKey="cargoVolume" onEdit={handleEdit} />
          <SummaryField label={t('request.labelIOVolume')} value={frequency} isHighlighted={isHL('frequency')} fieldKey="frequency" onEdit={handleEdit} />
        </motion.div>
      )}

      {hasDetails && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionDetails')}</h4>
          <SummaryField label={t('request.labelUrgency')} value={urgency} isHighlighted={isHL('urgency')} fieldKey="urgency" onEdit={handleEdit} />
          <SummaryField label={t('request.labelOrigin')} value={originLocation} isHighlighted={isHL('originLocation')} fieldKey="originLocation" onEdit={handleEdit} />
          <SummaryField label={t('request.labelDestination')} value={destinationLocation} isHighlighted={isHL('destinationLocation')} fieldKey="destinationLocation" onEdit={handleEdit} />
          <SummaryField label={t('request.labelVolumeFrequency')} value={frequency} isHighlighted={isHL('frequency')} fieldKey="frequency" onEdit={handleEdit} />
        </motion.div>
      )}

      {specialRequirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-xl border border-gray-100 p-4 transition-all duration-500 ${
            isHL('specialRequirements') ? 'ring-1 ring-brand-blue/20 bg-brand-blue/[0.02]' : ''
          }`}
        >
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionSpecialReq')}</h4>
          <div className="flex flex-wrap gap-1.5">
            {specialRequirements.map((req) => (
              <span key={req} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-blue/5 text-brand-blue text-xs font-medium">
                {req}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {hasBusiness && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionBusiness')}</h4>
          <SummaryField label={t('request.labelIndustry')} value={businessType} isHighlighted={isHL('businessType')} fieldKey="businessType" onEdit={handleEdit} />
        </motion.div>
      )}

      {recommendedServices.length > 0 && (
        <RecommendedServices services={recommendedServices} />
      )}

      {hasContact && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-4 group/field">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">{t('request.sectionContact')}</h4>
          <SummaryField label={t('request.labelName')} value={contactName} isHighlighted={isHL('contactName')} fieldKey="contactName" onEdit={handleEdit} />
          <SummaryField label={t('request.labelEmail')} value={contactEmail} isHighlighted={isHL('contactEmail')} fieldKey="contactEmail" onEdit={handleEdit} />
          <SummaryField label={t('request.labelCompany')} value={companyName} isHighlighted={isHL('companyName')} fieldKey="companyName" onEdit={handleEdit} />
        </motion.div>
      )}

      {stage === 'review' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-2">
          <p className="text-xs text-gray-500">{t('request.useChat')}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
