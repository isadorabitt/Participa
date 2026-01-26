import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import { useReport } from '../context/ReportContext';
import { useState, useEffect } from 'react';

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

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as 'anonymous' | 'identified';
    if (type === 'anonymous') {
      updateIdentification({ type: 'anonymous' });
      setFormData({ name: '', email: '', phone: '', cpf: '' });
    } else {
      updateIdentification({
        type: 'identified',
        ...formData,
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateIdentification({
      type: 'identified',
      ...newFormData,
    });
  };

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

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Identificação
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Escolha se deseja fazer o registro de forma anônima ou se prefere se identificar.
      </Typography>

      <RadioGroup
        value={report.identification.type}
        onChange={handleTypeChange}
        aria-label="Tipo de identificação"
        sx={{ marginBottom: 3 }}
      >
        <FormControlLabel
          value="anonymous"
          control={<Radio />}
          label="Registro Anônimo"
          aria-label="Registro anônimo"
        />
        <FormControlLabel
          value="identified"
          control={<Radio />}
          label="Registro Identificado"
          aria-label="Registro identificado"
        />
      </RadioGroup>

      {report.identification.type === 'identified' && (
        <Paper elevation={2} sx={{ padding: 3, marginTop: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Dados de Identificação
          </Typography>

          <TextField
            fullWidth
            label="Nome Completo"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            margin="normal"
            aria-label="Nome completo"
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            margin="normal"
            aria-label="Email"
            helperText="Seu email será usado apenas para contato sobre este registro"
          />

          <TextField
            fullWidth
            label="Telefone"
            value={formData.phone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              handleFieldChange('phone', formatted);
            }}
            margin="normal"
            aria-label="Telefone"
            placeholder="(00) 00000-0000"
            inputProps={{ maxLength: 15 }}
          />

          <TextField
            fullWidth
            label="CPF (Opcional)"
            value={formData.cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              handleFieldChange('cpf', formatted);
            }}
            margin="normal"
            aria-label="CPF opcional"
            placeholder="000.000.000-00"
            inputProps={{ maxLength: 14 }}
            helperText="O CPF é opcional e será usado apenas para verificação"
          />
        </Paper>
      )}

      {report.identification.type === 'anonymous' && (
        <Alert severity="info" sx={{ marginTop: 2 }} role="note">
          <Typography variant="body2">
            Seu registro será processado de forma anônima. Nenhuma informação pessoal será 
            coletada ou armazenada.
          </Typography>
        </Alert>
      )}

      {report.identification.type === 'identified' && (
        <Alert severity="info" sx={{ marginTop: 2 }} role="note">
          <Typography variant="body2">
            Suas informações serão mantidas em sigilo e usadas apenas para contato sobre este 
            registro, conforme a política de privacidade.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

