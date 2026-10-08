import React from 'react';
import { AlertTriangle, Thermometer, Droplets, Activity, CheckCircle } from 'lucide-react';

export default function EarlyWarning({ 
  lang, activeTemp, activeRain, soilData, rainShift, locationName, position, nasaData 
}) {
  const tempNum = Number(activeTemp);
  const rainNum = Number(activeRain);
  const clayNum = Number(soilData?.clay || 30);
  const sandNum = Number(soilData?.sand || 30);

  let title = '';
  let message = '';
  let colorClasses = '';
  let IconComponent = CheckCircle;

  if (rainNum < 60 || rainShift <= -30) {
    IconComponent = AlertTriangle;
    colorClasses = 'bg-rose-950/90 border-rose-600/70 text-rose-200 animate-pulse';
    title = lang === 'ar' ? `🚨 إنذار جفاف حرج في [ ${locationName} ]` : `🚨 Critical Drought Alert in [ ${locationName} ]`;
    message = lang === 'ar'
      ? `معدل الأمطار شحيح جداً (${rainNum} مم/سنة). رصد الأقمار يشير لعجز رطوبة سطحي؛ يُنصح بالشعير والبقوليات مع الري بالتنقيط الليلي.`
      : `Precipitation severely deficient (${rainNum} mm/yr). NASA detects surface deficit; shift to drought-resilient legumes and barley.`;
  } else if (tempNum >= 32) {
    IconComponent = Thermometer;
    colorClasses = 'bg-amber-950/90 border-amber-600/70 text-amber-200';
    title = lang === 'ar' ? `⚠️ إجهاد حراري مرتفع في [ ${locationName} ]` : `⚠️ Thermal Stress in [ ${locationName} ]`;
    message = lang === 'ar'
      ? `حرارة متوقعة (${tempNum}°C) مصحوبة بإشعاع شمسي (${nasaData?.solarRad || '5.4'} kWh/m²). يوصى بزيادة تغطية التربة بنباتات الغطاء لخفض حرارة السطح.`
      : `High thermal threshold (${tempNum}°C) detected. Increase bio-cover to buffer root zones against thermal shock.`;
  } else if (clayNum > 45 && rainNum > 200) {
    IconComponent = Droplets;
    colorClasses = 'bg-blue-950/90 border-blue-600/70 text-blue-200';
    title = lang === 'ar' ? `🌧️ تشبع مائي محتمل في [ ${locationName} ]` : `🌧️ Potential Waterlogging in [ ${locationName} ]`;
    message = lang === 'ar'
      ? `التربة طينية ثقيلة (${clayNum}% طين) مع وفرة أمطار (${rainNum} مم). ننصح بزراعة محاصيل ذات جذور وتدية وتنشيط الصرف الزراعي.`
      : `Heavy clay profile paired with high rain. Implement deep-taproot crops to improve soil drainage.`;
  } else if (sandNum > 55) {
    IconComponent = Activity;
    colorClasses = 'bg-teal-950/90 border-teal-600/70 text-teal-200';
    title = lang === 'ar' ? `🏜️ تربة رملية مسامية في [ ${locationName} ]` : `🏜️ High Permeability Sandy Soil in [ ${locationName} ]`;
    message = lang === 'ar'
      ? `نسبة الرمال مرتفعة (${sandNum}%). رصد ناسا ينصح بإدخال البقوليات والسماد الأخضر لبناء المادة العضوية وحبس الرطوبة.`
      : `High sand proportion leads to percolation loss. Add green manure/cover crops to build organic matter.`;
  } else {
    IconComponent = CheckCircle;
    colorClasses = 'bg-emerald-950/85 border-emerald-600/60 text-emerald-200';
    title = lang === 'ar' ? `🛰️ توازن بيئي ومناخي مثالي في [ ${locationName} ]` : `🛰️ Optimal Agro-Climate Balance in [ ${locationName} ]`;
    message = lang === 'ar'
      ? `قراءات ناسا مستقرة (حرارة: ${tempNum}°C | أمطار: ${rainNum} مم). الحقل جاهز لتطبيق الدورة المقترحة لتحقيق أعلى إنتاجية.`
      : `All NASA indicators in optimal range. Field conditions ideal for maximizing yields.`;
  }

  return (
    <div className={`border-b px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 transition-all duration-500 shadow-md ${colorClasses}`}>
      <div className="flex items-center gap-2 font-bold shrink-0">
        <IconComponent className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-2xs leading-relaxed flex-1 opacity-95">
        {message}
      </div>
      <div className="text-3xs font-mono bg-black/30 border border-white/10 px-2.5 py-1 rounded-md shrink-0">
        {position[0].toFixed(3)}°N , {position[1].toFixed(3)}°E
      </div>
    </div>
  );
}