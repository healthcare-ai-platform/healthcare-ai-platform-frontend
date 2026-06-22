import { apiFetch } from './client';

export function listDocuments({ page = 1, pageSize = 20, status } = {}) {
  const params = new URLSearchParams({ page, page_size: pageSize });
  if (status && status !== 'all') params.set('status', status);
  return apiFetch(`/api/v1/queue/?${params}`);
}

export async function uploadPdf(file, reportType) {
  const token = localStorage.getItem('hc_access') || '';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('report_type', reportType);

  const res = await fetch('/api/v1/upload/pdf', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Upload failed (${res.status})`);
  }
  return res.json();
}
