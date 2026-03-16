import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ── Seed Data Arrays ── */

const CATEGORIES = [
  'domestic_courier', 'domestic_courier', 'domestic_courier',
  'international', 'international',
  'freight', 'freight',
  'first_mile', 'first_mile',
  'last_mile', 'last_mile',
  'warehousing', 'fulfillment', 'road_freight',
  'reverse_logistics', 'trade_customs', 'postal',
];

const SUBCATEGORIES: Record<string, string[]> = {
  domestic_courier: ['Same day', 'Next day', 'Temperature controlled'],
  international: ['Express', 'Deferred', 'Cross border'],
  freight: ['Air freight', 'Sea freight FCL', 'Sea freight LCL'],
  first_mile: ['Scheduled pickup', 'On-demand pickup'],
  last_mile: ['Home delivery', 'Locker delivery'],
  warehousing: ['General', 'Cold storage', 'Bonded'],
  fulfillment: ['Pick & pack', 'Multi-channel'],
  road_freight: ['FTL', 'LTL', 'Cross-border trucking'],
  reverse_logistics: ['Returns processing', 'Warranty returns'],
  trade_customs: ['Import clearance', 'Export clearance'],
  postal: ['Letter mail', 'Postal parcels'],
};

const COMPANIES = [
  'Gulf Electronics FZCO', 'Al Nahda Foods LLC', 'Mashreq Trading Co.',
  'Emirates Pharma Group', 'Dubai Luxury Goods', 'Sharjah Textiles',
  'Abu Dhabi Auto Parts', 'RAK Ceramics Dist.', 'Ajman Steel Corp.',
  'Palm Bay Cosmetics', 'Desert Rose Perfumes', 'Nakheel Fresh Produce',
  'Al Ain Water Co.', 'Fujairah Chemicals', 'Global Tech Solutions',
  'MedPoint Healthcare', 'QuickBite Delivery', 'Fashion Hub MENA',
  'Noon Marketplace', 'Careem Commerce', 'Talabat Partners',
  'Aramex Express', 'Agility Logistics', 'DP World Trading',
  'ENOC Supply Chain', 'Jumbo Electronics', 'Sharaf DG Retail',
  'Lulu Hypermarket', 'Majid Al Futtaim', 'Emaar Properties',
];

const NAMES = [
  'Ahmed Al Rashid', 'Fatima Hassan', 'Omar Khalil', 'Sara Al Maktoum',
  'Khalid Ibrahim', 'Noura Saeed', 'Mohammed Ali', 'Aisha Rahman',
  'Yusuf Malik', 'Huda Al Suwaidi', 'Hassan Jaber', 'Mariam Noor',
  'Ali Abdulaziz', 'Reem Al Shamsi', 'Saeed Obaid', 'Layla Ahmed',
  'Tariq Hassan', 'Dana Al Ketbi', 'Faisal Mahmoud', 'Amira Yousef',
];

const LOCATIONS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'];
const URGENCIES = ['Same day', 'Next day', 'Express', 'Standard'];
const VOLUMES = ['Under 100', '100-1,000', '1,000-10,000', '10,000+'];
const INDUSTRIES = ['E-commerce / D2C', 'Retail', 'Healthcare / Pharma', 'Manufacturing', 'Food & Beverage', 'Government'];
const STATUSES = ['submitted', 'submitted', 'under_review', 'under_review', 'assigned', 'actioned', 'actioned', 'closed'] as const;
const SPECIAL_REQS = ['Temperature sensitive', 'High value items', 'Dangerous / hazardous goods', 'Fragile / special handling', 'Oversized or heavy'];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], min: number, max: number): T[] {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomRef(date: Date): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, '');
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `7X-${d}-${code}`;
}

/* ── Main ── */

async function main() {
  console.log('Clearing existing data...');
  await prisma.recommendedService.deleteMany();
  await prisma.note.deleteMany();
  await prisma.submission.deleteMany();

  const now = Date.now();
  const COUNT = 32;

  console.log(`Seeding ${COUNT} submissions...`);

  for (let i = 0; i < COUNT; i++) {
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 90);
    const createdAt = new Date(now - daysAgo * 86400000 - Math.random() * 86400000);

    const category = pick(CATEGORIES);
    const subcats = SUBCATEGORIES[category] || ['General'];
    const company = pick(COMPANIES);
    const name = pick(NAMES);
    const email = name.toLowerCase().replace(/\s+/g, '.') + '@' + company.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) + '.ae';

    await prisma.submission.create({
      data: {
        referenceNumber: randomRef(createdAt),
        status: pick(STATUSES),
        createdAt,
        serviceCategory: category,
        serviceSubcategory: pick(subcats),
        businessType: pick(INDUSTRIES),
        originLocation: pick(LOCATIONS),
        destinationLocation: Math.random() > 0.4 ? pick(LOCATIONS) : null,
        frequency: pick(VOLUMES),
        urgency: pick(URGENCIES),
        specialRequirements: Math.random() > 0.5 ? pickN(SPECIAL_REQS, 1, 2) : [],
        additionalNotes: null,
        contactName: name,
        contactEmail: email,
        contactPhone: null,
        companyName: company,
        conversationDuration: 120000 + Math.floor(Math.random() * 600000),
        nodesVisited: [],
        totalMessages: 8 + Math.floor(Math.random() * 12),
      },
    });
  }

  console.log(`Done! Seeded ${COUNT} submissions.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
