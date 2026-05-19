import { useMemo } from "react";
import { get } from "lodash";
import { FormTypeMap } from "../../../../types/models";
import { FormFieldDefinition } from "../../../../types/form";
import { ColumnType, TableHeader } from "../../../../types/table";
import { CustomTableContainer } from "../../../table";
import { useForm } from "../../../../context/form-context";
import { useQuery } from "../../../../context/query-context";
import { getDiffKeys } from "../../../../utils/comparison";
import { isEmptyObject } from "../../../../utils/data";
import { useAlert } from "../../../../context/alert-context";

const BulkConfirmForm = <T extends keyof FormTypeMap>() => {
  const {
    modelType,
    many,
    steps: { formSteps, currentStep },
  } = useForm<T>();

  const { page, setPage } = useQuery();

  const {
    modal: { alert },
  } = useAlert();

  const diffKeysObj: Record<number, string[]> =
    many?.originalDatas?.reduce(
      (acc, d, i) => {
        if (i in many.state) {
          const diffKeys = getDiffKeys(d, many.state[i]);

          if (diffKeys.length > 0) {
            acc[i] = diffKeys;
          }

          return acc;
        } else {
          return {};
        }
      },
      {} as Record<number, string[]>,
    ) ?? {};

  const isUpdated = !!alert.success && !isEmptyObject(diffKeysObj);
  const isChanged = !alert.success && !isEmptyObject(diffKeysObj);

  const hasNestedKey = (obj: any, path: string) => {
    return path.split(".").every((key) => {
      if (obj && typeof obj === "object" && key in obj) {
        obj = obj[key];
        return true;
      }
      return false;
    });
  };

  type ConfirmBulkDataHeader = TableHeader<DisplayRow> & {
    fieldType: FormFieldDefinition<T>["fieldType"];
    valueType: FormFieldDefinition<T>["valueType"];
  };

  type DisplayRow = Record<string, string | number | undefined>;

  const confirmBulkDataHeaders: ConfirmBulkDataHeader[] = useMemo(() => {
    const nextConfirmBulkDataHeaders: ConfirmBulkDataHeader[] =
      formSteps
        ?.filter((step) => step.many && step.modelType === modelType)
        .flatMap((s) =>
          (s.fields ?? [])
            .map(
              (field) =>
                ({
                  type: "string",
                  getValueType: ColumnType.FIELD,
                  key: field.key as string,
                  label: field.label,
                  field: field.key as string,
                  width: field.width,
                  fieldType: field.fieldType,
                  valueType: field.valueType,
                  displayOnTable: true,
                }) satisfies ConfirmBulkDataHeader,
            )
            .filter((h) =>
              (many?.state ?? []).some((d) =>
                hasNestedKey(d, h.field as string),
              ),
            ),
        ) ?? [];

    return nextConfirmBulkDataHeaders;
  }, [formSteps, many?.state, currentStep]);

  const confirmBulkData: DisplayRow[] = useMemo(() => {
    return (many?.stateLabel ?? [])
      .map((d) => {
        const row: DisplayRow = {};

        confirmBulkDataHeaders.forEach((h) => {
          const key = h.key;
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
  }, [many?.stateLabel, confirmBulkDataHeaders]);

  return (
    <>
      {confirmBulkData.length > 0 && (
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

          <div className="bg-gray-200 w-full p-1">
            <span className="font-bold">多数データ入力値</span>
          </div>

          {many?.renderConfirmMes(confirmBulkData)}

          <CustomTableContainer
            pageNation="client"
            items={confirmBulkData || []}
            fieldDefinitions={confirmBulkDataHeaders || []}
            pageNum={page.formPage}
            handlePageChange={async (p: number) => setPage("formPage", p)}
            selectedKeys={diffKeysObj}
          />
        </div>
      )}
    </>
  );
};

export default BulkConfirmForm;
