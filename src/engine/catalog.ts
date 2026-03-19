import type { Service } from './types';

export const SERVICE_CATALOG: Service[] = [
  // ===== FIRST MILE LOGISTICS =====
  { id: 'fm-scheduled', name: 'Scheduled Pickup', category: 'first_mile', subcategory: 'scheduled', description: 'Regular pickup from online merchants and fulfillment centers', verticals: ['ecommerce', 'retail'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fm-ondemand-sme', name: 'On-Demand Pickup', category: 'first_mile', subcategory: 'on_demand', description: 'Ad-hoc pickup requests from small businesses via digital platforms', verticals: ['sme', 'quick_commerce'], specialCapabilities: [], urgencyLevels: ['express', 'standard'], regions: ['domestic'] },
  { id: 'fm-vendor', name: 'Vendor Pickup', category: 'first_mile', subcategory: 'vendor', description: 'Collection of components and materials from suppliers', verticals: ['manufacturing', 'automotive'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fm-temp', name: 'Temperature Controlled Pickup', category: 'first_mile', subcategory: 'temperature', description: 'Pickup of chilled, frozen, or temperature sensitive products', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['express', 'standard'], regions: ['domestic'] },
  { id: 'fm-secure', name: 'Secure Pickup', category: 'first_mile', subcategory: 'secure', description: 'Secure pickup of high value shipments', verticals: ['luxury'], specialCapabilities: ['high_value'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fm-dg', name: 'Dangerous Goods Pickup', category: 'first_mile', subcategory: 'dangerous_goods', description: 'Certified pickup of hazardous chemical shipments', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== DOMESTIC COURIER & PARCEL =====
  { id: 'dc-sameday', name: 'Same Day Delivery', category: 'domestic_courier', subcategory: 'same_day', description: 'Ultra fast delivery from urban micro hubs', verticals: ['quick_commerce', 'healthcare'], specialCapabilities: [], urgencyLevels: ['same_day'], regions: ['domestic'] },
  { id: 'dc-nextday', name: 'Next Day Delivery', category: 'domestic_courier', subcategory: 'next_day', description: 'Standard next day delivery for online retail and replenishment', verticals: ['ecommerce', 'retail'], specialCapabilities: [], urgencyLevels: ['next_day'], regions: ['domestic'] },
  { id: 'dc-temp', name: 'Temperature Controlled Delivery', category: 'domestic_courier', subcategory: 'temperature', description: 'Delivery of chilled, frozen food and medicines', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['same_day', 'next_day'], regions: ['domestic'] },
  { id: 'dc-highvalue', name: 'High Value Delivery', category: 'domestic_courier', subcategory: 'high_value', description: 'Secure delivery with insurance and verification', verticals: ['luxury', 'electronics'], specialCapabilities: ['high_value'], urgencyLevels: ['next_day'], regions: ['domestic'] },
  { id: 'dc-dg', name: 'Dangerous Goods Delivery', category: 'domestic_courier', subcategory: 'dangerous_goods', description: 'Transport of lithium battery shipments', verticals: ['electronics'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'dc-idverified', name: 'Identity Verified Delivery', category: 'domestic_courier', subcategory: 'id_verified', description: 'Delivery requiring ID or OTP authentication', verticals: ['government'], specialCapabilities: ['identity_verified'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== INTERNATIONAL PARCEL & CROSS BORDER =====
  { id: 'int-express', name: 'Global Express', category: 'international', subcategory: 'express', description: 'Fast cross border shipping for online retailers and luxury goods', verticals: ['ecommerce', 'luxury'], specialCapabilities: ['high_value'], urgencyLevels: ['express'], regions: ['international'] },
  { id: 'int-deferred', name: 'Deferred Shipping', category: 'international', subcategory: 'deferred', description: 'Lower cost international shipping solution', verticals: ['sme'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'int-crossborder', name: 'Cross Border Delivery', category: 'international', subcategory: 'cross_border', description: 'Logistics for global marketplace sellers', verticals: ['marketplace'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'int-temp', name: 'Temperature Controlled Shipping', category: 'international', subcategory: 'temperature', description: 'Cold chain international shipping for pharma and food', verticals: ['pharma', 'food'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['express', 'standard'], regions: ['international'] },
  { id: 'int-dg', name: 'Dangerous Goods Shipping', category: 'international', subcategory: 'dangerous_goods', description: 'International shipment of regulated hazardous cargo', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['international'] },

  // ===== FREIGHT FORWARDING =====
  { id: 'ff-air', name: 'Air Freight', category: 'freight', subcategory: 'air', description: 'Transport of manufacturing cargo via air', verticals: ['industrial', 'manufacturing'], specialCapabilities: [], urgencyLevels: ['express'], regions: ['international'] },
  { id: 'ff-aircharter', name: 'Air Freight Charter', category: 'freight', subcategory: 'air_charter', description: 'Dedicated aircraft for urgent cargo', verticals: ['emergency'], specialCapabilities: [], urgencyLevels: ['same_day', 'express'], regions: ['international'] },
  { id: 'ff-seafcl', name: 'Sea Freight FCL', category: 'freight', subcategory: 'sea_fcl', description: 'Full container shipping for industrial cargo', verticals: ['manufacturing'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'ff-sealcl', name: 'Sea Freight LCL', category: 'freight', subcategory: 'sea_lcl', description: 'Shared container shipping for small exporters', verticals: ['sme'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'ff-reefer', name: 'Reefer Container', category: 'freight', subcategory: 'reefer', description: 'Refrigerated container shipping for perishables and pharma', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'ff-breakbulk', name: 'Breakbulk Shipping', category: 'freight', subcategory: 'breakbulk', description: 'Shipping of oversized industrial equipment', verticals: ['heavy_industry'], specialCapabilities: ['oversized'], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'ff-dgair', name: 'Dangerous Goods Air Freight', category: 'freight', subcategory: 'dg_air', description: 'Air shipment of hazardous cargo under IATA rules', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['express'], regions: ['international'] },
  { id: 'ff-dgsea', name: 'Dangerous Goods Sea Freight', category: 'freight', subcategory: 'dg_sea', description: 'Ocean shipping of hazardous energy materials', verticals: ['energy'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['international'] },

  // ===== ROAD FREIGHT & TRUCKING =====
  { id: 'rt-ftl', name: 'Full Truckload', category: 'road_freight', subcategory: 'ftl', description: 'Dedicated trucks transporting industrial goods', verticals: ['manufacturing'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic', 'gcc'] },
  { id: 'rt-ltl', name: 'Less Than Truckload', category: 'road_freight', subcategory: 'ltl', description: 'Shared truck capacity for smaller shipments', verticals: ['sme'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rt-crossborder', name: 'Cross Border Trucking', category: 'road_freight', subcategory: 'cross_border', description: 'Regional trucking across GCC markets', verticals: ['gcc_trade'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['gcc'] },
  { id: 'rt-express', name: 'Express Trucking', category: 'road_freight', subcategory: 'express', description: 'Rapid delivery of time critical industrial parts', verticals: ['spare_parts'], specialCapabilities: [], urgencyLevels: ['express'], regions: ['domestic'] },
  { id: 'rt-temp', name: 'Temperature Controlled Trucking', category: 'road_freight', subcategory: 'temperature', description: 'Refrigerated road transport for perishables and pharma', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['standard'], regions: ['domestic', 'gcc'] },
  { id: 'rt-dg', name: 'Dangerous Goods Trucking', category: 'road_freight', subcategory: 'dangerous_goods', description: 'Specialized trucking for hazardous materials', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rt-heavy', name: 'Heavy Haul Transport', category: 'road_freight', subcategory: 'heavy_haul', description: 'Transport of oversized construction equipment', verticals: ['construction'], specialCapabilities: ['oversized'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== WAREHOUSING & STORAGE =====
  { id: 'ws-general', name: 'General Warehousing', category: 'warehousing', subcategory: 'general', description: 'Storage of retail, consumer and industrial inventory', verticals: ['consumer_goods', 'industrial'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ws-bonded', name: 'Bonded Warehousing', category: 'warehousing', subcategory: 'bonded', description: 'Duty deferred storage for imported goods', verticals: ['international_trade'], specialCapabilities: ['bonded'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ws-cold', name: 'Cold Storage', category: 'warehousing', subcategory: 'cold', description: 'Refrigerated warehousing for perishable food and pharma', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ws-highvalue', name: 'High Value Storage', category: 'warehousing', subcategory: 'high_value', description: 'Secure vault storage for high value goods', verticals: ['luxury'], specialCapabilities: ['high_value'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ws-spareparts', name: 'Spare Parts Storage', category: 'warehousing', subcategory: 'spare_parts', description: 'Storage of automotive spare parts', verticals: ['automotive'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ws-micro', name: 'Micro Fulfillment', category: 'warehousing', subcategory: 'micro', description: 'Urban fulfillment enabling rapid delivery', verticals: ['quick_commerce'], specialCapabilities: [], urgencyLevels: ['express'], regions: ['domestic'] },
  { id: 'ws-hazardous', name: 'Hazardous Goods Storage', category: 'warehousing', subcategory: 'hazardous', description: 'Storage of dangerous goods in compliant facilities', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== FULFILLMENT SERVICES =====
  { id: 'fs-pickpack', name: 'Pick & Pack', category: 'fulfillment', subcategory: 'pick_pack', description: 'Order picking and packing for online retail shipments', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fs-fashion', name: 'Fashion Fulfillment', category: 'fulfillment', subcategory: 'fashion', description: 'Handling and distribution of fashion products', verticals: ['apparel'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fs-electronics', name: 'Electronics Fulfillment', category: 'fulfillment', subcategory: 'electronics', description: 'Specialized handling of electronic goods', verticals: ['electronics'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fs-multichannel', name: 'Multi Channel Fulfillment', category: 'fulfillment', subcategory: 'multi_channel', description: 'Serving orders across multiple channels', verticals: ['omnichannel_retail'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'fs-grocery', name: 'Grocery Fulfillment', category: 'fulfillment', subcategory: 'grocery', description: 'Rapid grocery order processing', verticals: ['quick_commerce'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['express'], regions: ['domestic'] },
  { id: 'fs-dg', name: 'DG Fulfillment', category: 'fulfillment', subcategory: 'dg', description: 'Fulfillment for products containing lithium batteries', verticals: ['electronics'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== LAST MILE DELIVERY =====
  { id: 'lm-home', name: 'Home Delivery', category: 'last_mile', subcategory: 'home', description: 'Parcel delivery to residential customers and groceries', verticals: ['ecommerce', 'grocery'], specialCapabilities: [], urgencyLevels: ['same_day', 'next_day', 'standard'], regions: ['domestic'] },
  { id: 'lm-furniture', name: 'Furniture Delivery', category: 'last_mile', subcategory: 'furniture', description: 'Delivery of bulky furniture items', verticals: ['home_furniture'], specialCapabilities: ['oversized'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'lm-locker', name: 'Locker Delivery', category: 'last_mile', subcategory: 'locker', description: 'Delivery to automated parcel lockers', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'lm-clickcollect', name: 'Click & Collect', category: 'last_mile', subcategory: 'click_collect', description: 'Delivery to stores for customer pickup', verticals: ['retail'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'lm-temp', name: 'Temperature Controlled Delivery', category: 'last_mile', subcategory: 'temperature', description: 'Last mile chilled, frozen and controlled temperature delivery', verticals: ['food', 'pharma'], specialCapabilities: ['temperature_controlled'], urgencyLevels: ['same_day', 'next_day'], regions: ['domestic'] },
  { id: 'lm-secure', name: 'Secure Delivery', category: 'last_mile', subcategory: 'secure', description: 'High security last mile delivery', verticals: ['luxury'], specialCapabilities: ['high_value'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'lm-dg', name: 'DG Certified Delivery', category: 'last_mile', subcategory: 'dg', description: 'Delivery of small dangerous goods shipments', verticals: ['industrial'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== REVERSE LOGISTICS =====
  { id: 'rl-returns', name: 'Customer Returns', category: 'reverse_logistics', subcategory: 'returns', description: 'Collection and processing of returned online orders', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rl-warranty', name: 'Warranty Returns', category: 'reverse_logistics', subcategory: 'warranty', description: 'Return of defective devices to manufacturers', verticals: ['electronics'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rl-repair', name: 'Repair Logistics', category: 'reverse_logistics', subcategory: 'repair', description: 'Transport of equipment to repair facilities', verticals: ['industrial'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rl-battery', name: 'Battery Recycling', category: 'reverse_logistics', subcategory: 'recycling', description: 'Collection of used lithium batteries', verticals: ['electronics'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'rl-hazardous', name: 'Hazardous Waste Returns', category: 'reverse_logistics', subcategory: 'hazardous', description: 'Return logistics for hazardous waste disposal', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['domestic'] },

  // ===== TRADE & CUSTOMS =====
  { id: 'tc-import', name: 'Import Clearance', category: 'trade_customs', subcategory: 'import', description: 'Customs clearance for cross border and manufacturing imports', verticals: ['ecommerce', 'industrial'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'tc-export', name: 'Export Clearance', category: 'trade_customs', subcategory: 'export', description: 'Export documentation and customs processing', verticals: ['sme'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'tc-compliance', name: 'Regulatory Compliance', category: 'trade_customs', subcategory: 'compliance', description: 'Compliance with pharmaceutical regulations', verticals: ['pharma'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'tc-dg', name: 'DG Documentation', category: 'trade_customs', subcategory: 'dg_docs', description: 'Preparation of dangerous goods declarations', verticals: ['chemicals'], specialCapabilities: ['dangerous_goods'], urgencyLevels: ['standard'], regions: ['international'] },

  // ===== POSTAL SERVICES =====
  { id: 'ps-lettermail', name: 'Letter Mail', category: 'postal', subcategory: 'letter', description: 'Delivery of personal and corporate correspondence', verticals: ['consumer', 'business'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ps-registered', name: 'Registered Mail', category: 'postal', subcategory: 'registered', description: 'Secure delivery of legal documents', verticals: ['legal'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ps-parcels', name: 'Postal Parcels', category: 'postal', subcategory: 'parcels', description: 'Parcel delivery through postal networks', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ps-crossborder', name: 'Cross Border Small Packets', category: 'postal', subcategory: 'cross_border', description: 'International small packet shipping', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['international'] },
  { id: 'ps-directmail', name: 'Direct Mail', category: 'postal', subcategory: 'direct_mail', description: 'Distribution of marketing materials', verticals: ['marketing'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ps-lockers', name: 'Postal Lockers', category: 'postal', subcategory: 'lockers', description: 'Automated lockers for parcel pickup and returns', verticals: ['ecommerce'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic'] },
  { id: 'ps-financial', name: 'Postal Financial Services', category: 'postal', subcategory: 'financial', description: 'Money transfer and financial services via postal networks', verticals: ['remittances'], specialCapabilities: [], urgencyLevels: ['standard'], regions: ['domestic', 'international'] },
];

export const CATEGORY_LABELS: Record<string, string> = {
  first_mile: 'First Mile Logistics',
  domestic_courier: 'Domestic Courier & Parcel',
  international: 'International Parcel & Cross Border',
  freight: 'Freight Forwarding',
  road_freight: 'Road Freight & Trucking',
  warehousing: 'Warehousing & Storage',
  fulfillment: 'Fulfillment Services',
  last_mile: 'Last Mile Delivery',
  reverse_logistics: 'Reverse Logistics',
  trade_customs: 'Trade & Customs',
  postal: 'Postal Services',
};

export const CATEGORY_LABELS_AR: Record<string, string> = {
  first_mile: '\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A\u0629 \u0644\u0644\u0645\u064A\u0644 \u0627\u0644\u0623\u0648\u0644',
  domestic_courier: '\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u0637\u0631\u0648\u062F \u0627\u0644\u0645\u062D\u0644\u064A\u0629',
  international: '\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u0637\u0631\u0648\u062F \u0627\u0644\u062F\u0648\u0644\u064A\u0629',
  freight: '\u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u062C\u0648\u064A \u0648\u0627\u0644\u0628\u062D\u0631\u064A',
  road_freight: '\u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0628\u0631\u064A \u0648\u0627\u0644\u0646\u0642\u0644 \u0628\u0627\u0644\u0634\u0627\u062D\u0646\u0627\u062A',
  warehousing: '\u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A',
  fulfillment: '\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u0646\u0641\u064A\u0630',
  last_mile: '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u064A\u0644 \u0627\u0644\u0623\u062E\u064A\u0631',
  reverse_logistics: '\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A\u0629 \u0627\u0644\u0639\u0643\u0633\u064A\u0629',
  trade_customs: '\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0648\u0627\u0644\u062C\u0645\u0627\u0631\u0643',
  postal: '\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629',
};

export const SERVICE_NAMES_AR: Record<string, string> = {
  // First Mile
  'fm-scheduled': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u062C\u062F\u0648\u0644',
  'fm-ondemand-sme': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628',
  'fm-vendor': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F',
  'fm-temp': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'fm-secure': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0622\u0645\u0646',
  'fm-dg': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0628\u0636\u0627\u0626\u0639 \u062E\u0637\u0631\u0629',
  // Domestic Courier
  'dc-sameday': '\u062A\u0648\u0635\u064A\u0644 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645',
  'dc-nextday': '\u062A\u0648\u0635\u064A\u0644 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A',
  'dc-temp': '\u062A\u0648\u0635\u064A\u0644 \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'dc-highvalue': '\u062A\u0648\u0635\u064A\u0644 \u0639\u0627\u0644\u064A \u0627\u0644\u0642\u064A\u0645\u0629',
  'dc-dg': '\u062A\u0648\u0635\u064A\u0644 \u0628\u0636\u0627\u0626\u0639 \u062E\u0637\u0631\u0629',
  'dc-idverified': '\u062A\u0648\u0635\u064A\u0644 \u0628\u062A\u062D\u0642\u0642 \u0627\u0644\u0647\u0648\u064A\u0629',
  // International
  'int-express': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0633\u0631\u064A\u0639',
  'int-deferred': '\u0634\u062D\u0646 \u0645\u0624\u062C\u0644',
  'int-crossborder': '\u062A\u0648\u0635\u064A\u0644 \u0639\u0628\u0631 \u0627\u0644\u062D\u062F\u0648\u062F',
  'int-temp': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'int-dg': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Freight
  'ff-air': '\u0634\u062D\u0646 \u062C\u0648\u064A',
  'ff-aircharter': '\u0637\u0627\u0626\u0631\u0629 \u0634\u062D\u0646 \u0645\u062E\u0635\u0635\u0629',
  'ff-seafcl': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A - \u062D\u0627\u0648\u064A\u0629 \u0643\u0627\u0645\u0644\u0629',
  'ff-sealcl': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A - \u062D\u0627\u0648\u064A\u0629 \u0645\u0634\u062A\u0631\u0643\u0629',
  'ff-reefer': '\u062D\u0627\u0648\u064A\u0629 \u0645\u0628\u0631\u062F\u0629',
  'ff-breakbulk': '\u0634\u062D\u0646 \u0628\u0636\u0627\u0626\u0639 \u0643\u0628\u064A\u0631\u0629',
  'ff-dgair': '\u0634\u062D\u0646 \u062C\u0648\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  'ff-dgsea': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Road Freight
  'rt-ftl': '\u062D\u0645\u0648\u0644\u0629 \u0634\u0627\u062D\u0646\u0629 \u0643\u0627\u0645\u0644\u0629',
  'rt-ltl': '\u0623\u0642\u0644 \u0645\u0646 \u062D\u0645\u0648\u0644\u0629 \u0634\u0627\u062D\u0646\u0629',
  'rt-crossborder': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0639\u0628\u0631 \u0627\u0644\u062D\u062F\u0648\u062F',
  'rt-express': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0633\u0631\u064A\u0639',
  'rt-temp': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'rt-dg': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  'rt-heavy': '\u0646\u0642\u0644 \u0627\u0644\u0623\u062D\u0645\u0627\u0644 \u0627\u0644\u062B\u0642\u064A\u0644\u0629',
  // Warehousing
  'ws-general': '\u062A\u062E\u0632\u064A\u0646 \u0639\u0627\u0645',
  'ws-bonded': '\u062A\u062E\u0632\u064A\u0646 \u062C\u0645\u0631\u0643\u064A',
  'ws-cold': '\u062A\u062E\u0632\u064A\u0646 \u0628\u0627\u0631\u062F',
  'ws-highvalue': '\u062A\u062E\u0632\u064A\u0646 \u0639\u0627\u0644\u064A \u0627\u0644\u0642\u064A\u0645\u0629',
  'ws-spareparts': '\u062A\u062E\u0632\u064A\u0646 \u0642\u0637\u0639 \u0627\u0644\u063A\u064A\u0627\u0631',
  'ws-micro': '\u062A\u0646\u0641\u064A\u0630 \u0645\u0635\u063A\u0631',
  'ws-hazardous': '\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Fulfillment
  'fs-pickpack': '\u062A\u062C\u0645\u064A\u0639 \u0648\u062A\u063A\u0644\u064A\u0641',
  'fs-fashion': '\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0623\u0632\u064A\u0627\u0621',
  'fs-electronics': '\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A',
  'fs-multichannel': '\u062A\u0646\u0641\u064A\u0630 \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0642\u0646\u0648\u0627\u062A',
  'fs-grocery': '\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0628\u0642\u0627\u0644\u0629',
  'fs-dg': '\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Last Mile
  'lm-home': '\u062A\u0648\u0635\u064A\u0644 \u0645\u0646\u0632\u0644\u064A',
  'lm-furniture': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0623\u062B\u0627\u062B',
  'lm-locker': '\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u062E\u0632\u0627\u0626\u0646',
  'lm-clickcollect': '\u0627\u0637\u0644\u0628 \u0648\u0627\u0633\u062A\u0644\u0645',
  'lm-temp': '\u062A\u0648\u0635\u064A\u0644 \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'lm-secure': '\u062A\u0648\u0635\u064A\u0644 \u0622\u0645\u0646',
  'lm-dg': '\u062A\u0648\u0635\u064A\u0644 \u0628\u0636\u0627\u0626\u0639 \u062E\u0637\u0631\u0629 \u0645\u0639\u062A\u0645\u062F',
  // Reverse Logistics
  'rl-returns': '\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0639\u0645\u0644\u0627\u0621',
  'rl-warranty': '\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0636\u0645\u0627\u0646',
  'rl-repair': '\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0625\u0635\u0644\u0627\u062D \u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A\u0629',
  'rl-battery': '\u0625\u0639\u0627\u062F\u0629 \u062A\u062F\u0648\u064A\u0631 \u0627\u0644\u0628\u0637\u0627\u0631\u064A\u0627\u062A',
  'rl-hazardous': '\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0646\u0641\u0627\u064A\u0627\u062A \u0627\u0644\u062E\u0637\u0631\u0629',
  // Trade & Customs
  'tc-import': '\u062A\u062E\u0644\u064A\u0635 \u0627\u0633\u062A\u064A\u0631\u0627\u062F',
  'tc-export': '\u062A\u062E\u0644\u064A\u0635 \u062A\u0635\u062F\u064A\u0631',
  'tc-compliance': '\u0627\u0644\u062A\u0632\u0627\u0645 \u062A\u0646\u0638\u064A\u0645\u064A',
  'tc-dg': '\u0648\u062B\u0627\u0626\u0642 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Postal
  'ps-lettermail': '\u0628\u0631\u064A\u062F \u0639\u0627\u062F\u064A',
  'ps-registered': '\u0628\u0631\u064A\u062F \u0645\u0633\u062C\u0644',
  'ps-parcels': '\u0637\u0631\u0648\u062F \u0628\u0631\u064A\u062F\u064A\u0629',
  'ps-crossborder': '\u0637\u0631\u0648\u062F \u062F\u0648\u0644\u064A\u0629 \u0635\u063A\u064A\u0631\u0629',
  'ps-directmail': '\u0628\u0631\u064A\u062F \u0645\u0628\u0627\u0634\u0631',
  'ps-lockers': '\u062E\u0632\u0627\u0626\u0646 \u0628\u0631\u064A\u062F\u064A\u0629',
  'ps-financial': '\u062E\u062F\u0645\u0627\u062A \u0645\u0627\u0644\u064A\u0629 \u0628\u0631\u064A\u062F\u064A\u0629',
};

export const SERVICE_DESCRIPTIONS_AR: Record<string, string> = {
  // First Mile
  'fm-scheduled': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646\u062A\u0638\u0645 \u0645\u0646 \u0627\u0644\u062A\u062C\u0627\u0631 \u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0648\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062A\u0646\u0641\u064A\u0630',
  'fm-ondemand-sme': '\u0637\u0644\u0628\u0627\u062A \u0627\u0633\u062A\u0644\u0627\u0645 \u0641\u0648\u0631\u064A\u0629 \u0645\u0646 \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u0635\u063A\u064A\u0631\u0629',
  'fm-vendor': '\u062A\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0643\u0648\u0646\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u062F \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
  'fm-temp': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0628\u0631\u062F\u0629 \u0648\u0627\u0644\u0645\u062C\u0645\u062F\u0629 \u0648\u0627\u0644\u062D\u0633\u0627\u0633\u0629 \u0644\u0644\u062D\u0631\u0627\u0631\u0629',
  'fm-secure': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0622\u0645\u0646 \u0644\u0644\u0634\u062D\u0646\u0627\u062A \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0642\u064A\u0645\u0629',
  'fm-dg': '\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0639\u062A\u0645\u062F \u0644\u0644\u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0629 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Domestic Courier
  'dc-sameday': '\u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639 \u0645\u0646 \u0627\u0644\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062D\u0636\u0631\u064A\u0629',
  'dc-nextday': '\u062A\u0648\u0635\u064A\u0644 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A \u0644\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u0627\u0644\u062A\u062C\u0632\u0626\u0629',
  'dc-temp': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0623\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u0628\u0631\u062F\u0629 \u0648\u0627\u0644\u0645\u062C\u0645\u062F\u0629 \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629',
  'dc-highvalue': '\u062A\u0648\u0635\u064A\u0644 \u0622\u0645\u0646 \u0645\u0639 \u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0648\u0627\u0644\u062A\u062D\u0642\u0642',
  'dc-dg': '\u0646\u0642\u0644 \u0634\u062D\u0646\u0627\u062A \u0628\u0637\u0627\u0631\u064A\u0627\u062A \u0627\u0644\u0644\u064A\u062B\u064A\u0648\u0645',
  'dc-idverified': '\u062A\u0648\u0635\u064A\u0644 \u064A\u062A\u0637\u0644\u0628 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0647\u0648\u064A\u0629',
  // International
  'int-express': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0633\u0631\u064A\u0639 \u0644\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u0627\u0644\u0633\u0644\u0639 \u0627\u0644\u0641\u0627\u062E\u0631\u0629',
  'int-deferred': '\u062D\u0644 \u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0628\u062A\u0643\u0644\u0641\u0629 \u0623\u0642\u0644',
  'int-crossborder': '\u062E\u062F\u0645\u0627\u062A \u0644\u0648\u062C\u0633\u062A\u064A\u0629 \u0644\u0628\u0627\u0626\u0639\u064A \u0627\u0644\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629',
  'int-temp': '\u0633\u0644\u0633\u0644\u0629 \u062A\u0628\u0631\u064A\u062F \u062F\u0648\u0644\u064A\u0629 \u0644\u0644\u0623\u062F\u0648\u064A\u0629 \u0648\u0627\u0644\u0623\u063A\u0630\u064A\u0629',
  'int-dg': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629 \u0627\u0644\u0645\u0646\u0638\u0645\u0629',
  // Freight
  'ff-air': '\u0646\u0642\u0644 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u062C\u0648\u0627\u064B',
  'ff-aircharter': '\u0637\u0627\u0626\u0631\u0629 \u0645\u062E\u0635\u0635\u0629 \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u0639\u0627\u062C\u0644\u0629',
  'ff-seafcl': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A \u0628\u062D\u0627\u0648\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629',
  'ff-sealcl': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A \u0628\u062D\u0627\u0648\u064A\u0629 \u0645\u0634\u062A\u0631\u0643\u0629 \u0644\u0644\u0645\u0635\u062F\u0631\u064A\u0646 \u0627\u0644\u0635\u063A\u0627\u0631',
  'ff-reefer': '\u0634\u062D\u0646 \u0628\u062D\u0627\u0648\u064A\u0627\u062A \u0645\u0628\u0631\u062F\u0629 \u0644\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0644\u0641 \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629',
  'ff-breakbulk': '\u0634\u062D\u0646 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u0643\u0628\u064A\u0631\u0629 \u0627\u0644\u062D\u062C\u0645',
  'ff-dgair': '\u0634\u062D\u0646 \u062C\u0648\u064A \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629 \u0648\u0641\u0642 \u0642\u0648\u0627\u0639\u062F IATA',
  'ff-dgsea': '\u0634\u062D\u0646 \u0628\u062D\u0631\u064A \u0644\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062E\u0637\u0631\u0629 \u0641\u064A \u0642\u0637\u0627\u0639 \u0627\u0644\u0637\u0627\u0642\u0629',
  // Road Freight
  'rt-ftl': '\u0634\u0627\u062D\u0646\u0627\u062A \u0645\u062E\u0635\u0635\u0629 \u0644\u0646\u0642\u0644 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629',
  'rt-ltl': '\u0633\u0639\u0629 \u0634\u0627\u062D\u0646\u0629 \u0645\u0634\u062A\u0631\u0643\u0629 \u0644\u0644\u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0635\u063A\u064A\u0631\u0629',
  'rt-crossborder': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0625\u0642\u0644\u064A\u0645\u064A \u0639\u0628\u0631 \u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u062E\u0644\u064A\u062C',
  'rt-express': '\u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639 \u0644\u0644\u0642\u0637\u0639 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u0627\u0644\u0639\u0627\u062C\u0644\u0629',
  'rt-temp': '\u0646\u0642\u0644 \u0628\u0631\u064A \u0645\u0628\u0631\u062F \u0644\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0644\u0641 \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629',
  'rt-dg': '\u0646\u0642\u0644 \u0645\u062A\u062E\u0635\u0635 \u0644\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062E\u0637\u0631\u0629',
  'rt-heavy': '\u0646\u0642\u0644 \u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0628\u0646\u0627\u0621 \u0643\u0628\u064A\u0631\u0629 \u0627\u0644\u062D\u062C\u0645',
  // Warehousing
  'ws-general': '\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0627\u0633\u062A\u0647\u0644\u0627\u0643\u064A \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u064A',
  'ws-bonded': '\u062A\u062E\u0632\u064A\u0646 \u0645\u0639\u0641\u0649 \u0645\u0646 \u0627\u0644\u0631\u0633\u0648\u0645 \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u0645\u0633\u062A\u0648\u0631\u062F\u0629',
  'ws-cold': '\u062A\u062E\u0632\u064A\u0646 \u0645\u0628\u0631\u062F \u0644\u0644\u0623\u063A\u0630\u064A\u0629 \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0644\u0641',
  'ws-highvalue': '\u062A\u062E\u0632\u064A\u0646 \u0622\u0645\u0646 \u0644\u0644\u0628\u0636\u0627\u0626\u0639 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0642\u064A\u0645\u0629',
  'ws-spareparts': '\u062A\u062E\u0632\u064A\u0646 \u0642\u0637\u0639 \u063A\u064A\u0627\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A',
  'ws-micro': '\u062A\u0646\u0641\u064A\u0630 \u062D\u0636\u0631\u064A \u0644\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0639',
  'ws-hazardous': '\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629 \u0641\u064A \u0645\u0646\u0634\u0622\u062A \u0645\u0639\u062A\u0645\u062F\u0629',
  // Fulfillment
  'fs-pickpack': '\u062A\u062C\u0645\u064A\u0639 \u0648\u062A\u063A\u0644\u064A\u0641 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u062C\u0632\u0626\u0629 \u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A',
  'fs-fashion': '\u0645\u0646\u0627\u0648\u0644\u0629 \u0648\u062A\u0648\u0632\u064A\u0639 \u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0623\u0632\u064A\u0627\u0621',
  'fs-electronics': '\u0645\u0646\u0627\u0648\u0644\u0629 \u0645\u062A\u062E\u0635\u0635\u0629 \u0644\u0644\u0633\u0644\u0639 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629',
  'fs-multichannel': '\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0639\u0628\u0631 \u0642\u0646\u0648\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629',
  'fs-grocery': '\u0645\u0639\u0627\u0644\u062C\u0629 \u0633\u0631\u064A\u0639\u0629 \u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0628\u0642\u0627\u0644\u0629',
  'fs-dg': '\u062A\u0646\u0641\u064A\u0630 \u0644\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0628\u0637\u0627\u0631\u064A\u0627\u062A \u0644\u064A\u062B\u064A\u0648\u0645',
  // Last Mile
  'lm-home': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0637\u0631\u0648\u062F \u0625\u0644\u0649 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0633\u0643\u0646\u064A\u064A\u0646',
  'lm-furniture': '\u062A\u0648\u0635\u064A\u0644 \u0642\u0637\u0639 \u0627\u0644\u0623\u062B\u0627\u062B \u0627\u0644\u0643\u0628\u064A\u0631\u0629',
  'lm-locker': '\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 \u062E\u0632\u0627\u0626\u0646 \u0627\u0644\u0637\u0631\u0648\u062F \u0627\u0644\u0622\u0644\u064A\u0629',
  'lm-clickcollect': '\u062A\u0648\u0635\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0639\u0645\u064A\u0644',
  'lm-temp': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u064A\u0644 \u0627\u0644\u0623\u062E\u064A\u0631 \u0628\u062A\u062D\u0643\u0645 \u062D\u0631\u0627\u0631\u064A',
  'lm-secure': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u064A\u0644 \u0627\u0644\u0623\u062E\u064A\u0631 \u0628\u0623\u0645\u0627\u0646 \u0639\u0627\u0644\u064A',
  'lm-dg': '\u062A\u0648\u0635\u064A\u0644 \u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629 \u0627\u0644\u0635\u063A\u064A\u0631\u0629',
  // Reverse Logistics
  'rl-returns': '\u062A\u062C\u0645\u064A\u0639 \u0648\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0629',
  'rl-warranty': '\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0645\u0639\u064A\u0628\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u0635\u0646\u0639\u064A\u0646',
  'rl-repair': '\u0646\u0642\u0644 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0625\u0644\u0649 \u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u0625\u0635\u0644\u0627\u062D',
  'rl-battery': '\u062A\u062C\u0645\u064A\u0639 \u0628\u0637\u0627\u0631\u064A\u0627\u062A \u0627\u0644\u0644\u064A\u062B\u064A\u0648\u0645 \u0627\u0644\u0645\u0633\u062A\u0639\u0645\u0644\u0629',
  'rl-hazardous': '\u062E\u062F\u0645\u0627\u062A \u0644\u0648\u062C\u0633\u062A\u064A\u0629 \u0644\u0644\u062A\u062E\u0644\u0635 \u0645\u0646 \u0627\u0644\u0646\u0641\u0627\u064A\u0627\u062A \u0627\u0644\u062E\u0637\u0631\u0629',
  // Trade & Customs
  'tc-import': '\u062A\u062E\u0644\u064A\u0635 \u062C\u0645\u0631\u0643\u064A \u0644\u0644\u0648\u0627\u0631\u062F\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u064A\u0629 \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629',
  'tc-export': '\u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u062B\u0627\u0626\u0642 \u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u0648\u0627\u0644\u062C\u0645\u0627\u0631\u0643',
  'tc-compliance': '\u0627\u0644\u0627\u0645\u062A\u062B\u0627\u0644 \u0644\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u0627\u0646\u064A\u0629',
  'tc-dg': '\u0625\u0639\u062F\u0627\u062F \u0625\u0642\u0631\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0627\u0644\u062E\u0637\u0631\u0629',
  // Postal
  'ps-lettermail': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0631\u0627\u0633\u0644\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0648\u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629',
  'ps-registered': '\u062A\u0648\u0635\u064A\u0644 \u0622\u0645\u0646 \u0644\u0644\u0648\u062B\u0627\u0626\u0642 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064A\u0629',
  'ps-parcels': '\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0637\u0631\u0648\u062F \u0639\u0628\u0631 \u0627\u0644\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629',
  'ps-crossborder': '\u0634\u062D\u0646 \u062F\u0648\u0644\u064A \u0644\u0644\u0637\u0631\u0648\u062F \u0627\u0644\u0635\u063A\u064A\u0631\u0629',
  'ps-directmail': '\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u0633\u0648\u064A\u0642\u064A\u0629',
  'ps-lockers': '\u062E\u0632\u0627\u0626\u0646 \u0622\u0644\u064A\u0629 \u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0648\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0637\u0631\u0648\u062F',
  'ps-financial': '\u062E\u062F\u0645\u0627\u062A \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0623\u0645\u0648\u0627\u0644 \u0639\u0628\u0631 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629',
};

// Reverse map: English category label → Arabic category label
const CATEGORY_EN_TO_AR: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABELS).map(([key, enLabel]) => [enLabel, CATEGORY_LABELS_AR[key] || enLabel])
);

/** Look up Arabic category label from either a key or English label */
export function getCategoryLabelAr(categoryKeyOrLabel: string): string {
  return CATEGORY_LABELS_AR[categoryKeyOrLabel] || CATEGORY_EN_TO_AR[categoryKeyOrLabel] || categoryKeyOrLabel;
}

/** Return localized service fields based on locale */
export function getLocalizedServiceFields(serviceId: string, categoryKey: string, locale: string) {
  if (locale !== 'ar') {
    return {
      name: null,
      description: null,
      category: CATEGORY_LABELS[categoryKey] || categoryKey,
    };
  }
  return {
    name: SERVICE_NAMES_AR[serviceId] || null,
    description: SERVICE_DESCRIPTIONS_AR[serviceId] || null,
    category: CATEGORY_LABELS_AR[categoryKey] || CATEGORY_LABELS[categoryKey] || categoryKey,
  };
}
