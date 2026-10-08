import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function MonthlyChart({ lang, t, monthlyRain, activeTemp }) {
  const monthsNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthsNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const baseTempNum = Number(activeTemp) || 23;
  const monthlyTemps = [
    baseTempNum - 8, baseTempNum - 6, baseTempNum - 3, baseTempNum, 
    baseTempNum + 4, baseTempNum + 7, baseTempNum + 8, baseTempNum + 8, 
    baseTempNum + 5, baseTempNum + 1, baseTempNum - 4, baseTempNum - 7
  ];

  const maxRainVal = Math.max(...monthlyRain, 30);
  const points = monthlyRain.map((val, i) => {
    const x = (i / 11) * 100;
    const y = 90 - (val / maxRainVal) * 75;
    return { x, y, val, temp: monthlyTemps[i].toFixed(1), month: lang === 'ar' ? monthsNamesAr[i] : monthsNamesEn[i] };
  });

  const pathD = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`, '');
  const areaD = `${pathD} L 100% 95% L 0% 95% Z`;
  const tempPoints = monthlyTemps.map((tVal, i) => {
    const x = (i / 11) * 100;
    const y = 85 - ((tVal - 10) / 30) * 65;
    return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
  }).join(' ');

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            {t.monthlyChartTitle}
          </h3>
          <p className="text-3xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'توزيع رصد أقمار ناسا على مدار أشهر السنة' : '12-Month Earth Observation baseline'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-3xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-cyan-600 to-blue-400"></span>
            <span className="text-slate-300">{lang === 'ar' ? 'الأمطار (مم/شهر)' : 'Precipitation (mm)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full"></span>
            <span className="text-slate-300">{lang === 'ar' ? 'متوسط الحرارة (°C)' : 'Mean Temp (°C)'}</span>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 overflow-hidden">
        <div className="w-full h-44 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#rainGradient)" />
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={tempPoints} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
          </svg>

          <div className="absolute inset-0 flex justify-between items-end">
            {points.map((p, idx) => (
              <div key={idx} className="relative flex flex-col items-center group h-full justify-end cursor-pointer">
                <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-slate-900/95 border border-slate-700 text-slate-100 p-2 rounded-lg shadow-2xl text-3xs whitespace-nowrap z-20">
                  <div className="font-bold text-cyan-300">{p.month}</div>
                  <div className="text-blue-300">🌧️ مطر: {p.val} مم</div>
                  <div className="text-amber-300">🌡️ حرارة: {p.temp}°C</div>
                </div>

                <div 
                  style={{ height: `${(p.val / maxRainVal) * 75}%` }} 
                  className="w-1.5 md:w-2.5 bg-gradient-to-t from-cyan-600/80 to-blue-400 rounded-t group-hover:from-cyan-400 group-hover:to-cyan-200 transition"
                ></div>

                <span className="text-3xs text-slate-400 group-hover:text-cyan-300 transition mt-1.5 font-medium">
                  {p.month.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}