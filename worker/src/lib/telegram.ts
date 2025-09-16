export async function callTelegram(token: string, method: string, payload: any) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const json = await res.json<any>();
  if (!json.ok) throw new Error(json.description || 'Telegram error');
  return json.result;
}