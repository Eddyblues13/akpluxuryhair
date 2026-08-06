import { ApiError } from "./api";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

const TOKEN_KEY = "akp-admin-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Set by AdminAuthProvider so an expired or revoked token drops the session
// wherever the 401 happens to surface.
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

async function request(path, { method = "GET", body, signal, params } = {}) {
  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )}`
    : "";

  let response;

  try {
    response = await fetch(`${BASE_URL}/admin${path}${query}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (cause?.name === "AbortError") throw cause;
    throw new ApiError("Can't reach the server — check your connection and try again.");
  }

  if (response.status === 401) {
    clearToken();
    onUnauthorized?.();
    throw new ApiError("Your session has expired. Please sign in again.", { status: 401 });
  }

  const payload = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Something went wrong (${response.status}).`,
      { status: response.status, errors: payload?.errors ?? {} }
    );
  }

  return payload;
}

/* auth */
export const adminLogin = (credentials) => request("/login", { method: "POST", body: credentials });
export const adminMe = (signal) => request("/me", { signal });
export const adminLogout = () => request("/logout", { method: "POST" });
export const adminUpdatePassword = (body) => request("/password", { method: "PUT", body });

/* dashboard */
export const fetchDashboard = (signal) => request("/dashboard", { signal });

/* products */
export const fetchAdminProducts = (params, signal) => request("/products", { params, signal });
export const fetchAdminProduct = (slug, signal) => request(`/products/${slug}`, { signal });
export const createProduct = (body) => request("/products", { method: "POST", body });
export const updateProduct = (slug, body) => request(`/products/${slug}`, { method: "PUT", body });
export const deleteProduct = (slug) => request(`/products/${slug}`, { method: "DELETE" });
export const toggleProduct = (slug) => request(`/products/${slug}/toggle`, { method: "PATCH" });

/* orders */
export const fetchAdminOrders = (params, signal) => request("/orders", { params, signal });
export const fetchAdminOrder = (id, signal) => request(`/orders/${id}`, { signal });
export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: "PATCH", body: { status } });
export const deleteOrder = (id) => request(`/orders/${id}`, { method: "DELETE" });

/* messages */
export const fetchMessages = (params, signal) => request("/messages", { params, signal });
export const toggleMessageHandled = (id) => request(`/messages/${id}/handled`, { method: "PATCH" });
export const deleteMessage = (id) => request(`/messages/${id}`, { method: "DELETE" });

/* team */
export const fetchTeam = (signal) => request("/team", { signal });
export const createTeamMember = (body) => request("/team", { method: "POST", body });
export const updateTeamMember = (id, body) => request(`/team/${id}`, { method: "PUT", body });
export const deleteTeamMember = (id) => request(`/team/${id}`, { method: "DELETE" });
