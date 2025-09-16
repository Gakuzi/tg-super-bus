export default function Calendar() {
  const tz = localStorage.getItem('settings.timezone') || 'Europe/Moscow';
  return (
    <div className="flex-1 overflow-y-auto">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Календарь ({tz})</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span>Месяц</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Создать пост</button>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <button className="rounded-full p-2 hover:bg-gray-100"><span className="material-symbols-outlined">chevron_left</span></button>
              <h2 className="text-lg font-semibold text-gray-800">Июль 2024</h2>
              <button className="rounded-full p-2 hover:bg-gray-100"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
            <div className="grid grid-cols-7 gap-px p-1">
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Вс</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Пн</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Вт</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Ср</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Чт</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Пт</div>
              <div className="py-2 text-center text-xs font-semibold uppercase text-gray-500">Сб</div>
              <div className="col-start-4 h-24 border-t border-gray-200 p-2 text-sm text-gray-800">1</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">2</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">3</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">4</div>
              <div className="relative h-24 border-t border-gray-200 bg-blue-50 p-2 text-sm">
                <span className="font-bold text-blue-600">5</span>
                <div className="mt-1 space-y-1">
                  <div className="cursor-pointer rounded bg-blue-200 p-1 text-xs text-blue-800">Пост: Технологии</div>
                  <div className="cursor-pointer rounded bg-green-200 p-1 text-xs text-green-800">Обновление</div>
                </div>
              </div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">6</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">7</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">8</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">9</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">10</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">11</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">12</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">13</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">14</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">15</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">16</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">17</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">18</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">19</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">20</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">21</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">22</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">23</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">24</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">25</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">26</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">27</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">28</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">29</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">30</div>
              <div className="h-24 border-t border-gray-200 p-2 text-sm text-gray-800">31</div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Запланированные посты на 5 июля</h2>
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">Элемент {i}</p>
                  <span className="text-sm text-gray-500">10:00</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Канал: Пример канала</p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"><span className="material-symbols-outlined text-lg">edit</span></button>
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"><span className="material-symbols-outlined text-lg">drag_handle</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}