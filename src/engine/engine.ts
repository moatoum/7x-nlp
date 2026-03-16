import type { ConversationNode, ChipOption, RequestFields } from './types';

// ============================================================
// CONVERSATION NODES — Full decision tree
// ============================================================

const nodes: Record<string, ConversationNode> = {
  // ===== PHASE 0: ENTITY TYPE GATE =====
  entity_type: {
    id: 'entity_type',
    type: 'question',
    message: 'Welcome to NLS Platform. Before we begin, are you...',
    chips: [
      { id: 'business', label: 'A business' },
      { id: 'government', label: 'A governmental entity' },
      { id: 'individual', label: 'An individual' },
    ],
    capturesField: 'entityType',
    edges: [
      { condition: 'chip', value: 'business', targetNodeId: 'welcome', priority: 10 },
      { condition: 'chip', value: 'government', targetNodeId: 'welcome', priority: 10 },
      { condition: 'chip', value: 'individual', targetNodeId: 'individual_redirect', priority: 10 },
      { condition: 'any', targetNodeId: 'welcome', priority: 0 },
    ],
  },

  individual_redirect: {
    id: 'individual_redirect',
    type: 'info',
    message: 'This platform is designed for businesses and government entities. For individual shipping needs, please visit waslah.ae where you can find services tailored for you.',
    chips: [
      { id: 'actually_business', label: "I'm actually a business" },
      { id: 'go_waslah', label: 'Go to waslah.ae' },
    ],
    edges: [
      { condition: 'chip', value: 'actually_business', targetNodeId: 'welcome', priority: 10 },
      { condition: 'chip', value: 'go_waslah', targetNodeId: 'individual_redirect', priority: 10 },
      { condition: 'any', targetNodeId: 'individual_redirect', priority: 0 },
    ],
  },

  // ===== PHASE 1: WELCOME =====
  welcome: {
    id: 'welcome',
    type: 'question',
    message: 'Welcome to NLS Platform. I\'m here to help you find the right logistics solution.\n\nWhat are you looking to do?',
    chips: [
      { id: 'ship_parcels', label: 'Ship packages or parcels', icon: 'Package' },
      { id: 'freight', label: 'Move large cargo or freight', icon: 'Container' },
      { id: 'warehouse', label: 'Store or warehouse goods', icon: 'Warehouse' },
      { id: 'fulfill', label: 'Fulfill online orders', icon: 'ShoppingBag' },
      { id: 'returns', label: 'Handle returns or repairs', icon: 'RotateCcw' },
      { id: 'customs', label: 'Customs and trade services', icon: 'FileCheck' },
      { id: 'postal', label: 'Postal and mail services', icon: 'Mail' },
      { id: 'unsure', label: 'I\'m not sure yet', icon: 'HelpCircle' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or describe what you need...',
    capturesField: 'serviceCategory',
    edges: [
      { condition: 'chip', value: 'ship_parcels', targetNodeId: 'ship_destination', priority: 10 },
      { condition: 'chip', value: 'freight', targetNodeId: 'freight_type', priority: 10 },
      { condition: 'chip', value: 'warehouse', targetNodeId: 'warehouse_type', priority: 10 },
      { condition: 'chip', value: 'fulfill', targetNodeId: 'fulfill_type', priority: 10 },
      { condition: 'chip', value: 'returns', targetNodeId: 'returns_type', priority: 10 },
      { condition: 'chip', value: 'customs', targetNodeId: 'customs_type', priority: 10 },
      { condition: 'chip', value: 'postal', targetNodeId: 'postal_type', priority: 10 },
      { condition: 'chip', value: 'unsure', targetNodeId: 'unsure_guide', priority: 10 },
      { condition: 'any', targetNodeId: 'unsure_guide', priority: 0 },
    ],
  },

  // ===== UNSURE PATH =====
  unsure_guide: {
    id: 'unsure_guide',
    type: 'question',
    message: 'No problem — let me help narrow things down.\n\nWhich of these best describes your situation?',
    chips: [
      { id: 'need_pickup', label: 'I need something picked up' },
      { id: 'need_delivery', label: 'I need something delivered' },
      { id: 'need_storage', label: 'I need to store goods' },
      { id: 'need_ship_intl', label: 'I need to ship internationally' },
      { id: 'need_help_ops', label: 'I have an operational challenge' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Describe your situation...',
    capturesField: 'serviceCategory',
    edges: [
      { condition: 'chip', value: 'need_pickup', targetNodeId: 'pickup_scope', priority: 10 },
      { condition: 'chip', value: 'need_delivery', targetNodeId: 'ship_destination', priority: 10 },
      { condition: 'chip', value: 'need_storage', targetNodeId: 'warehouse_type', priority: 10 },
      { condition: 'chip', value: 'need_ship_intl', targetNodeId: 'international_speed', priority: 10 },
      { condition: 'chip', value: 'need_help_ops', targetNodeId: 'ops_challenge', priority: 10 },
      { condition: 'any', targetNodeId: 'ship_destination', priority: 0 },
    ],
  },

  ops_challenge: {
    id: 'ops_challenge',
    type: 'question',
    message: 'Tell me more about your challenge. What area does it relate to?',
    chips: [
      { id: 'ops_delayed', label: 'Stuck or delayed shipments' },
      { id: 'ops_cost', label: 'Reducing logistics costs' },
      { id: 'ops_scale', label: 'Scaling operations' },
      { id: 'ops_other', label: 'Something else' },
    ],
    allowFreeText: true,
    capturesField: 'additionalNotes',
    edges: [
      { condition: 'any', targetNodeId: 'urgency', priority: 0 },
    ],
  },

  // ===== SHIPPING / PARCELS PATH =====
  ship_destination: {
    id: 'ship_destination',
    type: 'question',
    message: 'Where do your shipments need to go?',
    chips: [
      { id: 'domestic', label: 'Within the UAE' },
      { id: 'gcc', label: 'GCC countries' },
      { id: 'international', label: 'International' },
      { id: 'mixed', label: 'Multiple destinations' },
    ],
    capturesField: 'destinationLocation',
    edges: [
      { condition: 'chip', value: 'domestic', targetNodeId: 'domestic_speed', priority: 10 },
      { condition: 'chip', value: 'gcc', targetNodeId: 'gcc_details', priority: 10 },
      { condition: 'chip', value: 'international', targetNodeId: 'international_speed', priority: 10 },
      { condition: 'chip', value: 'mixed', targetNodeId: 'domestic_speed', priority: 10 },
      { condition: 'any', targetNodeId: 'domestic_speed', priority: 0 },
    ],
  },

  domestic_speed: {
    id: 'domestic_speed',
    type: 'question',
    message: 'How quickly do you need deliveries completed?',
    chips: [
      { id: 'same_day', label: 'Same day' },
      { id: 'next_day', label: 'Next day' },
      { id: 'standard', label: 'Standard (2-3 days)' },
      { id: 'flexible', label: 'Flexible' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  gcc_details: {
    id: 'gcc_details',
    type: 'question',
    message: 'What type of goods are you shipping across the GCC?',
    chips: [
      { id: 'gcc_general', label: 'General cargo' },
      { id: 'gcc_perishable', label: 'Perishable goods' },
      { id: 'gcc_heavy', label: 'Heavy / oversized' },
      { id: 'gcc_hazardous', label: 'Hazardous materials' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'urgency', priority: 0 },
    ],
  },

  international_speed: {
    id: 'international_speed',
    type: 'question',
    message: 'What shipping speed do you need?',
    chips: [
      { id: 'express', label: 'Express (fastest)' },
      { id: 'standard', label: 'Standard' },
      { id: 'deferred', label: 'Economy / deferred' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // ===== PICKUP PATH =====
  pickup_scope: {
    id: 'pickup_scope',
    type: 'question',
    message: 'What kind of pickup do you need?',
    chips: [
      { id: 'scheduled', label: 'Regular scheduled pickup' },
      { id: 'on_demand', label: 'One-time / on-demand' },
      { id: 'vendor', label: 'Vendor / supplier collection' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // ===== FREIGHT PATH =====
  freight_type: {
    id: 'freight_type',
    type: 'question',
    message: 'What type of freight service do you need?',
    chips: [
      { id: 'air_freight', label: 'Air freight' },
      { id: 'sea_freight', label: 'Sea freight' },
      { id: 'road_freight', label: 'Road freight / Trucking' },
      { id: 'not_sure', label: 'Not sure — advise me' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'chip', value: 'road_freight', targetNodeId: 'truck_type', priority: 10 },
      { condition: 'any', targetNodeId: 'freight_volume', priority: 0 },
    ],
  },

  truck_type: {
    id: 'truck_type',
    type: 'question',
    message: 'What kind of trucking do you need?',
    chips: [
      { id: 'ftl', label: 'Full truckload (FTL)' },
      { id: 'ltl', label: 'Less than truckload (LTL)' },
      { id: 'cross_border', label: 'Cross border (GCC)' },
      { id: 'heavy', label: 'Heavy / oversized' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'urgency', priority: 0 },
    ],
  },

  freight_volume: {
    id: 'freight_volume',
    type: 'question',
    message: 'How much cargo are you shipping?',
    chips: [
      { id: 'fcl', label: 'Full container (FCL)' },
      { id: 'lcl', label: 'Less than container (LCL)' },
      { id: 'pallets', label: 'Pallets / crates' },
      { id: 'oversized', label: 'Oversized / project cargo' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // ===== WAREHOUSING PATH =====
  warehouse_type: {
    id: 'warehouse_type',
    type: 'question',
    message: 'What type of warehousing do you need?',
    chips: [
      { id: 'general', label: 'General storage' },
      { id: 'cold', label: 'Cold / temperature controlled' },
      { id: 'bonded', label: 'Bonded warehouse' },
      { id: 'high_value', label: 'High value / secure' },
      { id: 'fulfillment', label: 'Fulfillment center' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'warehouse_duration', priority: 0 },
    ],
  },

  warehouse_duration: {
    id: 'warehouse_duration',
    type: 'question',
    message: 'How long do you need storage for?',
    chips: [
      { id: 'short', label: 'Short term (< 3 months)' },
      { id: 'medium', label: '3 - 12 months' },
      { id: 'long', label: 'Long term (1+ year)' },
      { id: 'ongoing', label: 'Ongoing / flexible' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  // ===== FULFILLMENT PATH =====
  fulfill_type: {
    id: 'fulfill_type',
    type: 'question',
    message: 'What kind of fulfillment support do you need?',
    chips: [
      { id: 'pick_pack', label: 'Pick & pack' },
      { id: 'multi_channel', label: 'Multi-channel fulfillment' },
      { id: 'grocery', label: 'Grocery / fresh' },
      { id: 'specialized', label: 'Specialized (fashion, electronics)' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'fulfill_volume', priority: 0 },
    ],
  },

  fulfill_volume: {
    id: 'fulfill_volume',
    type: 'question',
    message: 'What\'s your expected monthly order volume?',
    chips: [
      { id: 'low', label: 'Under 500 orders' },
      { id: 'medium', label: '500 - 5,000 orders' },
      { id: 'high', label: '5,000 - 50,000 orders' },
      { id: 'enterprise', label: '50,000+ orders' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  // ===== RETURNS PATH =====
  returns_type: {
    id: 'returns_type',
    type: 'question',
    message: 'What type of returns or reverse logistics do you need?',
    chips: [
      { id: 'customer_returns', label: 'Customer returns (e-commerce)' },
      { id: 'warranty', label: 'Warranty / defective returns' },
      { id: 'repair', label: 'Repair logistics' },
      { id: 'recycling', label: 'Recycling / waste disposal' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'urgency', priority: 0 },
    ],
  },

  // ===== CUSTOMS PATH =====
  customs_type: {
    id: 'customs_type',
    type: 'question',
    message: 'What trade or customs service do you need?',
    chips: [
      { id: 'import', label: 'Import clearance' },
      { id: 'export', label: 'Export clearance' },
      { id: 'compliance', label: 'Regulatory compliance' },
      { id: 'dg_docs', label: 'Dangerous goods documentation' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  // ===== POSTAL PATH =====
  postal_type: {
    id: 'postal_type',
    type: 'question',
    message: 'What postal service are you looking for?',
    chips: [
      { id: 'letter', label: 'Letter mail' },
      { id: 'registered', label: 'Registered / secure mail' },
      { id: 'parcels', label: 'Postal parcels' },
      { id: 'direct_mail', label: 'Direct mail / marketing' },
      { id: 'lockers', label: 'Postal lockers' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  // ===== SHARED NODES =====
  special_requirements: {
    id: 'special_requirements',
    type: 'question',
    message: 'Do any of these apply to your shipments?',
    chips: [
      { id: 'temperature', label: 'Temperature sensitive' },
      { id: 'high_value', label: 'High value items' },
      { id: 'dangerous', label: 'Dangerous / hazardous goods' },
      { id: 'fragile', label: 'Fragile / special handling' },
      { id: 'oversized', label: 'Oversized or heavy' },
      { id: 'none', label: 'None of these' },
    ],
    multiSelect: true,
    capturesField: 'specialRequirements',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  urgency: {
    id: 'urgency',
    type: 'question',
    message: 'How urgent is this?',
    chips: [
      { id: 'immediate', label: 'Immediate / ASAP' },
      { id: 'this_week', label: 'This week' },
      { id: 'planning', label: 'Planning ahead' },
      { id: 'exploring', label: 'Just exploring options' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  business_type: {
    id: 'business_type',
    type: 'question',
    message: 'What industry is your business in?',
    chips: [
      { id: 'ecommerce', label: 'E-commerce / D2C' },
      { id: 'retail', label: 'Retail' },
      { id: 'healthcare', label: 'Healthcare / Pharma' },
      { id: 'manufacturing', label: 'Manufacturing' },
      { id: 'food', label: 'Food & Beverage' },
      { id: 'government', label: 'Government' },
      { id: 'other', label: 'Other' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or type your industry...',
    capturesField: 'businessType',
    edges: [
      { condition: 'any', targetNodeId: 'volume', priority: 0 },
    ],
  },

  volume: {
    id: 'volume',
    type: 'question',
    message: 'What\'s your expected monthly volume?',
    chips: [
      { id: 'under_100', label: 'Under 100 shipments' },
      { id: '100_1000', label: '100 - 1,000' },
      { id: '1000_10000', label: '1,000 - 10,000' },
      { id: 'over_10000', label: '10,000+' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'origin_location', priority: 0 },
    ],
  },

  origin_location: {
    id: 'origin_location',
    type: 'question',
    message: 'Where are you based? This helps us match local services.',
    chips: [
      { id: 'dubai', label: 'Dubai' },
      { id: 'abu_dhabi', label: 'Abu Dhabi' },
      { id: 'sharjah', label: 'Sharjah' },
      { id: 'other_uae', label: 'Other UAE' },
      { id: 'outside_uae', label: 'Outside UAE' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or type your location...',
    capturesField: 'originLocation',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  // ===== PRE-RECOMMENDATION FILL NODES =====
  // These capture a single missing field and loop back to recommendation
  _fill_destination: {
    id: '_fill_destination',
    type: 'question',
    message: 'One more thing — where do your shipments need to go?',
    chips: [
      { id: 'domestic', label: 'Within the UAE' },
      { id: 'gcc', label: 'GCC countries' },
      { id: 'international', label: 'International' },
      { id: 'mixed', label: 'Multiple destinations' },
    ],
    capturesField: 'destinationLocation',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  _fill_urgency: {
    id: '_fill_urgency',
    type: 'question',
    message: 'How urgent is this?',
    chips: [
      { id: 'immediate', label: 'Immediate / ASAP' },
      { id: 'this_week', label: 'This week' },
      { id: 'planning', label: 'Planning ahead' },
      { id: 'exploring', label: 'Just exploring options' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  _fill_business_type: {
    id: '_fill_business_type',
    type: 'question',
    message: 'What industry is your business in?',
    chips: [
      { id: 'ecommerce', label: 'E-commerce / D2C' },
      { id: 'retail', label: 'Retail' },
      { id: 'healthcare', label: 'Healthcare / Pharma' },
      { id: 'manufacturing', label: 'Manufacturing' },
      { id: 'food', label: 'Food & Beverage' },
      { id: 'government', label: 'Government' },
      { id: 'other', label: 'Other' },
    ],
    allowFreeText: true,
    capturesField: 'businessType',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  _fill_volume: {
    id: '_fill_volume',
    type: 'question',
    message: 'What\'s your expected monthly volume?',
    chips: [
      { id: 'under_100', label: 'Under 100 shipments' },
      { id: '100_1000', label: '100 - 1,000' },
      { id: '1000_10000', label: '1,000 - 10,000' },
      { id: 'over_10000', label: '10,000+' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  _fill_origin: {
    id: '_fill_origin',
    type: 'question',
    message: 'Where are you based?',
    chips: [
      { id: 'dubai', label: 'Dubai' },
      { id: 'abu_dhabi', label: 'Abu Dhabi' },
      { id: 'sharjah', label: 'Sharjah' },
      { id: 'other_uae', label: 'Other UAE' },
      { id: 'outside_uae', label: 'Outside UAE' },
    ],
    allowFreeText: true,
    capturesField: 'originLocation',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  // ===== RECOMMENDATION =====
  recommendation: {
    id: 'recommendation',
    type: 'recommendation',
    message: 'Based on what you\'ve told me, here are the services I\'d recommend:',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation_response', priority: 0 },
    ],
  },

  recommendation_response: {
    id: 'recommendation_response',
    type: 'question',
    message: 'Do these look right for your needs?',
    chips: [
      { id: 'proceed', label: 'Yes, let\'s proceed' },
      { id: 'different', label: 'I need something different' },
      { id: 'restart', label: 'Start over' },
    ],
    edges: [
      { condition: 'chip', value: 'proceed', targetNodeId: 'current_courier', priority: 10 },
      { condition: 'chip', value: 'different', targetNodeId: 'unsure_guide', priority: 10 },
      { condition: 'chip', value: 'restart', targetNodeId: 'welcome', priority: 10 },
      { condition: 'any', targetNodeId: 'current_courier', priority: 0 },
    ],
  },

  // ===== CURRENT COURIER =====
  current_courier: {
    id: 'current_courier',
    type: 'question',
    message: 'Which courier service do you currently use for your logistics needs?',
    chips: [
      { id: 'emx', label: 'EMX' },
      { id: 'aramex', label: 'Aramex' },
      { id: 'dhl', label: 'DHL' },
      { id: 'fedex', label: 'FedEx' },
      { id: 'zajel', label: 'Zajel' },
      { id: 'other', label: 'Other' },
    ],
    capturesField: 'currentCourier',
    edges: [
      { condition: 'chip', value: 'other', targetNodeId: 'current_courier_other', priority: 10 },
      { condition: 'any', targetNodeId: 'contact_name', priority: 0 },
    ],
  },

  current_courier_other: {
    id: 'current_courier_other',
    type: 'capture',
    message: 'What courier service do you currently use?',
    allowFreeText: true,
    freeTextPlaceholder: 'Courier name',
    capturesField: 'currentCourier',
    edges: [
      { condition: 'any', targetNodeId: 'contact_name', priority: 0 },
    ],
  },

  // ===== CONTACT CAPTURE =====
  contact_name: {
    id: 'contact_name',
    type: 'capture',
    message: 'Great — let me connect you with our team.\n\nWhat\'s your name?',
    allowFreeText: true,
    freeTextPlaceholder: 'Your full name',
    capturesField: 'contactName',
    edges: [
      { condition: 'any', targetNodeId: 'contact_email', priority: 0 },
    ],
  },

  contact_email: {
    id: 'contact_email',
    type: 'capture',
    message: 'And your email address?',
    allowFreeText: true,
    freeTextPlaceholder: 'you@company.com',
    capturesField: 'contactEmail',
    edges: [
      { condition: 'any', targetNodeId: 'contact_phone', priority: 0 },
    ],
  },

  contact_phone: {
    id: 'contact_phone',
    type: 'capture',
    message: 'What\'s the best phone number to reach you?',
    allowFreeText: true,
    freeTextPlaceholder: '+971 XX XXX XXXX',
    capturesField: 'contactPhone',
    edges: [
      { condition: 'any', targetNodeId: 'contact_company', priority: 0 },
    ],
  },

  contact_company: {
    id: 'contact_company',
    type: 'capture',
    message: 'What company are you with?',
    allowFreeText: true,
    freeTextPlaceholder: 'Company name',
    capturesField: 'companyName',
    edges: [
      { condition: 'any', targetNodeId: 'additional_notes', priority: 0 },
    ],
  },

  // ===== ADDITIONAL NOTES =====
  additional_notes: {
    id: 'additional_notes',
    type: 'capture',
    message: 'Anything else you\'d like us to know about your logistics needs?',
    allowFreeText: true,
    freeTextPlaceholder: 'Additional notes (optional)',
    chips: [
      { id: 'skip', label: 'No, continue' },
    ],
    capturesField: 'additionalNotes',
    edges: [
      { condition: 'any', targetNodeId: 'review', priority: 0 },
    ],
  },

  // ===== REVIEW & SUBMIT =====
  review: {
    id: 'review',
    type: 'info',
    message: 'Your request is ready for review. Please check the summary panel and submit when you\'re satisfied.',
    chips: [
      { id: 'submit', label: 'Submit Request' },
      { id: 'edit', label: 'I want to change something' },
    ],
    edges: [
      { condition: 'chip', value: 'submit', targetNodeId: 'submitted', priority: 10 },
      { condition: 'chip', value: 'edit', targetNodeId: 'welcome', priority: 10 },
      { condition: 'any', targetNodeId: 'submitted', priority: 0 },
    ],
  },

  submitted: {
    id: 'submitted',
    type: 'terminal',
    message: '',
    edges: [],
  },
};

// ============================================================
// ENGINE FUNCTIONS
// ============================================================

export function getNode(id: string): ConversationNode {
  return nodes[id] || nodes['entity_type'];
}

export function detectCategoryFromText(input: string): string {
  const lower = input.toLowerCase();
  const keywords: Record<string, string[]> = {
    ship_destination: ['ship', 'send', 'deliver', 'package', 'parcel', 'courier', 'dispatch'],
    freight_type: ['freight', 'cargo', 'container', 'fcl', 'lcl', 'bulk', 'heavy'],
    warehouse_type: ['warehouse', 'storage', 'store', 'inventory', 'stock'],
    fulfill_type: ['fulfillment', 'fulfill', 'pick and pack', 'orders', 'ecommerce fulfillment'],
    returns_type: ['return', 'reverse', 'warranty', 'repair', 'recycl', 'defective'],
    customs_type: ['customs', 'clearance', 'import', 'export', 'compliance', 'declaration'],
    postal_type: ['mail', 'letter', 'postal', 'stamp', 'registered mail', 'post office'],
    international_speed: ['international', 'overseas', 'global', 'cross border', 'abroad'],
    pickup_scope: ['pickup', 'collect', 'pick up', 'collection'],
  };

  for (const [nodeId, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) return nodeId;
  }
  return 'unsure_guide';
}

export function processUserInput(
  input: string | ChipOption,
  currentNode: ConversationNode,
  context: RequestFields
): { nextNodeId: string; fieldUpdate?: Partial<RequestFields> } {
  // context available for future conditional logic
  void context;
  const isChip = typeof input !== 'string';
  const displayValue = isChip ? input.label : input;

  // Build field update
  const fieldUpdate: Partial<RequestFields> = {};
  if (currentNode.capturesField) {
    if (currentNode.multiSelect) {
      (fieldUpdate as Record<string, unknown>)[currentNode.capturesField] =
        displayValue === 'None of these' ? [] : [displayValue];
    } else {
      (fieldUpdate as Record<string, unknown>)[currentNode.capturesField] = displayValue;
    }
  }

  // Find matching edge
  const sortedEdges = [...currentNode.edges].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const edge of sortedEdges) {
    if (edge.condition === 'chip' && isChip && edge.value === input.id) {
      return { nextNodeId: edge.targetNodeId, fieldUpdate };
    }
    if (edge.condition === 'contains' && typeof input === 'string') {
      const vals = edge.values ?? [edge.value!];
      if (vals.some((v) => input.toLowerCase().includes(v.toLowerCase()))) {
        return { nextNodeId: edge.targetNodeId, fieldUpdate };
      }
    }
  }

  // Fallback: 'any' edge
  const anyEdge = sortedEdges.find((e) => e.condition === 'any');
  if (anyEdge) {
    return { nextNodeId: anyEdge.targetNodeId, fieldUpdate };
  }

  // Ultimate fallback: keyword detection from free text
  if (typeof input === 'string') {
    const detected = detectCategoryFromText(input);
    return { nextNodeId: detected, fieldUpdate };
  }

  return { nextNodeId: 'unsure_guide', fieldUpdate };
}
