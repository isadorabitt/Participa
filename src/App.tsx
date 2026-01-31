import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ReportProvider } from './context/ReportContext';
import { Layout } from './components/Layout';
import { Inicio } from './pages/Inicio';
import { NewReport } from './pages/NewReport';
import { MyReports } from './pages/MyReports';
import { About } from './pages/About';
import { Guidelines } from './pages/Guidelines';
import { Faq } from './pages/Faq';
import { Acessibilidade } from './pages/Acessibilidade';
import { MapView } from './pages/MapView';
import { ProtocolDetail } from './pages/ProtocolDetail';

export default function App() {
  return (
    <AccessibilityProvider>
      <ReportProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="novo-registro" element={<NewReport />} />
              <Route path="meus-registros" element={<MyReports />} />
              <Route path="protocolo/:protocolId" element={<ProtocolDetail />} />
              <Route path="ouvidoria" element={<About />} />
              <Route path="orientacoes" element={<Guidelines />} />
              <Route path="faq" element={<Faq />} />
              <Route path="acessibilidade" element={<Acessibilidade />} />
              <Route path="mapa" element={<MapView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ReportProvider>
    </AccessibilityProvider>
  );
}
