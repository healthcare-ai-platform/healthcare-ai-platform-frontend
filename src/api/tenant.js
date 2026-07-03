import { apiFetch } from './client';

export function listUsers(tenantId) {
  return apiFetch(`/api/v1/tenants/${tenantId}/users`);
}

export function inviteUser(tenantId, data) {
  return apiFetch(`/api/v1/tenants/${tenantId}/users/invite`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function suspendUser(tenantId, userId) {
  return apiFetch(`/api/v1/tenants/${tenantId}/users/${userId}/suspend`, {
    method: 'PUT',
  });
}

export function listFacilities(tenantId) {
  return apiFetch(`/api/v1/tenants/${tenantId}/facilities`);
}

export function createFacility(tenantId, data) {
  return apiFetch(`/api/v1/tenants/${tenantId}/facilities`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
