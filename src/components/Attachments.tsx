import { useReport } from '@/context/ReportContext';
import { DESCRIPTION_TEMPLATE } from '@/constants/formTemplates';
import { TextInput } from './TextInput';
import { AudioRecorder } from './AudioRecorder';
import { ImageUploader } from './ImageUploader';
import { VideoRecorder } from './VideoRecorder';
import { FieldTutorial } from './FieldTutorial';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export const Attachments = () => {
  const { updateDescription } = useReport();

  const useIzaTemplate = () => {
    updateDescription(DESCRIPTION_TEMPLATE);
  };

  return (
  <div className="w-full space-y-8">
    <section aria-labelledby="descricao-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 id="descricao-heading" className="text-base font-semibold text-foreground">
            Descrição da manifestação
          </h2>
          <FieldTutorial
            title="Descrição da manifestação"
            description="Aqui você escreve o que aconteceu com o máximo de detalhes possível: data, local e envolvidos. Use no mínimo 10 caracteres. Evite CPF, cartão ou dados sensíveis. Você também pode complementar com áudio, foto ou vídeo na seção Anexos."
            izaContextId="novo-registro-descricao"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={useIzaTemplate}
          className="gap-1.5 text-participa-pink hover:bg-participa-pink/10 hover:text-participa-pink-dark"
          aria-label="Usar modelo de descrição sugerido pela IZA"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Usar modelo IZA
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Descreva data, local e o que aconteceu. Mín. 10 caracteres.
      </p>
      <TextInput
        label="Descrição do Registro"
        maxLength={5000}
        minLength={10}
        required
      />
    </section>

    <section aria-labelledby="anexos-heading">
      <div className="mb-2 flex items-center gap-2">
        <h2 id="anexos-heading" className="text-base font-semibold text-foreground">
          Anexos (opcional)
        </h2>
        <FieldTutorial
          title="Anexos (opcional)"
          description="Você pode gravar um áudio, enviar uma foto ou um vídeo para complementar a descrição. Nenhum anexo é obrigatório; a descrição escrita já é suficiente para abrir o registro."
          izaContextId="novo-registro-anexos"
        />
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Áudio, imagem ou vídeo para complementar.
      </p>
      <Card className="border border-border bg-muted/20">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <AudioRecorder />
          <div className="border-t border-border" aria-hidden />
          <ImageUploader />
          <div className="border-t border-border" aria-hidden />
          <VideoRecorder />
        </CardContent>
      </Card>
    </section>
  </div>
  );
};
