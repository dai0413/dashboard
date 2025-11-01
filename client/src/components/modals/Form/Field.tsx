"use client";
import { FieldDefinition } from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { useOptions } from "../../../context/options-provider";
import { CustomTableContainer } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";
import { useEffect, useState } from "react";
import {
  convert as convertToOption,
  OptionsMap,
  OptionType,
} from "../../../utils/createOption";
import { OptionArray, OptionTable } from "../../../types/option";
import { readItemsBase } from "../../../lib/api";
import { API_ROUTES, CrudRouteWithParams } from "../../../lib/apiRoutes";
import { useApi } from "../../../context/api-context";
import { convert } from "../../../lib/convert/DBtoGetted";
import { QueryParams } from "../../../lib/api/readItems";
import { fieldDefinition } from "../../../lib/model-fields";
import {
  isFilterable,
  isModelType,
  isOptionType,
  isSortable,
} from "../../../types/field";
import { useFilter } from "../../../context/filter-context";
import { useSort } from "../../../context/sort-context";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => void;
};

export const RenderField = <T extends keyof FormTypeMap>({
  field,
  formData,
  formLabel,
  handleFormData,
}: RenderFieldProps<T>) => {
  const { multi, key, fieldType, valueType } = field;
  const formDataKey = key as keyof FormTypeMap[T];

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

  function getOptionKey<T extends keyof FormTypeMap>(
    key: keyof FormTypeMap[T] | string,
    keyMap: any
  ): keyof OptionsMap {
    if (typeof key === "string" && key.includes(".")) {
      const parts = key.split(".");
      const last = parts[parts.length - 1];
      return keyMap[last] ?? (last as keyof OptionsMap);
    }
    return keyMap[key as string] ?? (key as keyof OptionsMap);
  }

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

  const optionRouteMap: Record<string, CrudRouteWithParams<{}>> = {
    [ModelType.PLAYER]: API_ROUTES.PLAYER.GET_ALL,
    [ModelType.TEAM]: API_ROUTES.TEAM.GET_ALL,
    [ModelType.COUNTRY]: API_ROUTES.COUNTRY.GET_ALL,
    [ModelType.MATCH_FORMAT]: API_ROUTES.MATCH_FORMAT.GET_ALL,
    [ModelType.NATIONAL_MATCH_SERIES]: API_ROUTES.NATIONAL_MATCH_SERIES.GET_ALL,
    [ModelType.SEASON]: API_ROUTES.SEASON.GET_ALL,
    [ModelType.STADIUM]: API_ROUTES.STADIUM.GET_ALL,
    [ModelType.COMPETITION_STAGE]: API_ROUTES.COMPETITION_STAGE.GET_ALL,
    [ModelType.COMPETITION]: API_ROUTES.COMPETITION.GET_ALL,
  };

  const [optionKey, setOptionKey] = useState<keyof OptionsMap | null>(null);
  const [optionTableData, setOptionTableData] = useState<{
    option: OptionTable;
    page: number;
    totalCount: number;
    isLoading: boolean;
  } | null>(null);

  const [optionSelectData, setOptionSelectData] = useState<OptionArray | null>(
    null
  );

  const { filterConditions } = useFilter();
  const { sortConditions } = useSort();

  const handleLoading = (time: "end" | "start"): void => {
    setOptionTableData((prev) => ({
      ...(prev ?? { option: { data: [], header: [] }, page: 1, totalCount: 0 }), // fallback
      isLoading: time === "start",
    }));
  };

  const api = useApi();

  async function getOptionData<T extends ModelType>(
    route: CrudRouteWithParams<unknown>,
    params: QueryParams,
    optionKey: T,
    fieldType: "input" | "select" | "textarea" | "table"
  ) {
    readItemsBase({
      apiInstance: api,
      backendRoute: route,
      params,
      onSuccess: (data) => {
        const getted = convert(optionKey, data.data);

        const optionTableData = {
          option: convertToOption(
            optionKey,
            getted as OptionsMap[T],
            true
          ) as OptionTable,
          page: data.page,
          totalCount: data.totalCount,
          isLoading: false,
        };

        if (fieldType === "table") {
          setOptionTableData(optionTableData);
        } else if (fieldType === "select") {
          setOptionSelectData(
            convertToOption(
              optionKey,
              getted as OptionsMap[T],
              false
            ) as OptionArray
          );
        }
      },
      handleLoading,
    });
  }

  const handlePageChange = async (page: number): Promise<void> => {
    if (!optionKey) {
      console.error("optionKeyの不備:", optionKey);
      return Promise.resolve();
    }
    const route = optionRouteMap[optionKey];
    if (!route) {
      console.error("optionRouteMapの不備:", optionKey);
      return Promise.resolve();
    }

    await getOptionData(
      route,
      {
        page: page,
        filters: JSON.stringify(filterConditions),
        sorts: JSON.stringify(sortConditions),
      },
      optionKey as ModelType,
      fieldType
    );
  };

  useEffect(() => {
    if (!key) return;
    if (key !== optionKey && valueType === "option") {
      const nextOptionKey = getOptionKey(key, keyMap);
      setOptionKey(nextOptionKey);

      if (isModelType(nextOptionKey)) {
        const route = optionRouteMap[nextOptionKey];
        if (!route) {
          console.error("optionRouteMapの不備:", nextOptionKey);
          return;
        }

        getOptionData(
          route,
          {
            page: 1,
            filters: JSON.stringify(filterConditions),
            sorts: JSON.stringify(sortConditions),
          },
          nextOptionKey as ModelType,
          fieldType
        );
      } else if (isOptionType(nextOptionKey)) {
        if (fieldType === "table") {
          const newData = convertToOption(
            nextOptionKey,
            [],
            true
          ) as OptionTable;
          setOptionTableData({
            option: newData,
            page: 1,
            totalCount: newData.data.length,
            isLoading: false,
          });
        } else if (fieldType === "select") {
          setOptionSelectData(
            convertToOption(nextOptionKey, [], true) as OptionArray
          );
        }
      } else {
        console.error("未知のnextOptionKey:", nextOptionKey);
      }
    }
  }, [key]);

  if (fieldType === "table" && optionTableData)
    return (
      <>
        <div className="mb-2 text-gray-700">
          選択中: {formLabel[formDataKey as string] || "未選択"}
        </div>
        <CustomTableContainer
          headers={optionTableData.option.header}
          items={optionTableData.option.data}
          originalFilterField={
            optionKey && isModelType(optionKey)
              ? fieldDefinition[optionKey].filter(isFilterable)
              : undefined
          }
          originalSortField={
            optionKey && isModelType(optionKey)
              ? fieldDefinition[optionKey].filter(isSortable)
              : undefined
          }
          itemsLoading={optionTableData.isLoading}
          pageNum={optionTableData.page}
          totalCount={optionTableData.totalCount}
          form={true}
          onClick={(row: FormTypeMap[T][keyof FormTypeMap[T]]) => {
            handleFormData(formDataKey, row);
          }}
          selectedKey={
            typeof formData[formDataKey] === "string"
              ? [formData[formDataKey]]
              : []
          }
          handlePageChange={handlePageChange}
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
                placeholder="検索"
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
      />
    );
};
