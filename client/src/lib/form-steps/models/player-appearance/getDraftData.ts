import { AxiosInstance } from "axios";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerAppearance";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-appearance";
import { PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { getSeasons } from "../../utils/getSeasons";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { ReadDraftDataParams } from "../../utils/getDraftData/types";
import { getSeries } from "../../utils/getSeries";
import { readItemsBase } from "../../../api";
import { Team } from "../../../../types/models/team";
import { convert } from "../../../convert/CreateLabel";

const KEYS = ["match", "player", "team"] as const;

type CalcWithData = Record<string, any> & {
  start_time?: number;
  end_time?: number;
};

const calcTime = (d: CalcWithData, play_time?: number): number | undefined => {
  let time: number | undefined;

  if (typeof d.start_time === "number") {
    if (typeof d.end_time === "number") {
      time = d.end_time - d.start_time;
    } else if (typeof play_time === "number") {
      time = play_time - d.start_time;
    }
  }
  return time;
};

const buildResolveInput = (
  draftData: Scraped[],
  match: Label,
  season: string[],
  team: Label,
  series?: string,
  play_time?: number,
) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team,
      time: calcTime(d, play_time),
      season,
      series,
    };
  });
  return data;
};

type Input = ResolveInput<{ player: Select.MODEL }>;

type Resolve = {
  api: AxiosInstance;
  data: Input[];
  match: Label;
  season: string[];
  series?: string;
  resolveTeam?: Label;
  matchTeam: Label;
  play_time?: number;
};

const resolve = async ({
  api,
  data,
  season,
  match,
  series,
  resolveTeam,
  matchTeam,
  play_time,
}: Resolve) => {
  const input = buildResolveInput(
    data,
    match,
    season,
    resolveTeam ?? matchTeam,
    series,
    play_time,
  );

  const resolved = await fetchResolved<
    "playerAppearance",
    Input,
    ResolveOutput
  >(api, "playerAppearance", input);

  if (!resolveTeam) return resolved;

  return resolved.map((d) => {
    return {
      ...d,
      team: matchTeam,
    };
  });
};

const resolveTeam = async (api: AxiosInstance, team: Label) => {
  let resolvedTeam: Label | undefined = undefined;

  const abbr = team.label.replace("U-21", "").trim();
  const homeRes = await readItemsBase<Team[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM.ROOT,
    params: { abbr: abbr },
  });

  if (homeRes?.data && homeRes.data.length === 1) {
    const original = homeRes.data[0];
    resolvedTeam = {
      id: original._id,
      label: convert(ModelType.TEAM, original),
    };
  }

  return resolvedTeam;
};

type GetDraftDataParams = {
  readDraftDataParams: ReadDraftDataParams;
  postedDraftData: PostedDraftData;
  season: string;
};

export const getDraftData = async ({
  readDraftDataParams,
  postedDraftData,
  season,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.PLAYER_APPEARANCE][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData(readDraftDataParams);

  const updatedPostedDraftData = await readPostedDraftData({
    ...readDraftDataParams,
    postedDraftData,
    readPostedDraftDataKey: ["match"],
  });

  const { identifiers, api } = readDraftDataParams;

  const results = await Promise.all(
    identifiers.map(async (identifiers) => {
      const newDraftData = updatedDraftData[identifiers];

      if (!newDraftData.playerAppearance) return { value: [], label: [] };

      const { home: homePlayerAppearance, away: awayPlayerAppearance } =
        newDraftData.playerAppearance;

      const posted = updatedPostedDraftData[identifiers];

      if (!posted.match) return { value: [], label: [] };

      const {
        _id: matchId,
        competition,
        home_team,
        away_team,
        play_time,
        date,
      } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      let resolveHomeTeam: Label | undefined = undefined;
      let resolveAwayTeam: Label | undefined = undefined;
      if (competition.label === "U-21Jリーグ") {
        resolveHomeTeam = await resolveTeam(api, home_team);
        resolveAwayTeam = await resolveTeam(api, away_team);
      }

      const homeSeasons = await getSeasons(
        api,
        resolveHomeTeam?.id ?? home_team.id,
        date,
      );
      const awaySeasons = await getSeasons(
        api,
        resolveAwayTeam?.id ?? away_team.id,
        date,
      );

      const home_series = await getSeries(
        resolveHomeTeam?.id ?? home_team.id,
        api,
        matchId,
        date,
      );
      const away_series = await getSeries(
        resolveAwayTeam?.id ?? away_team.id,
        api,
        matchId,
        date,
      );

      const home = await resolve({
        api,
        data: homePlayerAppearance,
        match,
        season: [...new Set([season, ...homeSeasons])],
        series: home_series,
        matchTeam: home_team,
        resolveTeam: resolveHomeTeam,
        play_time,
      });

      const away = await resolve({
        api,
        data: awayPlayerAppearance,
        match,
        season: [...new Set([season, ...awaySeasons])],
        series: away_series,
        matchTeam: away_team,
        resolveTeam: resolveAwayTeam,
        play_time,
      });

      const homeResult = buildValueLabel(home, KEYS);
      const awayResult = buildValueLabel(away, KEYS);

      return {
        value: [...homeResult.value, ...awayResult.value],
        label: [...homeResult.label, ...awayResult.label],
      };
    }),
  );

  return {
    value: results.flatMap((r) => r.value),
    label: results.flatMap((r) => r.label),
  };
};
