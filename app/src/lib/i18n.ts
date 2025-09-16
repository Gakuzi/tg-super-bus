import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'ru' | 'en';

type Dict = Record<string, { ru: string; en: string }>; 

const DICT: Dict = {
  app_name: { ru: 'TG Super-Bus', en: 'TG Super-Bus' },
  planner: { ru: 'Планировщик', en: 'Planner' },
  calendar: { ru: 'Календарь', en: 'Calendar' },
  ideas: { ru: 'Идеи', en: 'Ideas' },
  posts: { ru: 'Посты', en: 'Posts' },
  analytics: { ru: 'Аналитика', en: 'Analytics' },
  settings: { ru: 'Настройки', en: 'Settings' },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('settings.lang') as Lang) || 'ru');

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('settings.lang', l);
  };

  useEffect(() => {
    const stored = (localStorage.getItem('settings.lang') as Lang) || 'ru';
    if (stored !== lang) setLangState(stored);
  }, []);

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    setLang,
    t: (key) => DICT[key]?.[lang] ?? key,
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

