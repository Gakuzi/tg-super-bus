import { Router } from 'itty-router';
import { verifyHmac } from './lib/hmac';
import { withCors } from './lib/cors';
import { callTelegram } from './lib/telegram';
import { improveText } from './lib/ai';
import { pullSources, storeIdeasKV, listIdeasKV } from './lib/rss';

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
  // RSS
  RSS_SOURCES?: string; // comma-separated list of URLs
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

// v1 API
router.post('/api/v1/rss/pull', async (req: Request, env: Env) => {
  const body = await req.json<any>().catch(()=>({}));
  const sources: string[] = Array.isArray(body.sources) ? body.sources : [];
  const topic: string = body.topic || '';
  const lang: 'ru'|'en' = (body.lang || 'ru').toLowerCase() === 'en' ? 'en' : 'ru';
  const timeoutMs = Math.max(2000, Math.min(20000, Number(body.timeoutMs) || 10000));
  const retries = Math.max(0, Math.min(3, Number(body.retries) || 1));
  const items = await pullSources(env, { sources, topic, lang, timeoutMs, retries });
  await storeIdeasKV(env, items);
  return json({ ok: true, count: items.length });
});

router.get('/api/v1/ideas', async (req: Request, env: Env) => {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 50));
  const cursor = url.searchParams.get('cursor') || undefined;
  const { items, nextCursor } = await listIdeasKV(env, limit, cursor);
  return json({ items, nextCursor });
});

router.post('/api/v1/ai/improve', async (req: Request, env: Env) => {
  if (!isDevBypass(req)) {
    const check = await verifyHmac(req, env.SIGNING_SECRET, env.NONCES);
    if (!check.ok) return json({ error: check.error }, 401);
  }
  const { variant, text, brand } = await req.json<any>();
  const providerOverride = (req.headers.get('x-ai-provider') || '').trim();
  const env2 = providerOverride ? { ...env, AI_PROVIDER: providerOverride } : env;
  const maxLen = 5000;
  const safeText = String(text || '').slice(0, maxLen * 5); // hard cap
  const out = await improveText(env2, String(variant || 'short'), safeText, brand);
  const parts = chunkByLength(out, maxLen);
  return json({ parts });
});

router.post('/api/v1/tg', async (req: Request, env: Env) => {
  if (!isDevBypass(req)) {
    const check = await verifyHmac(req, env.SIGNING_SECRET, env.NONCES);
    if (!check.ok) return json({ error: check.error }, 401);
  }
  const { method, payload } = await req.json<any>();
  // Basic validation for media groups
  if (method === 'sendMediaGroup') {
    if (!Array.isArray(payload?.media) || payload.media.length === 0) return json({ error: 'media required' }, 400);
  }
  const result = await callTelegram(env.TG_BOT_TOKEN, method, payload);
  return json({ ok: true, result });
});

router.get('/api/v1/redirect/:id', async (req: any, env: Env) => {
  const id = req.params.id as string;
  const url = new URL(req.url);
  const metrics = url.searchParams.get('metrics');
  if (metrics) {
    const count = parseInt((await env.NONCES.get(`ctr:${id}`)) || '0') || 0;
    return json({ id, count });
  }
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
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    try {
      const rssEnvSources = (env as any).RSS_SOURCES as string | undefined;
      const sources = rssEnvSources ? rssEnvSources.split(',').map((s)=>s.trim()).filter(Boolean) : [];
      const items = await pullSources(env, { sources, topic: '', lang: 'ru', timeoutMs: 10000, retries: 1 });
      await storeIdeasKV(env, items);
    } catch {}
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function chunkByLength(text: string, maxLen: number) {
  const parts: string[] = [];
  let i = 0;
  while (i < text.length) {
    parts.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return parts;
}