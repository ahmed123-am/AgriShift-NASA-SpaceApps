import React from 'react';
import { Award, Leaf } from 'lucide-react';

export default function ClimateCards({ 
  t, loading, activeTemp, tempShift, activeRain, rainShift, 
  soilHealthScore, soilHealthLabel, soilHealthColor, farmCarbonSequestered, farmArea 
}) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <span className="text-xs text-slate-400 block">{t.temp}</span>
        <span className="text-2xl font-black text-amber-400 block mt-1">
          {loading ? '...' : `${activeTemp} °C`}
        </span>
        <span className="text-xs text-slate-500 block mt-0.5">
          {tempShift > 0 ? `+${tempShift}°C` : 'NASA POWER API'}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <span className="text-xs text-slate-400 block">{t.rain}</span>
        <span className="text-2xl font-black text-blue-400 block mt-1">
          {loading ? '...' : `${activeRain} mm`}
        </span>
        <span className="text-xs text-slate-500 block mt-0.5">
          {rainShift !== 0 ? `${rainShift}%` : 'NASA Satellite Grid'}
        </span>
      </div>

      {/* مؤشر صحة التربة المتغير ديناميكياً */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <span className="text-xs text-slate-400 block flex items-center justify-between">
          {t.soilHealthScore}
          <Award className="w-3.5 h-3.5 text-emerald-400" />
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-2xl font-black ${soilHealthColor.split(' ')[0]}`}>
            {soilHealthScore}/100
          </span>
          <span className={`text-3xs font-bold px-2 py-0.5 rounded-full bg-slate-950 border ${soilHealthColor.split(' ')[0]} ${soilHealthColor.split(' ')[2]}`}>
            {soilHealthLabel}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            style={{ width: `${soilHealthScore}%` }} 
            className={`h-full rounded-full transition-all duration-500 ${soilHealthColor.split(' ')[1]}`}
          ></div>
        </div>
      </div>

      {/* مؤشر عزل الكربون */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <span className="text-xs text-slate-400 block flex items-center justify-between">
          {t.carbonSequestration}
          <Leaf className="w-3.5 h-3.5 text-teal-400" />
        </span>
        <span className="text-2xl font-black text-teal-300 block mt-1">
          {farmCarbonSequestered} <span className="text-xs font-normal">طن CO₂e/سنة</span>
        </span>
        <span className="text-3xs text-slate-500 block mt-0.5">
          على كامل الحقل ({farmArea} هكتار)
        </span>
      </div>
    </section>
  );
}