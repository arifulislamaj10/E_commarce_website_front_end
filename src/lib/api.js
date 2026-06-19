export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Thin fetch wrapper that unwraps the VelouraX { success, data } envelope. */
export async function api(path, { method = 'GET', body, token, cache, next } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || (json && json.success === false)) {
    const message = json?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.details = json?.details;
    error.status = res.status;
    throw error;
  }
  return json?.data;
}

// Server-side data helpers (used by React Server Components)
export const getCategories = () => api('/categories', { next: { revalidate: 120 } });
export const getProducts = (qs = '') => api(`/products${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
export const getProduct = (slug) => api(`/products/${slug}`, { next: { revalidate: 60 } });
