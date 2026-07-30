import { useEffect, useMemo, useState } from "react";
import { useNationalCallupPanel, useMatchPanel } from "./index";
import {
  NATIONAL_MATCH_SERIES_TAB,
  NationalMatchSeriesTab,
  UseNationalMatchSeriesSummary,
} from "../types";
import { useNationalMatchSeries } from "../../../../context/models/national-match-series";

export const useNationalMatchSeriesSummary = (
  id: string,
): UseNationalMatchSeriesSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useNationalMatchSeries();

  const matchIds = useMemo(() => {
    return (
      selected?.matches
        ?.map((d) => d.id)
        .filter((d): d is string => typeof d === "string") ?? []
    );
  }, [selected]);

  const [selectedTab, setSelectedTab] = useState<NationalMatchSeriesTab>(
    NATIONAL_MATCH_SERIES_TAB.NATIONAL_CALLUP,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalMatchSeriesTab);
  };

  const { matches, readMatches } = useMatchPanel();
  const { nationalCallups, readNationalCallups } = useNationalCallupPanel();

  const readDatas = async (matchIds: string[], seriesId: string) => {
    await Promise.all([readMatches(matchIds), readNationalCallups(seriesId)]);
  };

  // id変更で読み込む
  const onChangeId = async (matchIds: string[], seriesId: string) => {
    readDatas(matchIds, seriesId);
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
        await onChangeId(matchIds, id);
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
      nationalCallup: {
        key: `${selectedTab}`,
        items: nationalCallups.data,
        reloadFun: async () => readNationalCallups(id),
      },

      match: {
        key: `${selectedTab}`,
        items: matches.data,
        reloadFun: async () => readMatches(matchIds),
      },
    },
  };
};
