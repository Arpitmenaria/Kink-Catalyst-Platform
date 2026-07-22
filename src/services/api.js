// In production (Vercel) go through a same-origin proxy — requests hit
// `/api/...` on the Vercel domain, which vercel.json rewrites to Railway.
// This hides the Railway domain from the browser, so networks that block
// *.up.railway.app (some corporate/public wifi) can still reach the API.
// In local dev, call Railway directly (Railway CORS allows localhost).
const BASE_URL = import.meta.env.DEV
  ? 'https://kick-analyst-backend-production.up.railway.app'
  : '';

export async function apiRequest(path, { method = 'GET', body, token, isFormData = false } = {}) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message || data?.error || data?.msg || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
