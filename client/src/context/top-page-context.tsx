import { createContext, ReactNode, useContext, useState } from "react";
import { GettedModelDataMap, ModelType } from "../types/models";
import { Transfer, TransferGet } from "../types/models/transfer";
import { Injury, InjuryGet } from "../types/models/injury";
import { convert } from "../lib/convert/DBtoGetted";
import { useAlert } from "./alert-context";
import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../lib/api";
import { api } from "./api-context";
import { TeamGet } from "../types/models/team";
import { Season } from "../types/models/season";
import { TeamCompetitionSeason } from "../types/models/team-competition-season";
import { Competition } from "../types/models/competition";

type TopPageStage = {
  isLoading: boolean;
  transfers: GettedModelDataMap[ModelType.TRANSFER][];
  injuries: GettedModelDataMap[ModelType.INJURY][];
  j1Teams: GettedModelDataMap[ModelType.TEAM][];
  j2Teams: GettedModelDataMap[ModelType.TEAM][];
  j3Teams: GettedModelDataMap[ModelType.TEAM][];
  readItems: (limit?: number) => Promise<void>;
};
const defaultValue: TopPageStage = {
  isLoading: false,
  transfers: [],
  injuries: [],
  j1Teams: [],
  j2Teams: [],
  j3Teams: [],
  readItems: async () => {},
};

const readTeams = async (competitionName: string): Promise<TeamGet[]> => {
  const competitionRes = await readItemsBase<Competition[]>({
    apiInstance: api,
    backendRoute: API_PATHS.COMPETITION.ROOT,
    params: { name: competitionName },
  });

  if (!competitionRes || !competitionRes?.data) return [];
  const competition = convert(ModelType.COMPETITION, competitionRes.data[0]);

  const res = await readItemsBase<Season[]>({
    apiInstance: api,
    backendRoute: API_PATHS.SEASON.ROOT,
    params: { competition: competition._id, getAll: true },
  });

  if (!res || !res?.data) return [];

  const season = convert(ModelType.SEASON, res.data);
  const current = season.find((s) => s.current);
  const newSeason = current ? current : season[0];

  const teamCompetitionSeasonRes = await readItemsBase<TeamCompetitionSeason[]>(
    {
      apiInstance: api,
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
      params: { season: newSeason._id, getAll: true },
    },
  );

  if (!teamCompetitionSeasonRes || !teamCompetitionSeasonRes.data) return [];

  const teams = teamCompetitionSeasonRes?.data.map((d) => d.team);

  const teamGets = convert(ModelType.TEAM, teams).sort((a, b) =>
    (a.enTeam ?? "").localeCompare(b.enTeam ?? ""),
  );
  return teamGets;
};

const TopPageContext = createContext<TopPageStage>(defaultValue);

const TopPageProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transfers, setTransfers] = useState<TransferGet[]>([]);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);

  const [j1Teams, setJ1Teams] = useState<TeamGet[]>([]);
  const [j2Teams, setJ2Teams] = useState<TeamGet[]>([]);
  const [j3Teams, setJ3Teams] = useState<TeamGet[]>([]);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const readItems = async (limit?: number) => {
    handleLoading("start");

    const obj = await readItemsBase<{
      transferData: Transfer[];
      injuryData: Injury[];
    }>({
      apiInstance: api,
      backendRoute: API_PATHS.TOP_PAGE.GET,
      params: limit ? { limit } : {},
      handleSetAlert: handleSetAlert,
    });

    if (!obj) return handleLoading("end");

    const transfers = obj.data.transferData;
    const injuries = obj.data.injuryData;

    setTransfers(convert(ModelType.TRANSFER, transfers));
    setInjuries(convert(ModelType.INJURY, injuries));

    const j1Teams = await readTeams("Ｊ１リーグ");
    const j2Teams = await readTeams("Ｊ２リーグ");
    const j3Teams = await readTeams("Ｊ３リーグ");

    setJ1Teams(j1Teams);
    setJ2Teams(j2Teams);
    setJ3Teams(j3Teams);

    handleLoading("end");
  };

  const value = {
    isLoading,
    transfers,
    injuries,
    j1Teams,
    j2Teams,
    j3Teams,
    readItems,
  };

  return (
    <TopPageContext.Provider value={value}>{children}</TopPageContext.Provider>
  );
};

const useTopPage = () => {
  const context = useContext(TopPageContext);
  if (!context) {
    throw new Error("useTopPage must be used within a TopPageProvider");
  }
  return context;
};

export { TopPageProvider, useTopPage };
