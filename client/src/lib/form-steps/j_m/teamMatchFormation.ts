import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { readItemsBase } from "../../api";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Formation } from "../../../types/models/formation";
import { key } from "@dai0413/myorg-shared/generateField";
import { DraftData } from "../../../types/form/draftData";

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
        .filter((d) => typeof d === "string");
      const awayPositions: string[] = away
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

      const homeFormation = await getFormation(key(homePositions));
      const awayFormation = await getFormation(key(awayPositions));

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
    getDraftData: async ({ draftData, postedDraftData, metaData }) => {
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
