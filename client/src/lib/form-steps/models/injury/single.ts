import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { FormStep, FormUpdatePair } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { currentTransfer } from "../../utils/onChange/currentTransfer";

export const injury: FormStep<ModelType.INJURY>[] = [
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
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
    filterConditions: async (formData, api) => {
      if (!formData.player) return [];

      const { to_team } = await currentTransfer({ formData, api });

      if (to_team && to_team.key) {
        const filterCondition: FilterableFieldDefinition = {
          key: "_id",
          label: "チーム",
          operator: "equals",
          type: "select",
          value: [to_team.key],
          valueLabel: [to_team.label],
        };

        return [filterCondition];
      }

      return [];
    },
  },
  {
    stepLabel: "チームを選択",
    type: "form",
    fields: [
      {
        key: "team",
        label: "所属",
        fieldType: "table",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "日付を入力",
    type: "form",
    fields: [
      {
        key: "doa",
        label: "発表日",
        fieldType: "input",
        valueType: "date",
        required: true,
      },
      {
        key: "doi",
        label: "負傷日",
        fieldType: "input",
        valueType: "date",
      },
      { key: "dos", label: "手術日", fieldType: "input", valueType: "date" },
    ],
  },
  {
    stepLabel: "詳細",
    type: "form",
    fields: [
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
    ],
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: "form",
    fields: [
      {
        key: "URL",
        label: "URL",
        fieldType: "textarea",
        valueType: "text",
        multi: true,
      },
    ],
  },
];
