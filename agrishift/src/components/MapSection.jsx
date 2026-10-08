import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { MapPin, Layers, RefreshCw, SplitSquareVertical } from 'lucide-react';

function MapAutoResizer({ layerKey, isSplit }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map, layerKey, isSplit]);
  return null;
}

function LocationMarker({ position, onLocationChange }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      onLocationChange([e.latlng.lat, e.latlng.lng]);
      map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom(), { animate: true });
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function MapSection({
  t, position, setPosition, locationName, activeMapLayer, setActiveMapLayer,
  rainShift, setRainShift, tempShift, setTempShift
}) {
  const [splitSlider, setSplitSlider] = useState(50);
  const [isSplitMode, setIsSplitMode] = useState(false);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
        <div className="flex flex-wrap justify-between items-center mb-3 text-xs gap-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {t.clickMap}
          </span>
          
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-3xs">
            <button
              onClick={() => setIsSplitMode(!isSplitMode)}
              className={`px-2 py-1 rounded transition flex items-center gap-1 ${isSplitMode ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <SplitSquareVertical className="w-3 h-3" />
              مقارنة شاشة منقسمة
            </button>

            {!isSplitMode && (
              <>
                <Layers className="w-3.5 h-3.5 text-slate-400 mx-1" />
                <button
                  onClick={() => setActiveMapLayer('satellite')}
                  className={`px-2 py-1 rounded transition ${activeMapLayer === 'satellite' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  قمر Esri
                </button>
                <button
                  onClick={() => setActiveMapLayer('ndvi')}
                  className={`px-2 py-1 rounded transition ${activeMapLayer === 'ndvi' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  NASA NDVI
                </button>
                <button
                  onClick={() => setActiveMapLayer('osm')}
                  className={`px-2 py-1 rounded transition ${activeMapLayer === 'osm' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  تضاريس
                </button>
              </>
            )}
          </div>
        </div>

        {/* الخريطة مع السحاب المنقسم */}
        <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800 relative select-none" dir="ltr">
          <MapContainer center={position} zoom={7} style={{ height: '100%', width: '100%' }}>
            <MapAutoResizer layerKey={activeMapLayer} isSplit={isSplitMode} />

            {/* وضع الشاشة المنقسمة التفاعلي */}
            {isSplitMode ? (
              <>
                {/* النصف الأيسر: قمر طبيعي */}
                <TileLayer
                  attribution="&copy; Esri World Imagery"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                
                {/* النصف الأيمن: طبقة NASA NDVI الحية مقصوصة عبر clipPath */}
                <div style={{ clipPath: `inset(0 0 0 ${splitSlider}%)`, position: 'absolute', inset: 0, zIndex: 400, pointerEvents: 'none' }}>
                  <TileLayer
                    attribution="NASA GIBS MODIS NDVI"
                    url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png"
                    opacity={0.8}
                  />
                </div>
              </>
            ) : (
              <>
                {activeMapLayer === 'satellite' && (
                  <TileLayer
                    attribution="&copy; Esri World Imagery"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                {activeMapLayer === 'ndvi' && (
                  <>
                    <TileLayer
                      attribution="&copy; Esri Base"
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <TileLayer
                      attribution="NASA GIBS MODIS Terra NDVI"
                      url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png"
                      opacity={0.65}
                    />
                  </>
                )}
                {activeMapLayer === 'osm' && (
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}
              </>
            )}

            <LocationMarker position={position} onLocationChange={setPosition} />
          </MapContainer>

          {/* خط السحب المنقسم للمقارنة الفضائية */}
          {isSplitMode && (
            <div className="absolute inset-y-0 w-full pointer-events-none z-[500] flex items-center">
              <div 
                style={{ left: `${splitSlider}%` }} 
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] pointer-events-auto cursor-ew-resize flex items-center justify-center -translate-x-1/2"
              >
                <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center text-3xs font-black shadow-lg">
                  ⇄
                </div>
              </div>

              {/* شريط التحكم الخفي للسحب */}
              <input
                type="range"
                min="5"
                max="95"
                value={splitSlider}
                onChange={(e) => setSplitSlider(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize pointer-events-auto h-full w-full"
              />

              <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 text-3xs px-2 py-1 rounded text-white font-mono pointer-events-none">
                صورة القمر الطبيعية (Esri)
              </div>
              <div className="absolute top-3 right-3 bg-slate-950/80 border border-cyan-500/50 text-3xs px-2 py-1 rounded text-cyan-300 font-mono pointer-events-none">
                رصد الغطاء النباتي (NASA NDVI)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* محاكي السيناريوهات */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <RefreshCw className="w-4 h-4 text-emerald-400" /> {t.simTitle}
        </h3>

        <div className="space-y-4 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t.rainShiftLabel}</span>
              <span className={`font-mono font-bold ${rainShift < 0 ? 'text-rose-400' : 'text-blue-400'}`}>
                {rainShift > 0 ? `+${rainShift}%` : `${rainShift}%`}
              </span>
            </div>
            <input 
              type="range" min="-50" max="50" step="10" 
              value={rainShift} 
              onChange={(e) => setRainShift(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t.tempShiftLabel}</span>
              <span className="font-mono font-bold text-amber-400">+{tempShift}°C</span>
            </div>
            <input 
              type="range" min="0" max="4" step="0.5" 
              value={tempShift} 
              onChange={(e) => setTempShift(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
          {t.howItWorks}
        </div>
      </div>
    </section>
  );
}