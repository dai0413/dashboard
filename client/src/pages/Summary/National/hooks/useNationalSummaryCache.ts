import { useCallback, useRef } from "react";
import type { NationalSummaryCache } from "../types";

type NationalSummaryCacheMap = Map<string, Partial<NationalSummaryCache>>;

export const useNationalSummaryCache = () => {
  const cacheRef = useRef<NationalSummaryCacheMap>(new Map());

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
    (competitionId: string, data: Partial<NationalSummaryCache>) => {
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

    return (
      cached.competition !== undefined &&
      cached.team !== undefined &&
      cached.nationalMatchSeries !== undefined
    );
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
