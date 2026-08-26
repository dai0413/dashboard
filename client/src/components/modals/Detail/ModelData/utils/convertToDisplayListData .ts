import { Label } from "@dai0413/myorg-shared";
import { getOnDetailFields } from "../../../../../lib/model-fields";
import { DisplayListItem } from "../../../../../types/detail";
import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import { ColumnType, RenderCellValue } from "../../../../../types/table";
import { LinkField } from "../../../../../types/types";
import { toDisplayValue } from "../../../../../utils/displayField/toDisplayValue";

const createLabel = (
  dataValue: Label[] | Label,
): RenderCellValue | RenderCellValue[] => {
  if (Array.isArray(dataValue)) {
    return dataValue;
  } else {
    return dataValue;
  }
};

export const convertToDisplayListData = <T extends ModelType>(
  modelType: ModelType,
  data: GettedModelDataMap[T],
  linkField: LinkField[],
): DisplayListItem[] => {
  const displayableField = modelType ? getOnDetailFields(modelType) : [];

  const result: DisplayListItem[] = displayableField
    .map((field) => {
      if (!data || data === null) return undefined;
      let { renderCellValue } = toDisplayValue(field, data, linkField);

      // match-format対応
      if (modelType === ModelType.MATCH_FORMAT && field.key === "period") {
        const fields = displayableField.filter(
          (fie) => fie.getValueType === ColumnType.CUSTOM,
        );

        fields.forEach((field) => {
          const dataValue = field.getData(data);

          renderCellValue = createLabel(dataValue);
        });
      }

      // registration-history対応
      if (
        (modelType === ModelType.PLAYER_REGISTRATION_HISTORY ||
          modelType === ModelType.STAFF_REGISTRATION_HISTORY) &&
        field.key === "changes"
      ) {
        const fields = displayableField.filter(
          (fie) => fie.getValueType === ColumnType.CUSTOM,
        );

        fields.forEach((field) => {
          const dataValue = field.getData(data);

          renderCellValue = createLabel(dataValue);
        });
      }

      const displayListItem: DisplayListItem = {
        id: field.key,
        field: field.label ?? field.key,
        value: renderCellValue,
        displayField: true,
        isLink: field.key === "URL",
      };

      return displayListItem;
    })
    .filter((v) => typeof v !== "undefined");

  return result;
};
