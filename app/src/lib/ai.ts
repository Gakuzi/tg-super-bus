import { signRequest } from './hmac';

export type AIClientVariant = 'short' | 'interactive' | 'detailed';

export interface ImproveTextOptions {
  apiBase: string; // Worker base URL, e.g., https://your-worker.example.workers.dev
  publicSigningSalt?: string; // optional salt used to derive client-side signing secret
  devBypass?: boolean; // if true, adds x-dev: true to allow local dev bypass
}

export async function improveTextClient(variant: AIClientVariant, text: string, brand: any, opts?: Partial<ImproveTextOptions>): Promise<string> {
  const apiBase = opts?.apiBase || (import.meta as any).env.VITE_API_BASE || localStorage.getItem('VITE_API_BASE') || '';
  if (!apiBase) throw new Error('API base URL is not configured');

  const path = '/api/ai/improve';
  const body = { variant, text, brand };

  // HMAC signature (derived from PUBLIC_SIGNING_SALT for demo; real secret must be on server)
  const publicSalt = opts?.publicSigningSalt || (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || localStorage.getItem('PUBLIC_SIGNING_SALT') || '';
  const signingSecret = publicSalt ? `public:${publicSalt}` : '';
  const { sigHex, nonce, timestamp } = signingSecret
    ? await signRequest(signingSecret, 'POST', path.replace(/^\/+/, ''), body)
    : { sigHex: '', nonce: '', timestamp: '' } as any;

  const res = await fetch(joinUrl(apiBase, path), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(opts?.devBypass ? { 'x-dev': 'true' } : {}),
      ...(signingSecret ? { 'x-signature': sigHex, 'x-nonce': nonce, 'x-timestamp': timestamp } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  const data = await res.json() as { text?: string };
  return data.text || '';
}

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/?$/, '')}/${path.replace(/^\//, '')}`;
}

