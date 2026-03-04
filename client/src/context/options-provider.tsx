import { createContext, useContext } from "react";

import { ModelDataMap, ModelType } from "../types/models";
import { convert as createLabel } from "../lib/convert/CreateLabel";

import { api } from "./api-context";
import { isModelType } from "../types/field";
import { readItemBase } from "../lib/api";
import { optionRouteMap, getOptionKey } from "../lib/options";

type OptionsState = {
  getLabelById: <T extends ModelType>(
    optionKey: T,
    id: string,
  ) => Promise<string | undefined>;
};

const OptionContext = createContext<OptionsState>({
  getLabelById: async () => undefined,
});

const OptionProvider = ({ children }: { children: React.ReactNode }) => {
  async function getLabelById<T extends ModelType>(
    optionKey: T,
    id: string,
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
