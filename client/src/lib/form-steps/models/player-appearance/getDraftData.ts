import { AxiosInstance } from "axios";
import { Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerAppearance";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-appearance";
import { DraftData, PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { getSeasons } from "../../utils/getSeasons";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";

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
  team?: Label,
  play_time?: number,
) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team,
      time: calcTime(d, play_time),
      season,
    };
  });
  return data;
};

type Input = ResolveInput<{ player: Select.MODEL }>;

const resolve = async (
  api: AxiosInstance,
  data: Input[],
  match: Label,
  season: string[],
  team?: Label,
  play_time?: number,
) => {
  const input = buildResolveInput(data, match, season, team, play_time);
  return fetchResolved<"playerAppearance", Input, ResolveOutput>(
    api,
    "playerAppearance",
    input,
  );
};

type GetDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  cardIds: string[];
  season: string;
};

export const getDraftData = async ({
  api,
  draftData,
  postedDraftData,
  cardIds,
  season,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.PLAYER_APPEARANCE][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData({
    api,
    draftData,
    cardIds,
    readDraftDataKey: ["match", "playerAppearance"],
  });

  const updatedPostedDraftData = await readPostedDraftData({
    api,
    postedDraftData,
    cardIds,
    readPostedDraftDataKey: ["match"],
  });

  const results = await Promise.all(
    cardIds.map(async (cardId) => {
      const newDraftData = updatedDraftData[cardId];

      if (!newDraftData.playerAppearance) return { value: [], label: [] };

      const { home: homePlayerAppearance, away: awayPlayerAppearance } =
        newDraftData.playerAppearance;

      const posted = updatedPostedDraftData[cardId];

      if (!posted.match) return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
        play_time,
        date,
      } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      const homeSeasons = await getSeasons(api, home_team.id, date);
      const awaySeasons = await getSeasons(api, away_team.id, date);

      const home = await resolve(
        api,
        homePlayerAppearance,
        match,
        [...new Set([season, ...homeSeasons])],
        home_team,
        play_time,
      );

      const away = await resolve(
        api,
        awayPlayerAppearance,
        match,
        [...new Set([season, ...awaySeasons])],
        away_team,
        play_time,
      );

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
