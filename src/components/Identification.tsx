import { useReport } from '../context/ReportContext';
import { useState, useEffect } from 'react';
import { RadioGroup } from './ui/radio-group';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldTutorial } from './FieldTutorial';
const IDENTIFICATION_OPTIONS = [
  { value: 'anonymous', label: 'Registro Anônimo', 'aria-label': 'Registro anônimo' },
  { value: 'identified', label: 'Registro Identificado', 'aria-label': 'Registro identificado' },
] as const;

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return value;
};

export const Identification = () => {
  const { report, updateIdentification } = useReport();
  const [formData, setFormData] = useState({
    name: report.identification.name || '',
    email: report.identification.email || '',
    phone: report.identification.phone || '',
    cpf: report.identification.cpf || '',
  });

  useEffect(() => {
    if (report.identification.type === 'identified') {
      setFormData({
        name: report.identification.name || '',
        email: report.identification.email || '',
        phone: report.identification.phone || '',
        cpf: report.identification.cpf || '',
      });
    }
  }, [report.identification]);

  const handleTypeChange = (value: string) => {
    const type = value as 'anonymous' | 'identified';
    if (type === 'anonymous') {
      updateIdentification({ type: 'anonymous' });
      setFormData({ name: '', email: '', phone: '', cpf: '' });
    } else {
      updateIdentification({ type: 'identified', ...formData });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateIdentification({ type: 'identified', ...newFormData });
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-xl font-semibold">Identificação</h2>
        <FieldTutorial
          title="Identificação"
          description="Anônimo: seu registro não terá nome nem contato. Identificado: você informa nome e contato para possíveis retornos. Em ambos os casos você recebe um protocolo para acompanhar."
          izaContextId="novo-registro-identificacao"
        />
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Escolha se deseja fazer o registro de forma anônima ou se prefere se
        identificar.
      </p>

      <RadioGroup
        name="identification-type"
        value={report.identification.type}
        options={IDENTIFICATION_OPTIONS}
        onChange={handleTypeChange}
        aria-label="Tipo de identificação"
        className="mb-6"
      />

      {report.identification.type === 'identified' && (
        <Card className="mt-4 shadow-md">
          <CardHeader>
            <h3 className="text-base font-medium">Dados de Identificação</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                aria-label="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                aria-label="Email"
              />
              <p className="text-xs text-muted-foreground">
                Seu email será usado apenas para contato sobre este registro
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  handleFieldChange('phone', formatPhone(e.target.value));
                }}
                aria-label="Telefone"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF (Opcional)</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  handleFieldChange('cpf', formatCPF(e.target.value));
                }}
                aria-label="CPF opcional"
                placeholder="000.000.000-00"
                maxLength={14}
              />
              <p className="text-xs text-muted-foreground">
                O CPF é opcional e será usado apenas para verificação
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {report.identification.type === 'anonymous' && (
        <Alert variant="info" className="mt-4" role="note">
          <AlertDescription>
            Seu registro será processado de forma anônima. Nenhuma informação
            pessoal será coletada ou armazenada.
          </AlertDescription>
        </Alert>
      )}

      {report.identification.type === 'identified' && (
        <Alert variant="info" className="mt-4" role="note">
          <AlertDescription>
            Suas informações serão mantidas em sigilo e usadas apenas para
            contato sobre este registro, conforme a política de privacidade.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
