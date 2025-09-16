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
    <div className="app">
      <aside className="sidebar">
        <h2>TG Super-Bus</h2>
        <nav className="nav">
          <button className={tab==='planner'?'active':''} onClick={() => setTab('planner')}>Планировщик</button>
          <button className={tab==='calendar'?'active':''} onClick={() => setTab('calendar')}>Календарь</button>
          <button className={tab==='ideas'?'active':''} onClick={() => setTab('ideas')}>Идеи</button>
          <button className={tab==='posts'?'active':''} onClick={() => setTab('posts')}>Посты</button>
          <button className={tab==='analytics'?'active':''} onClick={() => setTab('analytics')}>Аналитика</button>
          <button className={tab==='settings'?'active':''} onClick={() => setTab('settings')}>Настройки</button>
        </nav>
      </aside>
      <main className="content">
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