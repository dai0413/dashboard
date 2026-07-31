import { useEffect, useState } from "react";
import { useStaffRegistrationPanel } from "./index";
import { STAFF_TAB, StaffTab, UseStaffSummary } from "../types";
import { useStaff } from "../../../../context/models/staff";

export const useStaffSummary = (id: string): UseStaffSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useStaff();

  const [selectedTab, setSelectedTab] = useState<StaffTab>(
    STAFF_TAB.STAFF_REGISTRATION,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as StaffTab);
  };

  const { staffRegistrations, readStaffRegistrations } =
    useStaffRegistrationPanel();

  const readDatas = async (staffId: string) => {
    await Promise.all([readStaffRegistrations(staffId)]);
  };

  // id変更で読み込む
  const onChangeId = async (staffId: string) => {
    readDatas(staffId);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (id) {
        await onChangeId(id);
      }
    })();
  }, [selected]);

  return {
    id,
    isLoading,
    selected,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      staffRegistration: {
        key: `${selectedTab}`,
        items: staffRegistrations.data,
        reloadFun: async () => readStaffRegistrations(id),
      },
    },
  };
};
