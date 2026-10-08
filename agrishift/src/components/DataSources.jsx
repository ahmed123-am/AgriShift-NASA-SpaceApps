import React from 'react';
import { Database, Satellite, CheckCircle, ExternalLink } from 'lucide-react';

export default function DataSources({ lang, position }) {
  const sources = [
    {
      name: "NASA POWER Climatology API",
      parameters: "T2M (Air Temp), PRECTOTCORR (Precipitation), ALLSKY_SFC_SW_DWN (Solar Flux)",
      frequency: "Daily & 30-Year Satellite Climatology (MERRA-2 Model)",
      link: `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN&community=AG&longitude=${position[1].toFixed(4)}&latitude=${position[0].toFixed(4)}&format=JSON`
    },
    {
      name: "NASA GIBS Satellite Imagery",
      parameters: "MODIS Terra NDVI (8-Day Normalized Difference Vegetation Index)",
      frequency: "Near Real-Time 250m Spatial Resolution",
      link: "https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs"
    },
    {
      name: "ISRIC SoilGrids 2.0 REST API",
      parameters: "Clay (0-5cm), Sand (0-5cm), pH in H2O at 250m Resolution",
      frequency: "Global Digital Soil Mapping Machine-Learning Framework",
      link: `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${position[0].toFixed(4)}&lon=${position[1].toFixed(4)}&property=clay&property=sand&property=phh2o&depth=0-5cm`
    }
  ];

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Database className="w-5 h-5 text-blue-400" />
        <div>
          <h3 className="text-base font-bold text-white">
            {lang === 'ar' ? 'بيانات ناسا والمصادر العلمية المعتمدة (NASA Science Architecture)' : 'NASA & Scientific Data Reference Architecture'}
          </h3>
          <p className="text-3xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'توثيق واجهات البرمجة المفتوحة ومصادر النمذجة المستخدمة في المنصة' : 'Verified Open Science Earth Observation & Geospatial Pipelines'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {sources.map((s, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-2xs">
                <Satellite className="w-3.5 h-3.5" /> {s.name}
              </span>
              <a href={s.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="text-3xs text-slate-300">
              <strong className="text-slate-500 block">المعلمات المقاسة:</strong>
              {s.parameters}
            </div>
            <div className="text-4xs text-slate-500">
              دقة النموذج: {s.frequency}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}