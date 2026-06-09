import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../api";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Formation } from "../../../../../types/models/formation";
import { key } from "@dai0413/myorg-shared/generateField";
import { bulkBase } from "../fields";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { createConfirmationStep } from "../../../confirmationStep";
import { AxiosInstance } from "axios";

const getFormation = async (
  api: AxiosInstance,
  key: string,
): Promise<{
  id: string;
  label: string;
} | null> => {
  const obj = await readItemsBase<Formation[]>({
    apiInstance: api,
    params: { key },
    backendRoute: API_PATHS.FORMATION.ROOT,
  });

  if (!obj || !obj.data) return null;

  const formations: Formation[] = obj.data;

  if (formations.length !== 1) return null;

  return { id: formations[0]._id, label: formations[0].name };
};

export const multiModel: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力開始",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!metaData || !postedDraftData || !draftData || !api)
        return { value: [], label: [] };
      const getDataUrl = metaData.getDataUrl;
      if (
        !getDataUrl ||
        !draftData[getDataUrl].playerAppearance ||
        !postedDraftData[getDataUrl].match
      )
        return { value: [], label: [] };

      const { home, away } = draftData[getDataUrl].playerAppearance;

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[getDataUrl].match;
      const { matchLabel } = postedDraftData[getDataUrl];

      const homePositions: string[] = home
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string");
      const awayPositions: string[] = away
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string");

      const homeFormation = await getFormation(api, key(homePositions));
      const awayFormation = await getFormation(api, key(awayPositions));

      let value: TeamMatchFormationForm[] = [];
      let label: Record<string, any>[] = [];

      if (homeFormation?.id) {
        value.push({
          match: matchId,
          team: home_team.id,
          formation: homeFormation?.id,
        });
        label.push({
          match: matchLabel,
          team: home_team.label,
          formation: homeFormation?.label,
        });
      }

      if (awayFormation?.id) {
        value.push({
          match: matchId,
          team: away_team.id,
          formation: awayFormation?.id,
        });
        label.push({
          match: matchLabel,
          team: away_team.label,
          formation: awayFormation?.label,
        });
      }

      return { value, label };
    },
  },
  bulkBase,
  createConfirmationStep<ModelType.TEAM_MATCH_FORMATION>(
    ModelType.TEAM_MATCH_FORMATION,
  ),
];
