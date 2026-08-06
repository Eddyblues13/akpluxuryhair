const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, errors = {} } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    // Laravel's { field: [message] } validation bag, flattened to first message.
    this.errors = Object.fromEntries(
      Object.entries(errors).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages[0] : messages,
      ])
    );
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (cause?.name === "AbortError") throw cause;
    throw new ApiError("Can't reach the store right now — check your connection and try again.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Something went wrong (${response.status}).`,
      { status: response.status, errors: payload?.errors ?? {} }
    );
  }

  return payload;
}

export const fetchProducts = (signal) => request("/products", { signal });

export const fetchProduct = (id, signal) =>
  request(`/products/${encodeURIComponent(id)}`, { signal });

export const createOrder = (order) => request("/orders", { method: "POST", body: order });

export const sendContactMessage = (message) =>
  request("/contact", { method: "POST", body: message });
