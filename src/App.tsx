import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CenterProvider } from './context/CenterContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { AssistantLayout } from './components/layout/AssistantLayout';
import { AdminFinancialDashboard } from './components/admin/AdminFinancialDashboard';
import { AdminDeliveriesTracker } from './components/admin/AdminDeliveriesTracker';
import { AssistantView } from './components/assistant/AssistantView';

export default function App() {
  return (
    <ToastProvider>
      <CenterProvider>
        <BrowserRouter>
          <Routes>
            {/* Direct Admin Link */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminFinancialDashboard />} />
              <Route path="deliveries" element={<AdminDeliveriesTracker />} />
            </Route>

            {/* Direct Assistant Link */}
            <Route path="/assistant" element={<AssistantLayout />}>
              <Route index element={<AssistantView />} />
            </Route>

            {/* Default root redirects to Admin */}
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </CenterProvider>
    </ToastProvider>
  );
}
