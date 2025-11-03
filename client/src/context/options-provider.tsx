import { createContext, useContext, useState } from "react";

import { FormTypeMap, ModelType } from "../types/models";
import { convert as convertToOption, OptionsMap } from "../utils/createOption";
import { OptionArray, OptionTable } from "../types/option";

import { useFilter } from "./filter-context";
import { useSort } from "./sort-context";
import { API_ROUTES, CrudRouteWithParams } from "../lib/apiRoutes";
import { QueryParams, readItemsBase } from "../lib/api/readItems";
import { useApi } from "./api-context";
import { convert } from "../lib/convert/DBtoGetted";
import { FieldDefinition } from "../types/form";
import { isModelType, isOptionType } from "../types/field";

type OptionsState = {
  optionKey: keyof OptionsMap | null;
  optionTableData: {
    option: OptionTable;
    page: number;
    totalCount: number;
    isLoading: boolean;
  } | null;
  optionSelectData: OptionArray | null;
  handlePageChange: <T extends ModelType>(
    page: number,
    fieldType: FieldDefinition<T>["fieldType"]
  ) => Promise<void>;
  updateOption: <T extends ModelType>(
    key: FieldDefinition<T>["key"],
    fieldType: FieldDefinition<T>["fieldType"]
  ) => void;
};

const OptionContext = createContext<OptionsState>({
  optionKey: null,
  optionTableData: null,
  optionSelectData: null,
  handlePageChange: () => Promise.resolve(),
  updateOption: () => {},
});

const OptionProvider = ({ children }: { children: React.ReactNode }) => {
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
      ...(prev ?? { option: { data: [], header: [] }, page: 1, totalCount: 0 }),
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

  const handlePageChange = async <T extends ModelType>(
    page: number,
    fieldType: FieldDefinition<T>["fieldType"]
  ): Promise<void> => {
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

  const updateOption = <T extends ModelType>(
    key: FieldDefinition<T>["key"],
    fieldType: FieldDefinition<T>["fieldType"]
  ): void => {
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
        const newData = convertToOption(nextOptionKey, [], true) as OptionTable;
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
  };

  return (
    <OptionContext.Provider
      value={{
        optionKey,
        optionTableData,
        optionSelectData,
        handlePageChange,
        updateOption,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
};

const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOptions must be used within a PlayerProvider");
  }
  return context;
};

export { useOptions, OptionProvider };
