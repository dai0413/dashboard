import { useCallback, useRef } from "react";
import type { MatchSummaryCache } from "../types";

type MatchSummaryCacheMap = Map<string, Partial<MatchSummaryCache>>;

export const useMatchSummaryCache = () => {
  const cacheRef = useRef<MatchSummaryCacheMap>(new Map());

  /**
   * キャッシュを取得
   */
  const getCache = useCallback((matchId: string) => {
    return cacheRef.current.get(matchId) ?? null;
  }, []);

  /**
   * キャッシュが存在するか
   */
  const hasCache = useCallback((matchId: string) => {
    return cacheRef.current.has(matchId);
  }, []);

  /**
   * キャッシュを保存・更新
   */
  const saveCache = useCallback(
    (matchId: string, data: Partial<MatchSummaryCache>) => {
      const prev = cacheRef.current.get(matchId) ?? {};

      cacheRef.current.set(matchId, {
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
      cached.startingMember !== undefined &&
      cached.homeSubMember !== undefined &&
      cached.awaySubMember !== undefined &&
      cached.staffAppearance !== undefined &&
      cached.playerMatchEventLog !== undefined &&
      cached.staffMatchEventLog !== undefined &&
      cached.teamMatchFormation !== undefined &&
      cached.homeStatsL !== undefined &&
      cached.awayStatsL !== undefined &&
      cached.refereeAppearance !== undefined
    );
  }, []);

  /**
   * 指定したIdのキャッシュを削除
   */
  const clearCache = useCallback((matchId: string) => {
    cacheRef.current.delete(matchId);
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
