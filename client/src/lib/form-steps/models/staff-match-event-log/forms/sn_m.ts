import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../sn_m/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { FormMode, From } from "../../../../../types/types";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, true);

export const staffMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "SN_M, STAFF_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.matchUrl;
      const match: string[] = metaData.match;

      if (!url || !match) return { value: [], label: [] };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          requests: [
            {
              draftDataKey: "staffMatchEventLog",
              from: From.SN_M,
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
    stepLabel: "SN_M, STAFF_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    nextFormMode: FormMode.CREATE,
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
              draftDataKey: "staffMatchEventLog",
              from: From.SN_M,
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
