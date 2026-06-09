import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { From } from "../../../../../types/types";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getDraftData } from "../getDraftData";
import { getPreMatchSelect } from "../../../j_m/preMatchSelectStep";

type BaseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const baseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, true);

export const playerMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "J_M, PLAYER_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.getDataUrl;
      const match: string[] = metaData.match;

      if (!url || !match) return { value: [], label: [] };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          requests: [
            {
              draftDataKey: "playerMatchEventLog",
              from: From.J_M,
              params: { url },
            },
          ],
        },
        postedDraftData,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "J_M, PLAYER_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl: string = metaData.getDataUrl;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: [getDataUrl],
          requests: [
            {
              draftDataKey: "playerMatchEventLog",
              from: From.J_M,
              params: { url: getDataUrl },
            },
          ],
        },
        postedDraftData,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
