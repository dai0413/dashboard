import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FormTypeMap } from "../../types/models";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useForm } from "../../context/form-context";
import { useState } from "react";
import { RenderField } from "./Form/Field";
import { RenderManyField } from "./Form/ManyField";
import { Table } from "../table";
import { useQuery } from "../../context/query-context";
import { FieldList } from "../modals/index";
import { FieldListData } from "../../types/types";
import { toDateKey } from "../../utils";
import { DetailFieldDefinition } from "../../types/field";
import { FormStep } from "../../types/form";
import { get } from "lodash";

const convertDisplayField = <T extends keyof FormTypeMap>(
  displayableField: DetailFieldDefinition[],
  formLabel: Record<string, any>,
  steps: FormStep<T>[],
  onEdit: (nextStepIndex: number) => void
): FieldListData => {
  const data: FieldListData = {};
  displayableField.forEach((display) => {
    if (typeof display.key === "string") {
      get(formLabel, display.key);
      const value = get(formLabel, display.key)
        ? get(formLabel, display.key)
        : undefined;

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
        const inputField = steps
          .flatMap((step) => step.fields || [])
          .find((f) => f.key === display.key);

        const stepIndex = steps.findIndex((step) =>
          (step.fields || []).some((f) => f.key === display.key)
        );

        da.onEdit = () => onEdit(stepIndex);

        if (!inputField) {
          da = { value: "入力対象外", onEdit: undefined };
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
              datevalue = toDateKey(value as string | number | Date);
            }
            if (inputField.valueType === "datetime-local") {
              datevalue = toDateKey(value as string | number | Date, true);
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

const Form = <T extends keyof FormTypeMap>() => {
  const {
    mode,
    formOperator: { closeForm },
    isOpen,
    isEditing,
    newData,

    single,

    many,

    steps: { currentStep, nextStep, prevStep, nextData, sendData, handleStep },

    getDiffKeys,
    displayableField,
  } = useForm<T>();

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const { page, setPage } = useQuery();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  const steps = mode === "single" ? single.formSteps : many?.formSteps;
  const handleFormData = single.handleFormData;

  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);

  const confirmBulkDataHeaders =
    steps
      ?.filter((step) => step.many)
      .flatMap((s) =>
        (s.fields ?? [])
          .map((field) => ({
            label: field.label,
            field: field.key as string,
            width: field.width,
            fieldType: field.fieldType,
            valueType: field.valueType,
          }))
          .filter((h) => (many?.formData ?? []).some((d) => h.field in d))
      ) ?? [];

  const confirmBulkData = (many?.formLabels ?? [])
    .map((d) => {
      const row: Record<string, string | number | undefined> = {};

      confirmBulkDataHeaders.forEach((h) => {
        const key = h.field;
        const value = d[key as keyof typeof d];

        let displayValue: string | number | undefined;

        if (h.fieldType === "select" || h.fieldType === "table") {
          displayValue = value;
        } else if (h.valueType === "boolean") {
          displayValue = value ? "◯" : "";
        } else {
          displayValue = value as string | number;
        }

        if (value === null || value === undefined) {
          displayValue = undefined;
        }

        row[key] = displayValue;
      });

      return row;
    })
    .filter((row) => Object.keys(row).length > 0);

  const data: FieldListData = {};
  displayableField.forEach((display) => {
    if (typeof display.key === "string") {
      const value =
        display.key in single.formLabel
          ? single.formLabel[display.key]
          : undefined;

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
        const inputField = steps
          .flatMap((step) => step.fields || [])
          .find((f) => f.key === display.key);

        const stepIndex = steps.findIndex((step) =>
          (step.fields || []).some((f) => f.key === display.key)
        );

        da.onEdit = () => handleStep(stepIndex);

        if (!inputField) {
          da = { value: "入力対象外", onEdit: undefined };
        } else {
          if (
            inputField.fieldType === "select" ||
            inputField.fieldType === "table"
          ) {
            da.value = Array.isArray(value)
              ? value.join(", ")
              : value || "未選択";
          }

          if (inputField.valueType === "date")
            da.value = toDateKey(value as string | number | Date);
          if (inputField.valueType === "datetime-local")
            da.value = toDateKey(value as string | number | Date, true);

          if (value && Array.isArray(value))
            da.value = value.filter((u) => u.trim() !== "").join(", ");
        }
      }

      data[display.key] = da;
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeForm}
      header={
        <>
          {steps && steps.length !== 0 ? (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-1">
                {newData ? "新規データ作成" : "既存データ編集"}
              </h3>

              <div>
                <div className="mb-1 text-sm text-gray-500">
                  ステップ {currentStep + 1} / {steps.length}：
                  {steps[currentStep].stepLabel}
                </div>

                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full ${
                        index <= currentStep ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <Alert
            success={alert?.success || false}
            message={alert?.message}
            resetAlert={resetAlert}
          />
        </>
      }
      footer={
        <div>
          {isTableOpen ? (
            <LinkButtonGroup
              deny={{
                text: "戻る",
                color: "red",
                onClick: () => setIsTableOpen(false),
              }}
            />
          ) : steps && currentStep === steps.length - 1 && !isEditing ? (
            <LinkButtonGroup
              approve={{
                text: "次のデータへ",
                color: "green",
                onClick: nextData,
              }}
              deny={{
                text: "入力終了",
                color: "red",
                onClick: closeForm,
              }}
            />
          ) : (
            <LinkButtonGroup
              approve={{
                text:
                  steps && currentStep === steps.length - 1
                    ? newData
                      ? "追加"
                      : "変更"
                    : "次へ",
                color: "green",
                onClick:
                  steps && currentStep === steps.length - 1
                    ? () => {
                        sendData();
                        setPage("formPage", 1);
                      }
                    : nextStep,
              }}
              deny={{
                text: "戻る",
                color: "red",
                onClick: prevStep,
                disabled: currentStep === 0,
              }}
            />
          )}
        </div>
      }
    >
      {!steps || steps.length === 0 ? null : (
        <>
          {steps[currentStep].type === "confirm" ? (
            <div className="space-y-2 text-sm text-gray-700">
              {!newData && alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更しました
                </span>
              )}

              {!newData && !alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更します
                </span>
              )}

              {typeof single.formData === "object" && (
                <FieldList
                  isForm={true}
                  fields={displayableField}
                  data={convertDisplayField(
                    displayableField,
                    single.formLabel,
                    steps,
                    handleStep
                  )}
                  diffKeys={diffKeys}
                  diffColor={!newData}
                  isEmpty={mode === "single" ? true : false}
                  isExclude={mode === "single" ? true : false}
                />
              )}

              {confirmBulkData.length > 0 && (
                <>
                  <div className="bg-gray-200 w-full p-1">
                    <span className="font-bold">多数データ入力値</span>
                  </div>

                  {many?.renderConfirmMes(confirmBulkData)}

                  <Table
                    pageNation="client"
                    data={confirmBulkData || []}
                    headers={confirmBulkDataHeaders || []}
                    currentPage={page.formPage}
                    onPageChange={(p: number) => setPage("formPage", p)}
                    itemsPerPage={10}
                  />
                </>
              )}
            </div>
          ) : steps[currentStep].fields && steps[currentStep].many && many ? (
            <RenderManyField
              fields={steps[currentStep].fields}
              isTableOpen={isTableOpen}
              toggleTableOpen={() => setIsTableOpen((prev) => !prev)}
            />
          ) : (
            steps[currentStep].fields &&
            steps[currentStep].fields.map((field) => (
              <div key={field.key as string} className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  {field.label}
                </label>
                <RenderField
                  key={field.key as string}
                  field={field}
                  formData={single.formData}
                  formLabel={single.formLabel}
                  handleFormData={handleFormData}
                />
              </div>
            ))
          )}
        </>
      )}
    </Modal>
  );
};

export default Form;
