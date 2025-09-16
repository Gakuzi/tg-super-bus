import { useEffect, useState } from 'react';
import { create, list, remove, update } from '../lib/db';

type Post = { id: string; title?: string; contentMd: string; status: string };

export default function Posts() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');

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
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" onClick={()=>publish(p.id)}><span className="material-symbols-outlined text-base">schedule</span></button>
                    <button className="rounded p-1 text-red-500 hover:bg-red-50" onClick={()=>del(p.id)}><span className="material-symbols-outlined text-base">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}