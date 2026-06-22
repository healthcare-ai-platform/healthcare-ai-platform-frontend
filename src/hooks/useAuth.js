function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function isExpired(decoded) {
  return decoded?.exp && decoded.exp * 1000 < Date.now();
}

export function getStoredUser() {
  const token = localStorage.getItem('hc_access');
  if (!token) return null;
  const decoded = decodeJWT(token);
  if (!decoded || isExpired(decoded)) {
    clearAuth();
    return null;
  }
  return decoded;
}

export function storeAuth(tokens) {
  localStorage.setItem('hc_access', tokens.access_token);
  localStorage.setItem('hc_refresh', tokens.refresh_token);
}

export function clearAuth() {
  localStorage.removeItem('hc_access');
  localStorage.removeItem('hc_refresh');
}

export function roleHomeRoute(role) {
  if (role === 'platform_admin') return '/admin';
  return '/';
}
