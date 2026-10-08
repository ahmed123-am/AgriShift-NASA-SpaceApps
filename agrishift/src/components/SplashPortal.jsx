import React, { useState, useEffect } from 'react';
import { Sprout, Satellite, Orbit, ArrowRight, ShieldCheck, Activity, Globe, Rocket, Flame } from 'lucide-react';

export default function SplashPortal({ onEnter, lang, setLang }) {
  const [telemetryStep, setTelemetryStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const steps = [
    lang === 'ar' ? 'جاري الاتصال بأسطول أقمار ناسا (NASA Landsat & SMAP)...' : 'Establishing NASA Satellite Uplink...',
    lang === 'ar' ? 'معايرة طبقات التربة ونماذج المناخ الفضائية...' : 'Calibrating SoilGrids & NASA POWER Telemetry...',
    lang === 'ar' ? 'بوابة AgriShift جاهزة لإطلاق المهمة.' : 'AgriShift Core Engine Ready for Launch.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, [lang]);

  // تشغيل انطلاق الصاروخ والانتقال السلس
  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);

    // بعد ثانية واحدة (مدة حركة الصاروخ للأعلى) يدخل التطبيق
    setTimeout(() => {
      onEnter();
    }, 1050);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 bg-nasa-grid flex items-center justify-center p-6 overflow-hidden select-none font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* هالات النيون المتدرجة في الخلفية */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none [animation-delay:2s]"></div>

      {/* 🚀 الصاروخ الفضائي المتوهج الذي يطير للأعلى عند الإطلاق */}
      {isLaunching && (
        <div 
          className="fixed left-1/2 bottom-16 z-[10000] pointer-events-none flex flex-col items-center animate-rocket-launch"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* جسم الصاروخ النيون */}
          <div className="relative p-4 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_50px_#10b981] text-emerald-300">
            <Rocket className="w-14 h-14 -rotate-45" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
          </div>

          {/* نيران وعادم المحرك الصاروخي */}
          <div className="flex flex-col items-center -mt-2">
            <div className="w-4 bg-gradient-to-b from-emerald-300 via-amber-400 to-rose-600 rounded-b-full animate-flame"></div>
            <div className="w-10 h-28 bg-gradient-to-b from-orange-500/80 to-transparent blur-md -mt-4"></div>
          </div>
        </div>
      )}

      {/* وميض سرعة الضوء الخفيف عند الإطلاق */}
      <div 
        className={`fixed inset-0 bg-emerald-400/20 z-[9998] pointer-events-none transition-opacity duration-700 ${
          isLaunching ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

      {/* زر تبديل اللغة أعلى البوابة */}
      <button 
        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        className="absolute top-6 left-6 z-10 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs text-slate-300 flex items-center gap-2 backdrop-blur transition"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>

      {/* كارت البوابة الفضائية */}
      <div className={`relative max-w-xl w-full text-center space-y-8 glass-card p-8 md:p-12 rounded-3xl border border-slate-700/60 shadow-2xl transition-all duration-700 ${
        isLaunching ? 'scale-95 opacity-30 blur-sm' : 'scale-100 opacity-100'
      }`}>
        
        {/* رادار أقمار ناسا الدوّار */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-500/30"></div>
          <div className="absolute inset-1.5 rounded-full border border-dashed border-cyan-500/40 animate-radar"></div>
          <div className="absolute inset-4 rounded-full border border-emerald-500/20"></div>
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-4 rounded-2xl shadow-xl shadow-emerald-500/20 relative z-10">
            <Sprout className="w-8 h-8 text-slate-950" />
          </div>
          <Satellite className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* النصوص والعناوين */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full text-3xs font-mono font-bold text-emerald-300 tracking-wide">
            <Orbit className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" />
            NASA SPACE APPS CHALLENGE 2026 • FIELD SHIFT
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-glow-emerald">Shift</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {lang === 'ar' 
              ? 'المنصة الذكية لهندسة الدورات الزراعية المتكيفة بالاعتماد على رصد بيانات أقمار ناسا المباشرة وحساب التوازن المائي والبيئي.'
              : 'NASA Earth Observation decision-support engine for climate-smart crop rotations, water budgeting, and carbon farming.'}
          </p>
        </div>

        {/* مؤشر الاتصال بالأقمار الصناعية */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono space-y-2">
          <div className="flex justify-between items-center text-3xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              SATELLITE TELEMETRY UPLINK
            </span>
            <span>{telemetryStep === 2 ? '100%' : telemetryStep === 1 ? '68%' : '34%'}</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              style={{ width: telemetryStep === 2 ? '100%' : telemetryStep === 1 ? '68%' : '34%' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700 rounded-full"
            ></div>
          </div>
          <p className="text-3xs text-slate-300 text-start truncate pt-1">
            &gt; {steps[telemetryStep]}
          </p>
        </div>

        {/* زر إطلاق المهمة مع الصاروخ */}
        <div>
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-sm py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75"
          >
            <Rocket className={`w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 ${isLaunching ? '-translate-y-4 animate-bounce' : ''}`} />
            <span>
              {isLaunching 
                ? (lang === 'ar' ? '🚀 جاري الإطلاق نحو المدار...' : '🚀 Launching into Orbit...') 
                : (lang === 'ar' ? 'إطلاق مهمة رصد الحقل الآن' : 'LAUNCH FIELD MISSION NOW')}
            </span>
            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
          <div className="flex items-center justify-center gap-2 text-3xs text-slate-500 mt-3 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
            NASA POWER API • ISRIC SOILGRIDS • OPENSTREETMAP VERIFIED
          </div>
        </div>

      </div>
    </div>
  );
}