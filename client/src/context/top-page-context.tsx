import { createContext, ReactNode, useContext, useState } from "react";
import { GettedModelDataMap, ModelType } from "../types/models";
import { Transfer, TransferGet } from "../types/models/transfer";
import { Injury, InjuryGet } from "../types/models/injury";
import { convert } from "../lib/convert/DBtoGetted";
import { useAlert } from "./alert-context";
import { API_PATHS, ResBody } from "@myorg/shared";
import { readItemsBase } from "../lib/api";
import { useApi } from "./api-context";

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
  const api = useApi();
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transfers, setTransfers] = useState<TransferGet[]>([]);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const readItems = async (limit?: number) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_PATHS.TOP_PAGE.GET,
      params: limit ? { limit } : {},
      onSuccess: (
        data: ResBody<{ transferData: Transfer[]; injuryData: Injury[] }>
      ) => {
        const transfers = data.data.transferData as Transfer[];
        const injuries = data.data.injuryData as Injury[];

        setTransfers(convert(ModelType.TRANSFER, transfers));
        setInjuries(convert(ModelType.INJURY, injuries));
      },
      handleLoading: handleLoading,
      handleSetAlert: handleSetAlert,
    });

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
