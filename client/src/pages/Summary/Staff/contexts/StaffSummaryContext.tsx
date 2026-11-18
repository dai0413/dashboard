import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  STAFF_TAB,
  StaffSummaryCache,
  StaffTab,
  UseStaffSummary,
} from "../types";
import { useStaffRegistrationPanel } from "../hooks";
import { useStaffSummaryCache } from "../hooks/useStaffSummaryCache";
import { useStaff } from "../../../../context/models/staff";

const StaffSummaryContext = createContext<UseStaffSummary | null>(null);

type Props = {
  children: React.ReactNode;
};

const DEFAULT_TAB = STAFF_TAB.STAFF_REGISTRATION;

export const StaffSummaryProvider = ({ children }: Props) => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useStaff();

  const [selectedTab, setSelectedTab] = useState<StaffTab>(DEFAULT_TAB);

  const [loadedPlaeyrId, setLoadedPlaeyrId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useStaffSummaryCache();

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as StaffTab);
  };

  const { staffRegistrations, readStaffRegistrations, setStaffRegistrations } =
    useStaffRegistrationPanel();

  const restoreCache = useCallback(
    (cached: Partial<StaffSummaryCache>) => {
      if (cached.staffRegistration !== undefined) {
        setStaffRegistrations(cached.staffRegistration);
      }
    },
    [setStaffRegistrations],
  );

  // id変更, season変更両方で読み込む
  const readDatas = useCallback(
    async (staffId: string): Promise<Partial<StaffSummaryCache>> => {
      const [staffRegistration] = await Promise.all([
        readStaffRegistrations(staffId),
      ]);

      return {
        ...(staffRegistration && { staffRegistration }),
      };
    },
    [selected?._id, readStaffRegistrations],
  );

  const latestIdRef = useRef<string | null>(null);

  const fetchPlaeyrData = useCallback(
    async (id: string) => {
      setLoadedPlaeyrId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      if (isStale()) return;

      const result = await readDatas(id);

      // 取得できたデータは正しいのでキャッシュには残す
      saveCache(id, { ...result });

      if (isStale()) return; // 状態への反映だけやめる
      setLoadedPlaeyrId(id);
    },
    [selected?._id, readItem, readDatas, saveCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedPlaeyrId === id) {
        return;
      }

      const cached = getCache(id);

      if (cached && isCacheComplete(id)) {
        if (selected?._id !== id) {
          await readItem(id);
        }

        if (latestIdRef.current !== id) return;

        setSelectedTab(DEFAULT_TAB);
        restoreCache(cached);
        setLoadedPlaeyrId(id);
        return;
      }

      await fetchPlaeyrData(id);
    },
    [
      loadedPlaeyrId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchPlaeyrData,
    ],
  );

  const reloadAndCache = async <K extends keyof StaffSummaryCache>(
    key: K,
    read: () => Promise<StaffSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedPlaeyrId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<StaffSummaryCache>);
  };

  const value: UseStaffSummary = {
    id: loadedPlaeyrId,
    isLoading,
    selected,
    activateId,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      staffRegistration: {
        key: `${selectedTab}`,
        isLoading: staffRegistrations.isLoading,
        items: staffRegistrations.data,
        reloadFun: () =>
          reloadAndCache("staffRegistration", () =>
            readStaffRegistrations(loadedPlaeyrId!),
          ),
      },
    },
  };

  return (
    <StaffSummaryContext.Provider value={value}>
      {children}
    </StaffSummaryContext.Provider>
  );
};

export const useStaffSummary = () => {
  const context = useContext(StaffSummaryContext);

  if (!context) {
    throw new Error("useStaffSummary must be used within StaffSummaryProvider");
  }

  return context;
};
