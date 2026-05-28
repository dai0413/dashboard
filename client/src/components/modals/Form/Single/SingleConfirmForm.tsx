import { get } from "lodash";
import { FormTypeMap } from "../../../../types/models";
import { FormStep } from "../../../../types/form";
import { useForm } from "../../../../context/form-context";
import FieldList from "../../FieldList";
import { isEmptyObject } from "../../../../utils/data";
import { DetailFieldDefinition } from "../../../../types/field";
import { FieldListData } from "../../../../types/types";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { getDiffKeys } from "../../../../utils/comparison";
import { useAlert } from "../../../../context/alert-context";

const convertDisplayField = <T extends keyof FormTypeMap>(
  displayableField: DetailFieldDefinition[],
  formLabel: Record<string, any>,
  steps: FormStep<T>[],
  onEdit: (nextStepIndex: number) => void,
): FieldListData => {
  const data: FieldListData = {};
  displayableField.forEach((display) => {
    if (typeof display.key === "string") {
      let value = null;
      value = get(formLabel, display.key);

      let da: {
        value: string;
        onEdit: (() => void) | undefined;
      } = {
        value:
          typeof value === "undefined" ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
            ? "未入力"
            : (value as string),
        onEdit: undefined,
      };

      if (Array.isArray(value) && value.length === 0) da.value = "未入力";

      if (steps) {
        const fields = steps
          .flatMap((step) => step.fields || [])
          .filter(Boolean);
        const inputField = fields.find(
          (f) => typeof f === "object" && "key" in f && f.key === display.key,
        );

        const stepIndex = steps.findIndex((step) =>
          (step.fields || []).some(
            (f) =>
              f && typeof f === "object" && "key" in f && f.key === display.key,
          ),
        );

        da.onEdit = () => onEdit(stepIndex);

        if (!inputField) {
          da = {
            value: typeof value !== "undefined" ? String(value) : "入力対象外",
            onEdit: undefined,
          };
        } else {
          if (
            inputField.fieldType === "select" ||
            inputField.fieldType === "table"
          ) {
            const selected =
              inputField?.multi && Array.isArray(value)
                ? value.join(", ")
                : (value as string);

            da.value = selected || "未選択";
          }

          if (
            inputField.valueType === "date" ||
            inputField.valueType === "datetime-local"
          ) {
            let datevalue: string = "";
            if (inputField.valueType === "date") {
              datevalue = toDateKey(value as string | number | Date) || "";
            }
            if (inputField.valueType === "datetime-local") {
              datevalue =
                toDateKey(value as string | number | Date, true) || "";
            }
            if (datevalue === "NaN-NaN-NaN") {
              da.value = "未入力";
            } else da.value = datevalue;
          }
        }
      }

      data[display.key] = da;
    }
  });

  return data;
};

const SingleConfirmForm = <T extends keyof FormTypeMap>() => {
  const {
    formMode,
    inputMode,
    single: { state, originalData, stateLabel },
    steps: { formSteps, handleStep },
    displayableField,
  } = useForm<T>();

  const {
    modal: { alert },
  } = useAlert();

  const diffKeys = originalData ? getDiffKeys(originalData, state) : [];

  const isUpdated = !!alert.success && diffKeys.length > 0;
  const isChanged = !alert.success && diffKeys.length > 0;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      {isUpdated && (
        <span className="text-sm text-red-600 font-medium">
          ※ 赤文字の値に変更しました
        </span>
      )}

      {isChanged && (
        <span className="text-sm text-red-600 font-medium">
          ※ 赤文字の値に変更します
        </span>
      )}

      {!isEmptyObject(state) && (
        <FieldList
          isForm={true}
          fields={displayableField}
          data={convertDisplayField(
            displayableField,
            stateLabel,
            formSteps,
            handleStep,
          )}
          diffKeys={diffKeys}
          diffColor={formMode === "update"}
          isEmpty={inputMode === "single" ? true : false}
          isExclude={inputMode === "single" ? true : false}
        />
      )}
    </div>
  );
};

export default SingleConfirmForm;
