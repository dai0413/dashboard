import { CustomTableContainer } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { fieldDefinition } from "../../../lib/model-fields";
import {
  isFilterable,
  isModelType,
  isOptionType,
  isSortable,
} from "../../../types/field";
import { useFilter } from "../../../context/filter-context";
import { useSort } from "../../../context/sort-context";

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
import { BaseCrudRoutes } from "../../../types/baseCrudRoutes";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../lib/api";
import { useApi } from "../../../context/api-context";
import { AxiosInstance } from "axios";
import { DataResoonse } from "../../../types/api";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FormFieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => void;
  supportButton?: boolean;
};

const keyMap: Record<string, keyof OptionsMap> = {
  citizenship: ModelType.COUNTRY,
  from_team: ModelType.TEAM,
  to_team: ModelType.TEAM,
  home_team: ModelType.TEAM,
  away_team: ModelType.TEAM,
  series: ModelType.NATIONAL_MATCH_SERIES,
  parent_stage: ModelType.COMPETITION_STAGE,
  competition_stage: ModelType.COMPETITION_STAGE,
  match_format: ModelType.MATCH_FORMAT,
};

export function getOptionKey<T extends keyof FormTypeMap>(
  key: keyof FormTypeMap[T] | string
): keyof OptionsMap {
  if (typeof key === "string" && key.includes(".")) {
    const parts = key.split(".");
    const last = parts[parts.length - 1];
    return keyMap[last] ?? (last as keyof OptionsMap);
  }
  return keyMap[key as string] ?? (key as keyof OptionsMap);
}

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

  const [optionSelectData, setOptionSelectData] = useState<OptionArray | null>(
    null
  );

  const { filterConditions } = useFilter();
  const { sortConditions } = useSort();

  const optionRouteMap: Record<string, BaseCrudRoutes> = {
    [ModelType.PLAYER]: API_PATHS.PLAYER,
    [ModelType.TEAM]: API_PATHS.TEAM,
    [ModelType.COUNTRY]: API_PATHS.COUNTRY,
    [ModelType.MATCH_FORMAT]: API_PATHS.MATCH_FORMAT,
    [ModelType.NATIONAL_MATCH_SERIES]: API_PATHS.NATIONAL_MATCH_SERIES,
    [ModelType.SEASON]: API_PATHS.SEASON,
    [ModelType.STADIUM]: API_PATHS.STADIUM,
    [ModelType.COMPETITION_STAGE]: API_PATHS.COMPETITION_STAGE,
    [ModelType.COMPETITION]: API_PATHS.COMPETITION,
  };

  const api = useApi();

  const handleLoading = () => {
    if (!setOptionTableData) return undefined;

    return (time: "start" | "end") =>
      setOptionTableData((prev) => ({
        ...(prev ?? {
          option: { data: [], header: [] },
          page: 1,
          totalCount: 0,
        }),
        isLoading: time === "start",
      }));
  };

  const readOptions = async (
    api: AxiosInstance,
    nextOptionKey: ModelType,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
    page?: number
  ): Promise<ModelDataOptions | undefined> => {
    const route = optionRouteMap[nextOptionKey].ROOT;
    if (!route) {
      console.error("optionRouteMapの不備:", nextOptionKey);
      return;
    }

    const optionKey = nextOptionKey as ModelType;

    const response: DataResoonse | undefined = await readItemsBase({
      apiInstance: api,
      backendRoute: route,
      params: {
        page: page || 1,
        filters: JSON.stringify(filterConditions),
        sorts: JSON.stringify(sortConditions),
      },
      handleLoading: handleLoading,
      returnResponse: true,
    });

    if (!response) return undefined;

    const getted = convert(optionKey, response.data);

    const optionTableData = {
      option: convertToOption(
        optionKey,
        getted as unknown as OptionsMap[T],
        true
      ) as OptionTable,
      page: response.page,
      totalCount: response.totalCount,
      isLoading: false,
    };

    return optionTableData;
  };

  const handlePageChange = async (page: number): Promise<void> => {
    if (!optionKey) return;
    if (!isModelType(optionKey)) return;
    const optionTableData = await readOptions(
      api,
      optionKey,
      filterConditions,
      sortConditions,
      page
    );

    if (!optionTableData) return;

    setOptionTableData(optionTableData);
  };

  useEffect(() => {
    if (!key) return;

    const nextOptionKey = getOptionKey(key);
    setOptionKey(nextOptionKey);

    if (!isOptionType(nextOptionKey)) return;

    const options = getDefaultOptions(nextOptionKey);
    setOptionSelectData(options);
  }, [filterConditions, sortConditions]);

  const multhInputHandleFormData = (
    index: number,
    value: string | number | Date | boolean
  ) => {
    const newValue = [...((formData[formDataKey] ?? []) as string[])];
    newValue[index] = value.toString();

    if (
      index === newValue.length - 1 &&
      value.toString().trim() !== "" &&
      !newValue.includes("")
    ) {
      newValue.push("");
    }

    handleFormData(formDataKey, newValue as FormTypeMap[T][typeof formDataKey]);
  };

  const value = get(formData, formDataKey) as string | number | Date;

  const multiInputHandleFormData = (value: string | number | Date) => {
    const selected = value;
    if (selected) {
      const current = (formData[formDataKey] as string[]) ?? [];
      handleFormData(formDataKey, [
        ...current,
        selected,
      ] as FormTypeMap[T][typeof formDataKey]);
    }
  };

  if (fieldType === "table")
    return (
      <>
        <div className="mb-2 text-gray-700">
          選択中: {formLabel[formDataKey as string] || "未選択"}
        </div>
        <CustomTableContainer
          headers={optionTableData ? optionTableData.option.header : undefined}
          items={optionTableData ? optionTableData.option.data : undefined}
          filterField={
            optionKey && isModelType(optionKey)
              ? fieldDefinition[optionKey].filter(isFilterable)
              : undefined
          }
          sortField={
            optionKey && isModelType(optionKey)
              ? fieldDefinition[optionKey].filter(isSortable)
              : undefined
          }
          itemsLoading={optionTableData ? optionTableData.isLoading : undefined}
          pageNum={optionTableData ? optionTableData.page || 1 : 1}
          totalCount={optionTableData ? optionTableData.totalCount : undefined}
          form={true}
          onClick={(row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
            handleFormData(formDataKey, row);
          }}
          selectedKey={
            typeof formData[formDataKey] === "string"
              ? [formData[formDataKey]]
              : []
          }
          handlePageChange={(page: number) => handlePageChange(page)}
          openBadges={optionKey === "team"}
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
                  newValue as FormTypeMap[T][typeof formDataKey]
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
                  newValue as FormTypeMap[T][typeof formDataKey]
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
      (v) => v !== ""
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
              value: string | number | Date
            ) => {
              const newValue = [...(formData[formDataKey] as string[])];
              newValue[index] = String(value);
              handleFormData(
                formDataKey,
                newValue as FormTypeMap[T][typeof formDataKey]
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
                />
              </div>
            );
          }
        )}

        {!lengthInArray && (
          <SelectField
            type={valueType}
            value={""}
            onChange={multiInputHandleFormData}
            options={options}
            defaultOption="--- 未選択 ---"
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
              value: string | number | Date
            ) => {
              const newValue = [...(formData[formDataKey] as string[])];
              newValue[index] = String(value);
              handleFormData(
                formDataKey,
                newValue as FormTypeMap[T][typeof formDataKey]
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
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = [...(formData[formDataKey] as string[])];
                    newValue.splice(index, 1);
                    handleFormData(
                      formDataKey,
                      newValue as FormTypeMap[T][typeof formDataKey]
                    );
                  }}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            );
          }
        )}

        <SelectField
          type={valueType}
          value={""}
          onChange={multiInputHandleFormData}
          options={optionSelectData}
          defaultOption="--- 未選択 ---"
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
          const onChange = (value: string | number | Date | boolean) =>
            multhInputHandleFormData(index, value);

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
                    newValue as FormTypeMap[T][typeof formDataKey]
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
        onChangeObj={(value: Record<string, any>) => {
          handleFormData(formDataKey, value as any);
        }}
        options={optionSelectData}
        defaultOption="--- 未選択 ---"
      />
    );

  if (fieldType === "input")
    return (
      <InputField
        type={valueType}
        value={value}
        onChange={(value: string | number | Date | boolean) => {
          handleFormData(formDataKey, value as any);
        }}
        placeholder=""
        supportButton={supportButton}
      />
    );
};
