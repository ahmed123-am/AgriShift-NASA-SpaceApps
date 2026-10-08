import React from 'react';
import { GitCompare } from 'lucide-react';

export default function Comparison({ 
  lang, t, regionalTradName, regionalTradWater, regionalTradNitrogen, 
  regionalTradCost, regionalTradRisk, selectedNames, totalWaterDemandPerHa, 
  netNitrogen, currentPlanCost, ureaSavingsPerHa, isSelectedDroughtResistant 
}) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <GitCompare className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">{t.compareTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* الخطة التقليدية */}
        <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-rose-300 font-bold">
            <span>{t.traditional}</span>
            <span className="bg-rose-900/40 px-2 py-0.5 rounded text-3xs font-mono">
              {regionalTradName}
            </span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">الاستهلاك المائي المقدر:</span>
              <span className="text-rose-400 font-bold">{regionalTradWater.toLocaleString()} م³/هكتار</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">حالة النيتروجين والتربة:</span>
              <span className="text-rose-400 font-bold">استنزاف ({regionalTradNitrogen} كجم/هـ)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">تكلفة الأسمدة الكيميائية:</span>
              <span className="text-rose-400 font-bold">${regionalTradCost}/هكتار سنوياً</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">مقاومة الإجهاد المناخي:</span>
              <span className="text-rose-400 font-bold">{regionalTradRisk}</span>
            </div>
          </div>
        </div>

        {/* دورة AgriShift */}
        <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-emerald-300 font-bold">
            <span>{t.smart}</span>
            <span className="bg-emerald-900/40 px-2 py-0.5 rounded text-3xs font-mono text-emerald-200">
              {selectedNames || 'الدورة المختارة'}
            </span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">الاستهلاك المائي الفعلي:</span>
              <span className="text-emerald-400 font-bold">
                {totalWaterDemandPerHa.toLocaleString()} م³/هكتار 
                <span className="text-3xs text-emerald-300 mr-1 font-normal">
                  (وفر {Math.max(0, regionalTradWater - totalWaterDemandPerHa).toLocaleString()} م³)
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">حالة النيتروجين والتربة:</span>
              <span className={`font-bold ${netNitrogen >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {netNitrogen >= 0 ? `فائض وتجديد طبيعي (+${netNitrogen} كجم/هـ)` : `استهلاك محدود (${netNitrogen} كجم/هـ)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">تكلفة الأسمدة الكيميائية:</span>
              <span className="text-emerald-400 font-bold">
                ${currentPlanCost}/هكتار
                <span className="text-3xs text-emerald-300 mr-1 font-normal">
                  (وفر ${ureaSavingsPerHa})
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">مقاومة الإجهاد المناخي:</span>
              <span className={`font-bold ${isSelectedDroughtResistant ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSelectedDroughtResistant ? 'عالية وموفرة للمخزون المائي' : 'متوسطة تتطلب متابعة أجهزة الري'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}