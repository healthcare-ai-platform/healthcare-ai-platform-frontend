import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Queue from './pages/Queue';
import Audit from './pages/Audit';
import AIAssistant from './pages/AIAssistant';
import Placeholder from './pages/Placeholder';
import Profile from './pages/Profile';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Placeholder title="Analytics" subtitle="Trend and cohort analysis" description="Analyst dashboard — filters by tenant, date, diagnosis, and document type. Coming in Phase 3." />} />
          <Route path="/documents" element={<Placeholder title="Documents" subtitle="All uploaded documents" description="Document browser with upload, OCR status, and extraction confidence scores. Coming in Phase 2." />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/failures" element={<Placeholder title="Failures" subtitle="Dead letter queue" description="DLQ viewer with error reasons, retry triggers, and replay history. Coming in Phase 2." />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/facilities" element={<Placeholder title="Facilities" subtitle="Hospital and clinic breakdown" description="Facility-level analytics with SLA tracking and volume trends. Coming in Phase 3." />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/access" element={<Placeholder title="Access control" subtitle="RBAC and tenant isolation" description="Role-based access control, tenant isolation, and user management. Coming in Phase 3." />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
