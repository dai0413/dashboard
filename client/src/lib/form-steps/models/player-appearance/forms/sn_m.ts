import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { From } from "../../../../../types/types";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getDraftData } from "../getDraftData";
import { getPreMatchSelect } from "../../../sn_m/preMatchSelectStep";
import { addPostedDraftData } from "../addPostedDraftData";
import { ReadDraftDataParams } from "../../../utils/getDraftData/types";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, true);

export const playerAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "SN_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.getDataUrl;
      const match: string[] = metaData.match;

      if (!url || !match) return { value: [], label: [] };

      const requests: ReadDraftDataParams["requests"] = [
        {
          draftDataKey: "playerAppearance",
          from: From.SN_M,
          params: { url },
        },
      ];

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          requests: requests,
        },
        postedDraftData,
        season: metaData.season,
      });
    },
  },
  ...bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "SN_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl: string = metaData.getDataUrl;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: [getDataUrl],
          requests: [
            {
              draftDataKey: "playerAppearance",
              from: From.SN_M,
              params: { url: getDataUrl },
            },
          ],
        },
        postedDraftData,
        season: metaData.season,
      });
    },
  },
  ...bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: ({ metaData, res, postedDraftData }) =>
      addPostedDraftData({
        postedDraftData,
        res,
        identifiers: [metaData.getDataUrl],
      }),
  },
];
