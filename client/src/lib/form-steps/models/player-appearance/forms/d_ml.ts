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
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { createItemBase } from "../../../../api";
import { buildValueLabel } from "../../../utils/resolver/resolveToValue";
import { getSeasons } from "../../../utils/getSeasons";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { convert } from "../../../../convert/DBtoGetted";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { readDraftData } from "../../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../../utils/getDraftData/readPostedDraftData";

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

const afterPlayerAppearanceaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  if (!res.success) return {};

  const playerAppearance: PlayerAppearance[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    card_ids.map((card_id) => {
      if (!postedDraftData[card_id].match) return [];

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[card_id].match;

      const home = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === home_team.id,
        ),
      );
      const away = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === away_team.id,
        ),
      );

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          playerAppearance: { home, away },
        },
      ];
    }),
  );

  return posted;
};

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const playerAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const season = metaData.season;
      if (!api) return { value: [], label: [] };

      const ids: string[] = metaData?.match;

      const updatedDraftData = await readDraftData({
        api,
        draftData,
        matchIds: ids,
        keys: ["match", "playerAppearance"],
      });

      const updatedPostedDraftData = await readPostedDraftData({
        api,
        postedDraftData,
        matchIds: ids,
        keys: ["match"],
      });

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData = updatedDraftData[id];

          if (!newDraftData.playerAppearance) return { value: [], label: [] };

          const { home: homePlayerAppearance, away: awayPlayerAppearance } =
            newDraftData.playerAppearance;

          const posted = updatedPostedDraftData[id];

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
    },
  },
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
  },
];

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterPlayerAppearanceaddPostedDraftData,
  },
];
