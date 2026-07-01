import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { combineOnChanges } from "../../../utils/onChange/combine";
import { getFields } from "../fields";
import { setFromDate } from "../onChange/setFromDate";
import { setTeam } from "../onChange/setTeam";
import { teamCheck } from "../validate/teamCheck";

type BaseModel = ModelType.TRANSFER;
const baseModel = ModelType.TRANSFER;

export const single: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "移籍形態・選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["form", "player"]),
    onChange: combineOnChanges(setTeam, setFromDate),
  },
  {
    stepLabel: "移籍元を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["from_team", "from_team_name"]),
    skip: (formData) => {
      return formData.form === "更新";
    },
  },
  {
    stepLabel: "移籍先を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["to_team", "to_team_name"]),
    validate: (formData) => teamCheck(formData),
    skip: (formData) => {
      return (
        formData.form === "満了" ||
        formData.form === "引退" ||
        formData.form === "契約解除" ||
        formData.form === "離脱" ||
        formData.form === "退団"
      );
    },
  },
  {
    stepLabel: "日付を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["doa", "from_date", "to_date"]),
  },
  {
    stepLabel: "背番号・ポジションを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["number", "position"]),
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["URL", "isCancelled"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
