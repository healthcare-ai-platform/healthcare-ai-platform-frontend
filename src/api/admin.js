import { apiFetch } from './client';

export const listTenants       = ()       => apiFetch('/api/v1/admin/tenants');
export const getTenant         = (id)     => apiFetch(`/api/v1/admin/tenants/${id}`);
export const suspendTenant     = (id)     => apiFetch(`/api/v1/admin/tenants/${id}/suspend`, { method: 'PUT' });
export const systemHealth      = ()       => apiFetch('/api/v1/admin/system/health');
export const billing           = ()       => apiFetch('/api/v1/admin/billing');
export const listAdminUsers    = ()       => apiFetch('/api/v1/admin/users');

export function createTenant(body) {
  return apiFetch('/api/v1/admin/tenants', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function inviteAdmin(body) {
  return apiFetch('/api/v1/admin/users/invite', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function platformLogs({ search, tenant_id, page = 1, page_size = 20 } = {}) {
  const params = new URLSearchParams({ page, page_size });
  if (search)    params.set('search', search);
  if (tenant_id) params.set('tenant_id', tenant_id);
  return apiFetch(`/api/v1/admin/logs?${params}`);
}
