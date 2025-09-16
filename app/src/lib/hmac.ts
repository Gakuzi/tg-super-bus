export async function signRequest(secret: string, method: string, path: string, body: any) {
  const encoder = new TextEncoder();
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID();
  const bodyString = body ? JSON.stringify(body) : '';
  const payload = `${method}\n${path}\n${bodyString}\n${timestamp}\n${nonce}`;
  const key = encoder.encode(secret);
  const data = encoder.encode(payload);
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const sigHex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return { sigHex, nonce, timestamp };
}