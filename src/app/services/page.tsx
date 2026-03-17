'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ServiceItem {
  solution: string;
  description: string;
  sla?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  services: ServiceItem[];
}

const categories: ServiceCategory[] = [
  {
    id: 'domestic-courier',
    name: 'Domestic Courier & Parcel',
    services: [
      { solution: 'On-demand Delivery', description: 'Ultra fast delivery from urban micro hubs', sla: 'Under 2 hours' },
      { solution: 'Same Day Delivery', description: 'Delivery of laboratory samples and medical supplies', sla: 'Within 4-6 hours' },
      { solution: 'Next Day Delivery', description: 'Standard next day delivery for online retail', sla: 'NDD' },
      { solution: 'Malls and Store Replenishment', description: 'Overnight replenishment deliveries to retail stores', sla: 'Based on Mall schedule' },
      { solution: 'Temperature Controlled Delivery', description: 'Delivery of chilled and frozen food products', sla: 'NDD' },
      { solution: 'High Value Delivery', description: 'Secure delivery with insurance and verification', sla: 'NDD' },
      { solution: 'Dangerous Goods Delivery', description: 'Transport of lithium battery shipments', sla: 'NDD' },
      { solution: 'Identity Verified Delivery', description: 'Delivery requiring ID or OTP authentication', sla: 'NDD' },
      { solution: 'Out of Home Delivery Network', description: 'Delivering to pick up and drop off points', sla: 'NDD' },
    ],
  },
  {
    id: 'international',
    name: 'International Courier and Parcel',
    services: [
      { solution: 'Premium Express', description: 'Fast cross border shipping', sla: '2-3 Days' },
      { solution: 'Deferred Express', description: 'Lower cost international shipping solution by land', sla: '5-7 Days' },
      { solution: 'Standard Express', description: 'Balanced solution between cost and transit time', sla: '3-5 Days' },
      { solution: 'Temperature Controlled Shipping', description: 'Cold chain international shipping', sla: '3-5 Days' },
      { solution: 'Dangerous Goods Shipping', description: 'International shipment for batteries and ID 8000', sla: '3-5 Days' },
    ],
  },
  {
    id: 'freight',
    name: 'Freight Forwarding',
    services: [
      { solution: 'Air Freight', description: 'Transport of manufacturing cargo via air' },
      { solution: 'Air Freight Charter', description: 'Dedicated aircraft for urgent cargo' },
      { solution: 'Air Freight Reefer', description: 'Refrigerated container shipping' },
      { solution: 'Air Freight Dangerous', description: 'Air shipment of hazardous cargo under IATA rules' },
      { solution: 'Sea Freight FCL', description: 'Full container shipping for industrial cargo' },
      { solution: 'Sea Freight LCL', description: 'Shared container shipping for small exporters' },
      { solution: 'Sea Freight Reefer Container', description: 'Temperature controlled ocean transport' },
      { solution: 'Sea Freight Dangerous Goods', description: 'Ocean shipping of hazardous energy materials' },
      { solution: 'Breakbulk Shipping', description: 'Shipping of oversized industrial equipment' },
    ],
  },
  {
    id: 'road-freight',
    name: 'Road Freight & Trucking',
    services: [
      { solution: 'Full Truckload', description: 'Dedicated trucks transporting industrial goods' },
      { solution: 'Less Than Truckload', description: 'Shared truck capacity for smaller shipments' },
      { solution: 'Temperature Controlled Trucking', description: 'Controlled temperature trucking' },
      { solution: 'Dangerous Goods Trucking', description: 'Specialized trucking for hazardous materials' },
      { solution: 'Heavy Haul Transport', description: 'Transport of oversized construction equipment' },
    ],
  },
  {
    id: 'warehousing',
    name: 'Warehousing & Fulfillment',
    services: [
      { solution: 'General Warehousing Mainland', description: 'Duty and tax paid storage within Dubai Mainland' },
      { solution: 'General Warehousing Free Zone', description: 'Duty and VAT exempted/deferred storage' },
      { solution: 'Cold Storage', description: 'Cold chain warehousing with multiple temperature controlled options and humidity control' },
      { solution: 'E-commerce Fulfillment', description: 'Piece level pick and pack' },
      { solution: 'Micro Fulfillment', description: 'Urban fulfillment enabling rapid delivery' },
      { solution: 'Dangerous Goods Storage', description: 'Storage of dangerous goods in compliant facilities' },
    ],
  },
  {
    id: 'reverse',
    name: 'Reverse Logistics',
    services: [
      { solution: 'Customer Initiated Returns', description: 'Collection and processing of returned online orders' },
      { solution: 'Warranty Returns', description: 'Return of defective devices to manufacturers' },
      { solution: 'Return & Repair', description: 'Transport of equipment to repair facilities' },
    ],
  },
  {
    id: 'trade-customs',
    name: 'Trade & Customs Services',
    services: [
      { solution: 'Import Clearance', description: 'Customs clearance for cross border inbound shipments' },
      { solution: 'Export Clearance', description: 'Export documentation and customs processing' },
      { solution: 'DG Documentation', description: 'Preparation of dangerous goods declarations' },
    ],
  },
  {
    id: 'postal',
    name: 'Postal Services',
    services: [
      { solution: 'Letter Mail', description: 'Delivery of personal mail for both individuals and corporates' },
      { solution: 'Registered Mail', description: 'Secure delivery of legal documents' },
      { solution: 'Postal Parcels', description: 'Parcel delivery through postal networks' },
      { solution: 'Cross Border Small Packets', description: 'International small packet shipping' },
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
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-center relative">
          <Link
            href="/"
            className="absolute left-5 md:left-8 flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Image src="/7xlogo-dark.svg" alt="7X" width={48} height={28} priority />
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
                      key={`${svc.solution}-${i}`}
                      className="py-3.5 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <h3 className="text-[14px] font-semibold text-gray-800 leading-snug">
                          {svc.solution}
                        </h3>
                        {svc.sla && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-400">
                            {svc.sla}
                          </span>
                        )}
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
