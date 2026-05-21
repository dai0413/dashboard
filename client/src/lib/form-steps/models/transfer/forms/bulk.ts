import { FormStep, DataSource, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";
import { getFields } from "../fields";
import { setTeam } from "../onChange/setTeam";
import { teamCheck } from "../validate/teamCheck";

type BaseModel = ModelType.TRANSFER;
const baseModel = ModelType.TRANSFER;

export const bulk: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["doa", "from_date", "form", "URL"]),
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "player",
      "from_team",
      "from_team_name",
      "to_team",
      "to_team_name",
      "doa",
      "from_date",
      "to_date",
      "form",
      "number",
      "position",
      "URL",
    ]),
    many: true,
    validate: (formData) => teamCheck(formData),
    onChange: toManyOnChange(setTeam),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
