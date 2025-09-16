import './styles/global.css';
import { useEffect, useState } from 'react';
import { useAuth } from './lib/auth';
import { signInWithGoogle } from './setup/firebase';
import Landing from './views/Landing';
import { upsertUser } from './lib/db';
import Planner from './planner/Planner';
import Calendar from './views/Calendar';
import Ideas from './views/Ideas';
import Posts from './views/Posts';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import { useI18n } from './lib/i18n';

export default function App() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'planner' | 'calendar' | 'ideas' | 'posts' | 'analytics' | 'settings'>('planner');
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 920);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Создать/обновить пользователя в БД после входа
  useEffect(() => {
    if (user) {
      upsertUser({ uid: user.uid, email: user.email || undefined, createdAt: Date.now() }).catch(() => {});
    }
  }, [user]);

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Загрузка…</div>;
  }

  if (!user) return <Landing />;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      {!isMobile && (
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
          <div className="flex h-full flex-col p-4">
            <div className="mb-2 flex items-center gap-3 px-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary-color,#0da6f2)] text-white font-bold">T</div>
              <h2 className="m-0 text-base font-bold text-gray-900">{t('app_name')}</h2>
            </div>
            <nav className="mt-2 flex flex-col gap-1">
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='planner' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('planner')}>
                <span className="material-symbols-outlined">auto_awesome</span>
                <span className="text-sm font-medium">{t('planner')}</span>
              </button>
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('calendar')}>
                <span className="material-symbols-outlined">calendar_today</span>
                <span className="text-sm font-medium">{t('calendar')}</span>
              </button>
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='ideas' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('ideas')}>
                <span className="material-symbols-outlined">lightbulb</span>
                <span className="text-sm font-medium">{t('ideas')}</span>
              </button>
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='posts' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('posts')}>
                <span className="material-symbols-outlined">article</span>
                <span className="text-sm font-medium">{t('posts')}</span>
              </button>
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('analytics')}>
                <span className="material-symbols-outlined">analytics</span>
                <span className="text-sm font-medium">{t('analytics')}</span>
              </button>
              <button className={`flex items-center gap-3 rounded-md px-3 py-2 text-left ${tab==='settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setTab('settings')}>
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">{t('settings')}</span>
              </button>
            </nav>
          </div>
        </aside>
      )}
      <main className="flex-1 p-8 pb-24">
        {tab === 'planner' && <Planner />}
        {tab === 'calendar' && <Calendar />}
        {tab === 'ideas' && <Ideas />}
        {tab === 'posts' && <Posts />}
        {tab === 'analytics' && <Analytics />}
        {tab === 'settings' && <Settings />}
      </main>
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-5 border-t border-gray-200 bg-white">
          {[
            { key: 'planner', icon: 'auto_awesome' },
            { key: 'calendar', icon: 'calendar_today' },
            { key: 'ideas', icon: 'lightbulb' },
            { key: 'posts', icon: 'article' },
            { key: 'settings', icon: 'settings' },
          ].map((item: any) => (
            <button key={item.key} className={`flex flex-col items-center justify-center py-2 text-xs ${tab===item.key ? 'text-blue-600' : 'text-gray-600'}`} onClick={() => setTab(item.key)}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{t(item.key as any)}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}