import { AxiosInstance } from "axios";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerAppearance";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-appearance";
import {
  AddPostedDraftData,
  FormStep,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import {
  PlayerAppearance,
  PlayerAppearanceForm,
} from "../../../../../types/models/player-appearance";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { createItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { getSeasons } from "../../../utils/getDraftData/getSeasons";
import { getFields } from "../fields";
import { validatePlayerEitherOne } from "../validations/name";
import { createConfirmationStep } from "../../../confirmationStep";
import { convert } from "../../../../convert/DBtoGetted";

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

const KEYS = ["match", "player", "team"] as const;

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

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{ player: Select.MODEL }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase<{ playerAppearance: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { playerAppearance: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.playerAppearance;
};

const resolve = async (
  api: AxiosInstance,
  data: Scraped[],
  match: Label,
  season: string[],
  team?: Label,
  play_time?: number,
) => {
  const input = buildResolveInput(data, match, season, team, play_time);
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

const afterPlayerAppearanceaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  let result = postedDraftData;
  const getDataUrl = metaData.getDataUrl;

  const { home_team, away_team } = postedDraftData[getDataUrl].match;

  if (!res.success) return {};

  const playerAppearance: PlayerAppearance[] = res.data;

  const home = convert(
    ModelType.PLAYER_APPEARANCE,
    playerAppearance.filter((d) => d.team._id === home_team.id),
  );
  const away = convert(
    ModelType.PLAYER_APPEARANCE,
    playerAppearance.filter((d) => d.team._id === away_team.id),
  );

  result = {
    [getDataUrl]: {
      ...result[getDataUrl],
      playerAppearance: { home, away },
    },
  };

  return result;
};

export const playerAppearance: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    modelType: ModelType.PLAYER_APPEARANCE,
    stepLabel: "選手の出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      const season = metaData.season;
      if (!getDataUrl || !api || !draftData[getDataUrl].playerAppearance)
        return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
        play_time,
        date,
      } = postedDraftData[getDataUrl].match;

      const match = {
        id: matchId,
        label: postedDraftData[getDataUrl].matchLabel || "",
      };

      const homeSeasons = await getSeasons(api, home_team.id, date);
      const awaySeasons = await getSeasons(api, away_team.id, date);

      const home = await resolve(
        api,
        draftData[getDataUrl].playerAppearance.home,
        match,
        [...new Set([season, ...homeSeasons])],
        home_team,
        play_time,
      );
      const away = await resolve(
        api,
        draftData[getDataUrl].playerAppearance.away,
        match,
        [...new Set([season, ...awaySeasons])],
        away_team,
        play_time,
      );

      const homeResult = buildValueLabel(home);
      const awayResult = buildValueLabel(away);

      const value: PlayerAppearanceForm[] = [
        ...homeResult.value,
        ...awayResult.value,
      ];
      const label: Record<string, any>[] = [
        ...homeResult.label,
        ...awayResult.label,
      ];

      return { value, label };
    },
    many: true,
  },
  {
    modelType: ModelType.PLAYER_APPEARANCE,
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
    type: StepType.FORM,
    fields: getFields([
      "match",
      "team",
      "player",
      "player_name",
      "number",
      "play_status",
      "position",
      "time",
    ]),
    validate: validatePlayerEitherOne,
    many: true,
  },
  {
    ...createConfirmationStep<ModelType.PLAYER_APPEARANCE>(
      ModelType.PLAYER_APPEARANCE,
    ),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
  },
];
