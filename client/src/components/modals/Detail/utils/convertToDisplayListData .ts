import { Label } from "@dai0413/myorg-shared";
import { getOnDetailFields } from "../../../../lib/model-fields";
import { DisplayListItem } from "../../../../types/detail";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { ColumnType, RenderCellValue } from "../../../../types/table";
import { LinkField } from "../../../../types/types";
import { toDisplayValue } from "../../../../utils/displayField/toDisplayValue";
import { FormStep } from "../../../../types/form";
import { UIFieldDefinition } from "../../../../types/field";

const createLabel = (
  dataValue: Label[] | Label,
): RenderCellValue | RenderCellValue[] => {
  if (Array.isArray(dataValue)) {
    return dataValue;
  } else {
    return dataValue;
  }
};

const convert = (
  renderCellValue: RenderCellValue | RenderCellValue[],
  hasInputField?: boolean,
): RenderCellValue | RenderCellValue[] => {
  if (Array.isArray(renderCellValue)) {
    return renderCellValue.map((v) => convertToFormValue(v, hasInputField));
  } else {
    return convertToFormValue(renderCellValue, hasInputField);
  }
};

const convertToFormValue = (
  renderCellValue: RenderCellValue,
  hasInputField?: boolean,
): RenderCellValue => {
  if (!hasInputField) {
    return { ...renderCellValue, label: "入力対象外" };
  }
  return renderCellValue;
};

const groupOrder = ["入力値", "未入力", "入力対象外"];

type ConvertToDisplayListDataOptions<T extends ModelType> = {
  data: GettedModelDataMap[T];
} & (
  | {
      model: {
        linkField?: LinkField[];
        modelType: T;
      };
      form?: never;
    }
  | {
      model?: never;
      form: {
        displayableField: UIFieldDefinition<GettedModelDataMap[T]>[];
        steps: FormStep<T>[];
        onEdit: (nextStepIndex: number) => void;
        diffKeys: string[];
      };
    }
);

export const convertToDisplayListData = <T extends ModelType>({
  data,
  model,
  form,
}: ConvertToDisplayListDataOptions<T>): DisplayListItem[] => {
  if (!data) return [];

  const displayableField = !!model
    ? getOnDetailFields(model.modelType)
    : form?.displayableField;

  if (!displayableField) return [];

  const inputFields = form
    ? form.steps.flatMap((step) => step.fields || []).filter(Boolean)
    : [];

  const diffKeys = form ? form.diffKeys : [];

  const result: DisplayListItem[] = displayableField
    .map((field) => {
      if (form && field.getValueType === ColumnType.CUSTOM) {
        return undefined;
      }

      let { renderCellValue } = toDisplayValue(
        field,
        data,
        model?.linkField || [],
        !!form,
      );

      // match-format対応
      if (
        model?.modelType === ModelType.MATCH_FORMAT &&
        field.key === "period"
      ) {
        const customFields = displayableField.filter(
          (f) => f.getValueType === ColumnType.CUSTOM,
        );

        customFields.forEach((field) => {
          renderCellValue = createLabel(field.getData(data));
        });
      }

      // registration-history対応
      if (
        (model?.modelType === ModelType.PLAYER_REGISTRATION_HISTORY ||
          model?.modelType === ModelType.STAFF_REGISTRATION_HISTORY) &&
        field.key === "changes"
      ) {
        const customFields = displayableField.filter(
          (f) => f.getValueType === ColumnType.CUSTOM,
        );

        customFields.forEach((field) => {
          renderCellValue = createLabel(field.getData(data));
        });
      }

      let group: string | undefined;
      let value = renderCellValue;
      let stepIndex: number | undefined;
      let hasInputField = false;

      if (form) {
        const inputField = inputFields.find((f) => f.key === field.key);

        hasInputField = !!inputField;

        stepIndex = form.steps.findIndex((step) =>
          (step.fields || []).some(
            (f) =>
              f && typeof f === "object" && "key" in f && f.key === field.key,
          ),
        );

        value = convert(renderCellValue, hasInputField);

        if (Array.isArray(value)) {
          group = value.some((v) => v.label) ? "入力値" : "未入力";
        } else if (value.label) {
          group = value.label === "未入力" ? "未入力" : "入力値";
        } else {
          group = "その他（フィルタリング用など）";
        }

        if (!hasInputField) {
          group = "入力対象外";
        }
      }

      const displayListItem: DisplayListItem = {
        id: field.key,
        field: field.label ?? field.key,
        ...(form && {
          group,
          displayGroup: true,
          onEdit: hasInputField ? () => form.onEdit(stepIndex!) : undefined,
        }),
        value,
        displayField: true,
        isLink: field.key === "URL" || field.key === "urls",
        isRed: diffKeys.includes(field.key),
      };

      return displayListItem;
    })
    .filter((v): v is DisplayListItem => v !== undefined);

  if (!form) {
    return result;
  }

  return result
    .sort((a, b) => {
      const aIndex = a.group ? groupOrder.indexOf(a.group) : -1;
      const bIndex = b.group ? groupOrder.indexOf(b.group) : -1;

      return (
        (aIndex === -1 ? groupOrder.length : aIndex) -
        (bIndex === -1 ? groupOrder.length : bIndex)
      );
    })
    .map((item, index, array) => ({
      ...item,
      displayGroup: index === 0 || item.group !== array[index - 1].group,
    }));
};
