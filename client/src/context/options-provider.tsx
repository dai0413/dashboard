import { createContext, useCallback, useContext } from "react";

import {
  FormTypeMap,
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../types/models";
import { convert as convertToOption, OptionsMap } from "../utils/createOption";
import { convert as createLabel } from "../lib/convert/CreateLabel";
import { OptionArray, OptionTable } from "../types/option";

import { BaseCrudRoutes } from "../types/baseCrudRoutes";
import { readItemsBase } from "../lib/api/readItems";
import { useApi } from "./api-context";
import { convert } from "../lib/convert/DBtoGetted";
import { FormFieldDefinition } from "../types/form";
import { isModelType, isOptionType } from "../types/field";
import { readItemBase } from "../lib/api";
import {
  API_PATHS,
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
} from ""@dai0413/myorg-shared";

type OptionsState = {
  handlePageChange: <T extends ModelType>(
    page: number,
    fieldType: FormFieldDefinition<T>["fieldType"],
    filters: FilterableFieldDefinition[],
    sorts: SortableFieldDefinition[],
    optionKey: keyof GettedModelDataMap | keyof OptionsMap | null,
    setOptionTableData: (
      value: React.SetStateAction<{
        option: OptionTable;
        page?: number;
        totalCount?: number;
        isLoading: boolean;
      } | null>
    ) => void,
    setOptionSelectData: (
      value: React.SetStateAction<OptionArray | null>
    ) => void
  ) => Promise<void>;
  updateOption: <T extends ModelType>(
    key: FormFieldDefinition<T>["key"],
    fieldType: FormFieldDefinition<T>["fieldType"],
    filters: FilterableFieldDefinition[],
    sorts: SortableFieldDefinition[],
    setOptionKey?: (
      value: React.SetStateAction<
        keyof GettedModelDataMap | keyof OptionsMap | null
      >
    ) => void,
    setOptionTableData?: (
      value: React.SetStateAction<{
        option: OptionTable;
        page?: number;
        totalCount?: number;
        isLoading: boolean;
      } | null>
    ) => void,
    setOptionSelectData?: (
      value: React.SetStateAction<OptionArray | null>
    ) => void
  ) => void;

  getLabelById: <T extends ModelType>(
    optionKey: T,
    id: string
  ) => Promise<string | undefined>;
};

const OptionContext = createContext<OptionsState>({
  handlePageChange: () => Promise.resolve(),
  updateOption: () => {},
  getLabelById: async () => undefined,
});

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

const OptionProvider = ({ children }: { children: React.ReactNode }) => {
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

  const handleLoading = (
    time: "end" | "start",
    setOptionTableData: (
      value: React.SetStateAction<{
        option: OptionTable;
        page?: number;
        totalCount?: number;
        isLoading: boolean;
      } | null>
    ) => void
  ): void => {
    setOptionTableData((prev) => ({
      ...(prev ?? { option: { data: [], header: [] }, page: 1, totalCount: 0 }),
      isLoading: time === "start",
    }));
  };

  const api = useApi();

  async function getLabelById<T extends ModelType>(
    optionKey: T,
    id: string
  ): Promise<string | undefined> {
    const key = getOptionKey(optionKey);

    if (!isModelType(key)) {
      console.error("optionKeyの不備:", key);
      return;
    }

    const route = optionRouteMap[key].DETAIL(id);
    if (!route) {
      console.error("optionRouteMapの不備:", key);
      return;
    }

    let fetchedItem: string | null = null;

    await readItemBase({
      apiInstance: api,
      backendRoute: route,
      onSuccess: (data: ModelDataMap[T]) => {
        fetchedItem = createLabel(key, data);
      },
    });

    return fetchedItem ?? undefined;
  }

  async function getOptionData<T extends ModelType>(
    route: string,
    params: QueryParams,
    optionKey: T,
    fieldType: "input" | "select" | "textarea" | "table",
    setOptionTableData?: (
      value: React.SetStateAction<{
        option: OptionTable;
        page?: number;
        totalCount?: number;
        isLoading: boolean;
      } | null>
    ) => void,
    setOptionSelectData?: (
      value: React.SetStateAction<OptionArray | null>
    ) => void
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
            getted as unknown as OptionsMap[T],
            true
          ) as OptionTable,
          page: data.page,
          totalCount: data.totalCount,
          isLoading: false,
        };

        if (fieldType === "table") {
          setOptionTableData && setOptionTableData(optionTableData);
        } else if (fieldType === "select") {
          setOptionSelectData &&
            setOptionSelectData(
              convertToOption(
                optionKey,
                getted as unknown as OptionsMap[T],
                false
              ) as OptionArray
            );
        }
      },
      handleLoading: setOptionTableData
        ? (time) => handleLoading(time, setOptionTableData)
        : undefined,
    });
  }

  const handlePageChange = useCallback(
    async <T extends ModelType>(
      page: number,
      fieldType: FormFieldDefinition<T>["fieldType"],
      filters: FilterableFieldDefinition[],
      sorts: SortableFieldDefinition[],
      optionKey: keyof GettedModelDataMap | keyof OptionsMap | null,
      setOptionTableData: (
        value: React.SetStateAction<{
          option: OptionTable;
          page?: number;
          totalCount?: number;
          isLoading: boolean;
        } | null>
      ) => void,
      setOptionSelectData: (
        value: React.SetStateAction<OptionArray | null>
      ) => void
    ): Promise<void> => {
      if (!optionKey) {
        console.error("optionKeyの不備:", optionKey);
        return Promise.resolve();
      }
      const route = optionRouteMap[optionKey].ROOT;
      if (!route) {
        console.error("optionRouteMapの不備:", optionKey);
        return Promise.resolve();
      }

      await getOptionData(
        route,
        {
          page: page,
          filters: JSON.stringify(filters),
          sorts: JSON.stringify(sorts),
        },
        optionKey as ModelType,
        fieldType,
        setOptionTableData,
        setOptionSelectData
      );
    },
    [optionRouteMap, getOptionData]
  );

  const updateOption = <T extends ModelType>(
    key: FormFieldDefinition<T>["key"],
    fieldType: FormFieldDefinition<T>["fieldType"],
    filters: FilterableFieldDefinition[],
    sorts: SortableFieldDefinition[],
    setOptionKey?: (
      value: React.SetStateAction<
        keyof GettedModelDataMap | keyof OptionsMap | null
      >
    ) => void,
    setOptionTableData?: (
      value: React.SetStateAction<{
        option: OptionTable;
        page?: number;
        totalCount?: number;
        isLoading: boolean;
      } | null>
    ) => void,
    setOptionSelectData?: (
      value: React.SetStateAction<OptionArray | null>
    ) => void
  ): void => {
    const nextOptionKey = getOptionKey(key);
    setOptionKey && setOptionKey(nextOptionKey);

    if (isModelType(nextOptionKey)) {
      const route = optionRouteMap[nextOptionKey].ROOT;
      if (!route) {
        console.error("optionRouteMapの不備:", nextOptionKey);
        return;
      }

      getOptionData(
        route,
        {
          page: 1,
          filters: JSON.stringify(filters),
          sorts: JSON.stringify(sorts),
        },
        nextOptionKey as ModelType,
        fieldType,
        setOptionTableData,
        setOptionSelectData
      );
    } else if (isOptionType(nextOptionKey)) {
      if (fieldType === "table") {
        const newData = convertToOption(nextOptionKey, [], true) as OptionTable;
        setOptionTableData &&
          setOptionTableData({
            option: newData,
            page: 1,
            totalCount: newData.data.length,
            isLoading: false,
          });
      } else if (fieldType === "select") {
        setOptionSelectData &&
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
        handlePageChange,
        updateOption,
        getLabelById,
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
