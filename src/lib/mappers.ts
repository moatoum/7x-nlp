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

/** Convert Prisma DB record → client Submission type */
export function toClientSubmission(db: PrismaSubmissionFull): Submission {
  return {
    id: db.id,
    referenceNumber: db.referenceNumber,
    status: db.status as Submission['status'],
    createdAt: db.createdAt.getTime(),
    serviceCategory: db.serviceCategory,
    serviceSubcategory: db.serviceSubcategory,
    businessType: db.businessType,
    originLocation: db.originLocation,
    destinationLocation: db.destinationLocation,
    frequency: db.frequency,
    urgency: db.urgency,
    specialRequirements: db.specialRequirements,
    additionalNotes: db.additionalNotes,
    contactName: db.contactName,
    contactEmail: db.contactEmail,
    contactPhone: db.contactPhone,
    companyName: db.companyName,
    conversationDuration: db.conversationDuration,
    nodesVisited: db.nodesVisited,
    totalMessages: db.totalMessages,
    recommendedServices: db.recommendedServices.map(toClientServiceMatch),
    notes: db.notes.map(toClientNote),
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
