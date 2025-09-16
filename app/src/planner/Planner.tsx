import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { signRequest } from '../lib/hmac';

export default function Planner() {
  const [chatId, setChatId] = useState(localStorage.getItem('TG_CHAT_ID') || '');
  const [apiBase, setApiBase] = useState(localStorage.getItem('VITE_API_BASE') || (import.meta as any).env.VITE_API_BASE || '');
  const [text, setText] = useState('Привет из TG Super-Bus!');
  const [sending, setSending] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'draft'|'review'|'approved'|'scheduled'|'sent'>('draft');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const previewHtml = useMemo(() => {
    const html = marked.parse(text || '');
    return { __html: DOMPurify.sanitize(html as string) };
  }, [text]);
  const signingSecret = localStorage.getItem('PUBLIC_SIGNING_SALT') || (import.meta as any).env.VITE_PUBLIC_SIGNING_SALT || '';

  useEffect(() => {
    if (!apiBase) setApiBase('');
  }, [apiBase]);

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

  const improve = async (variant: 'short' | 'detailed' | 'interactive') => {
    const path = 'api/ai/improve';
    const body = { variant, text };
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, {
      method: 'POST',
      headers: await authHeaders('POST', path, body),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'ai failed');
    setText(data.text || text);
  };

  const send = async () => {
    if (!apiBase || !chatId) {
      alert('Укажите API Base и chat_id в Настройках');
      return;
    }
    try {
      setSending(true);
      const path = 'api/tg';
      const body = { method: 'sendMessage', payload: { chat_id: chatId, text } };
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/${path}`, {
        method: 'POST',
        headers: await authHeaders('POST', path, body),
        body: JSON.stringify(body),
      });
      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();
      if (!res.ok || (data as any)?.error) throw new Error((data as any)?.error || `HTTP ${res.status}`);
      alert('Отправлено');
    } catch (e: any) {
      console.error('Send error', e);
      alert(`Ошибка отправки: ${e?.message || e}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="planner-page">
      <section className="col" style={{ gap: 16 }}>
        <div className="card col">
          <div className="section-title">Создать новый пост</div>
          <label className="col">
            <div>Заголовок поста</div>
            <input placeholder="Введите заголовок поста" value={title} onChange={(e)=>setTitle(e.target.value)} />
          </label>
          <label className="col">
            <div>Содержимое поста (Markdown)</div>
            <textarea rows={10} placeholder="Напишите свой пост здесь..." value={text} onChange={(e) => setText(e.target.value)} />
          </label>
        </div>

        <div className="card col">
          <div className="section-title">ИИ Помощник</div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <label className="col" style={{ flex: 1 }}>
              <div>Вариант улучшения</div>
              <select onChange={() => {}}>
                <option>Улучшить текст</option>
                <option>Подробный</option>
                <option>Интерактивный</option>
              </select>
            </label>
          </div>
          <div className="actions">
            <button className="btn-primary" onClick={() => improve('short')}>Короткий</button>
            <button className="btn-primary" onClick={() => improve('detailed')}>Подробный</button>
            <button className="btn-primary" onClick={() => improve('interactive')}>Интерактив</button>
          </div>
        </div>

        <div className="card col">
          <div className="section-title">Настройки поста</div>
          <div className="row" style={{ gap: 12 }}>
            <label className="col" style={{ flex: 1 }}>
              <div>chat_id канала</div>
              <input value={chatId} onChange={(e) => { setChatId(e.target.value); localStorage.setItem('TG_CHAT_ID', e.target.value); }} placeholder="-100..." />
            </label>
            <label className="col" style={{ flex: 1 }}>
              <div>Время публикации</div>
              <input type="datetime-local" />
            </label>
          </div>
          <div className="actions">
            <button>Сохранить как черновик</button>
            <button className="btn-primary" onClick={send} disabled={sending}>{sending ? 'Отправка…' : 'Опубликовать'}</button>
          </div>
        </div>
      </section>

      <aside className="col" style={{ gap: 16 }}>
        <div className="card col" style={{ gap: 12 }}>
          <div className="section-title">Предпросмотр поста</div>
          <div className="card" style={{ background: '#0f172a', color: '#fff' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>TG Super-Bus</div>
            <div className="muted" style={{ color: '#d1d5db' }}>{title || 'Заголовок поста'}</div>
            <div style={{ fontSize: 14, color: '#e5e7eb' }} dangerouslySetInnerHTML={previewHtml} />
          </div>
        </div>

        <div className="card col" style={{ gap: 12 }}>
          <div className="section-title">Статус поста</div>
          <div className="status-timeline col" style={{ gap: 14 }}>
            <div className="status-item">
              <div className={`status-dot ${status==='draft'?'active':''}`}>✓</div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600 }}>Черновик</div>
                <div className="muted">Создан только что</div>
              </div>
            </div>
            <div className="status-item">
              <div className={`status-dot ${status==='scheduled'?'active':''}`}>•</div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, color: '#6b7280' }}>Запланировано</div>
                <div className="muted">Ожидает публикации</div>
              </div>
            </div>
            <div className="status-item">
              <div className={`status-dot ${status==='sent'?'active':''}`}>•</div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, color: '#6b7280' }}>Опубликовано</div>
                <div className="muted">Еще не опубликовано</div>
              </div>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button onClick={()=>setStatus('review')}>На ревью</button>
            <button onClick={()=>setStatus('approved')}>Утвердить</button>
            <button onClick={()=>setStatus('scheduled')}>Запланировать</button>
            <button onClick={()=>setStatus('sent')}>Отметить отправленным</button>
          </div>
        </div>

        <div className="card col" style={{ gap: 10 }}>
          <div className="section-title">Комментарии</div>
          <div className="col" style={{ gap: 6 }}>
            {comments.length === 0 && <div className="muted">Нет комментариев</div>}
            {comments.map((c, i)=>(
              <div key={i} className="row" style={{ justifyContent:'space-between' }}>
                <div>{c}</div>
              </div>
            ))}
          </div>
          <div className="row">
            <input placeholder="Оставьте комментарий (@user)" value={newComment} onChange={(e)=>setNewComment(e.target.value)} />
            <button className="btn-primary" onClick={()=>{ if(newComment.trim()){ setComments((p)=>[...p, newComment.trim()]); setNewComment(''); } }}>Добавить</button>
          </div>
        </div>

      </aside>
    </div>
  );
}