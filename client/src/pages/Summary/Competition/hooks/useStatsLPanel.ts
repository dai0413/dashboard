import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import { StatsActual, StatsDeviation, StatsRank } from "../types";
import { buildTableData } from "../../../../utils/plot";
import { StatsL, StatsLGet } from "../../../../types/models/stats-l";
import { RadarField } from "../../../../components/plot/RadarChart/types";
import { radarFields } from "../../../../components/plot/RadarChart/radarFields";

export const useStatsLPanel = () => {
  const [raw, setRaw] = useState<StatsLGet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actual, setActual] = useState<StatsActual[]>([]);
  const [deviation, setDeviation] = useState<StatsDeviation[]>([]);
  const [rank, setRank] = useState<StatsRank[]>([]);

  const readStatsL = async (seasonId?: string) => {
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

    const tableDatas = buildTableData(
      converted,
      converted,
      fields,
      (d) => d.team.id || "",
    );

    setActual(tableDatas.actual);
    setDeviation(tableDatas.deviation);
    setRank(tableDatas.rank);

    setIsLoading(false);
  };

  return {
    statsL: {
      isLoading,

      items: {
        raw,
        actual,
        deviation,
        rank,
      },
    },
    readStatsL,
  };
};
