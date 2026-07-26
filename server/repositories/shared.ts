export function camelizeKeys<T = unknown>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelizeKeys(item)) as T;
  } else if (Buffer.isBuffer(obj)) {
    return obj.toString("base64") as T;
  } else if (obj instanceof Date) {
    return obj as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
        camelizeKeys(value),
      ]),
    ) as T;
  }
  return obj as T;
}
