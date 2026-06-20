export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'velourax_token';

// Customer access token lives in localStorage (browser only).
export const tokenStore = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  set: (t) => typeof window !== 'undefined' && localStorage.setItem(TOKEN_KEY, t),
  clear: () => typeof window !== 'undefined' && localStorage.removeItem(TOKEN_KEY),
};

async function tryRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (!res.ok) return false;
    const json = await res.json();
    if (json?.data?.accessToken) {
      tokenStore.set(json.data.accessToken);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Thin fetch wrapper that unwraps the VelouraX { success, data } envelope.
 * In the browser it auto-attaches the customer token (unless one is passed).
 * `auth: false` opts out (e.g. login/register). Transparently refreshes once on 401.
 */
export async function api(path, { method = 'GET', body, token, cache, next, auth = true, _retried = false } = {}) {
  const bearer = token || (auth ? tokenStore.get() : null);
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
    credentials: typeof window !== 'undefined' ? 'include' : undefined,
  });

  if (res.status === 401 && auth && !token && !_retried && typeof window !== 'undefined') {
    if (await tryRefresh()) return api(path, { method, body, cache, next, auth, _retried: true });
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || (json && json.success === false)) {
    const error = new Error(json?.message || `Request failed (${res.status})`);
    error.details = json?.details;
    error.status = res.status;
    throw error;
  }
  return json?.data;
}

// Server-side data helpers (used by React Server Components — no auth needed)
export const getCategories = () => api('/categories', { next: { revalidate: 120 }, auth: false });
export const getProducts = (qs = '') => api(`/products${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 }, auth: false });
export const getProduct = (slug) => api(`/products/${slug}`, { next: { revalidate: 60 }, auth: false });
