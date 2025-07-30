import { createContext, ReactNode, useContext, useState } from "react";
import { GettedModelDataMap, ModelType } from "../types/models";
import { API_ROUTES } from "../lib/apiRoutes";
import { APIError, ResponseStatus } from "../types/api";
import axios from "axios";
import { Transfer, TransferGet } from "../types/models/transfer";
import { Injury, InjuryGet } from "../types/models/injury";
import { convert } from "../lib/convert/DBtoGetted";
import { useAlert } from "./alert-context";

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

  const [isLoading, _SetIsloading] = useState<boolean>(false);
  const [transfers, setTransfers] = useState<TransferGet[]>([]);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);

  const readItems = async (limit?: number) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await axios.get(API_ROUTES.TOP_PAGE.GET, {
        params: { limit },
      });
      const transfers = res.data.transferData as Transfer[];
      const injuries = res.data.injuryData as Injury[];

      setTransfers(convert(ModelType.TRANSFER, transfers));
      setInjuries(convert(ModelType.INJURY, injuries));

      alert = { success: true, message: res.data?.message };
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
    } finally {
      handleSetAlert(alert);
    }
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
