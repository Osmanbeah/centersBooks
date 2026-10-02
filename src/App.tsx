import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CenterProvider } from './context/CenterContext';
import { PortalGateway } from './pages/PortalGateway';
import { AdminLayout } from './components/layout/AdminLayout';
import { AssistantLayout } from './components/layout/AssistantLayout';
import { AdminFinancialDashboard } from './components/admin/AdminFinancialDashboard';
import { AdminDeliveriesTracker } from './components/admin/AdminDeliveriesTracker';
import { AssistantView } from './components/assistant/AssistantView';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ToastProvider>
      <CenterProvider>
        <BrowserRouter>
          <Routes>
            {/* Gateway Page: Choose Admin or Assistant */}
            <Route path="/" element={<PortalGateway />} />

            {/* Admin Portal (Decoupled with full financial intelligence) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminFinancialDashboard />} />
              <Route path="deliveries" element={<AdminDeliveriesTracker />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Field Assistant Portal (Quantity drops, collections with photo proofs, no prices) */}
            <Route path="/assistant" element={<AssistantLayout />}>
              <Route index element={<AssistantView />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CenterProvider>
    </ToastProvider>
  );
}
