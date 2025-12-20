import { createContext, useContext } from "react";

import { FormTypeMap, ModelDataMap, ModelType } from "../types/models";
import { OptionsMap } from "../utils/createOption";
import { convert as createLabel } from "../lib/convert/CreateLabel";

import { BaseCrudRoutes } from "../types/baseCrudRoutes";
import { useApi } from "./api-context";
import { isModelType } from "../types/field";
import { readItemBase } from "../lib/api";
import { API_PATHS } from "@dai0413/myorg-shared";

type OptionsState = {
  getLabelById: <T extends ModelType>(
    optionKey: T,
    id: string
  ) => Promise<string | undefined>;
};

const OptionContext = createContext<OptionsState>({
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

  return (
    <OptionContext.Provider
      value={{
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
