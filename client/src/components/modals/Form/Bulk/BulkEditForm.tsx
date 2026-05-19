import { FormFieldDefinition } from "../../../../types/form/field";
import { FormTypeMap } from "../../../../types/models";
import { CustomTableContainer } from "../../../table";
import { RenderField } from "../Field/Field";
import { useState } from "react";
import { IconButton, IconTextButton } from "../../../buttons";
import { useQuery } from "../../../../context/query-context";
import { useForm } from "../../../../context/form-context";
import { ColumnType, TableHeader } from "../../../../types/table";
import { HandleFormData } from "../../../../types/form/handleFormData";

type RenderFieldProps = {
  isTableOpen: boolean;
  toggleTableOpen: () => void;
};

const BulkEditForm = <T extends keyof FormTypeMap>({
  isTableOpen,
  toggleTableOpen,
}: RenderFieldProps) => {
  const {
    many,
    autoFill,
    options,
    steps: { formSteps, currentStep },
  } = useForm<T>();

  const { page, setPage } = useQuery();

  type Focus = {
    field: FormFieldDefinition<T>;
    rowIndex: number;
  };

  const [focus, setFocus] = useState<Focus | null>(null);

  const formData: FormTypeMap[T] | undefined | null =
    focus && many?.state[focus.rowIndex];
  const formLabel = focus && many?.stateLabel[focus.rowIndex];

  const handleSetPage = (p: number) => setPage("formPage", p);

  if (focus?.field.fieldType === "table" && formData && formLabel) {
    if (isTableOpen && focus)
      return (
        <RenderField
          field={focus.field}
          formData={formData}
          formLabel={formLabel}
          handleFormData={(props) =>
            many?.handleFormData({ ...props, dataIndex: focus.rowIndex })
          }
          options={options}
        />
      );
  }

  const headers: TableHeader<Record<string, any>>[] = formSteps[currentStep]
    .fields
    ? formSteps[currentStep].fields?.map((field) => ({
        key: field.key as string,
        label: field.label,
        field: field.key as keyof Record<string, any>,
        width: field.width,
        type: "string",
        defaultDisplay: true,
        displayOnTable: true,
        getValueType: ColumnType.FIELD,
      }))
    : [];

  const requiredField =
    formSteps[currentStep].fields
      ?.filter((f) => f.required)
      .map((f) => String(f.key)) ?? [];

  return (
    <>
      <CustomTableContainer
        pageNation="client"
        items={many?.state.length === 0 ? [{}] : many?.state || []}
        fieldDefinitions={headers}
        renderFieldCell={(
          header: TableHeader<Record<string, any>>,
          formData: Record<string, any>,
          rowIndex: number,
        ) => {
          const field = formSteps[currentStep].fields?.find(
            (f) => f.key === header.key,
          );
          if (!field || !many?.handleFormData) return null;

          const targetObj = many?.stateLabel[rowIndex];
          const value =
            targetObj && field.key in targetObj
              ? targetObj[field.key as string]
              : "";

          const handleFormData: HandleFormData<T> = (props) =>
            many?.handleFormData({
              ...props,
              dataIndex: rowIndex,
            });

          if (field.fieldType === "table") {
            return (
              <IconButton
                icon="edit"
                color="gray"
                text={value || "未選択"}
                onClick={() => {
                  toggleTableOpen();
                  setFocus({
                    field: field,
                    rowIndex: rowIndex,
                  });
                }}
                className="text-gray-500"
              />
            );
          } else
            return (
              <RenderField
                field={field}
                formData={formData}
                formLabel={formLabel || []}
                handleFormData={handleFormData}
                options={options}
              />
            );
        }}
        pageNum={page.formPage}
        handlePageChange={async (p: number) => setPage("formPage", p)}
        edit={true}
        deleteOnClick={many?.deleteFormDatas}
        selectedKey={requiredField}
      />

      <div className="flex gap-x-2 pt-10">
        <div>
          <IconTextButton
            icon="add"
            color="blue"
            onClick={() => {
              many?.addFormDatas(handleSetPage);
            }}
          >
            データ追加
          </IconTextButton>
        </div>

        <div>
          {autoFill && (
            <IconTextButton icon="edit" color="gray" onClick={autoFill}>
              自動入力
            </IconTextButton>
          )}
        </div>
      </div>
    </>
  );
};

export default BulkEditForm;
