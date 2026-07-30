import { useEffect, useState } from "react";
import { RefereeTab, UseRefereeSummary } from "../types";
import { useReferee } from "../../../../context/models/referee";

export const useRefereeSummary = (id: string): UseRefereeSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useReferee();

  const [selectedTab, setSelectedTab] = useState<RefereeTab | null>(null);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as RefereeTab);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  return {
    id,
    isLoading,
    selected,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {},
  };
};
