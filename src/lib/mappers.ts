import type {
  Submission as PrismaSubmission,
  Note as PrismaNote,
  RecommendedService as PrismaService,
} from '@prisma/client';
import type { Submission, Note, ServiceMatch } from '@/engine/types';

type PrismaSubmissionFull = PrismaSubmission & {
  notes: PrismaNote[];
  recommendedServices: PrismaService[];
};

/** Convert Prisma DB record → client Submission type (full, admin-only) */
export function toClientSubmission(db: PrismaSubmissionFull): Submission {
  return {
    id: db.id,
    referenceNumber: db.referenceNumber,
    status: db.status as Submission['status'],
    createdAt: db.createdAt.getTime(),
    entityType: db.entityType,
    serviceCategory: db.serviceCategory,
    serviceSubcategory: db.serviceSubcategory,
    businessType: db.businessType,
    originLocation: db.originLocation,
    destinationLocation: db.destinationLocation,
    frequency: db.frequency,
    urgency: db.urgency,
    specialRequirements: db.specialRequirements,
    additionalNotes: db.additionalNotes,
    currentCourier: db.currentCourier,
    supplierStatus: db.supplierStatus,
    supplierCountry: db.supplierCountry,
    goodsCategory: db.goodsCategory,
    incoterms: db.incoterms,
    cargoVolume: db.cargoVolume,
    customsRequired: db.customsRequired,
    storageType: db.storageType,
    contactName: db.contactName,
    contactEmail: db.contactEmail,
    contactPhone: db.contactPhone,
    companyName: db.companyName,
    tag: db.tag,
    conversationDuration: db.conversationDuration,
    nodesVisited: db.nodesVisited,
    totalMessages: db.totalMessages,
    recommendedServices: db.recommendedServices.map(toClientServiceMatch),
    notes: db.notes.map(toClientNote),
  };
}

/** Convert Prisma DB record → public-safe DTO for tracking (no PII, external notes only) */
export function toPublicSubmission(db: PrismaSubmissionFull): Partial<Submission> {
  return {
    referenceNumber: db.referenceNumber,
    status: db.status as Submission['status'],
    createdAt: db.createdAt.getTime(),
    serviceCategory: db.serviceCategory,
    originLocation: db.originLocation,
    destinationLocation: db.destinationLocation,
    urgency: db.urgency,
    recommendedServices: db.recommendedServices.map(toClientServiceMatch),
    notes: db.notes
      .filter((n) => n.visibility === 'external')
      .map(toClientNote),
  };
}

/** Convert Prisma Note → client Note type */
export function toClientNote(db: PrismaNote): Note {
  return {
    id: db.id,
    content: db.content,
    visibility: db.visibility as Note['visibility'],
    createdAt: db.createdAt.getTime(),
    author: db.author,
  };
}

/** Convert Prisma RecommendedService → client ServiceMatch type */
export function toClientServiceMatch(db: PrismaService): ServiceMatch {
  return {
    id: db.serviceId,
    name: db.name,
    category: db.category,
    description: db.description,
    vertical: db.vertical,
    confidence: db.confidence ?? undefined,
  };
}
