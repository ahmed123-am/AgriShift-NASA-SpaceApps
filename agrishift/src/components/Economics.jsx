import React from 'react';
import { DollarSign } from 'lucide-react';

export default function Economics({ 
  t, farmArea, setFarmArea, waterSavedTotalFarm, ureaSavingsTotalFarm, dieselSavingsTotalFarm 
}) {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-900/40 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">{t.economicTitle}</h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">{t.fieldArea}</span>
          <input 
            type="number" 
            min="1" 
            max="500" 
            value={farmArea} 
            onChange={(e) => setFarmArea(Math.max(1, Number(e.target.value)))}
            className="w-16 bg-slate-900 text-emerald-400 font-bold border border-slate-700 rounded px-2 py-0.5 text-center focus:border-emerald-500 outline-none"
          />
          <span className="text-3xs text-slate-500">({(farmArea * 2.38).toFixed(1)} فدان)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.waterSavedMetric}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-400">{waterSavedTotalFarm.toLocaleString()} {t.m3}</span>
          </div>
          <p className="text-3xs text-slate-500 mt-1">وفر مائي على كامل مساحة مزرعتك ({farmArea} هكتار)</p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.fertSavedMetric}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">${ureaSavingsTotalFarm.toLocaleString()} {t.usd}</span>
          </div>
          <p className="text-3xs text-slate-500 mt-1">توفير سنوي بفضل التثبيت الحيوي لنيتروجين البقوليات</p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.dieselSavedMetric}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">${dieselSavingsTotalFarm.toLocaleString()} {t.usd}</span>
          </div>
          <p className="text-3xs text-slate-500 mt-1">توفير وقود وكهرباء طلمبات الضخ لمزرعتك</p>
        </div>
      </div>
    </section>
  );
}