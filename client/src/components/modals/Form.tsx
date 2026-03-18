import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FormTypeMap } from "../../types/models";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useForm } from "../../context/form-context";
import { useMemo, useState } from "react";
import { RenderField } from "./Form/Field";
import RenderManyField from "./Form/ManyField";
import { ListView } from "../table/";
import { useQuery } from "../../context/query-context";
import { FieldList } from "../modals/index";
import { FieldListData } from "../../types/types";
import { DetailFieldDefinition } from "../../types/field";
import { DataSource, FormStep } from "../../types/form";
import { get } from "lodash";
import { useModal } from "../../context/modal-context";
import { FilterProvider } from "../../context/filter-context";
import { SortProvider } from "../../context/sort-context";
import { ListViewProvider } from "../../context/listView-context";
import { isEmptyObject } from "../../utils";

const convertDisplayField = <T extends keyof FormTypeMap>(
  displayableField: DetailFieldDefinition[],
  formLabel: Record<string, any>,
  steps: FormStep<T>[],
  onEdit: (nextStepIndex: number) => void,
): FieldListData => {
  const data: FieldListData = {};
  displayableField.forEach((display) => {
    if (typeof display.key === "string") {
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
          (step.fields || []).some((f) => f.key === display.key),
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

const Form = <T extends keyof FormTypeMap>() => {
  const {
    form: { isOpen, close },
  } = useModal();

  const {
    modelType,
    inputMode,
    isEditing,
    formMode,

    single,
    single: { formLabel },

    many,

    steps: {
      formSteps,
      currentStep,
      prevStep,
      nextData,
      handleStep,
      processStep,
    },

    getDiffKeys,
    displayableField,
  } = useForm<T>();

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const { page, setPage } = useQuery();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  const handleFormData = single.handleFormData;

  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);

  const hasNestedKey = (obj: any, path: string) => {
    return path.split(".").every((key) => {
      if (obj && typeof obj === "object" && key in obj) {
        obj = obj[key];
        return true;
      }
      return false;
    });
  };

  const confirmBulkDataHeaders = useMemo(() => {
    const nextConfirmBulkDataHeaders =
      formSteps
        ?.filter((step) => step.many && step.modelType === modelType)
        .flatMap((s) =>
          (s.fields ?? [])
            .map((field) => ({
              label: field.label,
              field: field.key as string,
              width: field.width,
              fieldType: field.fieldType,
              valueType: field.valueType,
            }))
            .filter((h) =>
              (many?.formData ?? []).some((d) => hasNestedKey(d, h.field)),
            ),
        ) ?? [];

    return nextConfirmBulkDataHeaders;
  }, [formSteps, many?.formData]);

  const confirmBulkData = useMemo(() => {
    return (many?.formLabels ?? [])
      .map((d) => {
        const row: Record<string, string | number | undefined> = {};

        confirmBulkDataHeaders.forEach((h) => {
          const key = h.field;
          const value = get(d, key);

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
  }, [many?.formLabels]);

  const data: FieldListData = {};
  displayableField.forEach((display) => {
    if (typeof display.key === "string") {
      const value =
        display.key in formLabel ? formLabel[display.key] : undefined;

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

      if (formSteps) {
        const inputField = formSteps
          .flatMap((step) => step.fields || [])
          .find((f) => f.key === display.key);

        const stepIndex = formSteps.findIndex((step) =>
          (step.fields || []).some((f) => f.key === display.key),
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
            da.value = toDateKey(value as string | number | Date) || "";
          if (inputField.valueType === "datetime-local")
            da.value = toDateKey(value as string | number | Date, true) || "";

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
      onClose={close}
      header={
        <>
          {formSteps && formSteps.length !== 0 ? (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-1">
                {formMode === "create" ? "新規データ作成" : "既存データ編集"}
              </h3>

              <div>
                <div className="mb-1 text-sm text-gray-500">
                  ステップ {currentStep + 1} / {formSteps.length}：
                  {formSteps[currentStep].stepLabel || ""}
                </div>

                <div className="flex space-x-2">
                  {formSteps.map((_, index) => (
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
          ) : formSteps &&
            currentStep === formSteps.length - 1 &&
            !isEditing ? (
            <LinkButtonGroup
              approve={{
                text: "次のデータへ",
                color: "green",
                onClick: nextData,
              }}
            />
          ) : (
            <LinkButtonGroup
              approve={{
                text:
                  formSteps && currentStep === formSteps.length - 1
                    ? formMode === "create"
                      ? "追加"
                      : "変更"
                    : "次へ",
                color: "green",
                onClick: () => {processStep(); setPage("formPage",1)},
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
      {!formSteps || formSteps.length === 0 ? null : (
        <>
          {formSteps[currentStep].type === "confirm" ? (
            <div className="space-y-2 text-sm text-gray-700">
              {formMode === "update" &&
                alert.success &&
                diffKeys.length > 0 && (
                  <span className="text-sm text-red-600 font-medium">
                    ※ 赤文字の値に変更しました
                  </span>
                )}

              {formMode === "update" &&
                !alert.success &&
                diffKeys.length > 0 && (
                  <span className="text-sm text-red-600 font-medium">
                    ※ 赤文字の値に変更します
                  </span>
                )}

              {!isEmptyObject(single.formData) && (
                <FieldList
                  isForm={true}
                  fields={displayableField}
                  data={convertDisplayField(
                    displayableField,
                    formLabel,
                    formSteps,
                    handleStep,
                  )}
                  diffKeys={diffKeys}
                  diffColor={formMode === "update"}
                  isEmpty={inputMode === "single" ? true : false}
                  isExclude={inputMode === "single" ? true : false}
                />
              )}

              {confirmBulkData.length > 0 && (
                <>
                  <div className="bg-gray-200 w-full p-1">
                    <span className="font-bold">多数データ入力値</span>
                  </div>

                  {many?.renderConfirmMes(confirmBulkData)}

                  <FilterProvider>
                    <SortProvider>
                      <ListViewProvider>
                        <ListView
                          pageNation="client"
                          data={confirmBulkData || []}
                          headers={confirmBulkDataHeaders || []}
                          currentPage={page.formPage}
                          onPageChange={(p: number) => setPage("formPage", p)}
                          itemsPerPage={10}
                        />
                      </ListViewProvider>
                    </SortProvider>
                  </FilterProvider>
                </>
              )}
            </div>
          ) : formSteps[currentStep].fields &&
            formSteps[currentStep].many &&
            many ? (
            <RenderManyField
              fields={formSteps[currentStep].fields}
              isTableOpen={isTableOpen}
              toggleTableOpen={() => setIsTableOpen((prev) => !prev)}
            />
          ) : (
            formSteps[currentStep].fields &&
            formSteps[currentStep].fields.map((field, fieldIndex) => {
              const stepTotal = formSteps[currentStep]?.fields?.length ?? 0;
              const stepIndex = fieldIndex + 1;

              return (
                <div key={field.key as string} className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    <span className="mr-2 text-gray-400">
                      {stepIndex}/{stepTotal}
                    </span>
                    {field.label}
                  </label>
                  <RenderField
                    key={field.key as string}
                    field={field}
                    formData={
                      field.dataSource === DataSource.BULK_COMMON
                        ? many?.bulkCommonData || {}
                        : single.formData
                    }
                    formLabel={
                      field.dataSource === DataSource.BULK_COMMON
                        ? many?.bulkCommonLabel || {}
                        : formLabel
                    }
                    handleFormData={(key, value) =>
                      handleFormData(key, value, field.dataSource)
                    }
                    supportButton={!formSteps[currentStep].many}
                  />
                </div>
              );
            })
          )}
        </>
      )}
    </Modal>
  );
};

export default Form;
