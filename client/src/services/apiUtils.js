// Shared fetch wrapper for all API calls.
// On success (2xx): returns parsed JSON, or null for 204 (no body to parse).
// On failure (4xx/5xx): tries to read the server's { error } message for a
// specific reason (e.g. "Recipe not found"). Falls back to a generic message if
// the body isn't JSON (proxy error, network failure, empty response) — the
// empty catch silently discards the parse error and keeps the fallback.
// Always throws an Error with .status so callers can distinguish 400 vs 500.
export async function apiFetch(url, options) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    credentials: "include",
    ...options,
  });
  if (res.ok) return res.status === 204 ? null : res.json();
  let message = "Something went wrong. Please try again.";
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {}
  throw Object.assign(new Error(message), { status: res.status });
}
