import { useCallback, useRef } from "react";
import type { ClubTeamSummaryCache } from "../types";

type ClubTeamSummaryCacheMap = Map<string, Partial<ClubTeamSummaryCache>>;

export const useClubTeamSummaryCache = () => {
  const cacheRef = useRef<ClubTeamSummaryCacheMap>(new Map());

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
    (competitionId: string, data: Partial<ClubTeamSummaryCache>) => {
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
      cached.seasonDate !== undefined &&
      cached.selectedteamCompetitionSeason !== undefined &&
      cached.player !== undefined &&
      cached.future_in !== undefined &&
      cached.transfer_in !== undefined &&
      cached.transfer_out !== undefined &&
      cached.loan !== undefined &&
      cached.injury !== undefined &&
      cached.match !== undefined &&
      cached.playerRegistration !== undefined &&
      cached.statsL !== undefined &&
      cached.staffRegistration !== undefined &&
      cached.radarData !== undefined &&
      cached.linePlot !== undefined &&
      cached.teamCompetitionSeason !== undefined &&
      cached.appearancePlot !== undefined &&
      cached.birthYearPositionMatrix !== undefined &&
      cached.formationPlot !== undefined &&
      cached.playerStatistics !== undefined
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
