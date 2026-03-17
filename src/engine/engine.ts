import type { ConversationNode, ChipOption, RequestFields } from './types';

// ============================================================
// CONVERSATION NODES — Full decision tree
// ============================================================

const nodes: Record<string, ConversationNode> = {
  // ===== PHASE 0: ENTITY TYPE GATE =====
  entity_type: {
    id: 'entity_type',
    type: 'question',
    message: 'Welcome to LINK. Before we begin, are you...',
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
    message: 'This platform is designed for businesses and government entities. For individual shipping needs, you can reach out to NXN support team on +971600569696 – Monday to Saturday 8:00 AM – 6:00 PM, or send your request to support@nxn.ae to get a reply within 24 hours.',
    chips: [
      { id: 'actually_business', label: "I'm actually a business" },
      { id: 'go_nxn', label: 'Go to nxn.ae' },
    ],
    edges: [
      { condition: 'chip', value: 'actually_business', targetNodeId: 'welcome', priority: 10 },
      { condition: 'chip', value: 'go_nxn', targetNodeId: 'individual_redirect', priority: 10 },
      { condition: 'any', targetNodeId: 'individual_redirect', priority: 0 },
    ],
  },

  // ===== PHASE 1: WELCOME =====
  welcome: {
    id: 'welcome',
    type: 'question',
    message: 'Welcome to LINK. I\'m here to help you find the right logistics solution.\n\nWhat are you looking to do?',
    chips: [
      { id: 'ship_parcels', label: 'Ship packages or parcels', icon: 'Package' },
      { id: 'freight', label: 'Move large cargo or freight', icon: 'Container' },
      { id: 'warehouse', label: 'Warehousing & Fulfilment', icon: 'Warehouse' },
      { id: 'returns', label: 'Handle returns or repairs', icon: 'RotateCcw' },
      { id: 'customs', label: 'Customs and trade services', icon: 'FileCheck' },
      { id: 'postal', label: 'Postal and mail services', icon: 'Mail' },
      { id: 'import_goods', label: 'Import goods from a supplier', icon: 'Ship' },
      { id: 'unsure', label: 'I\'m not sure yet', icon: 'HelpCircle' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or describe what you need...',
    capturesField: 'serviceCategory',
    edges: [
      { condition: 'chip', value: 'ship_parcels', targetNodeId: 'ship_destination', priority: 10 },
      { condition: 'chip', value: 'freight', targetNodeId: 'freight_type', priority: 10 },
      { condition: 'chip', value: 'warehouse', targetNodeId: 'warehouse_type', priority: 10 },
      { condition: 'chip', value: 'returns', targetNodeId: 'returns_type', priority: 10 },
      { condition: 'chip', value: 'customs', targetNodeId: 'customs_type', priority: 10 },
      { condition: 'chip', value: 'postal', targetNodeId: 'postal_type', priority: 10 },
      { condition: 'chip', value: 'import_goods', targetNodeId: 'import_supplier_known', priority: 10 },
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
      { condition: 'chip', value: 'need_delivery', targetNodeId: 'unsure_delivery_destination', priority: 10 },
      { condition: 'chip', value: 'need_storage', targetNodeId: 'warehouse_type', priority: 10 },
      { condition: 'chip', value: 'need_ship_intl', targetNodeId: 'international_speed', priority: 10 },
      { condition: 'chip', value: 'need_help_ops', targetNodeId: 'ops_challenge', priority: 10 },
      { condition: 'any', targetNodeId: 'ship_destination', priority: 0 },
    ],
  },

  // Unsure > "I need something delivered" — has 4 chips (includes Multiple destinations per CSV)
  unsure_delivery_destination: {
    id: 'unsure_delivery_destination',
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
      { condition: 'chip', value: 'gcc', targetNodeId: 'gcc_urgency', priority: 10 },
      { condition: 'chip', value: 'international', targetNodeId: 'international_speed', priority: 10 },
      { condition: 'chip', value: 'mixed', targetNodeId: 'urgency', priority: 10 },
      { condition: 'any', targetNodeId: 'domestic_speed', priority: 0 },
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
    ],
    capturesField: 'destinationLocation',
    edges: [
      { condition: 'chip', value: 'domestic', targetNodeId: 'domestic_speed', priority: 10 },
      { condition: 'chip', value: 'gcc', targetNodeId: 'gcc_urgency', priority: 10 },
      { condition: 'chip', value: 'international', targetNodeId: 'international_speed', priority: 10 },
      { condition: 'any', targetNodeId: 'domestic_speed', priority: 0 },
    ],
  },

  domestic_speed: {
    id: 'domestic_speed',
    type: 'question',
    message: 'How quickly do you need deliveries completed?',
    chips: [
      { id: 'on_demand', label: 'On Demand Delivery' },
      { id: 'same_day', label: 'Same day' },
      { id: 'next_day', label: 'Next day' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // GCC sub-path: urgency → speed → goods type
  gcc_urgency: {
    id: 'gcc_urgency',
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
      { condition: 'any', targetNodeId: 'gcc_speed', priority: 0 },
    ],
  },

  gcc_speed: {
    id: 'gcc_speed',
    type: 'question',
    message: 'What shipping speed do you need?',
    chips: [
      { id: 'express', label: 'Express (fastest)' },
      { id: 'standard', label: 'Standard' },
      { id: 'economy', label: 'Economy / deferred' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'gcc_goods_type', priority: 0 },
    ],
  },

  gcc_goods_type: {
    id: 'gcc_goods_type',
    type: 'question',
    message: 'What type of goods are you shipping across the GCC?',
    chips: [
      { id: 'general', label: 'General cargo' },
      { id: 'perishable', label: 'Perishable goods' },
      { id: 'heavy', label: 'Heavy / oversized' },
      { id: 'dangerous', label: 'Dangerous Goods' },
      { id: 'others', label: 'Others' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // International sub-path: speed → goods type
  international_speed: {
    id: 'international_speed',
    type: 'question',
    message: 'What shipping speed do you need?',
    chips: [
      { id: 'express', label: 'Express (fastest)' },
      { id: 'standard', label: 'Standard' },
      { id: 'economy', label: 'Economy / deferred' },
    ],
    capturesField: 'urgency',
    edges: [
      { condition: 'any', targetNodeId: 'intl_goods_type', priority: 0 },
    ],
  },

  intl_goods_type: {
    id: 'intl_goods_type',
    type: 'question',
    message: 'What type of goods are you shipping internationally?',
    chips: [
      { id: 'general', label: 'General cargo' },
      { id: 'perishable', label: 'Perishable goods' },
      { id: 'heavy', label: 'Heavy / oversized' },
      { id: 'dangerous', label: 'Dangerous Goods' },
      { id: 'others', label: 'Others' },
    ],
    capturesField: 'serviceSubcategory',
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
      { id: 'heavy', label: 'Heavy / oversized' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'freight_road_urgency', priority: 0 },
    ],
  },

  freight_road_urgency: {
    id: 'freight_road_urgency',
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
      { condition: 'any', targetNodeId: 'freight_road_destination', priority: 0 },
    ],
  },

  freight_road_destination: {
    id: 'freight_road_destination',
    type: 'question',
    message: 'What are your top destinations?',
    chips: [
      { id: 'uae', label: 'UAE' },
      { id: 'ksa', label: 'KSA' },
      { id: 'kuwait', label: 'Kuwait' },
      { id: 'bahrain', label: 'Bahrain' },
      { id: 'oman', label: 'Oman' },
      { id: 'qatar', label: 'Qatar' },
      { id: 'others', label: 'Others' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or type destination...',
    capturesField: 'destinationLocation',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
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
    capturesField: 'cargoVolume',
    edges: [
      { condition: 'any', targetNodeId: 'freight_air_sea_destination', priority: 0 },
    ],
  },

  freight_air_sea_destination: {
    id: 'freight_air_sea_destination',
    type: 'question',
    message: 'What is your top destination region?',
    chips: [
      { id: 'gcc', label: 'GCC' },
      { id: 'europe', label: 'Europe' },
      { id: 'usa', label: 'USA' },
      { id: 'africa', label: 'Africa' },
      { id: 'asia', label: 'Asia' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or type region...',
    capturesField: 'destinationLocation',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
    ],
  },

  // ===== WAREHOUSING & FULFILMENT PATH (merged) =====
  warehouse_type: {
    id: 'warehouse_type',
    type: 'question',
    message: 'What type of warehousing do you need?',
    chips: [
      { id: 'general_mainland', label: 'General storage Mainland' },
      { id: 'micro_fulfilment', label: 'Micro Fulfilment' },
      { id: 'general_freezone', label: 'General Storage Freezone' },
      { id: 'high_value', label: 'High value / secure' },
      { id: 'ecommerce_fulfilment', label: 'E-commerce Fulfilment' },
      { id: 'cold_storage', label: 'Cold Storage' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'warehouse_storage_type', priority: 0 },
    ],
  },

  warehouse_storage_type: {
    id: 'warehouse_storage_type',
    type: 'question',
    message: 'What type of storage do you need?',
    chips: [
      { id: 'pallets', label: 'Pallets' },
      { id: 'cartons', label: 'Cartons' },
      { id: 'pieces', label: 'Pieces' },
    ],
    capturesField: 'storageType',
    edges: [
      { condition: 'any', targetNodeId: 'warehouse_storage_volume', priority: 0 },
    ],
  },

  warehouse_storage_volume: {
    id: 'warehouse_storage_volume',
    type: 'question',
    message: ((context: RequestFields) => {
      const unit = context.storageType === 'Pieces' ? 'Pieces' : 'CBM';
      return `What's your expected monthly storage in ${unit}?`;
    }) as ConversationNode['message'],
    chips: [
      { id: 'under_100', label: 'Under 100' },
      { id: '100_1000', label: '100 - 1,000' },
      { id: '1000_10000', label: '1,000 - 10,000' },
      { id: 'over_10000', label: '10,000+' },
    ],
    capturesField: 'cargoVolume',
    edges: [
      { condition: 'any', targetNodeId: 'warehouse_io_volume', priority: 0 },
    ],
  },

  warehouse_io_volume: {
    id: 'warehouse_io_volume',
    type: 'question',
    message: ((context: RequestFields) => {
      const unit = context.storageType === 'Pieces' ? 'Pieces' : 'CBM';
      return `What's your expected monthly inbound/outbound volume in ${unit}?`;
    }) as ConversationNode['message'],
    chips: [
      { id: 'under_100', label: 'Under 100' },
      { id: '100_1000', label: '100 - 1,000' },
      { id: '1000_10000', label: '1,000 - 10,000' },
      { id: 'over_10000', label: '10,000+' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'warehouse_business_type', priority: 0 },
    ],
  },

  warehouse_business_type: {
    id: 'warehouse_business_type',
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
      { condition: 'any', targetNodeId: 'origin_location', priority: 0 },
    ],
  },

  // ===== RETURNS PATH =====
  returns_type: {
    id: 'returns_type',
    type: 'question',
    message: 'What type of returns or reverse logistics do you need?',
    chips: [
      { id: 'customer_returns', label: 'Customer Initiated Returns (e-commerce)' },
      { id: 'warranty', label: 'Warranty / defective returns' },
      { id: 'repair', label: 'Return & Repair logistics' },
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
      { id: 'postal_shipping', label: 'Postal Shipping' },
    ],
    capturesField: 'serviceSubcategory',
    edges: [
      { condition: 'any', targetNodeId: 'business_type', priority: 0 },
    ],
  },

  // ===== IMPORT GOODS PATH (unchanged) =====
  import_supplier_known: {
    id: 'import_supplier_known',
    type: 'question',
    message: 'Do you already have an established supplier for the goods you want to import?',
    chips: [
      { id: 'yes', label: 'Yes, I have a supplier' },
      { id: 'exploring', label: 'Still exploring suppliers' },
    ],
    capturesField: 'supplierStatus',
    onEnter: () => ({
      serviceCategory: 'Import goods from a supplier',
      destinationLocation: 'Within the UAE',
    }),
    edges: [
      { condition: 'chip', value: 'yes', targetNodeId: 'import_supplier_country', priority: 10 },
      { condition: 'chip', value: 'exploring', targetNodeId: 'import_exploring_redirect', priority: 10 },
      { condition: 'any', targetNodeId: 'import_supplier_country', priority: 0 },
    ],
  },

  import_exploring_redirect: {
    id: 'import_exploring_redirect',
    type: 'info',
    message: 'No worries — one of our experts can help you find the right supplier and guide you through the import process. Request a callback and we\'ll get back to you shortly.',
    chips: [
      { id: 'request_callback', label: 'Request a callback' },
      { id: 'have_supplier', label: 'Actually, I have a supplier' },
    ],
    edges: [
      { condition: 'chip', value: 'request_callback', targetNodeId: 'import_exploring_redirect', priority: 10 },
      { condition: 'chip', value: 'have_supplier', targetNodeId: 'import_supplier_country', priority: 10 },
      { condition: 'any', targetNodeId: 'import_exploring_redirect', priority: 0 },
    ],
  },

  import_supplier_country: {
    id: 'import_supplier_country',
    type: 'question',
    message: 'Which country or region is your supplier based in?',
    chips: [
      { id: 'china', label: 'China' },
      { id: 'india', label: 'India' },
      { id: 'turkey', label: 'Turkey' },
      { id: 'europe', label: 'Europe' },
      { id: 'usa', label: 'USA' },
      { id: 'other', label: 'Other' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Country or region name',
    capturesField: 'supplierCountry',
    edges: [
      { condition: 'any', targetNodeId: 'import_goods_category', priority: 0 },
    ],
  },

  import_goods_category: {
    id: 'import_goods_category',
    type: 'question',
    message: 'What type of goods are you importing?',
    chips: [
      { id: 'raw_materials', label: 'Raw materials' },
      { id: 'components', label: 'Components / parts' },
      { id: 'finished', label: 'Finished products' },
      { id: 'machinery', label: 'Machinery / equipment' },
      { id: 'textiles', label: 'Textiles / garments' },
      { id: 'food', label: 'Food / perishables' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Or describe your goods...',
    capturesField: 'goodsCategory',
    edges: [
      { condition: 'any', targetNodeId: 'import_incoterms', priority: 0 },
    ],
  },

  import_incoterms: {
    id: 'import_incoterms',
    type: 'question',
    message: 'What shipping terms (Incoterms) have you agreed with your supplier?',
    chips: [
      { id: 'fob', label: 'FOB (Free on Board)' },
      { id: 'cif', label: 'CIF (Cost, Insurance & Freight)' },
      { id: 'exw', label: 'EXW (Ex Works)' },
      { id: 'ddp', label: 'DDP (Delivered Duty Paid)' },
      { id: 'not_sure', label: 'Not sure yet' },
    ],
    capturesField: 'incoterms',
    edges: [
      { condition: 'any', targetNodeId: 'import_cargo_volume', priority: 0 },
    ],
  },

  import_cargo_volume: {
    id: 'import_cargo_volume',
    type: 'question',
    message: 'What\'s the expected volume per shipment?',
    chips: [
      { id: 'small', label: 'Less than 1 CBM' },
      { id: 'medium', label: '1 - 5 CBM' },
      { id: 'fcl_20', label: 'Full container (20ft)' },
      { id: 'fcl_40', label: 'Full container (40ft)' },
      { id: 'multi', label: 'Multiple containers' },
      { id: 'not_sure', label: 'Not sure yet' },
    ],
    capturesField: 'cargoVolume',
    edges: [
      { condition: 'any', targetNodeId: 'import_customs', priority: 0 },
    ],
  },

  import_customs: {
    id: 'import_customs',
    type: 'question',
    message: 'Do you need customs clearance assistance for importing into the UAE?',
    chips: [
      { id: 'yes', label: 'Yes, I need help' },
      { id: 'no', label: 'No, we handle it' },
      { id: 'not_sure', label: 'Not sure' },
    ],
    capturesField: 'customsRequired',
    edges: [
      { condition: 'any', targetNodeId: 'import_frequency', priority: 0 },
    ],
  },

  import_frequency: {
    id: 'import_frequency',
    type: 'question',
    message: 'How often do you expect to import shipments?',
    chips: [
      { id: 'one_time', label: 'One-time shipment' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'quarterly', label: 'Quarterly' },
      { id: 'weekly', label: 'Weekly or more' },
    ],
    capturesField: 'frequency',
    edges: [
      { condition: 'any', targetNodeId: 'special_requirements', priority: 0 },
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
      { id: 'abu_dhabi', label: 'Abu Dhabi' },
      { id: 'dubai', label: 'Dubai' },
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
      { id: 'abu_dhabi', label: 'Abu Dhabi' },
      { id: 'dubai', label: 'Dubai' },
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
      { id: 'refine', label: 'Refine these results' },
      { id: 'different', label: 'I need something different' },
      { id: 'restart', label: 'Start over' },
    ],
    edges: [
      { condition: 'chip', value: 'proceed', targetNodeId: 'current_provider', priority: 10 },
      { condition: 'chip', value: 'refine', targetNodeId: 'refine_recommendation', priority: 10 },
      { condition: 'chip', value: 'different', targetNodeId: 'unsure_guide', priority: 10 },
      { condition: 'chip', value: 'restart', targetNodeId: 'welcome', priority: 10 },
      { condition: 'any', targetNodeId: 'current_provider', priority: 0 },
    ],
  },

  refine_recommendation: {
    id: 'refine_recommendation',
    type: 'question',
    message: 'I\'d like to find better options for you. Could you tell me what wasn\'t quite right? For example:\n- The services didn\'t match your specific need\n- You need a different type of service\n- Your requirements have changed',
    allowFreeText: true,
    freeTextPlaceholder: 'Tell me what you need differently...',
    capturesField: 'additionalNotes',
    edges: [
      { condition: 'any', targetNodeId: 'recommendation', priority: 0 },
    ],
  },

  // ===== CURRENT PROVIDER =====
  current_provider: {
    id: 'current_provider',
    type: 'capture',
    message: 'Who is your current transportation and logistics provider?',
    allowFreeText: true,
    freeTextPlaceholder: 'Type your current provider name...',
    capturesField: 'currentCourier',
    edges: [
      { condition: 'any', targetNodeId: 'contact_name', priority: 0 },
    ],
  },

  // ===== CONTACT CAPTURE =====
  contact_name: {
    id: 'contact_name',
    type: 'capture',
    message: 'Great — just a few details to finalize your request.\n\nWhat\'s your name?',
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
      { condition: 'any', targetNodeId: 'additional_info', priority: 0 },
    ],
  },

  additional_info: {
    id: 'additional_info',
    type: 'capture',
    message: 'Is there any additional information or anything else you\'d like to let us know about?',
    allowFreeText: true,
    freeTextPlaceholder: 'Type any additional details...',
    capturesField: 'additionalNotes',
    edges: [
      { condition: 'any', targetNodeId: 'review', priority: 0 },
    ],
  },

  // ===== REVIEW & SUBMIT =====
  review: {
    id: 'review',
    type: 'info',
    message: 'Your request is ready to submit. Please review the summary panel and submit when you\'re satisfied.',
    chips: [
      { id: 'submit', label: 'Submit Request' },
      { id: 'edit', label: 'I want to change something' },
    ],
    edges: [
      { condition: 'chip', value: 'submit', targetNodeId: 'submitted', priority: 10 },
      { condition: 'chip', value: 'edit', targetNodeId: 'edit_request', priority: 10 },
      { condition: 'any', targetNodeId: 'submitted', priority: 0 },
    ],
  },

  edit_request: {
    id: 'edit_request',
    type: 'capture',
    message: 'No problem — what would you like to change? Just type your update and I\'ll adjust it.',
    allowFreeText: true,
    freeTextPlaceholder: 'Describe what you want to change...',
    edges: [
      { condition: 'any', targetNodeId: 'review', priority: 0 },
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
    import_supplier_known: ['import goods', 'importing', 'supplier', 'procurement', 'source from'],
    ship_destination: ['ship', 'send', 'deliver', 'package', 'parcel', 'courier', 'dispatch'],
    freight_type: ['freight', 'cargo', 'container', 'fcl', 'lcl', 'bulk', 'heavy'],
    warehouse_type: ['warehouse', 'storage', 'store', 'inventory', 'stock', 'fulfillment', 'fulfill', 'fulfilment', 'pick and pack', 'ecommerce fulfillment'],
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
