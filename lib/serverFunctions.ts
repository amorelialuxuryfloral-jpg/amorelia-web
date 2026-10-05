/**
 * Calls the site's own API routes (app/api/<name>) with the same call shape and
 * result shape as `supabase.functions.invoke`: on a non-2xx response `data` is
 * null and `error` is set, so existing callers keep their error handling.
 */
export async function invokeFunction<T = any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string,
  options: { body: unknown },
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const res = await fetch(`/api/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    });
    if (!res.ok) return { data: null, error: new Error(`HTTP ${res.status}`) };
    return { data: (await res.json()) as T, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
