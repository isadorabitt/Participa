import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useReport } from '../context/ReportContext';
import type { TipoManifestacao } from '../utils/classificarTexto';

// Fix para ícones padrão do Leaflet
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

// Cores para cada tipo de manifestação
const typeColors: Record<TipoManifestacao, string> = {
  Reclamação: '#d32f2f',
  Solicitação: '#005FDB',
  Sugestão: '#FFC107',
  Elogio: '#2e7d32',
  Denúncia: '#9c27b0',
  'Pedido de Informação': '#0288d1',
};

// Ícones customizados por tipo
const createCustomIcon = (color: string) => {
  return L.divIcon({
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
};

export const ThematicMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { report } = useReport();
  const [storedMarkers, setStoredMarkers] = useState<StoredMarker[]>([]);

  // Carregar marcadores salvos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('participa_map_markers');
      if (stored) {
        const markers = JSON.parse(stored) as StoredMarker[];
        setStoredMarkers(markers);
      }
    } catch (error) {
      console.error('Erro ao carregar marcadores:', error);
    }
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Criar mapa centrado no Brasil (Brasília)
    const map = L.map(mapContainerRef.current, {
      center: [-15.7942, -47.8822],
      zoom: 4,
      zoomControl: true,
      attributionControl: true,
    });

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Adicionar marcador quando o usuário clicar no mapa
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

        // Adicionar marcador no mapa
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: createCustomIcon(typeColors[newMarker.type]),
        }).addTo(map);

        const popup = L.popup({
          maxWidth: 250,
          className: 'custom-popup',
        }).setContent(`
          <div style="padding: 8px;">
            <strong style="color: ${typeColors[newMarker.type]};">${newMarker.type}</strong>
            <p style="margin: 8px 0 0 0; font-size: 12px;">${newMarker.description}</p>
            <small style="color: #666; display: block; margin-top: 4px;">
              ${new Date(newMarker.createdAt).toLocaleDateString('pt-BR')}
            </small>
          </div>
        `);

        marker.bindPopup(popup);
        markersRef.current.push(marker);

        // Salvar no localStorage
        const updatedMarkers = [...storedMarkers, newMarker];
        setStoredMarkers(updatedMarkers);
        localStorage.setItem('participa_map_markers', JSON.stringify(updatedMarkers));
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Adicionar marcadores salvos ao mapa
  useEffect(() => {
    if (!mapRef.current || storedMarkers.length === 0) return;

    // Limpar marcadores existentes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Adicionar marcadores salvos
    storedMarkers.forEach((storedMarker) => {
      const marker = L.marker([storedMarker.latitude, storedMarker.longitude], {
        icon: createCustomIcon(typeColors[storedMarker.type]),
      }).addTo(mapRef.current!);

      const popup = L.popup({
        maxWidth: 250,
        className: 'custom-popup',
      }).setContent(`
        <div style="padding: 8px;">
          <strong style="color: ${typeColors[storedMarker.type]};">${storedMarker.type}</strong>
          <p style="margin: 8px 0 0 0; font-size: 12px;">${storedMarker.description}</p>
          <small style="color: #666; display: block; margin-top: 4px;">
            ${new Date(storedMarker.createdAt).toLocaleDateString('pt-BR')}
          </small>
        </div>
      `);

      marker.bindPopup(popup);
      markersRef.current.push(marker);
    });
  }, [storedMarkers]);

  // Contar marcadores por tipo
  const markersByType = storedMarkers.reduce((acc, marker) => {
    acc[marker.type] = (acc[marker.type] || 0) + 1;
    return acc;
  }, {} as Record<TipoManifestacao, number>);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Mapa */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          minHeight: { xs: 400, md: 500 },
        }}
      >
        <Box
          ref={mapContainerRef}
          sx={{
            width: '100%',
            height: '100%',
            minHeight: { xs: 400, md: 500 },
            borderRadius: 3,
            '& .leaflet-container': {
              borderRadius: 3,
              height: '100%',
              zIndex: 0,
            },
            '& .custom-popup': {
              borderRadius: 8,
            },
          }}
        />
      </Paper>

      {/* Legenda */}
      <Paper
        elevation={2}
        sx={{
          width: { xs: '100%', md: 280 },
          padding: 3,
          borderRadius: 3,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>
          Legenda
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {(Object.keys(typeColors) as TipoManifestacao[]).map((type) => {
            const count = markersByType[type] || 0;
            return (
              <Box
                key={type}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  padding: 1,
                  borderRadius: 2,
                  backgroundColor: count > 0 ? `${typeColors[type]}10` : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50% 50% 50% 0',
                    backgroundColor: typeColors[type],
                    border: '2px solid white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: 'rotate(-45deg)',
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {type}
                  </Typography>
                  {count > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {count} {count === 1 ? 'registro' : 'registros'}
                    </Typography>
                  )}
                </Box>
                {count > 0 && (
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      backgroundColor: typeColors[type],
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: 1 }}>
            <strong>Como usar:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
            Clique no mapa para adicionar um marcador no local escolhido. 
            Os marcadores são salvos apenas no seu navegador e não são enviados para servidores externos.
          </Typography>
        </Box>

        {storedMarkers.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Total: <strong>{storedMarkers.length}</strong> marcador(es) salvo(s)
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

