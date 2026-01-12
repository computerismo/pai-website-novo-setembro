'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { worldGeoJSON } from '../app/admin/analytics/audiencia/world-geo';

// Fix for default marker icons (though we aren't using markers yet, good practice)
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Portuguese Country Names
const countryNames: Record<string, string> = {
  BR: 'Brasil', US: 'Estados Unidos', PT: 'Portugal', AR: 'Argentina', MX: 'México',
  ES: 'Espanha', CO: 'Colômbia', CL: 'Chile', PE: 'Peru', UY: 'Uruguai',
  GB: 'Reino Unido', DE: 'Alemanha', FR: 'França', IT: 'Itália', CA: 'Canadá',
  JP: 'Japão', CN: 'China', IN: 'Índia', AU: 'Austrália', RU: 'Rússia',
  NL: 'Holanda', BE: 'Bélgica', CH: 'Suíça', AT: 'Áustria', SE: 'Suécia',
  NO: 'Noruega', DK: 'Dinamarca', FI: 'Finlândia', PL: 'Polônia', IE: 'Irlanda',
  ZA: 'África do Sul', EG: 'Egito', KR: 'Coreia do Sul', TR: 'Turquia',
  NZ: 'Nova Zelândia',
};

interface WorldMapProps {
  data: { x: string; y: number }[];
}

function MapController() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function WorldMap({ data }: WorldMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
        Carregando mapa...
      </div>
    );
  }

  // Create lookup map for easy access: 'BR' -> 150
  const countryData = data.reduce((acc, curr) => {
    acc[curr.x] = curr.y;
    return acc;
  }, {} as Record<string, number>);

  const maxValue = Math.max(...data.map((d) => d.y), 1);

  // Style function for GeoJSON
  const style = (feature: any) => {
    const code = feature.properties.iso_a2;
    const value = countryData[code] || 0;
    
    // Color scale: Light Blue to Dark Blue
    const getColor = (v: number) => {
      if (v === 0) return '#f1f5f9'; // Slate-100
      const intensity = v / maxValue; // 0 to 1
      if (intensity > 0.8) return '#1e3a8a'; // Blue-900
      if (intensity > 0.6) return '#1d4ed8'; // Blue-700
      if (intensity > 0.4) return '#3b82f6'; // Blue-500
      if (intensity > 0.2) return '#60a5fa'; // Blue-400
      return '#93c5fd'; // Blue-300
    };

    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const code = feature.properties.iso_a2;
    const name = countryNames[code] || feature.properties.name;
    const value = countryData[code] || 0;
    
    layer.bindTooltip(`
      <div class="text-sm font-sans">
        <span class="font-bold">${name}</span>: ${value} visitantes
      </div>
    `, {
      permanent: false,
      direction: 'top',
      className: 'custom-leaflet-tooltip'
    });
    
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        // Reset style is hard to call directly on geojson, so we approximate or use resetStyle if available
        // For simplicity, we re-apply the base style function logic
        layer.setStyle(style(feature));
      }
    });
  };

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <MapController />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON 
          data={worldGeoJSON as any} 
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg shadow-sm border border-slate-200 text-xs text-slate-600 z-[1000] backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">Visitantes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#f1f5f9] border border-slate-200"></div> <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#93c5fd]"></div> <span>Baixo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#3b82f6]"></div> <span>Médio</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#1e3a8a]"></div> <span>Alto</span>
        </div>
      </div>
    </div>
  );
}
