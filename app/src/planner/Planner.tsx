import { useEffect, useState } from 'react';

export default function Planner() {
  const [chatId, setChatId] = useState(localStorage.getItem('TG_CHAT_ID') || '');
  const [apiBase, setApiBase] = useState(localStorage.getItem('VITE_API_BASE') || '');
  const [text, setText] = useState('Привет из TG Super-Bus!');

  useEffect(() => {
    if (!apiBase) setApiBase('');
  }, [apiBase]);

  const send = async () => {
    if (!apiBase || !chatId) {
      alert('Укажите API Base и chat_id в Настройках');
      return;
    }
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/tg`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-dev': 'true' },
      body: JSON.stringify({ method: 'sendMessage', payload: { chat_id: chatId, text } }),
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || 'send failed');
    alert('Отправлено');
  };

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card col">
        <label className="col">
          <div>chat_id</div>
          <input value={chatId} onChange={(e) => { setChatId(e.target.value); localStorage.setItem('TG_CHAT_ID', e.target.value); }} placeholder="-100..." />
        </label>
        <label className="col">
          <div>Текст</div>
          <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <button onClick={send}>Отправить</button>
      </div>
    </div>
  );
}