import {
  AddPostedDraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { convert } from "../../../../convert/DBtoGetted";
import { createConfirmationStep } from "../../../confirmationStep";
import { Match } from "../../../../../types/models/match";
import { convert as createLabel } from "../../../../convert/CreateLabel";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { bulkBase } from "../fields";
import { getDraftData } from "../getDraftData";

const afterMatchaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  if (!res.success) return {};

  const matchOriginal: Match[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    matchOriginal.map((match, i) => {
      const matchData = convert(ModelType.MATCH, match);
      const label = createLabel(ModelType.MATCH, match);

      const periods = match.match_format?.period;
      const card_id = card_ids[i];

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          matchLabel: label,
          match: { ...matchData },
          periods,
        },
      ];
    }),
  );

  return posted;
};

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "cardId");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterMatchaddPostedDraftData,
  },
];

export const match: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: getDraftData,
  },
  ...multiModel,
];
