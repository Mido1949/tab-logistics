// Unified session helper — reads company_id from cookie OR localStorage

export function getCompanyId() {
  if (typeof window === 'undefined') return null;

  // 1) Try cookie
  const cookieVal = getCookieValue('company_id');
  if (cookieVal) return cookieVal;

  // 2) Fallback: localStorage
  const stored = localStorage.getItem('company_id');
  if (stored) {
    // Re-sync cookie from localStorage so backend picks it up
    try {
      document.cookie = `company_id=${encodeURIComponent(stored)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`;
    } catch (e) { console.error('Cookie sync failed:', e); }
    return stored;
  }

  return null;
}

export function setCompanyId(id) {
  if (typeof window === 'undefined' || !id) return;
  // Set cookie
  document.cookie = `company_id=${encodeURIComponent(id)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`;
  // Set localStorage as backup
  localStorage.setItem('company_id', id);
}

export function logout() {
  if (typeof window === 'undefined') return;
  document.cookie = 'company_id=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT';
  localStorage.removeItem('company_id');
  window.location.href = '/';
}

export function clearCompanyId() {
  logout();
}

function getCookieValue(name) {
  if (typeof document === 'undefined') return null;
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) {
    const raw = parts.pop().split(';').shift();
    try { return decodeURIComponent(raw); } catch { return raw; }
  }
  return null;
}
