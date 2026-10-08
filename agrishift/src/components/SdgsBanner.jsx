import React from 'react';
import { Globe, Droplet, Sprout, ShieldCheck, Award } from 'lucide-react';

export default function SdgsBanner({ 
  lang, waterSavedTotalFarm, farmCarbonSequestered, soilHealthScore, farmArea 
}) {
  const isOptimal = soilHealthScore >= 70;

  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'مؤشرات التنمية المستدامة للأمم المتحدة (UN SDGs)' : 'UN Sustainable Development Goals (SDGs)'}</span>
              <span className="text-3xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                2030 Agenda Aligned
              </span>
            </h3>
            <p className="text-3xs text-slate-400 mt-0.5">
              {lang === 'ar' ? 'قياس الأثر البيئي والغذائي للمزرعة وفق المعايير الدولية الرسمية' : 'Quantifying agro-climatic contributions to UN Global Goals'}
            </p>
          </div>
        </div>

        <div className="text-3xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-xl flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'اعتماد التنوع الزراعي الفضائي' : 'NASA Space-Agro Certified'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SDG 2: Zero Hunger */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">SDG 2</span>
            <Sprout className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">{lang === 'ar' ? 'القضاء التام على الجوع' : 'Zero Hunger'}</h4>
          <p className="text-3xs text-slate-400 mt-1 leading-relaxed">
            {lang === 'ar' 
              ? 'ضمان دورة إنتاج غذائي مستدامة تحافظ على إنتاج الحبوب بنسبة كفاءة +18%.' 
              : 'Preserves staple grain output stability with balanced seasonal succession.'}
          </p>
        </div>

        {/* SDG 6: Clean Water */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">SDG 6</span>
            <Droplet className="w-4 h-4 text-blue-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">{lang === 'ar' ? 'المياه النظيفة والنظافة الصحية' : 'Clean Water & Sanitation'}</h4>
          <p className="text-3xs text-slate-400 mt-1 leading-relaxed">
            {lang === 'ar' 
              ? `توفير مباشر لـ ${(waterSavedTotalFarm).toLocaleString()} م³ من مياه الري وحماية الآبار الجوفية.` 
              : `Conserves ${(waterSavedTotalFarm).toLocaleString()} m³ of freshwater from aquifer depletion.`}
          </p>
        </div>

        {/* SDG 13: Climate Action */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SDG 13</span>
            <Globe className="w-4 h-4 text-teal-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">{lang === 'ar' ? 'العمل المناخي' : 'Climate Action'}</h4>
          <p className="text-3xs text-slate-400 mt-1 leading-relaxed">
            {lang === 'ar' 
              ? `عزل سنوي يقدر بـ ${farmCarbonSequestered} طن CO₂e في التربة وخفض انبعاثات الطاقة.` 
              : `Sequestering ${farmCarbonSequestered} tCO2e/yr via bio-nitrogen and root storage.`}
          </p>
        </div>

        {/* SDG 15: Life on Land */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SDG 15</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">{lang === 'ar' ? 'الحياة في البر' : 'Life on Land'}</h4>
          <p className="text-3xs text-slate-400 mt-1 leading-relaxed">
            {lang === 'ar' 
              ? `مؤشر صحة تربة (${soilHealthScore}/100) لمنع التملح وحماية المادة العضوية على مساحة ${farmArea} هـ.` 
              : `Reversing soil degradation with a ${soilHealthScore}/100 index score across ${farmArea} ha.`}
          </p>
        </div>
      </div>
    </section>
  );
}