export interface ChipOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface ConversationEdge {
  condition: 'any' | 'chip' | 'text' | 'contains';
  value?: string;
  values?: string[];
  targetNodeId: string;
  priority?: number;
}

export interface ConversationNode {
  id: string;
  type: 'question' | 'info' | 'recommendation' | 'capture' | 'terminal';
  message: string | ((context: RequestFields) => string);
  chips?: ChipOption[];
  allowFreeText?: boolean;
  freeTextPlaceholder?: string;
  multiSelect?: boolean;
  capturesField?: keyof RequestFields;
  edges: ConversationEdge[];
  onEnter?: (context: RequestFields) => Partial<RequestFields>;
}

export interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: number;
  chips?: ChipOption[];
  multiSelect?: boolean;
  selectedChip?: string;
  serviceCards?: ServiceMatch[];
  isStreaming?: boolean;
}

export interface ServiceMatch {
  id: string;
  name: string;
  category: string;
  description: string;
  vertical: string;
  confidence?: number;
}

export interface Note {
  id: string;
  content: string;
  visibility: 'internal' | 'external';
  createdAt: number;
  author: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  verticals: string[];
  specialCapabilities: string[];
  urgencyLevels: string[];
  regions: string[];
}

export interface RequestFields {
  serviceCategory: string | null;
  serviceSubcategory: string | null;
  businessType: string | null;
  originLocation: string | null;
  destinationLocation: string | null;
  frequency: string | null;
  urgency: string | null;
  specialRequirements: string[];
  additionalNotes: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  companyName: string | null;
}

export type RequestStage = 'empty' | 'gathering' | 'matched' | 'review' | 'submitted';

export interface Submission {
  id: string;
  referenceNumber: string;
  status: 'submitted' | 'in_review' | 'approved' | 'rejected';
  createdAt: number;
  serviceCategory: string | null;
  serviceSubcategory: string | null;
  businessType: string | null;
  originLocation: string | null;
  destinationLocation: string | null;
  frequency: string | null;
  urgency: string | null;
  specialRequirements: string[];
  additionalNotes: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  companyName: string | null;
  recommendedServices: ServiceMatch[];
  conversationDuration: number;
  nodesVisited: string[];
  totalMessages: number;
  notes: Note[];
}
