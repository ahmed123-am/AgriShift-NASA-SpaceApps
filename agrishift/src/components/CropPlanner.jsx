import React from 'react';
import { Sprout, Calendar } from 'lucide-react';

export default function CropPlanner({ 
  lang, t, availableCrops, 
  selectedSeason1, setSelectedSeason1, crop1, 
  selectedSeason2, setSelectedSeason2, crop2, 
  selectedSeason3, setSelectedSeason3, crop3 
}) {
  const seasons = [
    { num: 1, title: lang === 'ar' ? 'الموسم 1 (شتوي)' : 'Season 1 (Winter)', state: selectedSeason1, setter: setSelectedSeason1, data: crop1, color: 'emerald' },
    { num: 2, title: lang === 'ar' ? 'الموسم 2 (صيفي)' : 'Season 2 (Summer)', state: selectedSeason2, setter: setSelectedSeason2, data: crop2, color: 'indigo' },
    { num: 3, title: lang === 'ar' ? 'الموسم 3 (بيني / غطاء)' : 'Season 3 (Cover Crop)', state: selectedSeason3, setter: setSelectedSeason3, data: crop3, color: 'teal' },
  ];

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400" /> {t.cropsSectionTitle}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{t.cropsSectionDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {seasons.map(s => (
          <div key={s.num} className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-xs bg-${s.color}-500/10 text-${s.color}-300 border border-${s.color}-500/20 px-2.5 py-1 rounded-md font-bold`}>
                {s.title}
              </span>
              <span className={`text-2xs px-2 py-0.5 rounded-full border ${s.data?.statusColor}`}>
                {s.data?.status}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">{t.chooseCrop}</label>
              <select 
                value={s.state} 
                onChange={(e) => s.setter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
              >
                {availableCrops.map(c => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ar' ? `${c.name_ar} - (${c.season_ar})` : `${c.name_en} - (${c.season_en})`}
                  </option>
                ))}
              </select>
            </div>

            {s.data && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.totalWater}</span>
                  <span className="font-bold text-blue-400">{s.data.waterNeedPerHa} {t.m3}/هـ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.irrigationNeeded}</span>
                  <span className="font-bold text-amber-400">{s.data.irrigationNeeded} {t.m3}/هـ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.nitrogenEffect}</span>
                  <span className="font-bold text-slate-200">
                    {lang === 'ar' ? s.data.nitrogenImpact_ar : s.data.nitrogenImpact_en}
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-3xs text-slate-300">
                  <strong className="text-emerald-400 block mb-1">{t.nextCrop}</strong>
                  {lang === 'ar' ? s.data.recommendationNext_ar : s.data.recommendationNext_en}
                </div>
                
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-3xs text-slate-300 flex items-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300">{t.calendarTitle}</strong>
                    {lang === 'ar' ? s.data.calendar_ar : s.data.calendar_en}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}