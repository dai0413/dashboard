import { API_PATHS, position } from "@dai0413/myorg-shared";
import { DraftData, FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { readItemsBase } from "../../api";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Formation } from "../../../types/models/formation";

const positions = position();
const positionIndexMap: Record<string, number> = Object.fromEntries(
  positions.map((pos, index) => [pos, index]),
);

export const teamMatchFormation: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力開始",
    type: StepType.FORM,
    fields: [],
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    addDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!metaData || !postedDraftData || !draftData || !api) return {};
      const getDataUrl = metaData.getDataUrl;
      if (!getDataUrl) return { ...draftData };

      const { home, away } = draftData[getDataUrl].playerAppearance;

      const homePositions: string[] = home
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string")
        .sort((a, b) => {
          return (positionIndexMap[a] ?? 999) - (positionIndexMap[b] ?? 999);
        });
      const awayPositions: string[] = away
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string")
        .sort((a, b) => {
          return (positionIndexMap[a] ?? 999) - (positionIndexMap[b] ?? 999);
        });

      const getFormation = async (
        position_formation: string[],
      ): Promise<{
        id: string;
        label: string;
      } | null> => {
        const resBody = await readItemsBase({
          apiInstance: api,
          params: { position_formation },
          backendRoute: API_PATHS.FORMATION.ROOT,
          returnResponse: true,
        });

        if (!resBody || !resBody.data) return null;

        const formations: Formation[] = resBody.data;

        return { id: formations[0]._id, label: formations[0].name };
      };

      const homeFormation = await getFormation(homePositions);
      const awayFormation = await getFormation(awayPositions);

      const newTeamMatchFormation = {
        home: {
          formation: { ...homeFormation },
        },
        away: {
          formation: { ...awayFormation },
        },
      };

      const newDraftData: DraftData = {
        ...draftData,
        [getDataUrl]: {
          ...draftData[getDataUrl],
          teamMatchFormation: newTeamMatchFormation,
        },
      };

      return newDraftData;
    },
    getDraftData: ({ draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      if (!getDataUrl) return { value: [], label: [] };
      if (!draftData[getDataUrl].teamMatchFormation)
        return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[getDataUrl].match;
      const { matchLabel } = postedDraftData[getDataUrl];
      const { home, away } = draftData[getDataUrl].teamMatchFormation;

      const value = [
        {
          match: matchId,
          team: home_team.id,
          formation: home.formation?.id,
        },
        {
          match: matchId,
          team: away_team.id,
          formation: away.formation?.id,
        },
      ];

      const label = [
        {
          match: matchLabel,
          team: home_team.label,
          formation: home.formation?.label,
        },
        {
          match: matchLabel,
          team: away_team.label,
          formation: away.formation?.label,
        },
      ];

      return { value, label };
    },
  },
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力",
    type: StepType.FORM,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "formation",
        label: "フォーメーション",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    many: true,
  },
];
