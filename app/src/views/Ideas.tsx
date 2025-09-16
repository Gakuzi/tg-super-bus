import { useState } from 'react';

export default function Ideas() {
  const [topic, setTopic] = useState('финтех');
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [list, setList] = useState<{ title: string; url: string }[]>([]);
  const apiBase = localStorage.getItem('VITE_API_BASE') || (import.meta as any).env.VITE_API_BASE || '';

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card row">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Тема" />
        <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <button onClick={async () => {
          const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/rss/discover?topic=${encodeURIComponent(topic)}&lang=${lang}`);
          const data = await res.json();
          setList(data);
        }}>Найти источники</button>
      </div>
      <div className="col" style={{ gap: 8 }}>
        {list.map((s, i) => (
          <div key={i} className="card">
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <a href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
          </div>
        ))}
      </div>
    </div>
  );
}