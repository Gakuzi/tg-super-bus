import { Router } from 'itty-router';
import { verifyHmac } from './lib/hmac';
import { withCors } from './lib/cors';
import { callTelegram } from './lib/telegram';
import { improveText } from './lib/ai';

export interface Env {
  CF_ALLOWED_ORIGINS: string;
  SIGNING_SECRET: string;
  TG_BOT_TOKEN: string;
  NONCES: KVNamespace;
  // AI providers
  AI_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  CF_ACCOUNT_ID?: string;
  CF_API_TOKEN?: string;
  CF_AI_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const router = Router();

function isDevBypass(req: Request) {
  const origin = req.headers.get('origin') || '';
  const dev = (req.headers.get('x-dev') || '').toLowerCase() === 'true';
  return dev && /^http:\/\/localhost:(5173|5174|5175)$/.test(origin);
}

router.options('*', () => new Response('ok'));

router.post('/api/tg', async (req: Request, env: Env) => {
  if (!isDevBypass(req)) {
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
  if (!isDevBypass(req)) {
    const check = await verifyHmac(req, env.SIGNING_SECRET, env.NONCES);
    if (!check.ok) return json({ error: check.error }, 401);
  }
  const { variant, text, brand } = await req.json<any>();
  const providerOverride = (req.headers.get('x-ai-provider') || '').trim();
  const env2 = providerOverride ? { ...env, AI_PROVIDER: providerOverride } : env;
  const out = await improveText(env2, variant, text, brand);
  return json({ text: out });
});

router.get('/api/redirect/:id', async (req: any, env: Env) => {
  const id = req.params.id as string;
  const target = decodeURIComponent(req.query?.u || '');
  const key = `ctr:${id}`;
  const curr = parseInt((await env.NONCES.get(key)) || '0') || 0;
  const next = curr + 1;
  await env.NONCES.put(key, String(next), { expirationTtl: 86400 * 30 });
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