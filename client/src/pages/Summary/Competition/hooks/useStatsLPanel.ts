import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import { GoalStats, StatsActual, StatsValue } from "../types";
import { buildTableData } from "../../../../utils/plot";
import { StatsL, StatsLGet } from "../../../../types/models/stats-l";
import { RadarField } from "../../../../components/plot/RadarChart/types";
import { radarFields } from "../../../../components/plot/RadarChart/radarFields";

export const useStatsLPanel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [statsL, setStatsL] = useState<{
    raw: StatsLGet[];
    values: StatsActual[];
  }>({
    raw: [],
    values: [],
  });

  const readStatsL = async (
    goalStats: GoalStats[],
    seasonId?: string,
  ): Promise<{
    raw: StatsLGet[];
    values: StatsActual[];
  } | null> => {
    if (goalStats.length === 0) return null;
    if (!seasonId) {
      setIsLoading(false);
      return null;
    }
    setIsLoading(true);
    const res = await readItemsBase<StatsL[]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        "match.season": seasonId,
      },
    });

    if (!res?.data) {
      setIsLoading(false);
      return null;
    }

    const converted = convert(ModelType.STATS_L, res.data);

    const fields: RadarField[] = radarFields.filter((f) => f.key);

    const goalStatsMap = new Map(
      goalStats.map((g) => [`${g.match.id}_${g.team.id}`, g]),
    );

    const mergedData: StatsValue[] = res.data.map((d) => {
      const key = `${d.match._id}_${d.team._id}`;
      const stats = goalStatsMap.get(key);

      return {
        ...d,
        goal: stats?.goal,
        against_goal: stats?.against_goal,
      };
    });

    const tableDatas = buildTableData(
      mergedData,
      mergedData,
      fields,
      (d) => d.team._id || "",
    );

    setStatsL({ raw: converted, values: tableDatas });
    setIsLoading(false);

    return { raw: converted, values: tableDatas };
  };
  return {
    statsL: {
      isLoading,

      items: statsL,
    },
    readStatsL,
    setStatsL,
  };
};
