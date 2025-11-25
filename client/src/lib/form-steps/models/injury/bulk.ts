import { FormStep, FormUpdatePair } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { currentTransfer } from "../../utils/onChange/currentTransfer";

export const injury: FormStep<ModelType.INJURY>[] = [
  {
    stepLabel: "共通要素を入力",
    type: "form",
    fields: [
      {
        key: "doa",
        label: "発表日",
        fieldType: "input",
        valueType: "date",
        overwriteByMany: true,
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "doa",
        label: "発表日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "doi",
        label: "負傷日",
        fieldType: "input",
        valueType: "date",
      },
      { key: "dos", label: "手術日", fieldType: "input", valueType: "date" },
      {
        key: "injured_part",
        label: "負傷箇所・診断結果",
        fieldType: "input",
        valueType: "text",
        multi: true,
      },
      {
        key: "ttp",
        label: "全治期間",
        fieldType: "input",
        valueType: "text",
        multi: true,
      },
      {
        key: "URL",
        label: "URL",
        fieldType: "textarea",
        valueType: "text",
        multi: true,
      },
    ],
    many: true,
    onChange: async (formData, api) => {
      const { to_team, to_team_name } = await currentTransfer({
        formData,
        api,
      });

      let obj: FormUpdatePair = [];
      if (to_team_name) {
        obj.push({
          key: "team_name",
          value: to_team_name,
        });
      } else if (to_team) {
        obj.push({
          key: "team",
          value: to_team,
        });
      }

      return obj;
    },
  },
];
