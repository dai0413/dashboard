import { useEffect, useState } from "react";
import { useCompetitionPanel, useTeamPanel } from "./index";
import { NATIONAL_TAB, NationalTab, UseNationalSummary } from "../types";
import { useCountry } from "../../../../context/models/country";

export const useNationalSummary = (id: string): UseNationalSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  const [selectedTab, setSelectedTab] = useState<NationalTab>(
    NATIONAL_TAB.COMPETITION,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalTab);
  };

  const { teams, readTeams } = useTeamPanel();
  const { competitions, readCompetitions } = useCompetitionPanel();

  const readDatas = async (countryId: string) => {
    await Promise.all([readTeams(countryId), readCompetitions(countryId)]);
  };

  // id変更で読み込む
  const onChangeId = async (competitionId: string) => {
    readDatas(competitionId);
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
      competition: {
        key: `${selectedTab}`,
        items: competitions.data,
        reloadFun: async () => readCompetitions(id),
      },

      team: {
        key: `${selectedTab}`,
        items: teams.data,
        reloadFun: async () => readTeams(id),
      },
    },
  };
};
