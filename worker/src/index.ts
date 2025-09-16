import { Router } from 'itty-router';
import { verifyHmac } from './lib/hmac';
import { withCors } from './lib/cors';
import { callTelegram } from './lib/telegram';

export interface Env {
  CF_ALLOWED_ORIGINS: string;
  SIGNING_SECRET: string;
  TG_BOT_TOKEN: string;
  NONCES: KVNamespace;
}

const router = Router();

function isDevBypass(req: Request, env: Env) {
  const origin = req.headers.get('origin') || '';
  const dev = req.headers.get('x-dev') === 'true';
  return dev && origin === 'http://localhost:5173';
}

router.options('*', () => new Response('ok'));

router.post('/api/tg', async (req: Request, env: Env) => {
  if (!isDevBypass(req, env)) {
    const check = await verifyHmac(req, env.SIGNING_SECRET, env.NONCES);
    if (!check.ok) return json({ error: check.error }, 401);
  }
  const { method, payload } = await req.json<any>();
  const result = await callTelegram(env.TG_BOT_TOKEN, method, payload);
  return json({ ok: true, result });
});

router.get('/api/rss/discover', async (req: Request) => {
  const url = new URL(req.url);
  const topic = url.searchParams.get('topic') || '';
  const lang = (url.searchParams.get('lang') || 'ru').toLowerCase();
  const googleNews = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=${lang === 'ru' ? 'ru' : 'en'}&gl=${lang === 'ru' ? 'RU' : 'US'}&ceid=${lang === 'ru' ? 'RU:ru' : 'US:en'}`;
  const items = [{ title: new URL(googleNews).host, url: googleNews }];
  return json(items);
});

router.post('/api/ai/improve', async (req: Request, env: Env) => {
  if (!isDevBypass(req, env)) {
    const check = await verifyHmac(req, env.SIGNING_SECRET, env.NONCES);
    if (!check.ok) return json({ error: check.error }, 401);
  }
  const { variant, text } = await req.json<any>();
  return json({ text: heuristicImprove(variant, text) });
});

router.get('/api/redirect/:id', async (req: any, env: Env) => {
  const id = req.params.id as string;
  const target = decodeURIComponent(req.query?.u || '');
  await env.NONCES.put(`ctr:${id}`, ((parseInt((await env.NONCES.get(`ctr:${id}`)) || '0') + 1) || 1).toString(), { expirationTtl: 86400 * 30 });
  return Response.redirect(target, 302);
});

export default {
  async fetch(req: Request, env: Env) {
    const allowedOrigins = env.CF_ALLOWED_ORIGINS?.split(',').map((s) => s.trim());
    const res = await router.handle(req, env);
    return withCors(allowedOrigins, req, res as Response);
  },
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function heuristicImprove(variant: string, text: string) {
  const addCTA = '\n\nПодписывайтесь и делитесь мнением!';
  if (variant === 'short') return shorten(text, 280) + addCTA;
  if (variant === 'interactive') return `${text}\n\nЧто вы думаете?` + addCTA;
  return `${text}\n\nПочему это важно: — 1 — 2 — 3` + addCTA;
}
function shorten(t: string, max: number) { return t.length <= max ? t : t.slice(0, max - 1) + '…'; }