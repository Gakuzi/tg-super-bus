export default function Analytics() {
  return (
    <main className="flex-1 p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
        <div className="flex gap-4">
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-md border border-gray-300 bg-white px-4">
            <p className="text-gray-700 text-sm font-medium">Все каналы</p>
            <span className="material-symbols-outlined text-gray-500 text-lg">expand_more</span>
          </button>
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-md border border-gray-300 bg-white px-4">
            <p className="text-gray-700 text-sm font-medium">Все время</p>
            <span className="material-symbols-outlined text-gray-500 text-lg">expand_more</span>
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Обзор</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {label:'Подписчики', value:'12,345', delta:'+12%'},
            {label:'Посты', value:'678', delta:'+5%'},
            {label:'Просмотры', value:'90,123', delta:'+8%'}
          ].map((m, i)=> (
            <div key={i} className="flex flex-col gap-2 rounded-lg p-6 bg-white border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">{m.label}</p>
              <p className="text-gray-900 text-3xl font-bold">{m.value}</p>
              <div className="flex items-center text-green-600">
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                <p className="text-sm font-medium">{m.delta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Эффективность каналов</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Подписчики</p>
                <p className="text-gray-900 text-3xl font-bold">+12%</p>
                <p className="text-gray-500 text-sm">За последний месяц</p>
              </div>
              <div className="flex items-center text-green-600">
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                <p className="text-sm font-medium">12%</p>
              </div>
            </div>
            <div className="grid min-h-[200px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
              <div className="bg-blue-500/20 w-full rounded-t-md" style={{height:'100%'}}></div>
              <p className="text-gray-500 text-xs font-medium">Канал 1</p>
              <div className="bg-blue-500/20 w-full rounded-t-md" style={{height:'70%'}}></div>
              <p className="text-gray-500 text-xs font-medium">Канал 2</p>
              <div className="bg-blue-500/20 w-full rounded-t-md" style={{height:'85%'}}></div>
              <p className="text-gray-500 text-xs font-medium">Канал 3</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Просмотры</p>
                <p className="text-gray-900 text-3xl font-bold">+8%</p>
                <p className="text-gray-500 text-sm">За последний месяц</p>
              </div>
              <div className="flex items-center text-green-600">
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                <p className="text-sm font-medium">8%</p>
              </div>
            </div>
            <div className="flex min-h-[200px] flex-1 flex-col justify-end pt-4">
              <div className="w-full h-[150px] bg-gradient-to-b from-blue-500/20 to-transparent rounded-b"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}