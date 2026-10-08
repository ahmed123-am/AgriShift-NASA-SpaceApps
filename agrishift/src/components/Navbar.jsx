import React, { useState } from 'react';
import { Sprout, Navigation, Globe, FileText, Database, ExternalLink, PlayCircle, Share2, QrCode } from 'lucide-react';

export default function Navbar({ 
  lang, setLang, t, position, onDetectGPS, onPrint, demoPresets, onApplyPreset,
  selectedSeason1, selectedSeason2, selectedSeason3
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // توليد رابط المشاركة الحي متضمناً الإحداثيات والمحاصيل
  const shareUrl = `${window.location.origin}${window.location.pathname}?lat=${position[0].toFixed(4)}&lon=${position[1].toFixed(4)}&c1=${selectedSeason1}&c2=${selectedSeason2}&c3=${selectedSeason3}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{t.title}</h1>
              <span className="text-2xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                NASA Space Apps 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* زر المشاركة والباركود الفوري للمحكمين والمزارعين */}
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition text-indigo-300"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>مشاركة الحقل</span>
          </button>

          <button
            onClick={onDetectGPS}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition text-cyan-300"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.gpsBtn}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition text-slate-200"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>

          <button
            onClick={onPrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
          >
            <FileText className="w-3.5 h-3.5" />
            {t.exportPdf}
          </button>

          <a
            href={`https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN&community=AG&longitude=${position[1].toFixed(4)}&latitude=${position[0].toFixed(4)}&format=JSON`}
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" /> {t.checkApi} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* نافذة الـ QR Code والمشاركة */}
      {showShareModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-400" />
              مشاركة رصد الحقل المباشر
            </h3>
            <p className="text-3xs text-slate-400">
              امسح الـ QR بكاميرا الهاتف لفتح نفس الإحداثيات والدورة الزراعية فوراً:
            </p>
            <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
              <img src={qrApiUrl} alt="Field QR" className="w-40 h-40 mx-auto" />
            </div>
            <div className="flex gap-2 pt-2">
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-3xs text-slate-300 font-mono outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-3xs px-3 py-1.5 rounded-xl transition whitespace-nowrap"
              >
                {copied ? 'تم النسخ!' : 'نسخ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* شريط جولة المحكمين */}
      <section className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <PlayCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{t.demoTourTitle}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {demoPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPreset(preset)}
              className="bg-slate-950 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/60 text-slate-200 text-3xs px-3 py-1.5 rounded-lg transition font-medium"
            >
              📍 {lang === 'ar' ? preset.name_ar : preset.name_en}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}