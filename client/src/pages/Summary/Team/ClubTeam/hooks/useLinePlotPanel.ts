import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { TeamMatch } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { convertMatchToTeamMatch } from "../../../../../utils/data";
import { Match, MatchGet } from "../../../../../types/models/match";

export const useLinePlotPanel = () => {
  const [teamMatchs, setTeamMatchs] = useState<TeamMatch[]>([]);
  const [plotData, setPlotData] = useState<{
    label: string[];
    value: number[];
  }>({ label: [], value: [] });

  async function readMatchs(id: string, seasonId: string): Promise<MatchGet[]> {
    const obj = await readItemsBase<Match[]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: { team: id, season: seasonId, getAll: true, sort: "date" },
    });

    if (!obj) return [];

    const matches = convert(ModelType.MATCH, obj.data);

    return matches;
  }

  const readPlotData = async (id: string, seasonId: string) => {
    const matches = await readMatchs(id, seasonId);
    const teamMatchs = convertMatchToTeamMatch(matches, id);

    setTeamMatchs(teamMatchs);

    const labels = teamMatchs.map((match) =>
      match.match_week ? `w-${match.match_week}` : "",
    );

    let total = 0;
    const cumulativePoints = teamMatchs.map((d) => {
      const point = d.result === "勝ち" ? 3 : d.result === "分け" ? 1 : 0;
      total += point;
      return total;
    });

    setPlotData({ label: labels, value: cumulativePoints });
  };

  return {
    readPlotData,
    teamMatchs,
    plotData,
  };
};
