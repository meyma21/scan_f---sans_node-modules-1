import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import PendingChecks from './pages/PendingChecks';
import ValidatedChecks from './pages/ValidatedChecks';
import NeedsReviewChecks from './pages/NeedsReviewChecks';
import RejectedChecks from './pages/RejectedChecks';
import CheckDetail from './pages/CheckDetail';
import CheckList from './pages/CheckList';
import { useCheckStore } from './store/checkStore';
import { SimulatorControlProvider } from './context/SimulatorControlContext';
import { ScannerDataProvider } from './context/ScannerDataProvider';


function App() {
  const { fetchChecks } = useCheckStore();
  
  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);
  
  return (
    <SimulatorControlProvider>
      <ScannerDataProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pending" element={<PendingChecks />} />
          <Route path="validated" element={<ValidatedChecks />} />
          <Route path="needs-review" element={<NeedsReviewChecks />} />
          <Route path="rejected" element={<RejectedChecks />} />
          <Route path="check/:id" element={<CheckDetail />} />
          <Route path="check-list" element={<CheckList />} />
          <Route path="list" element={<CheckList />} />
        </Route>
      </Routes>
      </ScannerDataProvider>
    </SimulatorControlProvider>
  );
}

export default App;