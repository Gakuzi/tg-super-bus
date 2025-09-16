export interface RssItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  image?: string;
  publishedAt?: number;
  hash: string;
}

export async function pullSources(env: any, opts: { sources?: string[]; topic?: string; lang?: 'ru'|'en'; timeoutMs?: number; retries?: number }) {
  const sources = (opts.sources && opts.sources.length > 0) ? opts.sources : buildDefaultSources(opts.topic || '', opts.lang || 'ru');
  const items: RssItem[] = [];
  for (const src of sources) {
    const xml = await fetchWithRetry(src, opts.timeoutMs || 10000, opts.retries || 1);
    const parsed = parseRssBasic(xml);
    for (const it of parsed) {
      const hash = await sha1(it.url + '|' + (it.title || ''));
      const id = hash;
      items.push({ ...it, id, hash });
    }
  }
  const unique: Record<string, RssItem> = {};
  for (const it of items) unique[it.id] = it;
  return Object.values(unique);
}

export async function storeIdeasKV(env: any, list: RssItem[], limit = 500) {
  const idxKey = 'ideas:index';
  let index = JSON.parse((await env.NONCES.get(idxKey)) || '[]') as string[];
  for (const it of list) {
    const exists = await env.NONCES.get(`ideas:${it.id}`);
    if (exists) continue;
    await env.NONCES.put(`ideas:${it.id}`, JSON.stringify(it), { expirationTtl: 86400 * 14 });
    index.unshift(it.id);
  }
  if (index.length > limit) index = index.slice(0, limit);
  await env.NONCES.put(idxKey, JSON.stringify(index), { expirationTtl: 86400 * 14 });
}

export async function listIdeasKV(env: any, limit = 50, cursor?: string) {
  const idxKey = 'ideas:index';
  const index = JSON.parse((await env.NONCES.get(idxKey)) || '[]') as string[];
  let start = 0;
  if (cursor) {
    const pos = index.indexOf(cursor);
    if (pos >= 0) start = pos + 1;
  }
  const slice = index.slice(start, start + limit);
  const items: RssItem[] = [];
  for (const id of slice) {
    const raw = await env.NONCES.get(`ideas:${id}`);
    if (raw) items.push(JSON.parse(raw));
  }
  const nextCursor = index[start + limit] || null;
  return { items, nextCursor };
}

function buildDefaultSources(topic: string, lang: 'ru'|'en') {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=${lang==='ru'?'ru':'en'}&gl=${lang==='ru'?'RU':'US'}&ceid=${lang==='ru'?'RU:ru':'US:en'}`;
  return [url];
}

async function fetchWithRetry(url: string, timeoutMs: number, retries: number) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort('timeout'), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(String(res.status));
      return await res.text();
    } catch (e) {
      clearTimeout(t);
      if (attempt === retries) throw e;
    }
  }
  throw new Error('unreachable');
}

function parseRssBasic(xml: string) {
  const items: Array<{ title: string; url: string; summary?: string; image?: string; publishedAt?: number }> = [];
  const itemRegex = /<item[\s\S]*?<\/item>/g;
  const linkRegex = /<link>([\s\S]*?)<\/link>/;
  const titleRegex = /<title>([\s\S]*?)<\/title>/;
  const descRegex = /<description>([\s\S]*?)<\/description>/;
  const enclosureRegex = /<enclosure[^>]*url="([^"]+)"/;
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
  const blocks = xml.match(itemRegex) || [];
  for (const block of blocks) {
    const url = unescapeXml((block.match(linkRegex)?.[1] || '').trim());
    const title = unescapeXml((block.match(titleRegex)?.[1] || '').trim());
    const summary = stripTags(unescapeXml((block.match(descRegex)?.[1] || '').trim())).slice(0, 500);
    const image = block.match(enclosureRegex)?.[1];
    const pub = block.match(pubDateRegex)?.[1];
    const publishedAt = pub ? Date.parse(pub) || undefined : undefined;
    if (url && title) items.push({ url, title, summary, image, publishedAt });
  }
  return items;
}

function stripTags(s: string) { return s.replace(/<[^>]+>/g, ''); }
function unescapeXml(s: string) { return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'); }
async function sha1(s: string) {
  const buf = new TextEncoder().encode(s);
  const d = await crypto.subtle.digest('SHA-1', buf);
  return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

