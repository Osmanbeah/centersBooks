import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CenterProvider } from './context/CenterContext';
import { Navbar } from './components/layout/Navbar';
import { AdminFinancialDashboard } from './components/admin/AdminFinancialDashboard';
import { AdminDeliveriesTracker } from './components/admin/AdminDeliveriesTracker';
import { AssistantView } from './components/assistant/AssistantView';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'admin' | 'admin-deliveries' | 'assistant' | 'settings'>('admin');
  const [currentRole, setCurrentRole] = useState<'admin' | 'assistant'>('admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'admin' && <AdminFinancialDashboard />}
        {currentTab === 'admin-deliveries' && <AdminDeliveriesTracker />}
        {currentTab === 'assistant' && <AssistantView />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CenterProvider>
        <AppContent />
      </CenterProvider>
    </ToastProvider>
  );
}
