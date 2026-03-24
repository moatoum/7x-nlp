/**
 * Cloudflare Turnstile server-side verification.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
}

/**
 * Verify a Turnstile token server-side.
 * Fails closed: returns false on any error or misconfiguration.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACvVBBrrDN_K5W-BHCLePBn--iU';
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }

  if (!token) return false;

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) {
      console.error('Turnstile verify HTTP error:', res.status);
      return false;
    }

    const result: TurnstileResult = await res.json();
    if (!result.success) {
      console.warn('Turnstile verification failed:', JSON.stringify(result));
    }
    return result.success;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return false;
  }
}
