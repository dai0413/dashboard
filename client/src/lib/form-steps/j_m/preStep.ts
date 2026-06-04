import { API_PATHS } from "@dai0413/myorg-shared";
import { Scraped as PositionData } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createItemBase } from "../../api";
import { DraftData, DraftDataValue } from "../../../types/form/draftData";
import { getPreMatchSelect } from "./preMatchSelectStep";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel);

export const preStep: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, VALUESデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ metaData, api }) => {
      const getDataUrl: string = metaData?.getDataUrl;
      const getPositionUrl: string = metaData?.getPositionUrl;

      if (!api || !getDataUrl) return {};

      const [res, positionRes] = await Promise.all([
        createItemBase<DraftData>({
          apiInstance: api,
          //   backendRoute: API_PATHS.GET_NEW_DATA.J_M.VALUES,
          backendRoute: "/get-new-data/j-m/values",
          data: { url: getDataUrl },
          returnResponse: true,
        }),
        getPositionUrl
          ? createItemBase<PositionData>({
              apiInstance: api,
              backendRoute: API_PATHS.GET_NEW_DATA.SN_M.POSITION,
              data: { url: getPositionUrl },
              returnResponse: true,
            })
          : Promise.resolve(null),
      ]);

      if (!res.success) return {};

      const baseData: DraftDataValue = res.data[getDataUrl];

      if (!baseData.playerAppearance) return {};

      // ポジションマージ処理
      if (positionRes?.success) {
        const positionData: PositionData = positionRes.data;
        const { home, away } = positionData;

        const mergePosition = (
          target: typeof baseData.playerAppearance.home,
          positions: typeof home,
        ) => {
          positions.forEach((positionData) => {
            const idx = target.findIndex(
              (scraped) => scraped.number === positionData.number,
            );

            if (idx >= 0) {
              target[idx].position = positionData.position;
            }
          });
        };

        mergePosition(baseData.playerAppearance.home, home);
        mergePosition(baseData.playerAppearance.away, away);
      }

      return { [getDataUrl]: baseData };
    },
  },
];
