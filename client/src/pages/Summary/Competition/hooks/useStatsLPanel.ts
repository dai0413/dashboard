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
  const [raw, setRaw] = useState<StatsLGet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [values, setValues] = useState<StatsActual[]>([]);

  const readStatsL = async (goalStats: GoalStats[], seasonId?: string) => {
    if (goalStats.length === 0) return;
    if (!seasonId) return setIsLoading(false);
    setIsLoading(true);
    const res = await readItemsBase<StatsL[]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        "match.season": seasonId,
      },
    });

    if (!res?.data) return setIsLoading(false);

    const converted = convert(ModelType.STATS_L, res.data);
    setRaw(converted);

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

    setValues(tableDatas);
    setIsLoading(false);
  };
  return {
    statsL: {
      isLoading,

      items: {
        raw,
        values,
      },
    },
    readStatsL,
  };
};
