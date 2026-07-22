import store from '../store';
import { logout } from '../store/slices/authSlice';
import { showToast } from '../store/slices/toastSlice';
import { showLogin } from '../store/slices/uiSlice';
import { disconnectSocket } from './socket';

const BASE_URL = 'https://kick-analyst-backend-production.jay886631.workers.dev';

// A still-valid JWT from a now-suspended user gets `suspended: true` on any
// 403 (userAuth middleware does a DB lookup per request) — force them out
// immediately instead of leaving them on a broken page. Guarded so a burst of
// parallel requests failing together doesn't stack duplicate toasts/redirects.
let suspensionHandled = false;

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
    if (data?.suspended && !suspensionHandled) {
      suspensionHandled = true;
      disconnectSocket();
      store.dispatch(logout());
      store.dispatch(showLogin());
      store.dispatch(showToast({
        message: data.message || 'Your account has been suspended. Please contact support.',
        type: 'error',
      }));
    }
    const message =
      data?.message || data?.error || data?.msg || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  suspensionHandled = false;
  return data;
}
