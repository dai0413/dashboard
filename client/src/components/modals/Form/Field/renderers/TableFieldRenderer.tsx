import { X } from "lucide-react";
import { FormTypeMap } from "../../../../../types/models";
import { CustomTableContainer } from "../../../../table";
import { QuickFilterItem } from "../../../../../types/table";
import { FormFieldDefinition, UpdateMode } from "../../../../../types/form";
import { OptionsMap } from "../../../../../utils/createOption/types/base";
import { OptionObj, OptionSource } from "../../../../../types/form/option";
import { HandleFormData } from "../../../../../types/form/handleFormData";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useMemo } from "react";
import {
  isCustomOptionType,
  isModelType,
  isOptionType,
  isQuickFilterType,
} from "../../../../../types/field";
import {
  getFilterableFields,
  getSortableFields,
} from "../../../../../lib/model-fields";
import { useForm } from "../../../../../context/form-context";

type TableFieldRendererProps<T extends keyof FormTypeMap> = {
  value: FormTypeMap[T][keyof FormTypeMap[T]];
  label: unknown;
  formDataKey: keyof FormTypeMap[T];
  field: FormFieldDefinition<T>;

  optionKey: keyof OptionsMap;
  viewOptionData: OptionObj<any>;
  optionIsLoading: boolean;
  optionSource: OptionSource;
  handleFormData?: HandleFormData<T>;
  handlePageChange: (
    page: number,
    filterConditions?: FilterableFieldDefinition[] | undefined,
    sortConditions?: SortableFieldDefinition[],
  ) => Promise<void>;

  onRowSelect?: (row: OptionObj<any>["data"][number]) => void;
};

export const TableFieldRenderer = <T extends keyof FormTypeMap>({
  value,
  label,
  formDataKey,
  field,

  optionKey,
  viewOptionData,
  optionIsLoading,
  optionSource,
  handleFormData,
  handlePageChange,
  onRowSelect,
}: TableFieldRendererProps<T>) => {
  const { filterConditionsObj, quickFilterItemsObj } = useForm();

  const filterField = useMemo(() => {
    if (!optionKey) return;

    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (
      filterConditionsObj &&
      valid &&
      filterConditionsObj[optionKey] &&
      filterConditionsObj[optionKey]?.length > 0
    ) {
      return filterConditionsObj[optionKey];
    }

    if (isModelType(optionKey) || isCustomOptionType(optionKey)) {
      const filterableField = getFilterableFields(optionKey);

      return filterableField;
    }
  }, [optionKey, filterConditionsObj]);

  const sortField = useMemo(() => {
    if (!optionKey) return;

    if (isModelType(optionKey) || isCustomOptionType(optionKey)) {
      const sortableField = getSortableFields(optionKey);
      return sortableField;
    }
  }, [optionKey]);

  const quickFilterItems: QuickFilterItem[] = useMemo(() => {
    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (!quickFilterItemsObj || !valid) return [];
    return quickFilterItemsObj[optionKey] || [];
  }, [optionKey, quickFilterItemsObj]);

  return (
    <>
      <div className="flex mb-2 text-gray-700">
        <div className="px-5">
          選択中:{" "}
          {Array.isArray(label) ? label.join(" , ") : String(label) || "未選択"}
        </div>
        <button
          type="button"
          onClick={() =>
            handleFormData &&
            handleFormData({
              key: formDataKey,
              value: undefined,
              field,
            })
          }
          className="hover:cursor-pointer flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          title="Clear"
        >
          選択解除
          <X size={16} />
        </button>
      </div>
      <CustomTableContainer
        pageNation="client"
        modelType={optionKey && isModelType(optionKey) ? optionKey : undefined}
        fieldDefinitions={viewOptionData?.fields ? viewOptionData.fields : []}
        items={viewOptionData ? viewOptionData.data : undefined}
        filterField={filterField}
        sortField={sortField}
        itemsLoading={optionIsLoading}
        pageNum={viewOptionData ? viewOptionData.page || 1 : 1}
        totalCount={viewOptionData ? viewOptionData.totalCount : undefined}
        form={true}
        onClick={(_index, row: OptionObj<any>["data"][number]) => {
          if (onRowSelect) {
            onRowSelect(row);
            return;
          }

          if (field.multi) {
            const { key, label } = row;

            const index = Array.isArray(value) ? value.length : 0;

            handleFormData &&
              handleFormData({
                key: formDataKey,
                value: { key, label } as FormTypeMap[T][typeof formDataKey],
                field,
                index: index,
                updateMode: UpdateMode.ARRAY_UPDATE,
              });
          } else {
            handleFormData &&
              handleFormData({
                key: formDataKey,
                value: row as FormTypeMap[T][keyof FormTypeMap[T]],
                field,
                updateMode: UpdateMode.REPLACE,
              });
          }
        }}
        selectedKey={Array.isArray(value) ? value : ([value] as string[])}
        handlePageChange={
          optionSource === OptionSource.REMOTE ||
          optionSource === OptionSource.CUSTOM
            ? (page, filterConditions, sortConditions) =>
                handlePageChange(page, filterConditions, sortConditions)
            : undefined
        }
        reloadFun={
          optionSource === OptionSource.REMOTE
            ? (
                filterConditions: FilterableFieldDefinition[],
                sortConditions: SortableFieldDefinition[],
              ) => handlePageChange(1, filterConditions, sortConditions)
            : undefined
        }
        quickFilterType={
          optionKey && isQuickFilterType(optionKey) ? optionKey : undefined
        }
        quickFilterItems={quickFilterItems}
        noItemMessage={
          <p className="text-sm text-gray-400">
            フィルターから条件を追加してください
          </p>
        }
      />
    </>
  );
};
