import { useEffect, useState } from 'react';
import { create, list, remove, update } from '../lib/db';
import { improveTextClient } from '../lib/ai';

type Post = { id: string; title?: string; contentMd: string; status: string };

export default function Posts() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [aiOpen, setAiOpen] = useState<string | null>(null);
  const [aiVariant, setAiVariant] = useState<'short' | 'interactive' | 'detailed'>('short');
  const [optEmojis, setOptEmojis] = useState((localStorage.getItem('brand.emojis')||'true')==='true');
  const [optHashtags, setOptHashtags] = useState(false);
  const [optCTA, setOptCTA] = useState(true);
  const [aiRunning, setAiRunning] = useState(false);

  async function load() {
    setLoading(true);
    const docs = await list('posts', { order: ['createdAt', 'desc'] });
    setItems(docs as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addDraft() {
    const id = await create('posts', { contentMd: draft || 'Новый пост', status: 'draft', channels: [] });
    setDraft('');
    await load();
  }

  async function publish(id: string) {
    await update(`posts/${id}`, { status: 'scheduled' });
    await load();
  }

  async function del(id: string) {
    await remove(`posts/${id}`);
    await load();
  }

  async function improve(id: string) {
    try {
      setAiRunning(true);
      const item = items.find((x)=>x.id===id);
      const brand = { tone: localStorage.getItem('brand.tone') || 'нейтральный', emojis: optEmojis, hashtags: optHashtags, cta: optCTA };
      const apiBase = (import.meta as any).env.VITE_API_BASE || localStorage.getItem('VITE_API_BASE') || '';
      const devBypass = (localStorage.getItem('AI_DEV_BYPASS') || 'false')==='true';
      const text = item?.contentMd || '';
      const out = await improveTextClient(aiVariant, text, brand, { apiBase, devBypass });
      await update(`posts/${id}`, { contentMd: out, title: (out || '').slice(0, 80) });
      await load();
      setAiOpen(null);
    } finally {
      setAiRunning(false);
    }
  }

  return (
    <main className="flex-1 p-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Посты</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Импорт</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700" onClick={addDraft}>Новый пост</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Заголовок</th>
              <th className="px-6 py-3">Статус</th>
              <th className="px-6 py-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-6 py-4" colSpan={3}>Загрузка…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-6 py-4" colSpan={3}>Пока нет постов</td></tr>
            ) : items.map((p)=> (
              <tr key={p.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.title || (p.contentMd?.slice(0, 40) || 'Без названия')}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{p.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1 text-purple-600 hover:bg-purple-50" onClick={()=>setAiOpen(p.id)} title="Улучшить с ИИ"><span className="material-symbols-outlined text-base">auto_awesome</span></button>
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" onClick={()=>publish(p.id)}><span className="material-symbols-outlined text-base">schedule</span></button>
                    <button className="rounded p-1 text-red-500 hover:bg-red-50" onClick={()=>del(p.id)}><span className="material-symbols-outlined text-base">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {aiOpen && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/30 p-4 md:items-center">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Улучшить с ИИ</h3>
              <button onClick={()=>setAiOpen(null)} className="rounded p-1 text-gray-500 hover:bg-gray-100"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Вариант</span>
                <select className="form-select w-full rounded-md border-slate-300" value={aiVariant} onChange={(e)=>setAiVariant(e.target.value as any)}>
                  <option value="short">Короткий</option>
                  <option value="detailed">Подробный</option>
                  <option value="interactive">Интерактивный</option>
                </select>
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={optEmojis} onChange={(e)=>setOptEmojis(e.target.checked)} />
                  <span className="text-sm text-gray-700">Эмодзи</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={optHashtags} onChange={(e)=>setOptHashtags(e.target.checked)} />
                  <span className="text-sm text-gray-700">Хэштеги</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={optCTA} onChange={(e)=>setOptCTA(e.target.checked)} />
                  <span className="text-sm text-gray-700">CTA</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={()=>setAiOpen(null)}>Отмена</button>
              <button disabled={aiRunning} className={`rounded-md px-4 py-2 text-white ${aiRunning ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={()=>improve(aiOpen)}>
                {aiRunning ? 'Генерация…' : 'Сгенерировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}