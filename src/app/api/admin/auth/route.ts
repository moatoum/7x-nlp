import { NextRequest, NextResponse } from 'next/server';

interface AdminAccount {
  username: string;
  password: string;
  role: 'admin' | 'viewer';
}

const ACCOUNTS: AdminAccount[] = [
  { username: 'nxn', password: process.env.NXN_PASSWORD || 'bDJ1bmaKwSOdqjcB', role: 'admin' },
  { username: 'emx', password: process.env.EMX_PASSWORD || 'knI2UBml0vWD0vA6', role: 'viewer' },
  // Legacy fallback: keep old single-account support
  ...(process.env.ADMIN_USERNAME
    ? [{ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD || 'admin', role: 'admin' as const }]
    : []),
];

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const account = ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );

    if (account) {
      return NextResponse.json({
        success: true,
        username: account.username,
        role: account.role,
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
