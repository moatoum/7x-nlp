'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ServiceItem {
  solution: string;
  vertical: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  services: ServiceItem[];
}

const categories: ServiceCategory[] = [
  {
    id: 'first-mile',
    name: 'First Mile Logistics',
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
    id: 'domestic-courier',
    name: 'Domestic Courier & Parcel',
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
    id: 'international',
    name: 'International Parcel & Cross Border',
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
    id: 'freight',
    name: 'Freight Forwarding',
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
    id: 'road-freight',
    name: 'Road Freight & Trucking',
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
    id: 'warehousing',
    name: 'Warehousing & Storage',
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
    id: 'fulfillment',
    name: 'Fulfillment Services',
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
    id: 'last-mile',
    name: 'Last Mile Delivery',
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
    id: 'reverse',
    name: 'Reverse Logistics',
    services: [
      { solution: 'Customer Returns', vertical: 'E-commerce', description: 'Collection and processing of returned online orders' },
      { solution: 'Warranty Returns', vertical: 'Electronics', description: 'Return of defective devices to manufacturers' },
      { solution: 'Repair Logistics', vertical: 'Industrial Equipment', description: 'Transport of equipment to repair facilities' },
      { solution: 'Battery Recycling', vertical: 'Electronics', description: 'Collection of used lithium batteries' },
      { solution: 'Hazardous Waste Returns', vertical: 'Chemicals', description: 'Return logistics for hazardous waste disposal' },
    ],
  },
  {
    id: 'trade-customs',
    name: 'Trade & Customs Services',
    services: [
      { solution: 'Import Clearance', vertical: 'E-commerce', description: 'Customs clearance for cross border online orders' },
      { solution: 'Import Clearance', vertical: 'Industrial', description: 'Clearance of manufacturing imports' },
      { solution: 'Export Clearance', vertical: 'SME Export', description: 'Export documentation and customs processing' },
      { solution: 'Regulatory Compliance', vertical: 'Pharma', description: 'Compliance with pharmaceutical regulations' },
      { solution: 'DG Documentation', vertical: 'Chemicals', description: 'Preparation of dangerous goods declarations' },
    ],
  },
  {
    id: 'postal',
    name: 'Postal Services',
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
  const [activeId, setActiveId] = useState(categories[0].id);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isClickScrolling = useRef(false);

  const setRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    isClickScrolling.current = true;
    const el = sectionRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
            7X
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-12 pb-8">
        <h1 className="text-[28px] md:text-[36px] font-semibold text-gray-900 tracking-[-0.025em]">
          Available Services
        </h1>
        <p className="mt-2 text-[15px] text-gray-400 max-w-xl leading-relaxed">
          {categories.length} categories covering {totalServices}+ logistics
          solutions across the UAE and GCC.
        </p>
      </section>

      {/* Mobile: Horizontal category scrollbar */}
      <div className="lg:hidden sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1 px-5 py-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap',
                activeId === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: Sidebar + Services */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pb-20">
        <div className="flex gap-12">
          {/* Left sidebar — desktop only */}
          <nav className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-20 py-4">
              <ul className="space-y-0.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => scrollTo(cat.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2.5',
                        activeId === cat.id
                          ? 'text-gray-900 font-semibold bg-gray-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 font-medium'
                      )}
                    >
                      {activeId === cat.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />
                      )}
                      <span className={activeId !== cat.id ? 'ml-4' : ''}>
                        {cat.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Right content — services */}
          <div className="flex-1 min-w-0 pt-2">
            {categories.map((cat) => (
              <section
                key={cat.id}
                id={cat.id}
                ref={(el) => setRef(cat.id, el)}
                className="scroll-mt-28 lg:scroll-mt-20 mb-14 last:mb-0"
              >
                {/* Category heading */}
                <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-gray-100">
                  <h2 className="text-[18px] font-semibold text-gray-900 tracking-tight">
                    {cat.name}
                  </h2>
                  <span className="text-[12px] text-gray-300 font-medium">
                    {cat.services.length} solutions
                  </span>
                </div>

                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                  {cat.services.map((svc, i) => (
                    <div
                      key={`${svc.solution}-${svc.vertical}-${i}`}
                      className="py-3.5 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <h3 className="text-[14px] font-semibold text-gray-800 leading-snug">
                          {svc.solution}
                        </h3>
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-400">
                          {svc.vertical}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
