import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const formation: FormStep<ModelType.FORMATION>[] = [
  {
    stepLabel: "フォーメーション名を入力",
    type: "form",
    fields: [
      {
        key: "name",
        label: "フォーメーション名",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
    ],
  },
  {
    stepLabel: "ポジションを選択",
    type: "form",
    fields: [
      {
        key: "position_formation",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
        multi: true,
        uniqueInArray: true,
        lengthInArray: 11,
      },
    ],
    validate: (data) => {
      if (!data.position_formation) {
        return {
          success: false,
          message: "positionを入力してください",
        };
      }

      const position_formation = data.position_formation?.filter(
        (p) => p !== ""
      ).length;

      if (position_formation !== 11)
        return {
          success: false,
          message: `positionは11個入力してください。現在${position_formation}個`,
        };

      const arr = data.position_formation;

      // --- 重複している値だけ抽出 ---
      const duplicates = arr.filter((v, i) => arr.indexOf(v) !== i);
      const uniqueDuplicates = [...new Set(duplicates)];

      if (uniqueDuplicates.length > 0)
        return {
          success: false,
          message: `positionは重複なく入力してください。重複しているのは ${uniqueDuplicates.join(
            ", "
          )}`,
        };

      return { success: true };
    },
  },
];
