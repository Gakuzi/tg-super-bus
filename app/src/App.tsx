import './styles/global.css';
import { useState } from 'react';
import Planner from './planner/Planner';
import Calendar from './views/Calendar';
import Ideas from './views/Ideas';
import Posts from './views/Posts';
import Analytics from './views/Analytics';
import Settings from './views/Settings';

export default function App() {
  const [tab, setTab] = useState<'planner' | 'calendar' | 'ideas' | 'posts' | 'analytics' | 'settings'>('planner');
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col p-4">
          <div className="mb-2 flex items-center gap-3 px-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary-color,#0da6f2)] text-white font-bold">T</div>
            <h2 className="m-0 text-base font-bold text-gray-900">TG Super-Bus</h2>
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='planner' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('planner')}>
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="text-sm font-medium">Планировщик</span>
            </button>
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('calendar')}>
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="text-sm font-medium">Календарь</span>
            </button>
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='ideas' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('ideas')}>
              <span className="material-symbols-outlined">lightbulb</span>
              <span className="text-sm font-medium">Идеи</span>
            </button>
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='posts' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('posts')}>
              <span className="material-symbols-outlined">article</span>
              <span className="text-sm font-medium">Посты</span>
            </button>
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('analytics')}>
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-sm font-medium">Аналитика</span>
            </button>
            <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('settings')}>
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Настройки</span>
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {tab === 'planner' && <Planner />}
        {tab === 'calendar' && <Calendar />}
        {tab === 'ideas' && <Ideas />}
        {tab === 'posts' && <Posts />}
        {tab === 'analytics' && <Analytics />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  );
}