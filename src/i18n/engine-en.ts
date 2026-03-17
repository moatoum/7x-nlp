// Engine conversation node translations — English
// Keyed by nodeId, each entry has: message, chips (keyed by chip id), freeTextPlaceholder

import type { RequestFields } from '@/engine/types';

export interface EngineNodeStrings {
  message: string | ((context: RequestFields) => string);
  chips?: Record<string, string>;
  freeTextPlaceholder?: string;
}

const engineEn: Record<string, EngineNodeStrings> = {
  // === PHASE 0: ENTITY TYPE GATE ===
  entity_type: {
    message: 'Welcome to LINK. Before we begin, are you...',
    chips: {
      business: 'A business',
      government: 'A governmental entity',
      individual: 'An individual',
    },
  },
  individual_redirect: {
    message: 'This platform is designed for businesses and government entities. For individual shipping needs, you can reach out to NXN support team on +971600569696 \u2013 Monday to Saturday 8:00 AM \u2013 6:00 PM, or send your request to support@nxn.ae to get a reply within 24 hours.',
    chips: {
      actually_business: "I'm actually a business",
      go_nxn: 'Go to nxn.ae',
    },
  },

  // === PHASE 1: WELCOME ===
  welcome: {
    message: "Welcome to LINK. I'm here to help you find the right logistics solution.\n\nWhat are you looking to do?",
    chips: {
      ship_parcels: 'Ship packages or parcels',
      freight: 'Move large cargo or freight',
      warehouse: 'Warehousing & Fulfilment',
      returns: 'Handle returns or repairs',
      customs: 'Customs and trade services',
      postal: 'Postal and mail services',
      import_goods: 'Import goods from a supplier',
      unsure: "I'm not sure yet",
    },
    freeTextPlaceholder: 'Or describe what you need...',
  },

  // === UNSURE PATH ===
  unsure_guide: {
    message: 'No problem \u2014 let me help narrow things down.\n\nWhich of these best describes your situation?',
    chips: {
      need_pickup: 'I need something picked up',
      need_delivery: 'I need something delivered',
      need_storage: 'I need to store goods',
      need_ship_intl: 'I need to ship internationally',
      need_help_ops: 'I have an operational challenge',
    },
    freeTextPlaceholder: 'Describe your situation...',
  },
  unsure_delivery_destination: {
    message: 'Where do your shipments need to go?',
    chips: {
      domestic: 'Within the UAE',
      gcc: 'GCC countries',
      international: 'International',
      mixed: 'Multiple destinations',
    },
  },
  ops_challenge: {
    message: 'Tell me more about your challenge. What area does it relate to?',
    chips: {
      ops_delayed: 'Stuck or delayed shipments',
      ops_cost: 'Reducing logistics costs',
      ops_scale: 'Scaling operations',
      ops_other: 'Something else',
    },
  },

  // === SHIPPING / PARCELS PATH ===
  ship_destination: {
    message: 'Where do your shipments need to go?',
    chips: {
      domestic: 'Within the UAE',
      gcc: 'GCC countries',
      international: 'International',
    },
  },
  domestic_speed: {
    message: 'How quickly do you need deliveries completed?',
    chips: {
      on_demand: 'On Demand Delivery',
      same_day: 'Same day',
      next_day: 'Next day',
    },
  },
  gcc_urgency: {
    message: 'How urgent is this?',
    chips: {
      immediate: 'Immediate / ASAP',
      this_week: 'This week',
      planning: 'Planning ahead',
      exploring: 'Just exploring options',
    },
  },
  gcc_speed: {
    message: 'What shipping speed do you need?',
    chips: {
      express: 'Express (fastest)',
      standard: 'Standard',
      economy: 'Economy / deferred',
    },
  },
  gcc_goods_type: {
    message: 'What type of goods are you shipping across the GCC?',
    chips: {
      general: 'General cargo',
      perishable: 'Perishable goods',
      heavy: 'Heavy / oversized',
      dangerous: 'Dangerous Goods',
      others: 'Others',
    },
  },
  international_speed: {
    message: 'What shipping speed do you need?',
    chips: {
      express: 'Express (fastest)',
      standard: 'Standard',
      economy: 'Economy / deferred',
    },
  },
  intl_goods_type: {
    message: 'What type of goods are you shipping internationally?',
    chips: {
      general: 'General cargo',
      perishable: 'Perishable goods',
      heavy: 'Heavy / oversized',
      dangerous: 'Dangerous Goods',
      others: 'Others',
    },
  },

  // === PICKUP PATH ===
  pickup_scope: {
    message: 'What kind of pickup do you need?',
    chips: {
      scheduled: 'Regular scheduled pickup',
      on_demand: 'One-time / on-demand',
      vendor: 'Vendor / supplier collection',
    },
  },

  // === FREIGHT PATH ===
  freight_type: {
    message: 'What type of freight service do you need?',
    chips: {
      air_freight: 'Air freight',
      sea_freight: 'Sea freight',
      road_freight: 'Road freight / Trucking',
      not_sure: 'Not sure \u2014 advise me',
    },
  },
  truck_type: {
    message: 'What kind of trucking do you need?',
    chips: {
      ftl: 'Full truckload (FTL)',
      ltl: 'Less than truckload (LTL)',
      heavy: 'Heavy / oversized',
    },
  },
  freight_road_urgency: {
    message: 'How urgent is this?',
    chips: {
      immediate: 'Immediate / ASAP',
      this_week: 'This week',
      planning: 'Planning ahead',
      exploring: 'Just exploring options',
    },
  },
  freight_road_destination: {
    message: 'What are your top destinations?',
    chips: {
      uae: 'UAE',
      ksa: 'KSA',
      kuwait: 'Kuwait',
      bahrain: 'Bahrain',
      oman: 'Oman',
      qatar: 'Qatar',
      others: 'Others',
    },
    freeTextPlaceholder: 'Or type destination...',
  },
  freight_volume: {
    message: 'How much cargo are you shipping?',
    chips: {
      fcl: 'Full container (FCL)',
      lcl: 'Less than container (LCL)',
      pallets: 'Pallets / crates',
      oversized: 'Oversized / project cargo',
    },
  },
  freight_air_sea_destination: {
    message: 'What is your top destination region?',
    chips: {
      gcc: 'GCC',
      europe: 'Europe',
      usa: 'USA',
      africa: 'Africa',
      asia: 'Asia',
    },
    freeTextPlaceholder: 'Or type region...',
  },

  // === WAREHOUSING PATH ===
  warehouse_type: {
    message: 'What type of warehousing do you need?',
    chips: {
      general_mainland: 'General storage Mainland',
      micro_fulfilment: 'Micro Fulfilment',
      general_freezone: 'General Storage Freezone',
      high_value: 'High value / secure',
      ecommerce_fulfilment: 'E-commerce Fulfilment',
      cold_storage: 'Cold Storage',
    },
  },
  warehouse_storage_type: {
    message: 'What type of storage do you need?',
    chips: {
      pallets: 'Pallets',
      cartons: 'Cartons',
      pieces: 'Pieces',
    },
  },
  warehouse_storage_volume: {
    message: ((context: RequestFields) => {
      const unit = context.storageType === 'Pieces' ? 'Pieces' : 'CBM';
      return `What's your expected monthly storage in ${unit}?`;
    }),
    chips: {
      under_100: 'Under 100',
      '100_1000': '100 - 1,000',
      '1000_10000': '1,000 - 10,000',
      over_10000: '10,000+',
    },
  },
  warehouse_io_volume: {
    message: ((context: RequestFields) => {
      const unit = context.storageType === 'Pieces' ? 'Pieces' : 'CBM';
      return `What's your expected monthly inbound/outbound volume in ${unit}?`;
    }),
    chips: {
      under_100: 'Under 100',
      '100_1000': '100 - 1,000',
      '1000_10000': '1,000 - 10,000',
      over_10000: '10,000+',
    },
  },
  warehouse_business_type: {
    message: 'What industry is your business in?',
    chips: {
      ecommerce: 'E-commerce / D2C',
      retail: 'Retail',
      healthcare: 'Healthcare / Pharma',
      manufacturing: 'Manufacturing',
      food: 'Food & Beverage',
      government: 'Government',
      other: 'Other',
    },
    freeTextPlaceholder: 'Or type your industry...',
  },

  // === RETURNS PATH ===
  returns_type: {
    message: 'What type of returns or reverse logistics do you need?',
    chips: {
      customer_returns: 'Customer Initiated Returns (e-commerce)',
      warranty: 'Warranty / defective returns',
      repair: 'Return & Repair logistics',
    },
  },

  // === CUSTOMS PATH ===
  customs_type: {
    message: 'What trade or customs service do you need?',
    chips: {
      import: 'Import clearance',
      export: 'Export clearance',
      compliance: 'Regulatory compliance',
      dg_docs: 'Dangerous goods documentation',
    },
  },

  // === POSTAL PATH ===
  postal_type: {
    message: 'What postal service are you looking for?',
    chips: {
      letter: 'Letter mail',
      registered: 'Registered / secure mail',
      postal_shipping: 'Postal Shipping',
    },
  },

  // === IMPORT GOODS PATH ===
  import_supplier_known: {
    message: 'Do you already have an established supplier for the goods you want to import?',
    chips: {
      yes: 'Yes, I have a supplier',
      exploring: 'Still exploring suppliers',
    },
  },
  import_exploring_redirect: {
    message: "No worries \u2014 one of our experts can help you find the right supplier and guide you through the import process. Request a callback and we'll get back to you shortly.",
    chips: {
      request_callback: 'Request a callback',
      have_supplier: 'Actually, I have a supplier',
    },
  },
  import_supplier_country: {
    message: 'Which country or region is your supplier based in?',
    chips: {
      china: 'China',
      india: 'India',
      turkey: 'Turkey',
      europe: 'Europe',
      usa: 'USA',
      other: 'Other',
    },
    freeTextPlaceholder: 'Country or region name',
  },
  import_goods_category: {
    message: 'What type of goods are you importing?',
    chips: {
      raw_materials: 'Raw materials',
      components: 'Components / parts',
      finished: 'Finished products',
      machinery: 'Machinery / equipment',
      textiles: 'Textiles / garments',
      food: 'Food / perishables',
    },
    freeTextPlaceholder: 'Or describe your goods...',
  },
  import_incoterms: {
    message: 'What shipping terms (Incoterms) have you agreed with your supplier?',
    chips: {
      fob: 'FOB (Free on Board)',
      cif: 'CIF (Cost, Insurance & Freight)',
      exw: 'EXW (Ex Works)',
      ddp: 'DDP (Delivered Duty Paid)',
      not_sure: 'Not sure yet',
    },
  },
  import_cargo_volume: {
    message: "What's the expected volume per shipment?",
    chips: {
      small: 'Less than 1 CBM',
      medium: '1 - 5 CBM',
      fcl_20: 'Full container (20ft)',
      fcl_40: 'Full container (40ft)',
      multi: 'Multiple containers',
      not_sure: 'Not sure yet',
    },
  },
  import_customs: {
    message: 'Do you need customs clearance assistance for importing into the UAE?',
    chips: {
      yes: 'Yes, I need help',
      no: 'No, we handle it',
      not_sure: 'Not sure',
    },
  },
  import_frequency: {
    message: 'How often do you expect to import shipments?',
    chips: {
      one_time: 'One-time shipment',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      weekly: 'Weekly or more',
    },
  },

  // === SHARED NODES ===
  special_requirements: {
    message: 'Do any of these apply to your shipments?',
    chips: {
      temperature: 'Temperature sensitive',
      high_value: 'High value items',
      dangerous: 'Dangerous / hazardous goods',
      fragile: 'Fragile / special handling',
      oversized: 'Oversized or heavy',
      none: 'None of these',
    },
  },
  urgency: {
    message: 'How urgent is this?',
    chips: {
      immediate: 'Immediate / ASAP',
      this_week: 'This week',
      planning: 'Planning ahead',
      exploring: 'Just exploring options',
    },
  },
  business_type: {
    message: 'What industry is your business in?',
    chips: {
      ecommerce: 'E-commerce / D2C',
      retail: 'Retail',
      healthcare: 'Healthcare / Pharma',
      manufacturing: 'Manufacturing',
      food: 'Food & Beverage',
      government: 'Government',
      other: 'Other',
    },
    freeTextPlaceholder: 'Or type your industry...',
  },
  volume: {
    message: "What's your expected monthly volume?",
    chips: {
      under_100: 'Under 100 shipments',
      '100_1000': '100 - 1,000',
      '1000_10000': '1,000 - 10,000',
      over_10000: '10,000+',
    },
  },
  origin_location: {
    message: 'Where are you based? This helps us match local services.',
    chips: {
      dubai: 'Dubai',
      abu_dhabi: 'Abu Dhabi',
      sharjah: 'Sharjah',
      other_uae: 'Other UAE',
      outside_uae: 'Outside UAE',
    },
    freeTextPlaceholder: 'Or type your location...',
  },

  // === PRE-RECOMMENDATION FILL NODES ===
  _fill_destination: {
    message: 'One more thing \u2014 where do your shipments need to go?',
    chips: {
      domestic: 'Within the UAE',
      gcc: 'GCC countries',
      international: 'International',
      mixed: 'Multiple destinations',
    },
  },
  _fill_urgency: {
    message: 'How urgent is this?',
    chips: {
      immediate: 'Immediate / ASAP',
      this_week: 'This week',
      planning: 'Planning ahead',
      exploring: 'Just exploring options',
    },
  },
  _fill_business_type: {
    message: 'What industry is your business in?',
    chips: {
      ecommerce: 'E-commerce / D2C',
      retail: 'Retail',
      healthcare: 'Healthcare / Pharma',
      manufacturing: 'Manufacturing',
      food: 'Food & Beverage',
      government: 'Government',
      other: 'Other',
    },
  },
  _fill_volume: {
    message: "What's your expected monthly volume?",
    chips: {
      under_100: 'Under 100 shipments',
      '100_1000': '100 - 1,000',
      '1000_10000': '1,000 - 10,000',
      over_10000: '10,000+',
    },
  },
  _fill_origin: {
    message: 'Where are you based?',
    chips: {
      dubai: 'Dubai',
      abu_dhabi: 'Abu Dhabi',
      sharjah: 'Sharjah',
      other_uae: 'Other UAE',
      outside_uae: 'Outside UAE',
    },
  },

  // === RECOMMENDATION ===
  recommendation: {
    message: "Based on what you've told me, here are the services I'd recommend:",
  },
  recommendation_response: {
    message: 'Do these look right for your needs?',
    chips: {
      proceed: "Yes, let's proceed",
      refine: 'Refine these results',
      different: 'I need something different',
      restart: 'Start over',
    },
  },
  refine_recommendation: {
    message: "I'd like to find better options for you. Could you tell me what wasn't quite right? For example:\n- The services didn't match your specific need\n- You need a different type of service\n- Your requirements have changed",
    freeTextPlaceholder: 'Tell me what you need differently...',
  },

  // === CURRENT PROVIDER ===
  current_provider: {
    message: 'Who is your current transportation and logistics provider?',
    freeTextPlaceholder: 'Type your current provider name...',
  },

  // === CONTACT CAPTURE ===
  contact_name: {
    message: "Great \u2014 just a few details to finalize your request.\n\nWhat's your name?",
    freeTextPlaceholder: 'Your full name',
  },
  contact_email: {
    message: 'And your email address?',
    freeTextPlaceholder: 'you@company.com',
  },
  contact_phone: {
    message: "What's the best phone number to reach you?",
    freeTextPlaceholder: '+971 XX XXX XXXX',
  },
  contact_company: {
    message: 'What company are you with?',
    freeTextPlaceholder: 'Company name',
  },
  additional_info: {
    message: "Is there any additional information or anything else you'd like to let us know about?",
    freeTextPlaceholder: 'Type any additional details...',
  },

  // === REVIEW & SUBMIT ===
  review: {
    message: "Your request is ready to submit. Please review the summary panel and submit when you're satisfied.",
    chips: {
      submit: 'Submit Request',
      edit: 'I want to change something',
    },
  },
  edit_request: {
    message: "No problem \u2014 what would you like to change? Just type your update and I'll adjust it.",
    freeTextPlaceholder: 'Describe what you want to change...',
  },
  submitted: {
    message: '',
  },
};

export default engineEn;
