import { useReport } from '../context/ReportContext';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldTutorial } from './FieldTutorial';
import { MapPin, Locate, Loader2 } from 'lucide-react';

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
        let addressText = '';
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) addressText = data.display_name;
        } catch {
          // endereço opcional
        }
        updateLocation({ latitude, longitude, address: addressText || undefined });
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualLocation = async () => {
    const trimmed = address.trim();
    if (!trimmed) return;
    if (report.location) {
      updateLocation({ ...report.location, address: trimmed });
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`
      );
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        updateLocation({ latitude: lat, longitude: lon, address: trimmed });
      } else {
        setError('Endereço não encontrado. Tente outro ou use a localização atual.');
      }
    } catch {
      setError('Erro ao buscar endereço. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeLocation = () => {
    updateLocation(null);
    setAddress('');
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-xl font-semibold">Localização (Opcional)</h2>
        <FieldTutorial
          title="Localização (opcional)"
          description="Você pode informar onde o fato ocorreu: use 'Usar minha localização' para enviar suas coordenadas ou digite um endereço. A localização não é obrigatória e pode ser pulada."
          izaContextId="novo-registro-localizacao"
        />
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Você pode fornecer a localização do registro. Isso ajuda a identificar o local exato onde o fato ocorreu.
      </p>

      {error && (
        <Alert variant="warning" className="mb-4" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!report.location ? (
        <div className="flex flex-col gap-4">
          <Button
            className="w-full"
            size="lg"
            onClick={getCurrentLocation}
            disabled={isLoading}
            aria-label="Obter localização atual"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Locate className="h-5 w-5" />}
            {isLoading ? 'Obtendo localização...' : 'Usar Minha Localização Atual'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">ou</p>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">Inserir Localização Manualmente</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço ou Descrição do Local</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rua Exemplo, 123 - Bairro - Cidade"
                  aria-label="Endereço ou descrição do local"
                />
              </div>
              <Button variant="outline" onClick={handleManualLocation} disabled={!address.trim()} aria-label="Salvar localização manual">
                Salvar Localização
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex gap-4 p-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="flex-1">
              <h3 className="font-medium">Localização Definida</h3>
              {report.location.address && (
                <p className="text-sm text-muted-foreground">
                  <strong>Endereço:</strong> {report.location.address}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                <strong>Coordenadas:</strong> {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
              </p>
              <Button variant="outline" size="sm" className="mt-2 border-destructive text-destructive hover:bg-destructive/10" onClick={removeLocation} aria-label="Remover localização">
                Remover Localização
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert variant="info" className="mt-6" role="note">
        <AlertDescription>
          A localização é opcional. Se você não deseja fornecer sua localização, pode pular esta etapa.
        </AlertDescription>
      </Alert>
    </div>
  );
};
