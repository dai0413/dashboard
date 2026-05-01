import { X } from "lucide-react";
import {
  FormTypeMap,
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
} from "../../../../../types/form/option";
import { HandleFormData } from "../../../../../types/form/handleFormData";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useMemo } from "react";
import {
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
import { ModelDataOptionConfigMap } from "../../../../../utils/createOption/types/optionTable";
import { normalizeFiltersForApi } from "../../../../../utils/normalizeFiltersForApi";
import { readItemsBase } from "../../../../../lib/api";
import { DataResoonse } from "../../../../../types/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { convertToOption } from "../../../../../utils/createOption/createOption";
import { api } from "../../../../../context/api-context";

type RenderFieldProps<T extends keyof FormTypeMap> = {
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
}: RenderFieldProps<T>) => {
  const { filterConditionsObj, quickFilterItemsObj } = useForm();

  const readOptions = async (
    api: AxiosInstance,
    nextOptionKey: ModelType,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
    page?: number,
  ): Promise<ModelDataOptions<OptionsMap[typeof optionKey]> | undefined> => {
    const crudRoutes = optionRouteMap[nextOptionKey];

    if (!crudRoutes) {
      console.error("optionRouteMapにキーが存在しません:", nextOptionKey);
      return;
    }

    const { ROOT: route } = crudRoutes;

    if (!route) {
      console.error("ROOT が未定義です:", nextOptionKey);
      return;
    }

    const optionKey: keyof ModelDataOptionConfigMap =
      nextOptionKey as keyof ModelDataOptionConfigMap;

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

    const response: DataResoonse | undefined = await readItemsBase({
      apiInstance: api,
      backendRoute: route,
      params,
      handleLoading: handleLoading,
      returnResponse: true,
    });

    if (!response) return undefined;

    const getted = convert(
      optionKey,
      response.data as ModelDataMap[typeof optionKey],
    ) as unknown as ModelDataOptionConfigMap[typeof optionKey]["input"];

    const option: ModelDataOptions<OptionsMap[typeof optionKey]>["option"] =
      convertToOption(optionKey, getted, true) as unknown as ModelDataOptions<
        OptionsMap[typeof optionKey]
      >["option"];

    const optionTableData: ModelDataOptions<OptionsMap[typeof optionKey]> = {
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
    if (!isModelType(optionKey)) return setOptionIsLoading(false);
    const optionTableData = await readOptions(
      api,
      optionKey,
      filterConditions,
      sortConditions,
      page,
    );

    if (!optionTableData) return setOptionIsLoading(false);

    setOptionTableData(optionTableData);
    setOptionIsLoading(false);
  };

  const filterField = useMemo(() => {
    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (filterConditionsObj && valid) {
      return filterConditionsObj[optionKey];
    }

    if (!optionKey || !isModelType(optionKey)) return;
    const filterableField = getFilterableFields(optionKey);

    return filterableField;
  }, [optionKey, filterConditionsObj]);

  const sortField = useMemo(() => {
    if (!optionKey || !isModelType(optionKey)) return;
    const sortableField = getSortableFields(optionKey);

    return sortableField;
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
        fieldDefinitions={optionTableData ? optionTableData.option.fields : []}
        items={optionTableData ? optionTableData.option.data : undefined}
        filterField={filterField}
        sortField={sortField}
        itemsLoading={optionIsLoading}
        pageNum={optionTableData ? optionTableData.page || 1 : 1}
        totalCount={optionTableData ? optionTableData.totalCount : undefined}
        form={true}
        onClick={(row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
          if (field.multi) {
            const { key, label } = row as {
              label: string;
              key: string;
            } & Record<any, any>;

            handleFormData({
              key: formDataKey,
              value: { key, label } as FormTypeMap[T][typeof formDataKey],
              field,
              index: ((value as string[]) || []).length,
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
          optionSource === OptionSource.REMOTE
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
