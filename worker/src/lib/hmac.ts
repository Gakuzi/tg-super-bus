export async function verifyHmac(request: Request, secret: string, nonces: KVNamespace) {
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/+/, '');
  const bodyText = method === 'GET' ? '' : await request.clone().text();
  const ts = request.headers.get('x-timestamp') || '';
  const nonce = request.headers.get('x-nonce') || '';
  const signature = request.headers.get('x-signature') || '';
  if (!ts || !nonce || !signature) return { ok: false, error: 'missing headers' };
  const payload = `${method}\n${path}\n${bodyText}\n${ts}\n${nonce}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = buf2hex(sigBuf);
  if (!timingSafeEqual(expected, signature)) return { ok: false, error: 'bad signature' };
  const replay = await nonces.get(nonce);
  if (replay) return { ok: false, error: 'replay' };
  await nonces.put(nonce, '1', { expirationTtl: 300 });
  return { ok: true };
}
function buf2hex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}