import { FormFieldDefinition } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { Table } from "../../table";
import { RenderField } from "./Field";
import { useState } from "react";
import { TableHeader } from "../../../types/types";
import { IconTextButton } from "../../buttons";
import { useQuery } from "../../../context/query-context";
import { useForm } from "../../../context/form-context";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  fields: FormFieldDefinition<T>[];
  isTableOpen: boolean;
  toggleTableOpen: () => void;
};

export const RenderManyField = <T extends keyof FormTypeMap>({
  fields,
  isTableOpen,
  toggleTableOpen,
}: RenderFieldProps<T>) => {
  const { many, mode } = useForm<T>();

  const { page, setPage } = useQuery();
  type Focus = {
    field: FormFieldDefinition<T>;
    rowIndex: number;
  };
  const [focus, setFocus] = useState<Focus | null>(null);

  const formData = focus && many?.formData[focus.rowIndex];
  const formLabel = focus && many?.formLabels[focus.rowIndex];

  const handleSetPage = (p: number) => setPage("formPage", p);

  if (focus?.field.fieldType === "table" && formData && formLabel) {
    if (isTableOpen && focus)
      return (
        <RenderField
          field={focus.field}
          formData={formData}
          formLabel={formLabel}
          handleFormData={(key, value) =>
            many?.handleFormData(focus.rowIndex, key, value)
          }
        />
      );
  }

  const headers = fields
    ? fields?.map((field) => ({
        label: field.label,
        field: field.key as string,
        width: field.width,
      }))
    : [];

  const requiredField = [
    fields
      .filter((f) => f.required)
      .map((f) => f.key)
      .toString(),
  ];

  return (
    <>
      <Table
        pageNation="client"
        data={many?.formData.length === 0 ? [{}] : many?.formData || []}
        headers={headers}
        renderFieldCell={(
          header: TableHeader,
          formData: FormTypeMap[T],
          rowIndex: number
        ) => {
          const field = fields?.find((f) => f.key === header.field);
          if (!field) return null;

          const value = many?.formLabels[rowIndex][field.key as string] ?? "";

          if (field.fieldType === "table") {
            return (
              <>
                <button
                  type="button"
                  className={`text-gray-500 bg-green-100 hover:bg-green-200 font-medium rounded-full text-sm px-3 py-1 text-center mx-2`}
                  onClick={() => {
                    toggleTableOpen();
                    setFocus({
                      field: field,
                      rowIndex: rowIndex,
                    });
                  }}
                >
                  編集
                </button>
                {value || "未選択"}
              </>
            );
          } else
            return (
              <RenderField
                field={field}
                formData={formData}
                formLabel={formLabel || []}
                handleFormData={(key, value) =>
                  many?.handleFormData(rowIndex, key, value)
                }
              />
            );
        }}
        currentPage={page.formPage}
        onPageChange={(p: number) => setPage("formPage", p)}
        itemsPerPage={10}
        edit={true}
        deleteOnClick={many?.deleteFormDatas}
        selectedKey={requiredField}
      />

      <IconTextButton
        icon="add"
        color="blue"
        onClick={() => {
          many?.addFormDatas(mode === "many" ? true : false, handleSetPage);
        }}
      >
        データ追加
      </IconTextButton>
    </>
  );
};
