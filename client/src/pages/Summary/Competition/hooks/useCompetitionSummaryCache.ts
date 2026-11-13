import { useCallback, useRef } from "react";
import type { CompetitionSummaryCache } from "../types";

export type CompetitionSummaryCacheMap = Map<
  string,
  Partial<CompetitionSummaryCache>
>;

export const useCompetitionSummaryCache = () => {
  const cacheRef = useRef<CompetitionSummaryCacheMap>(new Map());

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
    (competitionId: string, data: Partial<CompetitionSummaryCache>) => {
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
      cached.selectedSeason !== undefined &&
      cached.season !== undefined &&
      cached.competitionStage !== undefined &&
      cached.teamCompetitionSeason !== undefined &&
      cached.match !== undefined &&
      cached.playerRegistration !== undefined &&
      cached.staffRegistration !== undefined &&
      cached.playerStatistic !== undefined &&
      cached.statsL !== undefined
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
