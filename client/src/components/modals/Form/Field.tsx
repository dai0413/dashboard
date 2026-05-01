import { CustomTableContainer } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import {
  getFilterableFields,
  getSortableFields,
} from "../../../lib/model-fields";
import {
  isModelType,
  isOptionType,
  isQuickFilterType,
  resolveOptionSource,
} from "../../../types/field";

import { FormTypeMap, ModelDataMap, ModelType } from "../../../types/models";
import {
  convertToOption,
  getDefaultOptions,
} from "../../../utils/createOption/createOption";
import {
  DefaultOptionMap,
  OptionsMap,
  OptionType,
} from "../../../utils/createOption/types/base";
import { convert } from "../../../lib/convert/DBtoGetted";
import {
  ModelDataOptions,
  OptionArray,
  OptionSource,
  OptionTable,
} from "../../../types/form/option";

import { FormFieldDefinition } from "../../../types/form/field";
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
import { ModelDataOptionConfigMap } from "../../../utils/createOption/types/optionTable";
import { OptionProvider } from "../../../context/options-provider";
import { HandleFormData } from "../../../types/form/handleFormData";
import { UpdateMode } from "../../../types/form";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FormFieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: HandleFormData<T>;
  supportButton?: boolean;
  options: Record<string, OptionArray | OptionTable<any>>;
};

export const RenderFieldBase = <T extends keyof FormTypeMap>({
  field,
  formData,
  formLabel,
  handleFormData,
  supportButton,
  options,
}: RenderFieldProps<T>) => {
  const { multi, key, fieldType, valueType, uniqueInArray, lengthInArray } =
    field;
  const formDataKey = key as keyof FormTypeMap[T];

  const [optionKey, setOptionKey] = useState<keyof OptionsMap>(
    OptionType.OPERATOR,
  );
  const [optionTableData, setOptionTableData] =
    useState<ModelDataOptions<any> | null>(null);
  const [optionIsLoading, setOptionIsLoading] = useState<boolean>(false);
  const [optionSource, setOptionSource] = useState<OptionSource>(
    OptionSource.PRESET,
  );

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

  useEffect(() => {
    if (!key) return;

    const nextOptionKey = getOptionKey(key);
    const source = resolveOptionSource(nextOptionKey);

    if (!source) return;
    setOptionKey(nextOptionKey);
    setOptionSource(source);

    if (source === OptionSource.PRESET) {
      const options = getDefaultOptions(
        nextOptionKey as keyof DefaultOptionMap,
      );
      setOptionSelectData(options);
    }

    if (source === OptionSource.CUSTOM && nextOptionKey in options) {
      const optionData = options[nextOptionKey];

      if (Array.isArray(optionData)) {
        setOptionSelectData(optionData);
      } else {
        setOptionTableData({
          option: optionData,
          page: 1,
          totalCount: 1,
        });
      }
    }
  }, [key]);

  const value = get(formData, formDataKey) as string | number | Date;

  const filterField = useMemo(() => {
    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (filterConditionsObj && valid) {
      return filterConditionsObj[optionKey];
    }

    if (!optionKey || !isModelType(optionKey)) return;
    const filterableField = getFilterableFields(optionKey);

    return filterableField;
  }, [optionKey]);

  const sortField = useMemo(() => {
    if (!optionKey || !isModelType(optionKey)) return;
    const sortableField = getSortableFields(optionKey);

    return sortableField;
  }, [optionKey]);

  const quickFilterItems: QuickFilterItem[] = useMemo(() => {
    const valid = isModelType(optionKey) || isOptionType(optionKey);

    if (!quickFilterItemsObj || !valid) return [];
    return quickFilterItemsObj[optionKey] || [];
  }, [optionKey]);

  if (fieldType === "table")
    return (
      <>
        <div className="flex mb-2 text-gray-700">
          <div className="px-5">
            選択中:{" "}
            {Array.isArray(formLabel[formDataKey as string])
              ? formLabel[formDataKey as string].join(" , ")
              : formLabel[formDataKey as string] || "未選択"}
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
          modelType={
            optionKey && isModelType(optionKey) ? optionKey : undefined
          }
          fieldDefinitions={
            optionTableData ? optionTableData.option.fields : []
          }
          items={optionTableData ? optionTableData.option.data : undefined}
          filterField={filterField}
          sortField={sortField}
          itemsLoading={optionIsLoading}
          pageNum={optionTableData ? optionTableData.page || 1 : 1}
          totalCount={optionTableData ? optionTableData.totalCount : undefined}
          form={true}
          onClick={(row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
            if (multi) {
              const { key, label } = row as {
                label: string;
                key: string;
              } & Record<any, any>;

              handleFormData({
                key: formDataKey,
                value: { key, label } as FormTypeMap[T][typeof formDataKey],
                field,
                index: ((formData[formDataKey] as string[]) || []).length,
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
          selectedKey={
            Array.isArray(formData[formDataKey])
              ? formData[formDataKey]
              : ([formData[formDataKey]] as string[])
          }
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

                handleFormData({
                  key: formDataKey,
                  value: value as FormTypeMap[T][typeof formDataKey],
                  field,
                  index,
                  updateMode: UpdateMode.ARRAY_UPDATE,
                });
              }}
            />

            <button
              type="button"
              onClick={() => {
                handleFormData({
                  key: formDataKey,
                  value: undefined,
                  field,
                  updateMode: UpdateMode.ARRAY_UPDATE,
                  index: index,
                });
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}

        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={""}
          onChange={(e) => {
            handleFormData({
              key: formDataKey,
              value: e.target.value as FormTypeMap[T][typeof formDataKey],
              field,
              index: ((formData[formDataKey] as string[]) || []).length,
              updateMode: UpdateMode.ARRAY_UPDATE,
            });
          }}
        />
      </>
    );

  if (multi && fieldType === "select" && optionSelectData && uniqueInArray) {
    let options = optionSelectData;
    const selected = ((formData[formDataKey] as string[]) || []).filter(
      (v) => v !== "",
    );
    if (Array.isArray(selected)) {
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
            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={(value) => {
                    handleFormData({
                      key: formDataKey,
                      value: value as FormTypeMap[T][typeof formDataKey],
                      field,
                      index,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                    });
                  }}
                  options={getUniqueOptions(index)}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />
              </div>
            );
          },
        )}

        {!!lengthInArray && lengthInArray >= selected.length && (
          <SelectField
            type={valueType}
            value={""}
            onChange={(value) => {
              handleFormData({
                key: formDataKey,
                value: value as FormTypeMap[T][typeof formDataKey],
                field,
              });
            }}
            options={options}
            defaultOption="--- 未選択 ---"
            displayClearButton={true}
          />
        )}
      </>
    );
  }

  if (multi && fieldType === "select" && optionSelectData) {
    return (
      <>
        {[...((formData[formDataKey] as string[]) ?? [])].map(
          (item: string, index: number) => {
            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={(value) => {
                    handleFormData({
                      key: formDataKey,
                      value: value as FormTypeMap[T][typeof formDataKey],
                      field,
                      index,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                    });
                  }}
                  options={optionSelectData}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />

                <button
                  type="button"
                  onClick={() => {
                    handleFormData({
                      key: formDataKey,
                      value: undefined,
                      field,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                      index: index,
                    });
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
          onChange={(value) => {
            handleFormData({
              key: formDataKey,
              value: value as FormTypeMap[T][typeof formDataKey],
              field,
              index: ((formData[formDataKey] as string[]) || []).length,
              updateMode: UpdateMode.ARRAY_UPDATE,
            });
          }}
          options={optionSelectData}
          defaultOption="--- 未選択 ---"
          displayClearButton={true}
        />
      </>
    );
  }

  if (multi && fieldType === "input")
    return (
      <>
        {[
          ...(formData[formDataKey] &&
          (formData[formDataKey] as string[]).length > 0
            ? (formData[formDataKey] as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => {
          return (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <InputField
                type={valueType}
                value={item}
                onChange={(value) =>
                  handleFormData({
                    key: formDataKey,
                    value: value as FormTypeMap[T][typeof formDataKey],
                    field,
                    index,
                  })
                }
                placeholder=""
              />

              <button
                type="button"
                onClick={() => {
                  handleFormData({
                    key: formDataKey,
                    value: undefined,
                    field,
                    updateMode: UpdateMode.ARRAY_UPDATE,
                    index: index,
                  });
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
          handleFormData({
            key: formDataKey,
            value: value as any,
            field,
            updateMode: UpdateMode.REPLACE,
          });
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
          handleFormData({
            key: formDataKey,
            value: value as any,
            field,
            updateMode: UpdateMode.REPLACE,
          });
        }}
        placeholder=""
        supportButton={supportButton}
      />
    );
};

export const RenderField = <T extends keyof FormTypeMap>(
  props: RenderFieldProps<T>,
) => {
  return (
    <OptionProvider>
      <RenderFieldBase {...props} />
    </OptionProvider>
  );
};
