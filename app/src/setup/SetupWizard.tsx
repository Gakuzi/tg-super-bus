import { useEffect, useState } from 'react';

function Field({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <label className="col" style={{ width: '100%' }}>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} />
    </label>
  );
}

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [firebaseConfig, setFirebaseConfig] = useState(localStorage.getItem('FIREBASE_CONFIG') || '');
  const [apiBase, setApiBase] = useState(localStorage.getItem('VITE_API_BASE') || '');
  const [publicSalt, setPublicSalt] = useState(localStorage.getItem('PUBLIC_SIGNING_SALT') || '');
  const [tgChatId, setTgChatId] = useState(localStorage.getItem('TG_CHAT_ID') || '');
  const [workerUrl, setWorkerUrl] = useState(apiBase);

  useEffect(() => {
    setWorkerUrl(apiBase);
  }, [apiBase]);

  const save = () => {
    if (firebaseConfig) localStorage.setItem('FIREBASE_CONFIG', firebaseConfig);
    if (apiBase) localStorage.setItem('VITE_API_BASE', apiBase);
    if (publicSalt) localStorage.setItem('PUBLIC_SIGNING_SALT', publicSalt);
    if (tgChatId) localStorage.setItem('TG_CHAT_ID', tgChatId);
    alert('Сохранено в localStorage');
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="card col">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>Мастер настроек</b>
          <div>Шаг {step} из 4</div>
        </div>
        {step === 1 && (
          <div className="col">
            <div><b>Firebase</b> — включите Auth (email/пароль) и Firestore.</div>
            <ol>
              <li>Создайте проект в Firebase Console.</li>
              <li>Включите Authentication (Email/Password) и Firestore.</li>
              <li>Скопируйте client firebaseConfig (объект JSON).</li>
            </ol>
            <Field label="firebaseConfig JSON" value={firebaseConfig} onChange={setFirebaseConfig} placeholder='{"apiKey":"...","authDomain":"..."}' />
            <button onClick={() => setStep(2)}>Далее</button>
          </div>
        )}
        {step === 2 && (
          <div className="col">
            <div><b>Cloudflare Worker</b> — прокси Telegram и API.</div>
            <ol>
              <li>Создайте воркер, включите KV, задайте Secrets: SIGNING_SECRET, TG_BOT_TOKEN, CF_ALLOWED_ORIGINS, GCP_SA_JSON, FIREBASE_PROJECT_ID.</li>
              <li>Опубликуйте воркер и получите URL вида https://<name>.workers.dev/</li>
            </ol>
            <Field label="API Base (Worker URL)" value={apiBase} onChange={setApiBase} placeholder="https://tgsb.workers.dev/" />
            <Field label="PUBLIC_SIGNING_SALT (клиентская соль)" value={publicSalt} onChange={setPublicSalt} placeholder="любой текст" />
            <button onClick={() => setStep(3)}>Далее</button>
          </div>
        )}
        {step === 3 && (
          <div className="col">
            <div><b>Telegram</b> — бот и канал/чат.</div>
            <ol>
              <li>Создайте бота через @BotFather, добавьте в канал админом.</li>
              <li>Проверьте доступ: https://api.telegram.org/botTOKEN/getUpdates</li>
              <li>Укажите chat_id тестового канала.</li>
            </ol>
            <Field label="chat_id" value={tgChatId} onChange={setTgChatId} placeholder="-1001234567890" />
            <button onClick={() => setStep(4)}>Далее</button>
          </div>
        )}
        {step === 4 && (
          <div className="col">
            <div><b>GitHub Pages</b> — деплой фронта.</div>
            <ol>
              <li>Создайте репозиторий tg-super-bus.</li>
              <li>Пуш: <code>git remote add origin ... && git push -u origin main</code></li>
              <li>Включите Pages (GitHub Actions). Workflow уже добавлен.</li>
            </ol>
            <button onClick={save}>Сохранить</button>
          </div>
        )}
      </div>

      <div className="card">
        <div><b>Подсказки</b></div>
        <div>
          Worker URL: {workerUrl || '—'} | chat_id: {tgChatId || '—'}
        </div>
      </div>
    </div>
  );
}