import { X } from "lucide-react";
import {
  FormTypeMap,
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../../types/models";
import { CustomTableContainer } from "../../../../table";
import { QuickFilterItem } from "../../../../../types/table";
import { FormFieldDefinition, UpdateMode } from "../../../../../types/form";
import { OptionsMap } from "../../../../../utils/createOption/types/base";
import {
  ModelDataOptions,
  OptionSource,
  OptionTable,
} from "../../../../../types/form/option";
import { HandleFormData } from "../../../../../types/form/handleFormData";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useEffect, useMemo, useState } from "react";
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
import { AxiosInstance } from "axios";
import { optionRouteMap } from "../../../../../lib/options";
import {
  ModelDataOption,
  ModelDataOptionConfigMap,
} from "../../../../../utils/createOption/types/optionTable";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { convertToOption } from "../../../../../utils/createOption/createOption";
import { api } from "../../../../../context/api-context";
import { applyFilterClient } from "../../../../../utils/filter/applyFilterClient";
import { applySortClient } from "../../../../../utils/sort/applySortClient";

type TableFieldRendererProps<T extends keyof FormTypeMap> = {
  value: FormTypeMap[T][keyof FormTypeMap[T]];
  label: unknown;
  formDataKey: keyof FormTypeMap[T];
  field: FormFieldDefinition<T>;

  optionKey: keyof OptionsMap;
  optionTableData: ModelDataOptions<any> | null;
  optionIsLoading: boolean;
  optionSource: OptionSource;
  handleFormData: HandleFormData<T>;
  setOptionIsLoading: (time: boolean) => void;
  setOptionTableData: (data: ModelDataOptions<any> | null) => void;
};

export const TableFieldRenderer = <T extends keyof FormTypeMap>({
  value,
  label,
  formDataKey,
  field,

  optionKey,
  optionTableData,
  optionIsLoading,
  optionSource,
  handleFormData,
  setOptionIsLoading,
  setOptionTableData,
}: TableFieldRendererProps<T>) => {
  const { filterConditionsObj, quickFilterItemsObj } = useForm();

  const [viewOptionData, setViewOptionData] =
    useState<ModelDataOptions<any> | null>(null);

  const readOptions = async <T extends keyof ModelDataOptionConfigMap>(
    api: AxiosInstance,
    nextOptionKey: T,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
    page?: number,
  ): Promise<ModelDataOptions<OptionsMap[T]> | undefined> => {
    function isOptionKey(key: ModelType): key is keyof ModelDataOption {
      return key in optionRouteMap;
    }
    if (!isOptionKey(nextOptionKey)) {
      console.error("optionRouteMapにキーが存在しません:", nextOptionKey);
      return;
    }
    const crudRoutes = optionRouteMap[nextOptionKey];

    const { ROOT: route } = crudRoutes;

    if (!route) {
      console.error("ROOT が未定義です:", nextOptionKey);
      return;
    }

    const params: Record<string, any> = {
      getAll: true,
    };

    if (filterConditions && filterConditions.length > 0) {
      params.filters = JSON.stringify(normalizeFiltersForApi(filterConditions));
    }

    if (sortConditions && sortConditions.length > 0) {
      params.sorts = JSON.stringify(sortConditions);
    }

    const handleLoading = (time: "start" | "end") => {
      setOptionIsLoading(time === "start");
    };

    const response = await readItemsBase<ModelDataMap[T][]>({
      apiInstance: api,
      backendRoute: route,
      params,
      handleLoading: handleLoading,
      returnResponse: true,
    });

    if (!response) return undefined;

    const getted: GettedModelDataMap[T][] = convert(
      nextOptionKey,
      response.data,
    );
    const option: OptionTable<OptionsMap[T]> = convertToOption(
      nextOptionKey,
      getted,
      true,
    );

    const optionTableData: ModelDataOptions<OptionsMap[T]> = {
      option,
      page: page ? page : response.page || 1,
      totalCount: response.totalCount || 1,
    };

    return optionTableData;
  };

  const handlePageChange = async (
    page: number,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
  ): Promise<void> => {
    setOptionIsLoading(true);

    if (!optionKey) return setOptionIsLoading(false);

    if (isModelType(optionKey)) {
      const optionTableData = await readOptions(
        api,
        optionKey,
        filterConditions,
        sortConditions,
        page,
      );
      if (!optionTableData) return setOptionIsLoading(false);
      setOptionTableData(optionTableData);
    } else if (isCustomOptionType(optionKey)) {
      if (!optionTableData) return setOptionIsLoading(false);

      let processed = [...optionTableData.option.data];

      processed = applyFilterClient(processed, filterConditions);
      processed = applySortClient(processed, sortConditions);

      const nextViewOptionData = {
        ...optionTableData,
        page,
        option: {
          ...optionTableData.option,
          data: processed,
        },
        totalCount: processed.length,
      };
      setViewOptionData(nextViewOptionData);
    }

    setOptionIsLoading(false);
  };

  const filterField = useMemo(() => {
    if (!optionKey) return;

    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (filterConditionsObj && valid) {
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

  useEffect(() => {
    setViewOptionData(optionTableData);
  }, [optionKey, optionTableData]);

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
        fieldDefinitions={viewOptionData ? viewOptionData.option.fields : []}
        items={viewOptionData ? viewOptionData.option.data : undefined}
        filterField={filterField}
        sortField={sortField}
        itemsLoading={optionIsLoading}
        pageNum={viewOptionData ? viewOptionData.page || 1 : 1}
        totalCount={viewOptionData ? viewOptionData.totalCount : undefined}
        form={true}
        onClick={(index, row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
          if (field.multi) {
            const { key, label } = row as {
              label: string;
              key: string;
            } & Record<any, any>;

            handleFormData({
              key: formDataKey,
              value: { key, label } as FormTypeMap[T][typeof formDataKey],
              field,
              index: index,
              updateMode: UpdateMode.ARRAY_UPDATE,
            });
          } else {
            handleFormData({
              key: formDataKey,
              value: row,
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
