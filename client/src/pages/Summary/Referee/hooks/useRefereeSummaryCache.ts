import { useCallback, useRef } from "react";
import type { RefereeSummaryCache } from "../types";

type RefereeSummaryCacheMap = Map<string, Partial<RefereeSummaryCache>>;

export const useRefereeSummaryCache = () => {
  const cacheRef = useRef<RefereeSummaryCacheMap>(new Map());

  /**
   * キャッシュを取得
   */
  const getCache = useCallback((competitionId: string) => {
    return cacheRef.current.get(competitionId) ?? null;
  }, []);

  /**
   * キャッシュが存在するか
   */
  const hasCache = useCallback((competitionId: string) => {
    return cacheRef.current.has(competitionId);
  }, []);

  /**
   * キャッシュを保存・更新
   */
  const saveCache = useCallback(
    (competitionId: string, data: Partial<RefereeSummaryCache>) => {
      const prev = cacheRef.current.get(competitionId) ?? {};

      cacheRef.current.set(competitionId, {
        ...prev,
        ...data,
      });
    },
    [],
  );

  /**
   * すべてのデータあるか
   */
  const isCacheComplete = useCallback((id: string) => {
    const cached = cacheRef.current.get(id);

    if (!cached) return false;

    return true;
  }, []);

  /**
   * 指定したIdのキャッシュを削除
   */
  const clearCache = useCallback((competitionId: string) => {
    cacheRef.current.delete(competitionId);
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
