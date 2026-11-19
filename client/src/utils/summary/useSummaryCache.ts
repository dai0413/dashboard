import { useCallback, useRef } from "react";

export const useSummaryCache = <T>(requiredKeys: (keyof T)[]) => {
  const cacheRef = useRef<Map<string, Partial<T>>>(new Map());

  /**
   * キャッシュを取得
   */
  const getCache = useCallback((id: string) => {
    return cacheRef.current.get(id) ?? null;
  }, []);

  /**
   * キャッシュが存在するか
   */
  const hasCache = useCallback((id: string) => {
    return cacheRef.current.has(id);
  }, []);

  /**
   * キャッシュを保存・更新
   */
  const saveCache = useCallback((id: string, data: Partial<T>) => {
    const prev = cacheRef.current.get(id) ?? {};

    cacheRef.current.set(id, {
      ...prev,
      ...data,
    });
  }, []);

  /**
   * すべてのデータがあるか
   */
  const isCacheComplete = useCallback(
    (id: string) => {
      const cached = cacheRef.current.get(id);

      if (!cached) return false;

      return requiredKeys.every((key) => cached[key] !== undefined);
    },
    [requiredKeys],
  );

  /**
   * 指定したIDのキャッシュを削除
   */
  const clearCache = useCallback((id: string) => {
    cacheRef.current.delete(id);
  }, []);

  /**
   * すべてのキャッシュを削除
   */
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    getCache,
    hasCache,
    saveCache,
    isCacheComplete,
    clearCache,
    clearAllCache,
  };
};
