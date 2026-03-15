import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Truck, Package, Globe, Ship, MapPin, Warehouse, ShoppingBag, RotateCcw, FileText, Mail } from 'lucide-react';

interface ServiceItem {
  solution: string;
  vertical: string;
  description: string;
}

interface ServiceCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  services: ServiceItem[];
}

const categories: ServiceCategory[] = [
  {
    name: 'First Mile Logistics',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-blue-50 text-blue-600',
    services: [
      { solution: 'Scheduled Pickup', vertical: 'E-commerce', description: 'Regular pickup from online merchants and fulfillment centers' },
      { solution: 'Scheduled Pickup', vertical: 'Retail', description: 'Collection of shipments from retail stores and distribution centers' },
      { solution: 'On-Demand Pickup', vertical: 'SME', description: 'Ad-hoc pickup requests from small businesses via digital platforms' },
      { solution: 'On-Demand Pickup', vertical: 'Quick Commerce', description: 'Rapid pickup from dark stores or micro-fulfillment centers' },
      { solution: 'Vendor Pickup', vertical: 'Manufacturing', description: 'Collection of components and materials from suppliers' },
      { solution: 'Vendor Pickup', vertical: 'Automotive', description: 'Pickup of spare parts and automotive components' },
      { solution: 'Temperature Controlled Pickup', vertical: 'Food & Grocery', description: 'Pickup of chilled or frozen products' },
      { solution: 'Temperature Controlled Pickup', vertical: 'Pharma', description: 'Pickup of temperature sensitive pharmaceuticals' },
      { solution: 'Secure Pickup', vertical: 'Luxury Goods', description: 'Secure pickup of high value shipments' },
      { solution: 'Dangerous Goods Pickup', vertical: 'Chemicals', description: 'Certified pickup of hazardous chemical shipments' },
    ],
  },
  {
    name: 'Domestic Courier & Parcel',
    icon: <Package className="w-5 h-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    services: [
      { solution: 'Same Day Delivery', vertical: 'Quick Commerce', description: 'Ultra fast delivery from urban micro hubs' },
      { solution: 'Same Day Delivery', vertical: 'Healthcare', description: 'Delivery of laboratory samples and medical supplies' },
      { solution: 'Next Day Delivery', vertical: 'E-commerce', description: 'Standard next day delivery for online retail' },
      { solution: 'Next Day Delivery', vertical: 'Retail', description: 'Overnight replenishment deliveries to retail stores' },
      { solution: 'Temperature Controlled Delivery', vertical: 'Food', description: 'Delivery of chilled and frozen food products' },
      { solution: 'Temperature Controlled Delivery', vertical: 'Pharma', description: 'Controlled temperature delivery of medicines' },
      { solution: 'High Value Delivery', vertical: 'Luxury Goods', description: 'Secure delivery with insurance and verification' },
      { solution: 'High Value Delivery', vertical: 'Electronics', description: 'Secure delivery of expensive electronic devices' },
      { solution: 'Dangerous Goods Delivery', vertical: 'Batteries & Electronics', description: 'Transport of lithium battery shipments' },
      { solution: 'Identity Verified Delivery', vertical: 'Government', description: 'Delivery requiring ID or OTP authentication' },
    ],
  },
  {
    name: 'International Parcel & Cross Border',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-violet-50 text-violet-600',
    services: [
      { solution: 'Global Express', vertical: 'E-commerce', description: 'Fast cross border shipping for online retailers' },
      { solution: 'Global Express', vertical: 'Luxury Goods', description: 'Secure international shipping of high value products' },
      { solution: 'Deferred Shipping', vertical: 'SME Export', description: 'Lower cost international shipping solution' },
      { solution: 'Cross Border Delivery', vertical: 'Marketplace', description: 'Logistics for global marketplace sellers' },
      { solution: 'Temperature Controlled Shipping', vertical: 'Pharma', description: 'Cold chain international shipping' },
      { solution: 'Temperature Controlled Shipping', vertical: 'Food Export', description: 'Export logistics for perishable foods' },
      { solution: 'Dangerous Goods Shipping', vertical: 'Chemicals', description: 'International shipment of regulated hazardous cargo' },
    ],
  },
  {
    name: 'Freight Forwarding',
    icon: <Ship className="w-5 h-5" />,
    color: 'bg-sky-50 text-sky-600',
    services: [
      { solution: 'Air Freight', vertical: 'Industrial', description: 'Transport of manufacturing cargo via air' },
      { solution: 'Air Freight Charter', vertical: 'Emergency Logistics', description: 'Dedicated aircraft for urgent cargo' },
      { solution: 'Sea Freight FCL', vertical: 'Manufacturing', description: 'Full container shipping for industrial cargo' },
      { solution: 'Sea Freight LCL', vertical: 'SME Export', description: 'Shared container shipping for small exporters' },
      { solution: 'Reefer Container', vertical: 'Food', description: 'Refrigerated container shipping for perishables' },
      { solution: 'Reefer Container', vertical: 'Pharma', description: 'Temperature controlled ocean transport' },
      { solution: 'Breakbulk Shipping', vertical: 'Heavy Industry', description: 'Shipping of oversized industrial equipment' },
      { solution: 'Dangerous Goods Air Freight', vertical: 'Chemicals', description: 'Air shipment of hazardous cargo under IATA rules' },
      { solution: 'Dangerous Goods Sea Freight', vertical: 'Energy', description: 'Ocean shipping of hazardous energy materials' },
    ],
  },
  {
    name: 'Road Freight & Trucking',
    icon: <Truck className="w-5 h-5" />,
    color: 'bg-orange-50 text-orange-600',
    services: [
      { solution: 'Full Truckload', vertical: 'Manufacturing', description: 'Dedicated trucks transporting industrial goods' },
      { solution: 'Less Than Truckload', vertical: 'SME', description: 'Shared truck capacity for smaller shipments' },
      { solution: 'Cross Border Trucking', vertical: 'GCC Trade', description: 'Regional trucking across GCC markets' },
      { solution: 'Express Trucking', vertical: 'Spare Parts', description: 'Rapid delivery of time critical industrial parts' },
      { solution: 'Temperature Controlled Trucking', vertical: 'Food', description: 'Refrigerated road transport for perishables' },
      { solution: 'Temperature Controlled Trucking', vertical: 'Pharma', description: 'Controlled temperature trucking' },
      { solution: 'Dangerous Goods Trucking', vertical: 'Chemicals', description: 'Specialized trucking for hazardous materials' },
      { solution: 'Heavy Haul Transport', vertical: 'Construction', description: 'Transport of oversized construction equipment' },
    ],
  },
  {
    name: 'Warehousing & Storage',
    icon: <Warehouse className="w-5 h-5" />,
    color: 'bg-amber-50 text-amber-600',
    services: [
      { solution: 'General Warehousing', vertical: 'Consumer Goods', description: 'Storage of retail and consumer inventory' },
      { solution: 'General Warehousing', vertical: 'Industrial', description: 'Storage of manufacturing inputs' },
      { solution: 'Bonded Warehousing', vertical: 'International Trade', description: 'Duty deferred storage for imported goods' },
      { solution: 'Cold Storage', vertical: 'Food', description: 'Refrigerated warehousing for perishable food' },
      { solution: 'Cold Storage', vertical: 'Pharma', description: 'Temperature controlled pharmaceutical storage' },
      { solution: 'High Value Storage', vertical: 'Luxury', description: 'Secure vault storage for high value goods' },
      { solution: 'Spare Parts Storage', vertical: 'Automotive', description: 'Storage of automotive spare parts' },
      { solution: 'Micro Fulfillment', vertical: 'Quick Commerce', description: 'Urban fulfillment enabling rapid delivery' },
      { solution: 'Hazardous Goods Storage', vertical: 'Chemicals', description: 'Storage of dangerous goods in compliant facilities' },
    ],
  },
  {
    name: 'Fulfillment Services',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'bg-pink-50 text-pink-600',
    services: [
      { solution: 'Pick & Pack', vertical: 'E-commerce', description: 'Order picking and packing for online retail shipments' },
      { solution: 'Fashion Fulfillment', vertical: 'Apparel', description: 'Handling and distribution of fashion products' },
      { solution: 'Electronics Fulfillment', vertical: 'Electronics', description: 'Specialized handling of electronic goods' },
      { solution: 'Multi Channel Fulfillment', vertical: 'Omnichannel Retail', description: 'Serving orders across multiple channels' },
      { solution: 'Grocery Fulfillment', vertical: 'Quick Commerce', description: 'Rapid grocery order processing' },
      { solution: 'DG Fulfillment', vertical: 'Electronics', description: 'Fulfillment for products containing lithium batteries' },
    ],
  },
  {
    name: 'Last Mile Delivery',
    icon: <Package className="w-5 h-5" />,
    color: 'bg-teal-50 text-teal-600',
    services: [
      { solution: 'Home Delivery', vertical: 'E-commerce', description: 'Parcel delivery to residential customers' },
      { solution: 'Home Delivery', vertical: 'Grocery', description: 'Delivery of groceries to households' },
      { solution: 'Furniture Delivery', vertical: 'Home & Furniture', description: 'Delivery of bulky furniture items' },
      { solution: 'Locker Delivery', vertical: 'E-commerce', description: 'Delivery to automated parcel lockers' },
      { solution: 'Click & Collect', vertical: 'Retail', description: 'Delivery to stores for customer pickup' },
      { solution: 'Temperature Controlled Delivery', vertical: 'Food', description: 'Last mile chilled and frozen delivery' },
      { solution: 'Temperature Controlled Delivery', vertical: 'Pharma', description: 'Controlled temperature medicine delivery' },
      { solution: 'Secure Delivery', vertical: 'Luxury', description: 'High security last mile delivery' },
      { solution: 'DG Certified Delivery', vertical: 'Industrial', description: 'Delivery of small dangerous goods shipments' },
    ],
  },
  {
    name: 'Reverse Logistics',
    icon: <RotateCcw className="w-5 h-5" />,
    color: 'bg-rose-50 text-rose-600',
    services: [
      { solution: 'Customer Returns', vertical: 'E-commerce', description: 'Collection and processing of returned online orders' },
      { solution: 'Warranty Returns', vertical: 'Electronics', description: 'Return of defective devices to manufacturers' },
      { solution: 'Repair Logistics', vertical: 'Industrial Equipment', description: 'Transport of equipment to repair facilities' },
      { solution: 'Battery Recycling', vertical: 'Electronics', description: 'Collection of used lithium batteries' },
      { solution: 'Hazardous Waste Returns', vertical: 'Chemicals', description: 'Return logistics for hazardous waste disposal' },
    ],
  },
  {
    name: 'Trade & Customs Services',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    services: [
      { solution: 'Import Clearance', vertical: 'E-commerce', description: 'Customs clearance for cross border online orders' },
      { solution: 'Import Clearance', vertical: 'Industrial', description: 'Clearance of manufacturing imports' },
      { solution: 'Export Clearance', vertical: 'SME Export', description: 'Export documentation and customs processing' },
      { solution: 'Regulatory Compliance', vertical: 'Pharma', description: 'Compliance with pharmaceutical regulations' },
      { solution: 'DG Documentation', vertical: 'Chemicals', description: 'Preparation of dangerous goods declarations' },
    ],
  },
  {
    name: 'Postal Services',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-cyan-50 text-cyan-600',
    services: [
      { solution: 'Letter Mail', vertical: 'Consumer', description: 'Delivery of personal letters' },
      { solution: 'Letter Mail', vertical: 'Business', description: 'Delivery of corporate correspondence' },
      { solution: 'Registered Mail', vertical: 'Legal', description: 'Secure delivery of legal documents' },
      { solution: 'Postal Parcels', vertical: 'E-commerce', description: 'Parcel delivery through postal networks' },
      { solution: 'Cross Border Small Packets', vertical: 'E-commerce', description: 'International small packet shipping' },
      { solution: 'Direct Mail', vertical: 'Marketing', description: 'Distribution of marketing materials' },
      { solution: 'Postal Lockers', vertical: 'E-commerce', description: 'Automated lockers for parcel pickup and returns' },
      { solution: 'Postal Financial Services', vertical: 'Remittances', description: 'Money transfer and financial services via postal networks' },
    ],
  },
];

const totalServices = categories.reduce((sum, cat) => sum + cat.services.length, 0);

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <Image src="/adio.png" alt="ADIO" width={100} height={24} className="h-5 w-auto opacity-40" />
            <span className="w-px h-4 bg-gray-200" />
            <span className="text-[13px] font-semibold text-gray-900 tracking-tight">7X</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-8">
        <h1 className="text-[28px] md:text-[36px] font-semibold text-gray-900 tracking-[-0.025em]">
          Available Services
        </h1>
        <p className="mt-2 text-[15px] text-gray-400 max-w-xl leading-relaxed">
          Transportation and logistics products and solutions across {categories.length} categories covering {totalServices}+ service offerings.
        </p>

        {/* Category quick nav */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-[12px] text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              {cat.name}
              <span className="text-gray-300">{cat.services.length}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        <div className="space-y-12">
          {categories.map((cat) => (
            <div
              key={cat.name}
              id={cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="scroll-mt-20"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color}`}>
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-gray-900">{cat.name}</h2>
                  <p className="text-[12px] text-gray-400">{cat.services.length} solutions</p>
                </div>
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.services.map((svc, i) => (
                  <div
                    key={`${svc.solution}-${svc.vertical}-${i}`}
                    className="group border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-[14px] font-semibold text-gray-900 leading-snug">
                        {svc.solution}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-gray-50 text-[11px] font-medium text-gray-400">
                        {svc.vertical}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 text-center">
          <h3 className="text-[20px] font-semibold text-gray-900">Need a custom solution?</h3>
          <p className="mt-2 text-[14px] text-gray-400">
            Tell us what you need and we will match you with the right service.
          </p>
          <Link
            href="/intake"
            className="mt-5 inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-gray-900 transition-colors"
          >
            Start a Request
          </Link>
        </div>
      </section>
    </div>
  );
}
