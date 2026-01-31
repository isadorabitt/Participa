import { ThematicMap } from '../components/ThematicMap';
import { PageLayout, PageHeader } from '../components/PageLayout';

export const MapView = () => (
  <PageLayout maxWidth="full" padding="md">
    <PageHeader
      title="Mapa Temático de Registros"
      description="Visualize no mapa os locais onde você criou registros. Os marcadores são organizados por tipo de manifestação e salvos apenas no seu navegador."
    />
    <ThematicMap />
  </PageLayout>
);
