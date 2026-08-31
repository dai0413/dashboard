import { API_PATHS } from "@dai0413/myorg-shared";
import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { createConfirmationStep } from "../../../confirmationStep";
import { bulkBase, getFields } from "../fields";
import { Match } from "../../../../../types/models/match";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { key } from "@dai0413/myorg-shared/generateField";
import { AxiosInstance } from "axios";
import { convert } from "../../../../convert/CreateLabel";
import { getFormation } from "../utils/getFormation";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
const baseModel = ModelType.TEAM_MATCH_FORMATION;

const getPlayerAppearance = async (
  api: AxiosInstance,
  match: string,
  team: string,
): Promise<string[]> => {
  const obj = await readItemsBase<PlayerAppearance[]>({
    apiInstance: api,
    params: { getAll: true, match, team, play_status: "start" },
    backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
  });

  if (!obj || !obj.data) return [];

  const playerAppearances: PlayerAppearance[] = obj.data;

  const positions = playerAppearances
    .map((d) => d.position)
    .filter((d) => typeof d === "string");

  return positions;
};

type Applied = {
  formData: TeamMatchFormationForm;
  formLabel: Record<string, any>;
};

const applyPosition = async (
  api: AxiosInstance,
  matchId: string,
  matchLabel: string,
): Promise<Applied[]> => {
  const matchCache = new Map<string, Match>();
  let match = matchCache.get(matchId);
  if (!match) {
    const fetchedMatch = await readItemBase<Match>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.DETAIL(matchId),
    });

    if (!fetchedMatch) return [];

    match = fetchedMatch;
    matchCache.set(matchId, match);
  }

  const homePositions = await getPlayerAppearance(
    api,
    match._id,
    match.home_team._id,
  );
  const awayPositions = await getPlayerAppearance(
    api,
    match._id,
    match.away_team._id,
  );

  const homeFormation = await getFormation(api, key(homePositions));
  const awayFormation = await getFormation(api, key(awayPositions));

  const result: Applied[] = [];

  if (homeFormation) {
    result.push({
      formData: {
        match: match._id,
        formation: homeFormation.id,
        team: match.home_team._id,
      },
      formLabel: {
        match: matchLabel,
        formation: homeFormation.label,
        team: convert(ModelType.TEAM, match.home_team),
      },
    });
  }

  if (awayFormation) {
    result.push({
      formData: {
        match: match._id,
        formation: awayFormation.id,
        team: match.away_team._id,
      },
      formLabel: {
        match: matchLabel,
        formation: awayFormation.label,
        team: convert(ModelType.TEAM, match.away_team),
      },
    });
  }

  return result;
};

export const bulk: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match"]),
  },
  {
    ...bulkBase,
    many: true,
    actions: [
      {
        label: "Player-Appearanceから計算",
        onClick: async ({ formDatas, formLabels, api }) => {
          if (!api) return { formDatas, formLabels };

          const matchIds: string[] = formDatas
            .map((d) => d.match)
            .filter((d) => typeof d === "string");
          const matchLabels: string[] = formLabels
            .map((d) => d.match)
            .filter((d) => typeof d === "string");

          const applied = await Promise.all(
            matchIds.map((matchId, i) =>
              applyPosition(api, matchId, matchLabels[i]),
            ),
          );

          const flattened = applied.flat();

          const returnFormDatas = flattened.map((d) => d.formData);
          const returnFormLabels = flattened.map((d) => d.formLabel);

          return {
            formDatas: returnFormDatas,
            formLabels: returnFormLabels,
          };
        },
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
