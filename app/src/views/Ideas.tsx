import { useState } from 'react';

export default function Ideas() {
  const [topic, setTopic] = useState('финтех');
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [list, setList] = useState<{ title: string; url: string }[]>([]);
  const apiBase = localStorage.getItem('VITE_API_BASE') || (import.meta as any).env.VITE_API_BASE || '';

  const discover = async () => {
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/rss/discover?topic=${encodeURIComponent(topic)}&lang=${lang}`);
    const data = await res.json();
    setList(data || []);
  };

  return (
    <main className="flex-1 p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-gray-900 text-4xl font-bold">Идеи</h1>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-6 bg-[#0da6f2] text-white text-sm font-bold leading-normal shadow-md hover:bg-blue-600 transition-colors">
          <span className="material-symbols-outlined mr-2">add</span>
          <span className="truncate">Новая идея</span>
        </button>
      </div>

      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input className="form-input w-full rounded-md border-gray-300 pl-10 focus:border-[#0da6f2] focus:ring-[#0da6f2]" placeholder="Тема (например, финтех)" type="text" value={topic} onChange={(e)=>setTopic(e.target.value)} />
        </div>
        <select className="form-select rounded-md border-gray-300 focus:border-[#0da6f2] focus:ring-[#0da6f2]" value={lang} onChange={(e)=>setLang(e.target.value as any)}>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <button className="px-4 py-2 rounded-md bg-[#0da6f2] text-white text-sm font-medium" onClick={discover}>Найти источники</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <div className="p-4">
              <h3 className="text-gray-800 text-lg font-bold">{s.title}</h3>
              <a className="text-blue-600 text-sm break-all" href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}