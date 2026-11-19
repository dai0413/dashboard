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

  const [loadedStaffId, setLoadedStaffId] = useState<string | null>(null);

  const { getCache, saveCache, isCacheComplete } = useStaffSummaryCache();

  const handleSelectedTab = useCallback(
    (value: string | number | Date | undefined) => {
      const tab = value as StaffTab;
      setSelectedTab(tab);

      if (loadedStaffId) {
        saveCache(loadedStaffId, { selectedTab: tab });
      }
    },
    [loadedStaffId, saveCache],
  );

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

  const fetchStaffData = useCallback(
    async (id: string) => {
      setLoadedStaffId(null); // 読み込み中は「未確定」にする
      const isStale = () => latestIdRef.current !== id;

      if (selected?._id !== id) {
        await readItem(id);
        if (isStale()) return;
      }

      if (isStale()) return;

      const result = await readDatas(id);
      const selectedTab = getCache(id)?.selectedTab ?? DEFAULT_TAB;
      const cache = {
        ...result,
        selectedTab,
      };

      saveCache(id, cache);

      if (isStale()) return;
      setLoadedStaffId(id);
    },
    [selected?._id, readItem, readDatas, saveCache, getCache],
  );

  const activateId = useCallback(
    async (id: string) => {
      latestIdRef.current = id;

      if (loadedStaffId === id) {
        return;
      }

      setSelectedTab(getCache(id)?.selectedTab ?? DEFAULT_TAB);
      const cached = getCache(id);

      if (cached && isCacheComplete(id)) {
        if (selected?._id !== id) {
          await readItem(id);
        }

        if (latestIdRef.current !== id) return;

        restoreCache(cached);
        setLoadedStaffId(id);
        return;
      }

      await fetchStaffData(id);
    },
    [
      loadedStaffId,
      selected?._id,
      getCache,
      isCacheComplete,
      readItem,
      restoreCache,
      fetchStaffData,
    ],
  );

  const reloadAndCache = async <K extends keyof StaffSummaryCache>(
    key: K,
    read: () => Promise<StaffSummaryCache[K] | null | undefined>,
  ) => {
    const id = loadedStaffId;
    if (!id) return;

    const result = await read();
    if (!result) return;

    if (latestIdRef.current !== id) return;

    saveCache(id, {
      [key]: result,
    } as Partial<StaffSummaryCache>);
  };

  const value: UseStaffSummary = {
    id: loadedStaffId,
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
            readStaffRegistrations(loadedStaffId!),
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
