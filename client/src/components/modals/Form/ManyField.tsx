import { FormFieldDefinition } from "../../../types/form/field";
import { FormTypeMap } from "../../../types/models";
import { CustomTableContainer } from "../../table";
import { RenderField } from "./Field";
import { useState } from "react";
import { IconButton, IconTextButton } from "../../buttons";
import { useQuery } from "../../../context/query-context";
import { useForm } from "../../../context/form-context";
import { FilterProvider } from "../../../context/filter-context";
import { SortProvider } from "../../../context/sort-context";
import { ListViewProvider } from "../../../context/listView-context";
import { ColumnType, TableHeader } from "../../../types/table";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  fields: FormFieldDefinition<T>[];
  isTableOpen: boolean;
  toggleTableOpen: () => void;
};

const ManyField = <T extends keyof FormTypeMap>({
  fields,
  isTableOpen,
  toggleTableOpen,
}: RenderFieldProps<T>) => {
  const { many, autoFill } = useForm<T>();

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
          handleFormData={(key, value) =>
            many?.handleFormData(focus.rowIndex, key, value)
          }
        />
      );
  }

  const headers: TableHeader<Record<string, any>>[] = fields
    ? fields?.map((field) => ({
        id: field.key as string,
        label: field.label,
        field: field.key as keyof Record<string, any>,
        width: field.width,
        type: ColumnType.FIELD,
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
      <CustomTableContainer
        pageNation="client"
        items={many?.state.length === 0 ? [{}] : many?.state || []}
        headers={headers}
        renderFieldCell={(
          header: TableHeader<Record<string, any>>,
          formData: Record<string, any>,
          rowIndex: number,
        ) => {
          const field = fields?.find((f) => f.key === header.id);
          if (!field) return null;

          const targetObj = many?.stateLabel[rowIndex];
          const value =
            targetObj && field.key in targetObj
              ? targetObj[field.key as string]
              : "";

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
                handleFormData={(key, value) =>
                  many?.handleFormData(rowIndex, key, value)
                }
              />
            );
        }}
        pageNum={page.formPage}
        handlePageChange={async (p: number) => setPage("formPage", p)}
        edit={true}
        deleteOnClick={many?.deleteFormDatas}
        selectedKey={requiredField}
      />

      <div className="flex gap-x-2">
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

const RenderManyField = <K extends keyof FormTypeMap>(
  props: RenderFieldProps<K>,
) => {
  return (
    <FilterProvider>
      <SortProvider>
        <ListViewProvider>
          <ManyField {...props} />
        </ListViewProvider>
      </SortProvider>
    </FilterProvider>
  );
};

export default RenderManyField;
