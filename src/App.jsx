import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Login from './pages/auth/Login';
import AcceptInvite from './pages/auth/AcceptInvite';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Queue from './pages/Queue';
import Audit from './pages/Audit';
import AIAssistant from './pages/AIAssistant';
import Placeholder from './pages/Placeholder';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Facilities from './pages/Facilities';
import TenantTeam from './pages/tenant/TenantTeam';

import AdminTenants from './pages/admin/AdminTenants';
import AdminHealth  from './pages/admin/AdminHealth';
import AdminBilling from './pages/admin/AdminBilling';
import AdminLogs    from './pages/admin/AdminLogs';
import AdminUsers   from './pages/admin/AdminUsers';

import './styles/globals.css';

const TEAM_ROLES = ['tenant_admin', 'manager'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"           element={<Login />} />
        <Route path="/accept-invite"   element={<AcceptInvite />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Platform admin panel */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><Navigate to="/admin/tenants" replace /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tenants" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><AdminTenants /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/health" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><AdminHealth /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/billing" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><AdminBilling /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><AdminLogs /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="platform_admin">
            <AdminLayout><AdminUsers /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Tenant dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AppLayout><Placeholder title="Analytics" subtitle="Trend and cohort analysis" description="Analyst dashboard — filters by tenant, date, diagnosis, and document type. Coming in Phase 3." /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <AppLayout><Documents /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/queue" element={
          <ProtectedRoute>
            <AppLayout><Queue /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/failures" element={
          <ProtectedRoute>
            <AppLayout><Placeholder title="Failures" subtitle="Dead letter queue" description="DLQ viewer with error reasons, retry triggers, and replay history. Coming in Phase 2." /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute>
            <AppLayout><Patients /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/facilities" element={
          <ProtectedRoute>
            <AppLayout><Facilities /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai-assistant" element={
          <ProtectedRoute>
            <AppLayout><AIAssistant /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute requiredRole={TEAM_ROLES}>
            <AppLayout><TenantTeam /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/audit" element={
          <ProtectedRoute>
            <AppLayout><Audit /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
