import { key } from "@dai0413/myorg-shared/generateField";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { readItemsBase } from "../../../../api";
import { Formation } from "../../../../../types/models/formation";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { getFields } from "../fields";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
const baseModel = ModelType.TEAM_MATCH_FORMATION;

export const single: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
    onChange: async (data, api) => {
      const { match, team } = data;
      if (!match || !team || !api) return [];

      const getPlayerAppearance = async (
        team: string,
      ): Promise<PlayerAppearance[] | null> => {
        const resBody = await readItemsBase({
          apiInstance: api,
          params: { team, match, getAll: true, play_status: "start" },
          backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
          returnResponse: true,
        });

        if (!resBody || !resBody.data) return null;

        const playerAppearance: PlayerAppearance[] = resBody.data;

        return playerAppearance;
      };

      const playerAppearance = await getPlayerAppearance(team);

      if (!playerAppearance) return [];

      const positions: string[] = playerAppearance
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string");

      const getFormation = async (
        key: string,
      ): Promise<{
        id: string;
        label: string;
      } | null> => {
        const resBody = await readItemsBase({
          apiInstance: api,
          params: { key },
          backendRoute: API_PATHS.FORMATION.ROOT,
          returnResponse: true,
        });

        if (!resBody || !resBody.data) return null;

        const formations: Formation[] = resBody.data;

        if (formations.length !== 1) return null;

        return { id: formations[0]._id, label: formations[0].name };
      };

      const formation = await getFormation(key(positions));

      if (!formation?.id) return [];

      return [
        {
          key: "formation",
          value: { key: formation.id, label: formation.label },
        },
      ];
    },
  },
  {
    stepLabel: "フォーメーションを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["formation"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
