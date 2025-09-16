export default function Settings() {
  const apiBase = (import.meta as any).env.VITE_API_BASE || localStorage.getItem('VITE_API_BASE') || '';
  const salt = (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || localStorage.getItem('PUBLIC_SIGNING_SALT') || '';
  const tz = localStorage.getItem('settings.timezone') || 'Europe/Moscow';
  const lang = localStorage.getItem('settings.lang') || 'ru';

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card col">
        <div style={{ fontWeight: 600 }}>Подключения</div>
        <label className="col">
          <div>API Base (Worker URL)</div>
          <input defaultValue={apiBase} onBlur={(e) => localStorage.setItem('VITE_API_BASE', e.target.value)} />
        </label>
        <label className="col">
          <div>PUBLIC_SIGNING_SALT</div>
          <input defaultValue={salt} onBlur={(e) => localStorage.setItem('PUBLIC_SIGNING_SALT', e.target.value)} />
        </label>
      </div>
      <div className="card col">
        <div style={{ fontWeight: 600 }}>Интерфейс</div>
        <label className="col">
          <div>Часовой пояс</div>
          <input defaultValue={tz} onBlur={(e) => localStorage.setItem('settings.timezone', e.target.value)} />
        </label>
        <label className="col">
          <div>Язык</div>
          <select defaultValue={lang} onBlur={(e) => localStorage.setItem('settings.lang', e.target.value)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
    </div>
  );
}