export function withCors(originList: string[] = [], req: Request, res: Response) {
  const origin = req.headers.get('origin') || '';
  const allowed = originList.includes(origin);
  const headers = new Headers(res.headers);
  if (allowed) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type,X-Signature,X-Nonce,X-Timestamp,Authorization');
  return new Response(res.body, { status: res.status, headers });
}