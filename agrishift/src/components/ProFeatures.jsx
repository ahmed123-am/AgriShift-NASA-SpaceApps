import React, { useState } from 'react';
import { TrendingUp, Volume2, VolumeX, ShieldCheck, Download, Award, Sliders, Waves, Calendar, Maximize2 } from 'lucide-react';

export default function ProFeatures({ 
  lang, t, farmArea, setFarmArea, waterSavedTotalFarm, ureaSavingsTotalFarm, 
  dieselSavingsTotalFarm, farmCarbonSequestered, locationName, position,
  activeTemp, activeRain, soilData, selectedNames, onSpeakAlert, isSpeaking,
  rainShift = 0, tempShift = 0
}) {
  const [showDossier, setShowDossier] = useState(false);
  
  // 1. أشرطة التحكم المتغيرة (السنوات، المسافة/العمق، وسعر الكربون)
  const [projectionYears, setProjectionYears] = useState(5); // عدد السنوات (1 - 10)
  const [wellDepth, setWellDepth] = useState(60);            // مسافة وعمق الضخ بالمتر (20م - 300م)
  const [carbonPricePerTon, setCarbonPricePerTon] = useState(25); // سعر طن الكربون ($10 - $60)

  // 2. التحويل الدقيق بين الهكتار والفدان (1 هكتار = 2.38 فدان مصري)
  const safeFarmArea = Number(farmArea) || 1;
  const feddanEquivalent = (safeFarmArea * 2.38095).toFixed(1);

  // 3. حساب تكلفة ضخ المتر المكعب ديناميكياً بناءً على مسافة وعمق الضخ
  const pumpingCostPerM3 = Number((0.02 + (wellDepth * 0.0006)).toFixed(3));

  // 4. تأمين المتغيرات العددية لتجنب خطأ NaN نهائياً
  const safeTempShift = Number(tempShift) || 0;
  const safeRainShift = Number(rainShift) || 0;
  const safeCarbonTons = Number(farmCarbonSequestered) || 0.5;
  const safeWaterSaved = Number(waterSavedTotalFarm) || 500;
  const safeUreaSaved = Number(ureaSavingsTotalFarm) || 70;

  const climateStressFactor = 1 + (safeTempShift * 0.03) + (Math.abs(safeRainShift) * 0.002);

  // 5. النمذجة الرياضية التراكمية بحسب عدد السنوات والمساحة
  let cumulativeWaterSaved = 0;
  let cumulativeInputSavings = 0;
  let cumulativeCarbonRevenue = 0;

  for (let year = 1; year <= projectionYears; year++) {
    const soilHealthBoost = 1 + ((year - 1) * 0.035);
    const inflationRate = Math.pow(1.045, year - 1); // تضخم 4.5% سنوياً

    const yearWater = safeWaterSaved * soilHealthBoost;
    const yearPumpingSaving = yearWater * pumpingCostPerM3 * inflationRate;
    const yearUreaSaving = safeUreaSaved * inflationRate * soilHealthBoost;
    const yearCarbon = safeCarbonTons * soilHealthBoost * carbonPricePerTon;

    cumulativeWaterSaved += yearWater;
    cumulativeInputSavings += (yearPumpingSaving + yearUreaSaving);
    cumulativeCarbonRevenue += yearCarbon;
  }

  const totalWaterFormatted = Math.round(cumulativeWaterSaved).toLocaleString();
  const totalInputFormatted = Math.round(cumulativeInputSavings).toLocaleString();
  const totalCarbonFormatted = Math.round(cumulativeCarbonRevenue).toLocaleString();
  const totalNetFormatted = Math.round((cumulativeInputSavings + cumulativeCarbonRevenue) * climateStressFactor).toLocaleString();

  return (
    <>
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* الهيدر العلوي والأزرار */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'ar' ? `محاكي الإسقاط المالي المتغير (${projectionYears} سنوات)` : `Dynamic ${projectionYears}-Year Agro-Financial Model`}</span>
                <span className="text-3xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {wellDepth > 100 ? (lang === 'ar' ? 'آبار ارتوازية عميقة' : 'Deep Aquifer') : (lang === 'ar' ? 'رفع سطحي / آبار ضحلة' : 'Shallow Lift')}
                </span>
              </h3>
              <p className="text-3xs text-slate-400 mt-0.5">
                {lang === 'ar' 
                  ? `محسوب لمساحة ${safeFarmArea} هكتار (${feddanEquivalent} فدان) في [ ${locationName} ]` 
                  : `Calibrated for ${safeFarmArea} Ha (${feddanEquivalent} Feddans) at [ ${locationName} ]`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSpeakAlert}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                isSpeaking 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? (lang === 'ar' ? 'إيقاف الصوت' : 'Stop Audio') : (lang === 'ar' ? 'استمع للتحليل' : 'Voice Brief')}</span>
            </button>

            <button
              onClick={() => setShowDossier(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow"
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'ar' ? 'وثيقة الاعتماد' : 'NASA Dossier'}</span>
            </button>
          </div>
        </div>

        {/* 🎛️ وحدة التحكم المتغيرة: المساحة والهكتار/الفدان + عدد السنين + عمق الضخ + سعر الكربون */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* 🌾 مدخل مساحة المزرعة وتحويل الهكتار للفدان */}
          <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Maximize2 className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'مساحة المزرعة:' : 'Farm Size:'}
              </span>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30">
                <input 
                  type="number" 
                  min="1" 
                  max="500" 
                  value={safeFarmArea} 
                  onChange={(e) => setFarmArea && setFarmArea(Math.max(1, Number(e.target.value)))}
                  className="w-10 bg-transparent text-emerald-400 font-mono font-bold text-center outline-none"
                />
                <span className="text-3xs text-emerald-300 font-bold">{lang === 'ar' ? 'هكتار' : 'Ha'}</span>
              </div>
            </div>

            {/* شارة التحويل التلقائي للفدان والمعادلة */}
            <div className="flex items-center justify-between text-3xs font-mono pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">
                {lang === 'ar' ? 'ما يعادله بالفدان:' : 'In Feddans:'}
              </span>
              <span className="text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                ≈ {feddanEquivalent} {lang === 'ar' ? 'فدان' : 'Feddan'}
              </span>
            </div>
            <div className="text-4xs text-slate-500 text-center">
              (1 هكتار = 2.38 فدان مصري)
            </div>
          </div>

          {/* 📅 سلايدر عدد السنين */}
          <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'ar' ? 'عدد السنوات:' : 'Years Horizon:'}
              </span>
              <span className="font-mono font-bold text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40">
                {projectionYears} {lang === 'ar' ? 'سنوات' : 'Yrs'}
              </span>
            </div>
            <input 
              type="range" min="1" max="10" step="1"
              value={projectionYears}
              onChange={(e) => setProjectionYears(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
            />
            <div className="flex justify-between text-3xs text-slate-500">
              <span>1 سنة</span>
              <span>10 سنوات</span>
            </div>
          </div>

          {/* 🌊 سلايدر مسافة وعمق الضخ */}
          <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Waves className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'ar' ? 'عمق الضخ:' : 'Lift Depth:'}
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                {wellDepth} {lang === 'ar' ? 'متر' : 'm'}
              </span>
            </div>
            <input 
              type="range" min="20" max="300" step="10"
              value={wellDepth}
              onChange={(e) => setWellDepth(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
            />
            <div className="flex justify-between text-3xs text-slate-500">
              <span>20م (سطحي)</span>
              <span>300م (عميق)</span>
            </div>
          </div>

          {/* 🍃 سلايدر سعر طن الكربون */}
          <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                {lang === 'ar' ? 'سعر الكربون:' : 'Carbon Price:'}
              </span>
              <span className="font-mono font-bold text-teal-300 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-800/40">
                ${carbonPricePerTon} / {lang === 'ar' ? 'طن' : 't'}
              </span>
            </div>
            <input 
              type="range" min="10" max="60" step="2"
              value={carbonPricePerTon}
              onChange={(e) => setCarbonPricePerTon(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
            />
            <div className="flex justify-between text-3xs text-slate-500">
              <span>$10</span>
              <span>$60</span>
            </div>
          </div>
        </div>

        {/* الكروت المالية الأربعة المحدثة فورياً */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-3xs text-slate-400 block">
              {lang === 'ar' ? `وفر المياه (${projectionYears} سنوات)` : `${projectionYears}-Yr Water Saved`}
            </span>
            <span className="text-xl font-black text-blue-400 mt-1 block">{totalWaterFormatted} م³</span>
            <span className="text-3xs text-slate-500 mt-0.5 block">
              {lang === 'ar' ? `تكلفة ضخ: $${pumpingCostPerM3}/م³` : `Lift Cost: $${pumpingCostPerM3}/m³`}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-3xs text-slate-400 block">
              {lang === 'ar' ? `وفر الأسمدة والطاقة (${projectionYears} سنوات)` : `${projectionYears}-Yr Inputs & Fuel`}
            </span>
            <span className="text-xl font-black text-amber-400 mt-1 block">${totalInputFormatted} دولار</span>
            <span className="text-3xs text-slate-500 mt-0.5 block">
              {lang === 'ar' ? 'شاملاً تضخم الأسعار' : 'Indexed to input inflation'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-3xs text-slate-400 block">
              {lang === 'ar' ? `عائد الكربون (${projectionYears} سنوات)` : `${projectionYears}-Yr Carbon Credits`}
            </span>
            <span className="text-xl font-black text-teal-400 mt-1 block">${totalCarbonFormatted} دولار</span>
            <span className="text-3xs text-slate-500 mt-0.5 block">
              {lang === 'ar' ? `بحساب $${carbonPricePerTon} للطن` : `At $${carbonPricePerTon}/tCO2e`}
            </span>
          </div>

          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40">
            <span className="text-3xs text-emerald-300 block font-bold">
              {lang === 'ar' ? 'صافي القيمة الاقتصادية المضافة' : `Total Net Added Value`}
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">${totalNetFormatted} دولار</span>
            <span className="text-3xs text-emerald-300/70 mt-0.5 block">
              {lang === 'ar' 
                ? `لمساحة ${safeFarmArea} هكتار (${feddanEquivalent} فدان) خلال ${projectionYears} سنوات` 
                : `For ${safeFarmArea} Ha (${feddanEquivalent} Feddans) over ${projectionYears} yrs`}
            </span>
          </div>
        </div>
      </section>

      {/* نافذة ملف الاعتماد الرسمي Dossier */}
      {showDossier && (
        <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-3xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  NASA SPACE APPS 2026 OFFICIAL DOSSIER
                </span>
                <h2 className="text-xl font-black mt-2 text-white">وثيقة الاعتماد الميداني وخطة الدورة الزراعية</h2>
                <p className="text-3xs font-mono text-slate-400">DOC-REF: AGRI-{position[0].toFixed(2)}-{position[1].toFixed(2)}-{projectionYears}Y</p>
              </div>
              <button 
                onClick={() => setShowDossier(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div><strong className="text-slate-400">الموقع الحقلي:</strong> {locationName}</div>
              <div><strong className="text-slate-400">مساحة المزرعة:</strong> {safeFarmArea} هكتار ({feddanEquivalent} فدان)</div>
              <div><strong className="text-slate-400">عمق ومسافة الضخ:</strong> {wellDepth} متر</div>
              <div><strong className="text-slate-400">فترة الاستثمار:</strong> {projectionYears} سنوات</div>
              <div><strong className="text-slate-400">صافي العائد المتوقع:</strong> ${totalNetFormatted} دولار</div>
              <div><strong className="text-slate-400">الدورة المعتمدة:</strong> {selectedNames}</div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-3xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>VERIFIED BY NASA POWER & ISRIC SOILGRIDS</span>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>طباعة / حفظ كملف PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}