import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession, SESSION_TTL_SECONDS } from '@/lib/admin-session';

interface AdminAccount {
  username: string;
  password: string;
  role: 'admin' | 'viewer';
}

function getAccounts(): AdminAccount[] {
  const accounts: AdminAccount[] = [];

  if (process.env.NXN_PASSWORD) {
    accounts.push({ username: 'nxn', password: process.env.NXN_PASSWORD, role: 'admin' });
  }
  if (process.env.EMX_PASSWORD) {
    accounts.push({ username: 'emx', password: process.env.EMX_PASSWORD, role: 'viewer' });
  }
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    accounts.push({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: 'admin' });
  }

  return accounts;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const accounts = getAccounts();
    if (accounts.length === 0) {
      console.error('No admin accounts configured — set NXN_PASSWORD, EMX_PASSWORD, or ADMIN_USERNAME+ADMIN_PASSWORD env vars');
      return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
    }

    const account = accounts.find(
      (a) => a.username === username && a.password === password
    );

    if (account) {
      const token = createSession(account.username, account.role);

      const response = NextResponse.json({
        success: true,
        username: account.username,
        role: account.role,
      });

      // Set HTTP-only cookie — not accessible to client JS
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE /api/admin/auth — Logout
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  destroySession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
