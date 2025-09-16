export default function Calendar() {
  const tz = localStorage.getItem('settings.timezone') || 'Europe/Moscow';
  return (
    <div className="card">
      <div style={{ fontWeight: 600 }}>Календарь ({tz})</div>
      <div style={{ color: '#666', marginTop: 8 }}>Drag&drop и подсказки времени будут добавлены.</div>
    </div>
  );
}