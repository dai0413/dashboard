import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "./alert-context";
import { readItemsBase } from "../lib/api";
import { api } from "./api-context";
import { NationalitySquadResult } from "../types/japaneseInEurope";
import { API_PATHS } from "@dai0413/myorg-shared";

type Context = {
  isLoading: boolean;
  datas: NationalitySquadResult[];
  readItems: () => Promise<void>;
};
const defaultValue: Context = {
  isLoading: false,
  datas: [],
  readItems: async () => {},
};

const JapaneseInEuropeContext = createContext<Context>(defaultValue);

const JapaneseInEuropePageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [datas, setDatas] = useState<NationalitySquadResult[]>([]);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const readItems = async () => {
    handleLoading("start");

    const obj = await readItemsBase<NationalitySquadResult[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.NATIONALITY_SQUAD,
      handleSetAlert: handleSetAlert,
    });

    if (!obj) return handleLoading("end");

    setDatas(obj.data);

    handleLoading("end");
  };

  const value = {
    isLoading,
    datas,

    readItems,
  };

  return (
    <JapaneseInEuropeContext.Provider value={value}>
      {children}
    </JapaneseInEuropeContext.Provider>
  );
};

const useJapaneseInEuropePage = () => {
  const context = useContext(JapaneseInEuropeContext);
  if (!context) {
    throw new Error(
      "useJapaneseInEuropePage must be used within a JapaneseInEuropePageProvider",
    );
  }
  return context;
};

export { JapaneseInEuropePageProvider, useJapaneseInEuropePage };
