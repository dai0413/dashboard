import { CustomTableContainer } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { fieldDefinition } from "../../../lib/model-fields";
import {
  isFilterable,
  isModelType,
  isOptionType,
  isQuickFilterType,
  isSortable,
} from "../../../types/field";

import { FormTypeMap, ModelType } from "../../../types/models";
import {
  convertToOption,
  getDefaultOptions,
  OptionsMap,
} from "../../../utils/createOption";
import { convert } from "../../../lib/convert/DBtoGetted";
import {
  ModelDataOptions,
  OptionArray,
  OptionTable,
} from "../../../types/option";

import { FormFieldDefinition } from "../../../types/form";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../lib/api";
import { api } from "../../../context/api-context";
import { AxiosInstance } from "axios";
import { DataResoonse } from "../../../types/api";
import { normalizeFiltersForApi } from "../../../utils/normalizeFiltersForApi";
import { X } from "lucide-react";
import { optionRouteMap, getOptionKey } from "../../../lib/options";
import { useForm } from "../../../context/form-context";
import { QuickFilterItem } from "../../../types/table";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FormFieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K] | undefined,
  ) => void;
  supportButton?: boolean;
};

export const RenderField = <T extends keyof FormTypeMap>({
  field,
  formData,
  formLabel,
  handleFormData,
  supportButton,
}: RenderFieldProps<T>) => {
  const { multi, key, fieldType, valueType, uniqueInArray, lengthInArray } =
    field;
  const formDataKey = key as keyof FormTypeMap[T];

  const [optionKey, setOptionKey] = useState<keyof OptionsMap | null>(null);
  const [optionTableData, setOptionTableData] =
    useState<ModelDataOptions | null>(null);
  const [optionIsLoading, setOptionIsLoading] = useState<boolean>(false);

  const [optionSelectData, setOptionSelectData] = useState<OptionArray | null>(
    null,
  );

  const { filterConditionsObj, quickFilterItemsObj } = useForm();

  const handleLoading = (time: "start" | "end") => {
    setOptionIsLoading(time === "start");
  };

  const readOptions = async (
    api: AxiosInstance,
    nextOptionKey: ModelType,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
    page?: number,
  ): Promise<ModelDataOptions | undefined> => {
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

    const optionKey = nextOptionKey as ModelType;

    const params: Record<string, any> = {
      getAll: true,
    };

    if (filterConditions && filterConditions.length > 0) {
      params.filters = JSON.stringify(normalizeFiltersForApi(filterConditions));
    }

    if (sortConditions && sortConditions.length > 0) {
      params.sorts = JSON.stringify(sortConditions);
    }

    const response: DataResoonse | undefined = await readItemsBase({
      apiInstance: api,
      backendRoute: route,
      params,
      handleLoading: handleLoading,
      returnResponse: true,
    });

    if (!response) return undefined;

    const getted = convert(optionKey, response.data);

    const optionTableData = {
      option: convertToOption(
        optionKey,
        getted as unknown as OptionsMap[T],
        true,
      ) as OptionTable,
      page: page ? page : response.page || 1,
      totalCount: response.totalCount || 1,
      isLoading: false,
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

  useEffect(() => {
    if (!key) return;

    const nextOptionKey = getOptionKey(key);
    setOptionKey(nextOptionKey);

    if (!isOptionType(nextOptionKey)) return;

    const options = getDefaultOptions(nextOptionKey);
    setOptionSelectData(options);
  }, []);

  const multhInputHandleFormData = (
    index: number,
    value: string | number | Date | boolean | undefined,
  ) => {
    const newValue = [...((formData[formDataKey] ?? []) as string[])];
    if (value === undefined) {
      newValue[index] = "";
    } else {
      newValue[index] = value.toString();
    }

    if (
      index === newValue.length - 1 &&
      value !== undefined &&
      value.toString().trim() !== "" &&
      !newValue.includes("")
    ) {
      newValue.push("");
    }

    handleFormData(formDataKey, newValue as FormTypeMap[T][typeof formDataKey]);
  };

  const value = get(formData, formDataKey) as string | number | Date;

  const multiInputHandleFormData = (
    value: string | number | Date | undefined,
  ) => {
    const selected = value;
    if (selected) {
      const current = (formData[formDataKey] as string[]) ?? [];
      handleFormData(formDataKey, [
        ...current,
        selected,
      ] as FormTypeMap[T][typeof formDataKey]);
    }
  };

  const filterField = useMemo(() => {
    if (filterConditionsObj && optionKey && filterConditionsObj[optionKey]) {
      return filterConditionsObj[optionKey];
    }

    return optionKey && isModelType(optionKey)
      ? fieldDefinition[optionKey].filter(isFilterable)
      : undefined;
  }, [optionKey]);

  const quickFilterItems: QuickFilterItem[] = useMemo(() => {
    if (!quickFilterItemsObj || !optionKey) return [];
    return quickFilterItemsObj[optionKey] || [];
  }, [optionKey]);

  if (fieldType === "table")
    return (
      <>
        <div className="flex mb-2 text-gray-700">
          <div className="px-5">
            選択中: {formLabel[formDataKey as string] || "未選択"}
          </div>
          <button
            type="button"
            onClick={() => handleFormData(formDataKey, undefined)}
            className="hover:cursor-pointer flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
            title="Clear"
          >
            選択解除
            <X size={16} />
          </button>
        </div>
        <CustomTableContainer
          pageNation="client"
          modelType={
            optionKey && isModelType(optionKey) ? optionKey : undefined
          }
          headers={optionTableData ? optionTableData.option.header : undefined}
          items={optionTableData ? optionTableData.option.data : undefined}
          filterField={filterField}
          sortField={
            optionKey && isModelType(optionKey)
              ? fieldDefinition[optionKey].filter(isSortable)
              : undefined
          }
          itemsLoading={optionIsLoading}
          pageNum={optionTableData ? optionTableData.page || 1 : 1}
          totalCount={optionTableData ? optionTableData.totalCount : undefined}
          form={true}
          onClick={(row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
            const currentValue = formData[formDataKey];

            const isSame =
              currentValue &&
              row &&
              typeof row === "object" &&
              "key" in row &&
              row.key === currentValue;
            handleFormData(formDataKey, isSame ? undefined : row);
          }}
          selectedKey={
            typeof formData[formDataKey] === "string"
              ? [formData[formDataKey]]
              : []
          }
          handlePageChange={(
            page: number,
            filterConditions: FilterableFieldDefinition[],
            sortConditions: SortableFieldDefinition[],
          ) => handlePageChange(page, filterConditions, sortConditions)}
          reloadFun={(
            filterConditions: FilterableFieldDefinition[],
            sortConditions: SortableFieldDefinition[],
          ) => handlePageChange(1, filterConditions, sortConditions)}
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

  if (multi && fieldType === "textarea")
    return (
      <>
        {[
          ...(formData[formDataKey] &&
          (formData[formDataKey] as string[]).length > 0
            ? (formData[formDataKey] as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={item}
              onChange={(e) => {
                const value = e.target.value;
                const newValue = [
                  ...((formData[formDataKey] ?? []) as string[]),
                ];
                newValue[index] = value;

                // 入力されたのが最後の要素かつ空だった場合、新たな空欄を追加
                if (
                  index === newValue.length - 1 &&
                  value.trim() !== "" &&
                  !newValue.includes("")
                ) {
                  newValue.push("");
                }

                handleFormData(
                  formDataKey,
                  newValue as FormTypeMap[T][typeof formDataKey],
                );
              }}
            />

            <button
              type="button"
              onClick={() => {
                const newValue = [...(formData[formDataKey] as string[])];
                newValue.splice(index, 1);
                handleFormData(
                  formDataKey,
                  newValue as FormTypeMap[T][typeof formDataKey],
                );
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </>
    );

  if (multi && fieldType === "select" && optionSelectData && uniqueInArray) {
    let options = optionSelectData;
    const selected = (formData[formDataKey] as string[]).filter(
      (v) => v !== "",
    );
    if (uniqueInArray && Array.isArray(selected)) {
      options = optionSelectData.filter((item) => {
        return !selected.includes(item.key);
      });
    }

    const getUniqueOptions = (index: number) => {
      const used = new Set(selected.slice(0, index));
      return optionSelectData.filter((item) => !used.has(item.key));
    };

    return (
      <>
        {[...((formData[formDataKey] as string[]) ?? [])].map(
          (item: string, index: number) => {
            const inputArrayHandleFormData = (
              value: string | number | Date | undefined,
            ) => {
              const newValue = [...(formData[formDataKey] as string[])];
              newValue[index] = String(value);
              handleFormData(
                formDataKey,
                newValue as FormTypeMap[T][typeof formDataKey],
              );
            };

            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={inputArrayHandleFormData}
                  options={getUniqueOptions(index)}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />
              </div>
            );
          },
        )}

        {!lengthInArray && (
          <SelectField
            type={valueType}
            value={""}
            onChange={multiInputHandleFormData}
            options={options}
            defaultOption="--- 未選択 ---"
            displayClearButton={true}
          />
        )}
      </>
    );
  }

  if (multi && fieldType === "select" && optionSelectData)
    return (
      <>
        {[...((formData[formDataKey] as string[]) ?? [])].map(
          (item: string, index: number) => {
            const inputArrayHandleFormData = (
              value: string | number | Date | undefined,
            ) => {
              const newValue = [...(formData[formDataKey] as string[])];
              newValue[index] = String(value);
              handleFormData(
                formDataKey,
                newValue as FormTypeMap[T][typeof formDataKey],
              );
            };

            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={inputArrayHandleFormData}
                  options={optionSelectData}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = [...(formData[formDataKey] as string[])];
                    newValue.splice(index, 1);
                    handleFormData(
                      formDataKey,
                      newValue as FormTypeMap[T][typeof formDataKey],
                    );
                  }}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            );
          },
        )}

        <SelectField
          type={valueType}
          value={""}
          onChange={multiInputHandleFormData}
          options={optionSelectData}
          defaultOption="--- 未選択 ---"
          displayClearButton={true}
        />
      </>
    );

  if (multi && fieldType === "input")
    return (
      <>
        {[
          ...(formData[formDataKey] &&
          (formData[formDataKey] as string[]).length > 0
            ? (formData[formDataKey] as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => {
          const onChange = (
            value: string | number | Date | boolean | undefined,
          ) => multhInputHandleFormData(index, value);

          return (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <InputField
                type={valueType}
                value={item}
                onChange={onChange}
                placeholder=""
              />

              <button
                type="button"
                onClick={() => {
                  const newValue = [...(formData[formDataKey] as string[])];
                  newValue.splice(index, 1);
                  handleFormData(
                    formDataKey,
                    newValue as FormTypeMap[T][typeof formDataKey],
                  );
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          );
        })}
      </>
    );

  if (fieldType === "select" && optionSelectData)
    return (
      <SelectField
        type={valueType}
        value={value || ""}
        onChangeObj={(value: Record<string, any> | undefined) => {
          handleFormData(formDataKey, value as any);
        }}
        options={optionSelectData}
        defaultOption="--- 未選択 ---"
        displayClearButton={true}
      />
    );

  if (fieldType === "input")
    return (
      <InputField
        type={valueType}
        value={value}
        onChange={(value: string | number | Date | boolean | undefined) => {
          handleFormData(formDataKey, value as any);
        }}
        placeholder=""
        supportButton={supportButton}
      />
    );
};
