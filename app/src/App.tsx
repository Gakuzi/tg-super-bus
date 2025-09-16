import './styles/global.css';
import SetupWizard from './setup/SetupWizard';
import Planner from './planner/Planner';
import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState<'setup' | 'planner'>('setup');
  return (
    <div style={{ padding: 16 }}>
      <h2>TG Super-Bus</h2>
      <div className="row" style={{ marginBottom: 12 }}>
        <button onClick={() => setTab('setup')} style={{ background: tab === 'setup' ? '#eee' : '' }}>Настройки</button>
        <button onClick={() => setTab('planner')} style={{ background: tab === 'planner' ? '#eee' : '' }}>Планировщик</button>
      </div>
      {tab === 'setup' ? <SetupWizard /> : <Planner />}
    </div>
  );
}