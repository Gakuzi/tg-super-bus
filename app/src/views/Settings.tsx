import { useEffect, useState } from 'react';
import { signInWithGoogle, signOutAll } from '../setup/firebase';
import { useI18n } from '../lib/i18n';

export default function Settings() {
  const apiBase = (import.meta as any).env.VITE_API_BASE || localStorage.getItem('VITE_API_BASE') || '';
  const salt = (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || localStorage.getItem('PUBLIC_SIGNING_SALT') || '';
  const [tz, setTz] = useState(localStorage.getItem('settings.timezone') || 'Europe/Moscow');
  const [lang, setLang] = useState(localStorage.getItem('settings.lang') || 'ru');
  const { setLang: setLangCtx } = useI18n();

  useEffect(() => { localStorage.setItem('settings.timezone', tz); }, [tz]);
  useEffect(() => { localStorage.setItem('settings.lang', lang); setLangCtx(lang as any); }, [lang]);

  return (
    <main className="flex-1 overflow-y-auto p-0">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-4xl font-bold tracking-tight text-slate-900">Настройки</h2>

        <section className="mb-10">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">Аккаунт</h3>
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex gap-3">
              <button className="btn-primary" onClick={signInWithGoogle}>Войти через Google</button>
              <button onClick={signOutAll}>Выйти</button>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">Подключения</h3>
          <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">API Base (Worker URL)</span>
              <input className="col-span-2 form-input rounded-md border-slate-300" defaultValue={apiBase} onBlur={(e) => localStorage.setItem('VITE_API_BASE', e.target.value)} />
            </label>
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">PUBLIC_SIGNING_SALT</span>
              <input className="col-span-2 form-input rounded-md border-slate-300" defaultValue={salt} onBlur={(e) => localStorage.setItem('PUBLIC_SIGNING_SALT', e.target.value)} />
            </label>
          </div>
        </section>

        <div className="border-t border-slate-200"></div>

        <section className="mt-10">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">Интерфейс</h3>
          <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">Часовой пояс</span>
              <input className="col-span-2 form-input rounded-md border-slate-300" value={tz} onChange={(e) => setTz(e.target.value)} />
            </label>
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">Язык</span>
              <select className="col-span-2 form-select rounded-md border-slate-300" value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}