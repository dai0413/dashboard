import { createContext, ReactNode, useContext, useState } from "react";
import { GettedModelDataMap, ModelType } from "../types/models";
import { Transfer, TransferGet } from "../types/models/transfer";
import { Injury, InjuryGet } from "../types/models/injury";
import { convert } from "../lib/convert/DBtoGetted";
import { useAlert } from "./alert-context";
import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../lib/api";
import { api } from "./api-context";

type TopPageStage = {
  isLoading: boolean;
  transfers: GettedModelDataMap[ModelType.TRANSFER][];
  injuries: GettedModelDataMap[ModelType.INJURY][];
  readItems: (limit?: number) => Promise<void>;
};
const defaultValue: TopPageStage = {
  isLoading: false,
  transfers: [],
  injuries: [],
  readItems: async () => {},
};

const TopPageContext = createContext<TopPageStage>(defaultValue);

const TopPageProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transfers, setTransfers] = useState<TransferGet[]>([]);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const readItems = async (limit?: number) => {
    const obj = await readItemsBase<{
      transferData: Transfer[];
      injuryData: Injury[];
    }>({
      apiInstance: api,
      backendRoute: API_PATHS.TOP_PAGE.GET,
      params: limit ? { limit } : {},
      handleLoading: handleLoading,
      handleSetAlert: handleSetAlert,
    });

    if (!obj) return;

    const transfers = obj.data.transferData;
    const injuries = obj.data.injuryData;

    setTransfers(convert(ModelType.TRANSFER, transfers));
    setInjuries(convert(ModelType.INJURY, injuries));
  };

  const value = { isLoading, transfers, injuries, readItems };

  return (
    <TopPageContext.Provider value={value}>{children}</TopPageContext.Provider>
  );
};

const useTopPage = () => {
  const context = useContext(TopPageContext);
  if (!context) {
    throw new Error("useTopPage must be used within a TopPageProvider");
  }
  return context;
};

export { TopPageProvider, useTopPage };
