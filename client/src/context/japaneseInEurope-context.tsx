import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { readItemsBase } from "../lib/api";
import { api } from "./api-context";
import { NationalitySquadResult } from "../types/japaneseInEurope";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Country } from "../types/models/country";
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

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

const getSeasonRange = (date = new Date()) => {
  const year = date.getFullYear();

  // 7月以降なら今年、6月以前なら前年がシーズン開始年
  const startYear = date.getMonth() >= 6 ? year : year - 1;

  return {
    seasonStart: new Date(startYear, 6, 1),
    seasonEnd: new Date(startYear + 1, 5, 30),
  };
};

const { seasonStart, seasonEnd } = getSeasonRange();

const JapaneseInEuropePageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLoading = (time: "start" | "end"): void => {
    time === "start" ? setIsLoading(true) : setIsLoading(false);
  };

  const [targetCountryIds, setTargetCountryIds] = useState<string[]>([]);
  const [isCountryLoaded, setIsCountryLoaded] = useState(false);

  const [datas, setDatas] = useState<NationalitySquadResult[]>([]);

  // 1. ヨーロッパの国を取得
  useEffect(() => {
    const readCountries = async () => {
      const res = await readItemsBase<Country[]>({
        apiInstance: api,
        backendRoute: API_PATHS.COUNTRY.ROOT,
        params: {
          area: "ヨーロッパ",
          getAll: true,
        },
      });

      if (res?.data) {
        setTargetCountryIds(res.data.map((d) => d._id));
      }

      setIsCountryLoaded(true);
    };

    void readCountries();
  }, []);

  // 2. 国の取得が完了してから集計 API を呼び出す
  const readItems = useCallback(async () => {
    if (!isCountryLoaded) return;

    handleLoading("start");

    try {
      const obj = await readItemsBase<NationalitySquadResult[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.NATIONALITY_SQUAD,
        params: {
          targetCountryIds,
          citizenshipIds: [japan],
          seasonStart,
          seasonEnd,
        },
        handleSetAlert,
      });

      if (obj) {
        setDatas(obj.data);
      }
    } finally {
      handleLoading("end");
    }
  }, [isCountryLoaded, targetCountryIds]);

  useEffect(() => {
    if (!isCountryLoaded) return;

    if (targetCountryIds.length === 0) return;

    void readItems();
  }, [readItems]);

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
