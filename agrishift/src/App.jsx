import React, { useState, useEffect } from 'react';
import { AVAILABLE_CROPS } from './data/crops';
import { TRANSLATIONS } from './data/translations';
import { DEMO_PRESETS } from './data/presets';

import SplashPortal from './components/SplashPortal';
import Navbar from './components/Navbar';
import EarlyWarning from './components/EarlyWarning';
import ClimateCards from './components/ClimateCards';
import MapSection from './components/MapSection';
import MonthlyChart from './components/MonthlyChart';
import Economics from './components/Economics';
import Comparison from './components/Comparison';
import CropPlanner from './components/CropPlanner';
import Chatbot from './components/Chatbot';
import ProFeatures from './components/ProFeatures';
import SdgsBanner from './components/SdgsBanner';
import DataSources from './components/DataSources';
import { Sparkles, CheckCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('ar');
  const t = TRANSLATIONS[lang];

  const [hasEntered, setHasEntered] = useState(false);

  // قراءة المعلمات من الرابط إذا تم فتح التطبيق من QR أو رابط مشاركة
  const searchParams = new URLSearchParams(window.location.search);
  const initialLat = searchParams.get('lat') ? Number(searchParams.get('lat')) : 31.2565;
  const initialLon = searchParams.get('lon') ? Number(searchParams.get('lon')) : 31.8105;
  const initialC1 = searchParams.get('c1') || 'wheat';
  const initialC2 = searchParams.get('c2') || 'fava_beans';
  const initialC3 = searchParams.get('c3') || 'alfalfa';

  const [position, setPosition] = useState([initialLat, initialLon]); 
  const [locationName, setLocationName] = useState('شمال الدلتا، مصر');
  const [nasaData, setNasaData] = useState(null);
  const [monthlyRain, setMonthlyRain] = useState([18, 14, 10, 5, 2, 0, 0, 0, 2, 8, 16, 22]);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeMapLayer, setActiveMapLayer] = useState('satellite');
  const [rainShift, setRainShift] = useState(0);
  const [tempShift, setTempShift] = useState(0);
  const [farmArea, setFarmArea] = useState(5);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [optimizedAlert, setOptimizedAlert] = useState(false);

  const [selectedSeason1, setSelectedSeason1] = useState(initialC1);
  const [selectedSeason2, setSelectedSeason2] = useState(initialC2);
  const [selectedSeason3, setSelectedSeason3] = useState(initialC3);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'مرحباً! أنا AgriShift Copilot 🛰️. أقوم بتحليل بيانات NASA POWER و SoilGrids لحقلك لحظة بلحظة. كيف يمكنني تحسين دورتك الزراعية اليوم؟' 
    }
  ]);

  // جلب البيانات من الخوادم مع دعم الأوفلاين
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const lat = position[0].toFixed(4);
      const lon = position[1].toFixed(4);
      const cacheKey = `agrishift_${lat}_${lon}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.nasaData && parsed.soilData) {
            setNasaData(parsed.nasaData);
            setSoilData(parsed.soilData);
            setMonthlyRain(parsed.monthlyRain);
            setLocationName(parsed.locationName);
          }
        } catch (e) {}
      }

      try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=${lang}`;
        const geoRes = await fetch(geoUrl);
        const geoJson = await geoRes.json();
        const detectedPlace = geoJson.address?.state || geoJson.address?.city || geoJson.address?.county || geoJson.address?.country || `${lat}°N, ${lon}°E`;
        if (isMounted) setLocationName(detectedPlace);
      } catch (e) {
        if (isMounted && !cached) setLocationName(lang === 'ar' ? 'الموقع المختار' : 'Selected Coordinates');
      }

      let fetchedNasa = null;
      let fetchedMonthly = null;
      try {
        const nasaUrl = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;
        const res = await fetch(nasaUrl);
        const json = await res.json();
        const p = json?.properties?.parameter;

        if (isMounted && p) {
          const rawRain = p?.PRECTOTCORR || {};
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          fetchedMonthly = months.map(m => Math.round((rawRain[m] || 0.4) * 30));
          fetchedNasa = {
            avgTemp: p?.T2M ? p.T2M.ANN.toFixed(1) : '23.4',
            annualRain: p?.PRECTOTCORR ? Math.round(p.PRECTOTCORR.ANN * 365) : 135,
            solarRad: p?.ALLSKY_SFC_SW_DWN ? p.ALLSKY_SFC_SW_DWN.ANN.toFixed(2) : '5.42',
          };
          setMonthlyRain(fetchedMonthly);
          setNasaData(fetchedNasa);
        }
      } catch (e) {
        if (!cached) {
          fetchedNasa = { avgTemp: '23.1', annualRain: 120, solarRad: '5.30' };
          setNasaData(fetchedNasa);
        }
      }

      let fetchedSoil = null;
      try {
        const soilUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}&property=clay&property=sand&property=phh2o&depth=0-5cm`;
        const sRes = await fetch(soilUrl);
        const sJson = await sRes.json();
        const layers = sJson?.properties?.layers || [];
        
        let clay = 38;
        let sand = 32;
        let ph = '7.5';

        layers.forEach((l) => {
          const val = l?.depths?.[0]?.values?.mean;
          if (val) {
            if (l.name === 'clay') clay = Math.round(val / 10);
            if (l.name === 'sand') sand = Math.round(val / 10);
            if (l.name === 'phh2o') ph = (val / 10).toFixed(1);
          }
        });

        let typeName_ar = clay > 40 ? 'طينية ثقيلة (Clay)' : sand > 50 ? 'رملية خفيفة (Sandy)' : 'طميية متوازنة (Loam)';
        let typeName_en = clay > 40 ? 'Heavy Clay' : sand > 50 ? 'Light Sandy' : 'Balanced Loam';

        fetchedSoil = { clay, sand, ph, typeName_ar, typeName_en };
        if (isMounted) setSoilData(fetchedSoil);
      } catch (e) {
        if (!cached) {
          fetchedSoil = { clay: 35, sand: 35, ph: '7.4', typeName_ar: 'طميية متوازنة (Loam)', typeName_en: 'Balanced Loam' };
          setSoilData(fetchedSoil);
        }
      } finally {
        if (isMounted) setLoading(false);
        if (fetchedNasa && fetchedSoil) {
          localStorage.setItem(cacheKey, JSON.stringify({
            nasaData: fetchedNasa,
            soilData: fetchedSoil,
            monthlyRain: fetchedMonthly || monthlyRain,
            locationName
          }));
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [position, lang]);

  const activeTemp = nasaData?.avgTemp ? (Number(nasaData.avgTemp) + tempShift).toFixed(1) : '23.5';
  const activeRain = nasaData?.annualRain ? Math.max(10, Math.round(nasaData.annualRain * (1 + rainShift / 100))) : 120;

  // التحسين التلقائي
  const handleAutoOptimize = () => {
    const isDry = Number(activeRain) < 80 || Number(soilData?.sand || 30) > 45;
    const isHot = Number(activeTemp) > 28;

    if (isDry || isHot) {
      setSelectedSeason1('barley');
      setSelectedSeason2('peanuts');
      setSelectedSeason3('alfalfa');
    } else {
      setSelectedSeason1('wheat');
      setSelectedSeason2('fava_beans');
      setSelectedSeason3('alfalfa');
    }

    setOptimizedAlert(true);
    setTimeout(() => setOptimizedAlert(false), 4500);
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => alert(lang === 'ar' ? 'تعذر جلب موقع GPS' : 'Unable to retrieve GPS')
      );
    }
  };

  const handleApplyPreset = (preset) => {
    setPosition(preset.pos);
    setSelectedSeason1(preset.crops[0]);
    setSelectedSeason2(preset.crops[1]);
    setSelectedSeason3(preset.crops[2]);
    setRainShift(preset.rainShift);
    setTempShift(preset.tempShift);
  };

  const analyzeCrop = (cropId) => {
    const crop = AVAILABLE_CROPS.find(c => c.id === cropId);
    if (!crop) return null;
    const currentT = Number(activeTemp);
    const tempFit = currentT >= crop.tempMin && currentT <= crop.tempMax;
    const irrigationNeeded = Math.max(0, crop.waterNeedPerHa - (activeRain * 10));

    let status = lang === 'ar' ? 'ممتاز ومناسب' : 'Optimal';
    let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (!tempFit) {
      status = lang === 'ar' ? 'إجهاد حراري' : 'Thermal Stress';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (crop.waterNeedPerHa > 5000 && activeRain < 100) {
      status = lang === 'ar' ? 'استنزاف مائي' : 'Water Stress';
      statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }

    return { ...crop, status, statusColor, irrigationNeeded };
  };

  const crop1 = analyzeCrop(selectedSeason1);
  const crop2 = analyzeCrop(selectedSeason2);
  const crop3 = analyzeCrop(selectedSeason3);

  // حساب مؤشر صحة التربة
  const calculateSustainabilityMetrics = () => {
    const clay = Number(soilData?.clay || 35);
    const sand = Number(soilData?.sand || 35);
    const ph = Number(soilData?.ph || 7.4);
    const rain = Number(activeRain || 120);

    let score = 50;

    if (clay >= 30 && clay <= 50) score += 15;
    else if (clay > 50) score += 8;
    else if (sand > 60) score -= 18;

    if (ph >= 6.5 && ph <= 7.8) score += 10;
    else if (ph > 8.2 || ph < 6.0) score -= 12;

    if (rain < 50) score -= 15;
    else if (rain >= 100 && rain <= 350) score += 8;

    [selectedSeason1, selectedSeason2, selectedSeason3].forEach(cropId => {
      if (cropId === 'fava_beans' || cropId === 'alfalfa') score += 10;
      else if (cropId === 'peanuts' || cropId === 'barley') score += 5;
      else if (cropId === 'wheat' || cropId === 'sugar_beet') score -= 4;
      else if (cropId === 'corn') score -= 10;
      else if (cropId === 'rice') score -= 14;
    });

    if (rainShift < 0) score += Math.round(rainShift * 0.2);
    if (tempShift > 0) score -= Math.round(tempShift * 3.5);

    score = Math.min(99, Math.max(15, score));

    let label = lang === 'ar' ? 'ممتاز' : 'Optimal';
    let colorClass = 'text-emerald-400 bg-emerald-500 border-emerald-500/30';

    if (score < 45) {
      label = lang === 'ar' ? 'حرج / مجهد' : 'Critical / Degraded';
      colorClass = 'text-rose-400 bg-rose-500 border-rose-500/30';
    } else if (score < 70) {
      label = lang === 'ar' ? 'متوسط' : 'Moderate';
      colorClass = 'text-amber-400 bg-amber-500 border-amber-500/30';
    }

    let totalCarbonSeqPerHa = 0;
    [crop1, crop2, crop3].forEach(c => {
      if (c) totalCarbonSeqPerHa += (c.carbonSeqRate || 0.6);
    });
    const totalCarbonFarm = Math.max(0.1, (totalCarbonSeqPerHa * farmArea * (score / 68))).toFixed(1);

    return { score, label, colorClass, totalCarbonFarm };
  };

  const { 
    score: soilHealthScore, 
    label: soilHealthLabel, 
    colorClass: soilHealthColor, 
    totalCarbonFarm: farmCarbonSequestered 
  } = calculateSustainabilityMetrics();

  const totalWaterDemandPerHa = (crop1?.waterNeedPerHa || 0) + (crop2?.waterNeedPerHa || 0) + (crop3?.waterNeedPerHa || 0);
  const isArid = Number(activeRain) < 70 || soilData?.sand > 50;
  const isHeavy = soilData?.clay > 40 && Number(activeRain) >= 70;

  const regionalTradName = isArid ? "أعلاف مكشوفة تقليدية + ري غمر" : isHeavy ? "أرز صيفي مغمور + قمح متكرر" : "قمح متكرر + ذرة صيفية مكثفة";
  const regionalTradWater = isArid ? 16500 : isHeavy ? 15200 : 14200;
  const regionalTradNitrogen = isArid ? -80 : isHeavy ? -120 : -105;
  const regionalTradCost = isArid ? 450 : isHeavy ? 410 : 380;
  const regionalTradRisk = isArid ? "استنزاف مائي حاد للآبار الصحراوية" : isHeavy ? "تشبع مائي مع تملح بطيء" : "حساسة لعجز الأمطار وإجهاد التربة";

  const waterSavedTotalFarm = Math.max(500, regionalTradWater - totalWaterDemandPerHa) * farmArea;
  const ureaSavingsPerHa = (crop2?.id === 'fava_beans' || crop3?.id === 'alfalfa') ? 280 : 70;
  const ureaSavingsTotalFarm = ureaSavingsPerHa * farmArea;
  const dieselSavingsTotalFarm = Math.round(waterSavedTotalFarm * 0.045);

  let netNitrogen = 0;
  if (selectedSeason1 === 'wheat') netNitrogen -= 45; else if (selectedSeason1 === 'fava_beans') netNitrogen += 65; else if (selectedSeason1 === 'barley') netNitrogen -= 25;
  if (selectedSeason2 === 'corn') netNitrogen -= 60; else if (selectedSeason2 === 'rice') netNitrogen -= 70; else if (selectedSeason2 === 'peanuts') netNitrogen += 40; else if (selectedSeason2 === 'fava_beans') netNitrogen += 65;
  if (selectedSeason3 === 'alfalfa') netNitrogen += 70; else netNitrogen += 10;

  const selectedNames = [crop1, crop2, crop3].filter(Boolean).map(c => lang === 'ar' ? c.name_ar.split(' ')[0] : c.name_en.split(' ')[0]).join(' + ');

  const handleVoiceBriefing = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = lang === 'ar'
      ? `تنبيه رصد الحقل من منصة أجري شيفت. الموقع: ${locationName}. درجة الحرارة ${activeTemp} مئوية. مؤشر صحة واستدامة التربة هو ${soilHealthScore} من مئة. إجمالي التوفير المائي لمزرعتك يبلغ ${waterSavedTotalFarm} متر مكعب. تم التحقق من البيانات عبر أقمار ناسا الصناعية.`
      : `AgriShift Satellite Briefing. Location: ${locationName}. Temperature ${activeTemp} Celsius. Soil Health Index is ${soilHealthScore} out of 100. Farm water savings total ${waterSavedTotalFarm} cubic meters. Telemetry verified by NASA.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendChat = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : chatInput;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `بناءً على موقع مزرعتك في [${locationName}] وقراءات ناسا (${activeTemp}°C حرارة، ${activeRain} مم أمطار، تربة ${soilData?.typeName_ar || 'طميية'}):\n` +
        `خطة دورتك الزراعية تحقق وفراً مائياً قدره ${waterSavedTotalFarm.toLocaleString()} م³، وعزلاً للكربون قدره ${farmCarbonSequestered} طن، ومؤشر صحة تربة ${soilHealthScore}/100 (${soilHealthLabel}).`;
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 550);
  };

  if (!hasEntered) {
    return <SplashPortal onEnter={() => setHasEntered(true)} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-nasa-grid text-slate-100 font-sans relative overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {optimizedAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-600/95 border border-emerald-400 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur animate-bounce text-xs">
          <CheckCheck className="w-5 h-5 text-slate-950" />
          <span>{lang === 'ar' ? '⚡ تم التحسين الفوري بالذكاء الاصطناعي: تم اعتماد دورة تعويضية رفعت مؤشر التربة وحفظت المياه!' : '⚡ AI Auto-Optimized: Succession balanced for maximum water & soil score!'}</span>
        </div>
      )}

      <EarlyWarning 
        lang={lang} activeTemp={activeTemp} activeRain={activeRain} 
        soilData={soilData} rainShift={rainShift} locationName={locationName} 
        position={position} nasaData={nasaData} 
      />

      <Navbar 
        lang={lang} setLang={setLang} t={t} position={position} 
        onDetectGPS={handleDetectGPS} onPrint={() => window.print()} 
        demoPresets={DEMO_PRESETS} onApplyPreset={handleApplyPreset}
        selectedSeason1={selectedSeason1} selectedSeason2={selectedSeason2} selectedSeason3={selectedSeason3}
      />

      <div className="max-w-7xl mx-auto px-6 pt-2 flex justify-end">
        <button
          onClick={handleAutoOptimize}
          className="bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-spin [animation-duration:6s]" />
          <span>{lang === 'ar' ? '⚡ تحسين الدورة تلقائياً بالذكاء الاصطناعي (AI Auto-Optimize)' : '⚡ AI Auto-Optimize Rotation'}</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <ClimateCards 
          t={t} loading={loading} activeTemp={activeTemp} tempShift={tempShift} 
          activeRain={activeRain} rainShift={rainShift} soilHealthScore={soilHealthScore} 
          soilHealthLabel={soilHealthLabel} soilHealthColor={soilHealthColor} 
          farmCarbonSequestered={farmCarbonSequestered} farmArea={farmArea} 
        />

        <ProFeatures 
          lang={lang} 
          t={t} 
          farmArea={farmArea} 
          setFarmArea={setFarmArea}
          waterSavedTotalFarm={waterSavedTotalFarm} 
          ureaSavingsTotalFarm={ureaSavingsTotalFarm} 
          dieselSavingsTotalFarm={dieselSavingsTotalFarm} 
          farmCarbonSequestered={farmCarbonSequestered} 
          locationName={locationName} 
          position={position} 
          activeTemp={activeTemp} 
          activeRain={activeRain} 
          soilData={soilData} 
          selectedNames={selectedNames} 
          onSpeakAlert={handleVoiceBriefing} 
          isSpeaking={isSpeaking} 
          rainShift={rainShift} 
          tempShift={tempShift}
        />

        <MapSection 
          t={t} position={position} setPosition={setPosition} locationName={locationName} 
          activeMapLayer={activeMapLayer} setActiveMapLayer={setActiveMapLayer} 
          rainShift={rainShift} setRainShift={setRainShift} 
          tempShift={tempShift} setTempShift={setTempShift} 
        />

        <MonthlyChart lang={lang} t={t} monthlyRain={monthlyRain} activeTemp={activeTemp} />

        <SdgsBanner 
          lang={lang} 
          waterSavedTotalFarm={waterSavedTotalFarm} 
          farmCarbonSequestered={farmCarbonSequestered} 
          soilHealthScore={soilHealthScore} 
          farmArea={farmArea} 
        />

        <Economics 
          t={t} farmArea={farmArea} setFarmArea={setFarmArea} 
          waterSavedTotalFarm={waterSavedTotalFarm} 
          ureaSavingsTotalFarm={ureaSavingsTotalFarm} 
          dieselSavingsTotalFarm={dieselSavingsTotalFarm} 
        />

        <Comparison 
          lang={lang} t={t} regionalTradName={regionalTradName} 
          regionalTradWater={regionalTradWater} regionalTradNitrogen={regionalTradNitrogen} 
          regionalTradCost={regionalTradCost} regionalTradRisk={regionalTradRisk} 
          selectedNames={selectedNames} totalWaterDemandPerHa={totalWaterDemandPerHa} 
          netNitrogen={netNitrogen} currentPlanCost={Math.max(60, regionalTradCost - ureaSavingsPerHa)} 
          ureaSavingsPerHa={ureaSavingsPerHa} isSelectedDroughtResistant={crop1?.waterNeedPerHa < 4000} 
        />

        <CropPlanner 
          lang={lang} t={t} availableCrops={AVAILABLE_CROPS} 
          selectedSeason1={selectedSeason1} setSelectedSeason1={setSelectedSeason1} crop1={crop1} 
          selectedSeason2={selectedSeason2} setSelectedSeason2={setSelectedSeason2} crop2={crop2} 
          selectedSeason3={selectedSeason3} setSelectedSeason3={setSelectedSeason3} crop3={crop3} 
        />

        <DataSources lang={lang} position={position} />
      </main>

      <Chatbot 
        t={t} chatOpen={chatOpen} setChatOpen={setChatOpen} 
        chatExpanded={chatExpanded} setChatExpanded={setChatExpanded} 
        messages={messages} isTyping={isTyping} chatInput={chatInput} 
        setChatInput={setChatInput} onSendChat={handleSendChat} 
      />
    </div>
  );
}