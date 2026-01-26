import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { LocationOn as LocationOnIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useState } from 'react';

export const LocationStep = () => {
  const { report, updateLocation } = useReport();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(report.location?.address || '');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Tentar obter endereço reverso (opcional)
        let addressText = '';
        try {
          // Usando Nominatim (OpenStreetMap) para geocodificação reversa
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) {
            addressText = data.display_name;
          }
        } catch (err) {
          // Erro silencioso - endereço é opcional
        }

        updateLocation({
          latitude,
          longitude,
          address: addressText || undefined,
        });
        setAddress(addressText);
        setIsLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Permissão de localização negada. Você pode inserir manualmente.'
            : 'Erro ao obter localização. Tente novamente ou insira manualmente.'
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualLocation = () => {
    if (report.location) {
      updateLocation({
        ...report.location,
        address: address || undefined,
      });
    }
  };

  const removeLocation = () => {
    updateLocation(null);
    setAddress('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Localização (Opcional)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Você pode fornecer a localização do registro. Isso ajuda a identificar o local exato 
        onde o fato ocorreu.
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ marginBottom: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {!report.location ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : <MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={isLoading}
            aria-label="Obter localização atual"
            fullWidth
            size="large"
          >
            {isLoading ? 'Obtendo localização...' : 'Usar Minha Localização Atual'}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            ou
          </Typography>

          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Inserir Localização Manualmente
            </Typography>
            <TextField
              fullWidth
              label="Endereço ou Descrição do Local"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua Exemplo, 123 - Bairro - Cidade"
              aria-label="Endereço ou descrição do local"
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="outlined"
              onClick={handleManualLocation}
              disabled={!address.trim()}
              aria-label="Salvar localização manual"
            >
              Salvar Localização
            </Button>
          </Paper>
        </Box>
      ) : (
        <Paper elevation={2} sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <LocationOnIcon color="primary" sx={{ marginTop: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Localização Definida
              </Typography>
              {report.location.address && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Endereço:</strong> {report.location.address}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Coordenadas:</strong> {report.location.latitude.toFixed(6)},{' '}
                {report.location.longitude.toFixed(6)}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={removeLocation}
                aria-label="Remover localização"
                sx={{ marginTop: 2 }}
              >
                Remover Localização
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Alert severity="info" sx={{ marginTop: 3 }} role="note">
        <Typography variant="body2">
          A localização é opcional. Se você não deseja fornecer sua localização, 
          pode pular esta etapa.
        </Typography>
      </Alert>
    </Box>
  );
};

