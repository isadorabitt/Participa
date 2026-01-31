import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useReport } from '../context/ReportContext';
import type { TipoManifestacao } from '../utils/classificarTexto';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface StoredMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: TipoManifestacao;
  description: string;
  createdAt: string;
}

const BRASILIA_CENTER: [number, number] = [-15.7942, -47.8822];
const BRASILIA_ZOOM = 12;

const DEFAULT_MARKERS_BRASILIA: StoredMarker[] = [
  {
    id: 'default-1',
    latitude: -15.8017,
    longitude: -47.8642,
    type: 'Solicitação',
    description: 'Praça dos Três Poderes – exemplo de registro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    latitude: -15.7935,
    longitude: -47.8822,
    type: 'Reclamação',
    description: 'Eixo Monumental – exemplo de registro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-3',
    latitude: -15.7942,
    longitude: -47.8922,
    type: 'Sugestão',
    description: 'Asa Sul – exemplo de registro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-4',
    latitude: -15.7642,
    longitude: -47.8822,
    type: 'Elogio',
    description: 'Asa Norte – exemplo de registro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-5',
    latitude: -15.8386,
    longitude: -48.0211,
    type: 'Denúncia',
    description: 'Águas Claras – exemplo de registro',
    createdAt: new Date().toISOString(),
  },
];

const typeColors: Record<TipoManifestacao, string> = {
  Reclamação: '#d32f2f',
  Solicitação: '#005FDB',
  Sugestão: '#FFC107',
  Elogio: '#2e7d32',
  Denúncia: '#9c27b0',
  'Pedido de Informação': '#0288d1',
};

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -4px;
          margin-top: -4px;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

export const ThematicMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const defaultMarkersRef = useRef<L.Marker[]>([]);
  const { report } = useReport();
  const [storedMarkers, setStoredMarkers] = useState<StoredMarker[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('participa_map_markers');
      if (stored) setStoredMarkers(JSON.parse(stored) as StoredMarker[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BRASILIA_CENTER,
      zoom: BRASILIA_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    DEFAULT_MARKERS_BRASILIA.forEach((stored) => {
      const marker = L.marker([stored.latitude, stored.longitude], {
        icon: createCustomIcon(typeColors[stored.type]),
      }).addTo(map);
      const popup = L.popup({ maxWidth: 250, className: 'custom-popup' }).setContent(`
        <div style="padding: 8px;">
          <strong style="color: ${typeColors[stored.type]};">${stored.type}</strong>
          <p style="margin: 8px 0 0 0; font-size: 12px;">${stored.description}</p>
          <small style="color: #666; display: block; margin-top: 4px;">Exemplo – Brasília</small>
        </div>
      `);
      marker.bindPopup(popup);
      defaultMarkersRef.current.push(marker);
    });

    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (report.classification?.tipo) {
        const newMarker: StoredMarker = {
          id: Date.now().toString(),
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          type: report.classification.tipo,
          description: report.description.substring(0, 100) || 'Sem descrição',
          createdAt: new Date().toISOString(),
        };

        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: createCustomIcon(typeColors[newMarker.type]),
        }).addTo(map);

        const popup = L.popup({ maxWidth: 250, className: 'custom-popup' }).setContent(`
          <div style="padding: 8px;">
            <strong style="color: ${typeColors[newMarker.type]};">${newMarker.type}</strong>
            <p style="margin: 8px 0 0 0; font-size: 12px;">${newMarker.description}</p>
            <small style="color: #666; display: block; margin-top: 4px;">${new Date(newMarker.createdAt).toLocaleDateString('pt-BR')}</small>
          </div>
        `);
        marker.bindPopup(popup);
        markersRef.current.push(marker);

        const updated = [...storedMarkers, newMarker];
        setStoredMarkers(updated);
        localStorage.setItem('participa_map_markers', JSON.stringify(updated));
      }
    });

    return () => {
      defaultMarkersRef.current.forEach((m) => m.remove());
      defaultMarkersRef.current = [];
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || storedMarkers.length === 0) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    storedMarkers.forEach((stored) => {
      const marker = L.marker([stored.latitude, stored.longitude], {
        icon: createCustomIcon(typeColors[stored.type]),
      }).addTo(mapRef.current!);
      const popup = L.popup({ maxWidth: 250, className: 'custom-popup' }).setContent(`
        <div style="padding: 8px;">
          <strong style="color: ${typeColors[stored.type]};">${stored.type}</strong>
          <p style="margin: 8px 0 0 0; font-size: 12px;">${stored.description}</p>
          <small style="color: #666; display: block; margin-top: 4px;">${new Date(stored.createdAt).toLocaleDateString('pt-BR')}</small>
        </div>
      `);
      marker.bindPopup(popup);
      markersRef.current.push(marker);
    });
  }, [storedMarkers]);

  const markersByType = storedMarkers.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {} as Record<TipoManifestacao, number>);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="min-h-[400px] flex-1 overflow-hidden md:min-h-[500px]">
        <div
          ref={mapContainerRef}
          className="h-full min-h-[400px] w-full rounded-xl [&_.leaflet-container]:h-full [&_.leaflet-container]:rounded-xl [&_.custom-popup]:rounded-lg md:min-h-[500px]"
        />
      </Card>

      <Card className="w-full md:w-[280px]">
        <CardHeader>
          <h2 className="text-lg font-semibold">Legenda</h2>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <Separator className="mb-4" />
          {(Object.keys(typeColors) as TipoManifestacao[]).map((type) => {
            const count = markersByType[type] || 0;
            return (
              <div
                key={type}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors"
                style={count > 0 ? { backgroundColor: `${typeColors[type]}20` } : undefined}
              >
                <div
                  className="h-5 w-5 shrink-0 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: typeColors[type], transform: 'rotate(-45deg)' }}
                  aria-hidden
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{type}</p>
                  {count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {count} {count === 1 ? 'registro' : 'registros'}
                    </p>
                  )}
                </div>
                {count > 0 && (
                  <Badge className="text-white" style={{ backgroundColor: typeColors[type] }}>
                    {count}
                  </Badge>
                )}
              </div>
            );
          })}
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            <strong>Como usar:</strong> Clique no mapa para adicionar um marcador no local escolhido. Os marcadores são salvos apenas no seu navegador e não são enviados para servidores externos.
          </p>
          {storedMarkers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Total: <strong>{storedMarkers.length}</strong> marcador(es) salvo(s)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
