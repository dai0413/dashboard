import { createContext, ReactNode, useContext, useState } from "react";
import { GettedModelDataMap, ModelType } from "../types/models";
import { Transfer, TransferGet } from "../types/models/transfer";
import { Injury, InjuryGet } from "../types/models/injury";
import { convert } from "../lib/convert/DBtoGetted";
import { useAlert } from "./alert-context";
import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../lib/api";
import { api } from "./api-context";
import { Team, TeamGet } from "../types/models/team";
import { Season, SeasonGet } from "../types/models/season";
import { TeamCompetitionSeason } from "../types/models/team-competition-season";
import { Competition } from "../types/models/competition";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../types/models/national-match-series";
import { Country } from "../types/models/country";

type TopPageStage = {
  isLoading: boolean;
  transfers: GettedModelDataMap[ModelType.TRANSFER][];
  injuries: GettedModelDataMap[ModelType.INJURY][];
  j1Teams: GettedModelDataMap[ModelType.TEAM][];
  j2Teams: GettedModelDataMap[ModelType.TEAM][];
  j3Teams: GettedModelDataMap[ModelType.TEAM][];
  currentCompetitions: GettedModelDataMap[ModelType.SEASON][];
  series: GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][];
  readItems: (limit?: number) => Promise<void>;
};
const defaultValue: TopPageStage = {
  isLoading: false,
  transfers: [],
  injuries: [],
  j1Teams: [],
  j2Teams: [],
  j3Teams: [],
  currentCompetitions: [],
  series: [],
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

  const teams = teamCompetitionSeasonRes?.data
    .sort((a, b) => (a.order && b.order ? a.order - b.order : -1))
    .map((d) => d.team);

  const teamGets = convert(ModelType.TEAM, teams);
  return teamGets;
};

const readSeries = async (): Promise<NationalMatchSeriesGet[]> => {
  const countryRes = await readItemsBase<Country[]>({
    apiInstance: api,
    backendRoute: API_PATHS.COUNTRY.ROOT,
    params: { en_name: "Japan" },
  });

  if (!countryRes?.data || countryRes.data.length !== 1) return [];

  const countryId = countryRes.data[0]._id;

  const teamRes = await readItemsBase<Team[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM.ROOT,
    params: {
      getAll: true,
      genre: "national",
      country: countryId,
      sort: "age_group",
    },
  });

  if (!teamRes?.data) return [];

  const teamIds = teamRes.data.map((team) => team._id);

  const toDay = new Date();

  const [futureSeriesRes, pastSeriesRes] = await Promise.all([
    readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        team: teamIds,
        joined_at: `>=${toDay}`,
      },
    }),
    readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        team: teamIds,
        left_at: `>=${toDay}`,
      },
    }),
  ]);

  const seriesDatas = Array.from(
    new Map(
      [...(futureSeriesRes?.data ?? []), ...(pastSeriesRes?.data ?? [])].map(
        (item) => [item._id, item],
      ),
    ).values(),
  );

  return convert(ModelType.NATIONAL_MATCH_SERIES, seriesDatas);
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

  const [currentCompetitions, setCurrentCompetitions] = useState<SeasonGet[]>(
    [],
  );

  const [series, setSeries] = useState<NationalMatchSeriesGet[]>([]);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const readItems = async (limit?: number) => {
    handleLoading("start");

    try {
      const obj = await readItemsBase<{
        transferData: Transfer[];
        injuryData: Injury[];
      }>({
        apiInstance: api,
        backendRoute: API_PATHS.TOP_PAGE.GET,
        params: limit ? { limit } : {},
        handleSetAlert,
      });

      if (!obj) return;

      setTransfers(convert(ModelType.TRANSFER, obj.data.transferData));
      setInjuries(convert(ModelType.INJURY, obj.data.injuryData));

      const [j1Teams, j2Teams, j3Teams, series, seasonObj] = await Promise.all([
        readTeams("Ｊ１リーグ"),
        readTeams("Ｊ２リーグ"),
        readTeams("Ｊ３リーグ"),
        readSeries(),
        readItemsBase<Season[]>({
          apiInstance: api,
          backendRoute: API_PATHS.SEASON.ROOT,
          params: { current: true },
        }),
      ]);

      setJ1Teams(j1Teams);
      setJ2Teams(j2Teams);
      setJ3Teams(j3Teams);
      setSeries(series);

      if (seasonObj?.data) {
        setCurrentCompetitions(convert(ModelType.SEASON, seasonObj.data));
      }
    } catch (e) {
      console.error(e);
    } finally {
      handleLoading("end");
    }
  };

  const value = {
    isLoading,
    transfers,
    injuries,
    j1Teams,
    j2Teams,
    j3Teams,
    currentCompetitions,
    series,
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
