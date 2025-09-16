import { useEffect, useState } from 'react';
import { signInWithGoogle, signOutAll } from '../setup/firebase';
import { useI18n } from '../lib/i18n';
import { signRequest } from '../lib/hmac';

export default function Settings() {
  const apiBase = (import.meta as any).env.VITE_API_BASE || localStorage.getItem('VITE_API_BASE') || '';
  const salt = (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || localStorage.getItem('PUBLIC_SIGNING_SALT') || '';
  const provider = localStorage.getItem('AI_PROVIDER') || 'gemini';
  const devBypass = (localStorage.getItem('AI_DEV_BYPASS') || 'false') === 'true';
  const [tone, setTone] = useState(localStorage.getItem('brand.tone') || 'нейтральный');
  const [emojis, setEmojis] = useState((localStorage.getItem('brand.emojis') || 'true') === 'true');
  const [tz, setTz] = useState(localStorage.getItem('settings.timezone') || 'Europe/Moscow');
  const [lang, setLang] = useState(localStorage.getItem('settings.lang') || 'ru');
  const { setLang: setLangCtx } = useI18n();
  const [wizardOpen, setWizardOpen] = useState(false);

  // Wizard state
  const [wizStep, setWizStep] = useState<1|2|3|4>(1);
  const [wizChatId, setWizChatId] = useState(localStorage.getItem('wizard.chat_id') || '');
  const [wizTitle, setWizTitle] = useState('');
  const [wizLoading, setWizLoading] = useState(false);
  const [wizError, setWizError] = useState<string|null>(null);
  const [utmPreset, setUtmPreset] = useState(localStorage.getItem('utm.preset') || 'utm_source=tgsb&utm_medium=post&utm_campaign=default');

  const signingSecret = salt;

  const authHeaders = async (method: string, path: string, body: any) => {
    let headers: Record<string, string> = { 'content-type': 'application/json' };
    if (signingSecret) {
      const { sigHex, nonce, timestamp } = await signRequest(signingSecret, method, path, body);
      headers = { ...headers, 'x-signature': sigHex, 'x-nonce': nonce, 'x-timestamp': timestamp };
    } else {
      headers = { ...headers, 'x-dev': 'true' };
    }
    return headers;
  };

  const wizCheckChat = async () => {
    setWizLoading(true); setWizError(null);
    try {
      const path = 'api/tg';
      // try getChat info
      const bodyInfo = { method: 'getChat', payload: { chat_id: wizChatId } };
      const resInfo = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, { method: 'POST', headers: await authHeaders('POST', path, bodyInfo), body: JSON.stringify(bodyInfo) });
      const dataInfo = await resInfo.json();
      if (!resInfo.ok || dataInfo?.error) throw new Error(dataInfo?.error || 'getChat failed');
      setWizTitle(dataInfo?.result?.title || '');
      // try send test message and delete it
      const bodySend = { method: 'sendMessage', payload: { chat_id: wizChatId, text: 'Проверка TG Super-Bus (будет удалено)' } };
      const resSend = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, { method: 'POST', headers: await authHeaders('POST', path, bodySend), body: JSON.stringify(bodySend) });
      const dataSend = await resSend.json();
      if (!resSend.ok || dataSend?.error) throw new Error(dataSend?.error || 'sendMessage failed');
      const messageId = dataSend?.result?.message_id;
      if (messageId) {
        const bodyDel = { method: 'deleteMessage', payload: { chat_id: wizChatId, message_id: messageId } };
        await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, { method: 'POST', headers: await authHeaders('POST', path, bodyDel), body: JSON.stringify(bodyDel) });
      }
      setWizStep(4);
    } catch (e: any) {
      setWizError(e?.message || String(e));
    } finally {
      setWizLoading(false);
    }
  };

  const wizSaveChannel = () => {
    const channels = JSON.parse(localStorage.getItem('channels') || '[]');
    const exists = Array.isArray(channels) ? channels.find((c: any) => c.chat_id === wizChatId) : null;
    const updated = exists ? channels : [...(Array.isArray(channels)?channels:[]), { chat_id: wizChatId, title: wizTitle, utm: utmPreset }];
    localStorage.setItem('channels', JSON.stringify(updated));
    localStorage.setItem('wizard.chat_id', wizChatId);
  };

  useEffect(() => { localStorage.setItem('settings.timezone', tz); }, [tz]);
  useEffect(() => { localStorage.setItem('settings.lang', lang); setLangCtx(lang as any); }, [lang]);
  useEffect(() => { localStorage.setItem('brand.tone', tone); }, [tone]);
  useEffect(() => { localStorage.setItem('brand.emojis', String(emojis)); }, [emojis]);

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
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">AI Provider</span>
              <select className="col-span-2 form-select rounded-md border-slate-300" defaultValue={provider} onChange={(e) => localStorage.setItem('AI_PROVIDER', e.target.value)}>
                <option value="gemini">Gemini (бесплатно)</option>
                <option value="cf_ai">Cloudflare AI</option>
                <option value="openai">OpenAI</option>
                <option value="heuristic">Heuristic (локально)</option>
              </select>
            </label>
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">Dev bypass (локальный тест)</span>
              <input type="checkbox" className="col-span-2 h-5 w-5" defaultChecked={devBypass} onChange={(e) => localStorage.setItem('AI_DEV_BYPASS', String(e.target.checked))} />
            </label>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">Подключение бота (визард)</h3>
            <button className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50" onClick={()=>setWizardOpen(v=>!v)}>{wizardOpen ? 'Скрыть' : 'Открыть'}</button>
          </div>
          {wizardOpen && (
            <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2 text-sm">
                <div className={`h-6 w-6 shrink-0 rounded-full text-center leading-6 ${wizStep>=1?'bg-blue-600 text-white':'bg-slate-200 text-slate-600'}`}>1</div>
                <div className="font-medium">Токен бота</div>
              </div>
              <div className="text-sm text-slate-700">
                Создайте бота в <a className="text-blue-600" href="https://t.me/BotFather" target="_blank" rel="noreferrer">@BotFather</a> и сохраните токен в Secrets воркера: <code className="rounded bg-slate-100 px-1">TG_BOT_TOKEN</code>.
                Из UI мы токен не сохраняем. Выполните в терминале:
                <pre className="mt-2 rounded bg-slate-50 p-3 text-xs">wrangler secret put TG_BOT_TOKEN</pre>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`h-6 w-6 shrink-0 rounded-full text-center leading-6 ${wizStep>=2?'bg-blue-600 text-white':'bg-slate-200 text-slate-600'}`}>2</div>
                <div className="font-medium">chat_id канала</div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className="form-input rounded-md border-slate-300 md:col-span-2" placeholder="-100..." value={wizChatId} onChange={(e)=>setWizChatId(e.target.value)} />
                <button className="rounded-md bg-[#0da6f2] px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={wizLoading || !wizChatId} onClick={()=>{ setWizStep(3); wizCheckChat(); }}>Проверить</button>
              </div>
              {wizError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{wizError}</div>}
              {wizLoading && <div className="text-sm text-slate-600">Проверка…</div>}
              {wizStep===4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-6 w-6 shrink-0 rounded-full text-center leading-6 bg-blue-600 text-white`}>4</div>
                    <div className="font-medium">Итог и пресеты UTM</div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="text-sm text-slate-700">Канал: <span className="font-semibold">{wizTitle || 'Без названия'}</span> (<span className="text-slate-500">{wizChatId}</span>)</label>
                    <select className="form-select rounded-md border-slate-300" value={utmPreset} onChange={(e)=>{ setUtmPreset(e.target.value); localStorage.setItem('utm.preset', e.target.value); }}>
                      <option value="utm_source=tgsb&utm_medium=post&utm_campaign=default">utm_source=tgsb…</option>
                      <option value="utm_source=telegram&utm_medium=post&utm_campaign=organic">utm_source=telegram…</option>
                      <option value="utm_source=telegram&utm_medium=post&utm_campaign=promo">utm_source=telegram…promo</option>
                    </select>
                  </div>
                  <div className="rounded-md border border-slate-200 p-3">
                    <div className="mb-2 text-sm font-medium text-slate-800">Предпросмотр публикации (мок)</div>
                    <div className="rounded-md bg-slate-900 p-3 text-slate-100">
                      <div className="text-xs text-slate-400">{wizTitle || 'Канал'}</div>
                      <div className="mt-1 text-sm">Пример поста с UTM: https://example.com?{utmPreset}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary" onClick={wizSaveChannel}>Сохранить канал</button>
                    <button className="rounded-md border border-slate-300 px-4 py-2" onClick={()=>setWizStep(2)}>Назад</button>
                  </div>
                </div>
              )}
            </div>
          )}
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
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">Тон бренда</span>
              <input className="col-span-2 form-input rounded-md border-slate-300" value={tone} onChange={(e) => setTone(e.target.value)} />
            </label>
            <label className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <span className="font-medium text-slate-700">Эмодзи</span>
              <input type="checkbox" className="col-span-2 h-5 w-5" checked={emojis} onChange={(e) => setEmojis(e.target.checked)} />
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}