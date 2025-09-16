export type AIProvider = 'gemini' | 'cf_ai' | 'openai' | 'heuristic';

export async function improveText(env: any, variant: string, text: string, brand?: any) {
  const provider = ((env.AI_PROVIDER || 'gemini') as AIProvider);
  try {
    if (provider === 'gemini' && env.GEMINI_API_KEY) {
      const prompt = buildPrompt(variant, text, brand);
      const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + env.GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await resp.json<any>();
      const out = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
      if (out) return out;
    }
    if (provider === 'cf_ai' && env.CF_AI_MODEL && env.CF_ACCOUNT_ID && env.CF_API_TOKEN) {
      const prompt = buildPrompt(variant, text, brand);
      const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/run/${env.CF_AI_MODEL}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'authorization': `Bearer ${env.CF_API_TOKEN}` },
        body: JSON.stringify({ messages: [ { role: 'system', content: 'Rewrite for Telegram post (RU if RU input).' }, { role: 'user', content: prompt } ] }),
      });
      const data = await resp.json<any>();
      const out = data?.result?.response || '';
      if (out) return out;
    }
    if (provider === 'openai' && env.OPENAI_API_KEY) {
      const prompt = buildPrompt(variant, text, brand);
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'authorization': `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: env.OPENAI_MODEL || 'gpt-4o-mini', messages: [ { role: 'system', content: 'Rewrite for Telegram post (RU if RU input).' }, { role: 'user', content: prompt } ] }),
      });
      const data = await resp.json<any>();
      const out = data?.choices?.[0]?.message?.content || '';
      if (out) return out;
    }
  } catch {}
  return heuristicImprove(variant, text, brand);
}

function buildPrompt(variant: string, text: string, brand?: any) {
  return `variant=${variant}\nbrand=${JSON.stringify(brand || {})}\n\n${text}`;
}

function heuristicImprove(variant: string, text: string, brand?: any) {
  const tone = brand?.tone || 'нейтральный';
  const addCTA = '\n\nПодписывайтесь и делитесь мнением!';
  if (variant === 'short') return shorten(text, 280) + addCTA;
  if (variant === 'interactive') return `${text}\n\nЧто вы думаете?` + addCTA;
  return `${text}\n\nПочему это важно: — 1 — 2 — 3` + addCTA + `\nТон: ${tone}`;
}
function shorten(t: string, max: number) { return t.length <= max ? t : t.slice(0, max - 1) + '…'; }