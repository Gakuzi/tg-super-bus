import { signInWithGoogle } from '../setup/firebase';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#0da6f2] text-white text-lg font-bold">T</div>
          <div className="text-lg font-semibold text-slate-900">TG Super-Bus</div>
        </div>
        <div className="hidden gap-3 sm:flex">
          <button className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={signInWithGoogle}>Войти</button>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black" onClick={signInWithGoogle}>Начать бесплатно</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="mt-8 grid items-center gap-10 md:mt-14 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] text-slate-900 md:text-5xl">
              Управляйте Telegram-каналами с ИИ-помощником
            </h1>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Идеи, улучшение текста, календарь публикаций, аналитика и автоматизация — всё в одном окне. Без серверов и платных подписок.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button className="rounded-lg bg-[#0da6f2] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600" onClick={signInWithGoogle}>Войти через Google</button>
              <button className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={signInWithGoogle}>Попробовать сейчас</button>
            </div>
            <div className="mt-4 text-xs text-slate-500">Бесплатно: GitHub Pages + Firebase Auth + Cloudflare Worker</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
              <div className="text-sm text-slate-400">Предпросмотр</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-slate-800 p-3">ИИ улучшает посты ✨<div className="mt-1 text-xs text-slate-400">Эмодзи, хэштеги, CTA</div></div>
                <div className="rounded-lg bg-slate-800 p-3">Календарь публикаций 📅<div className="mt-1 text-xs text-slate-400">drag&drop, лучшее время</div></div>
                <div className="rounded-lg bg-slate-800 p-3">Аналитика 📊<div className="mt-1 text-xs text-slate-400">CTR, охваты, топ-темы</div></div>
                <div className="rounded-lg bg-slate-800 p-3">Команда 👥<div className="mt-1 text-xs text-slate-400">ролей и ревью-контент</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: 'auto_awesome', title: 'ИИ-ассистент', desc: 'Короткие, подробные и интерактивные варианты. Тон бренда и пресеты.' },
            { icon: 'calendar_today', title: 'Планировщик', desc: 'Перетаскивайте посты в удобный календарь. Подсказки лучшего времени.' },
            { icon: 'analytics', title: 'Аналитика', desc: 'CTR, охваты, эффективность по времени. Экспорт CSV/JSON.' },
          ].map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-800">{f.icon}</span>
                <div className="text-base font-semibold text-slate-900">{f.title}</div>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">{f.desc}</div>
            </div>
          ))}
        </section>

        <section className="my-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8">
          <div className="text-xl font-semibold text-slate-900">Готовы начать?</div>
          <div className="mt-2 text-slate-600">Войдите и подключите ваш Telegram-канал за 2 минуты.</div>
          <button className="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black" onClick={signInWithGoogle}>Войти через Google</button>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-slate-500">© {new Date().getFullYear()} TG Super-Bus</footer>
    </div>
  );
}

