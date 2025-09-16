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
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>TG Super-Bus</h2>
      <nav className="row" style={{ gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab('planner')} style={{ background: tab === 'planner' ? '#eee' : '' }}>Планировщик</button>
        <button onClick={() => setTab('calendar')} style={{ background: tab === 'calendar' ? '#eee' : '' }}>Календарь</button>
        <button onClick={() => setTab('ideas')} style={{ background: tab === 'ideas' ? '#eee' : '' }}>Идеи</button>
        <button onClick={() => setTab('posts')} style={{ background: tab === 'posts' ? '#eee' : '' }}>Посты</button>
        <button onClick={() => setTab('analytics')} style={{ background: tab === 'analytics' ? '#eee' : '' }}>Аналитика</button>
        <button onClick={() => setTab('settings')} style={{ background: tab === 'settings' ? '#eee' : '' }}>Настройки</button>
      </nav>
      {tab === 'planner' && <Planner />}
      {tab === 'calendar' && <Calendar />}
      {tab === 'ideas' && <Ideas />}
      {tab === 'posts' && <Posts />}
      {tab === 'analytics' && <Analytics />}
      {tab === 'settings' && <Settings />}
    </div>
  );
}