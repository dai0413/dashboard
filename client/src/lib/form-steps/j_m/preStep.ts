import { FormStep, StepType } from "../../../types/form";
import { From } from "../../../types/types";
import { ModelType } from "../../../types/models";
import { getPreMatchSelect } from "./preMatchSelectStep";
import { readDraftData } from "../utils/getDraftData/readDraftData";
import { ReadDraftDataParams } from "../utils/getDraftData/types";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel);

export const preStep: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "J_M, VALUESデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ metaData, api }) => {
      const getDataUrl: string = metaData?.getDataUrl;
      const getPositionUrl: string = metaData?.getPositionUrl;

      if (!getDataUrl) return {};

      const baseRequest: ReadDraftDataParams["requests"] = [
        {
          draftDataKey: "values",
          from: From.J_M,
          params: { url: getDataUrl },
        },
      ];

      const requests: ReadDraftDataParams["requests"] = getPositionUrl
        ? [
            ...baseRequest,
            {
              draftDataKey: "positions",
              from: From.SN_M,
              params: { url: getPositionUrl },
            },
          ]
        : baseRequest;

      const updatedDraftData = await readDraftData({
        api,
        draftData: {},
        identifiers: [getDataUrl],
        requests: requests,
      });

      return updatedDraftData;
    },
  },
];
