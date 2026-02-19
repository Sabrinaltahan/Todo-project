const API_URL = "http://localhost:4000";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasMessage(value: unknown): value is { message: string } {
  return isObject(value) && typeof value.message === "string";
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;

    try {
      const data: unknown = await res.json();
      if (hasMessage(data)) msg = data.message;
    } catch (err) {
      console.error("Failed to parse error response:", err);
    }

    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}