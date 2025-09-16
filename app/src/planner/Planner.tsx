import { useEffect, useState } from 'react';
import { signRequest } from '../lib/hmac';

export default function Planner() {
  const [chatId, setChatId] = useState(localStorage.getItem('TG_CHAT_ID') || '');
  const [apiBase, setApiBase] = useState(localStorage.getItem('VITE_API_BASE') || (import.meta as any).env.VITE_API_BASE || '');
  const [text, setText] = useState('Привет из TG Super-Bus!');
  const [sending, setSending] = useState(false);
  const signingSecret = localStorage.getItem('PUBLIC_SIGNING_SALT') || (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || '';

  useEffect(() => {
    if (!apiBase) setApiBase('');
  }, [apiBase]);

  const authHeaders = async (method: string, path: string, body: any) => {
    let headers: Record<string, string> = { 'content-type': 'application/json' };
    if (signingSecret) {
      const { sigHex, nonce, timestamp } = await signRequest(signingSecret, method, path, body);
      headers = { ...headers, 'x-signature': sigHex, 'x-nonce': nonce, 'x-timestamp': timestamp };
    } else {
      headers = { ...headers, 'x-dev': 'true' };
    }
    return headers;
  };

  const improve = async (variant: 'short' | 'detailed' | 'interactive') => {
    const path = 'api/ai/improve';
    const body = { variant, text };
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, {
      method: 'POST',
      headers: await authHeaders('POST', path, body),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'ai failed');
    setText(data.text || text);
  };

  const send = async () => {
    if (!apiBase || !chatId) {
      alert('Укажите API Base и chat_id в Настройках');
      return;
    }
    try {
      setSending(true);
      const path = 'api/tg';
      const body = { method: 'sendMessage', payload: { chat_id: chatId, text } };
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, {
        method: 'POST',
        headers: await authHeaders('POST', path, body),
        body: JSON.stringify(body),
      });
      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();
      if (!res.ok || (data as any)?.error) throw new Error((data as any)?.error || `HTTP ${res.status}`);
      alert('Отправлено');
    } catch (e: any) {
      console.error('Send error', e);
      alert(`Ошибка отправки: ${e?.message || e}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card row">
        <button onClick={() => improve('short')}>ИИ: короткий</button>
        <button onClick={() => improve('detailed')}>ИИ: подробный</button>
        <button onClick={() => improve('interactive')}>ИИ: интерактив</button>
      </div>
      <div className="card col">
        <label className="col">
          <div>chat_id</div>
          <input value={chatId} onChange={(e) => { setChatId(e.target.value); localStorage.setItem('TG_CHAT_ID', e.target.value); }} placeholder="-100..." />
        </label>
        <label className="col">
          <div>Текст</div>
          <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <button onClick={send} disabled={sending}>{sending ? 'Отправка…' : 'Отправить'}</button>
      </div>
    </div>
  );
}