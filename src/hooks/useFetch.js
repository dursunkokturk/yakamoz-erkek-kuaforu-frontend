import { useEffect, useState, useCallback } from "react";

/**
 * Genel amaçlı fetch hook'u. Proje şu an localStorage ile çalıştığı için
 * bileşenler bunu doğrudan kullanmıyor, ama ileride gerçek bir API'ye
 * bağlanılacaksa (örn. /api/appointments) hazır bir soyutlama sağlar.
 */
export function useFetch(url, options, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`İstek başarısız: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (immediate && url) {
      execute().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, error, isLoading, refetch: execute };
}
