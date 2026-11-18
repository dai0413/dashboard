import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { convertMatchToTeamMatch } from "../../../../../utils/data";
import { Match, MatchGet } from "../../../../../types/models/match";
import { LinePlotData } from "../types";

export const useLinePlotPanel = () => {
  const [linePLotData, setLinePlotData] = useState<LinePlotData>({
    data: { teamMatchs: [], plotData: { label: [], value: [] } },
    page: 1,
    totalCount: 0,
    isLoading: false,
  });

  async function readMatchs(id: string, seasonId: string): Promise<MatchGet[]> {
    const obj = await readItemsBase<Match[]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: { team: id, season: seasonId, getAll: true, sort: "date" },
      handleLoading: (time) => {
        setLinePlotData((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return [];

    const matches = convert(ModelType.MATCH, obj.data);

    return matches;
  }

  const readLinePlotData = async (id: string, seasonId: string) => {
    const matches = await readMatchs(id, seasonId);
    const teamMatchs = convertMatchToTeamMatch(matches, id);

    const labels = teamMatchs.map((match, i) =>
      match.match_week ? `w-${match.match_week}` : `Game-${i + 1}`,
    );

    let total = 0;
    const cumulativePoints = teamMatchs.map((d) => {
      const point = d.result === "勝ち" ? 3 : d.result === "分け" ? 1 : 0;
      total += point;
      return total;
    });

    const nextItems: LinePlotData = {
      data: {
        teamMatchs,
        plotData: { label: labels, value: cumulativePoints },
      },
      page: 1,
      totalCount: teamMatchs.length,
      isLoading: false,
    };

    setLinePlotData(nextItems);

    return nextItems;
  };

  return {
    readLinePlotData,
    linePLotData,
    setLinePlotData,
  };
};
