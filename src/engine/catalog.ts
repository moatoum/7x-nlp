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
