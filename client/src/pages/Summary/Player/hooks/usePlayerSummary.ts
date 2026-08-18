import { useEffect, useMemo, useState } from "react";
import {
  useInjuryPanel,
  useNationalCallupPanel,
  usePlayerRegistrationPanel,
  useStatisticsPanel,
  useTransferPanel,
} from "./index";
import { PLAYER_TAB, PlayerTab, UsePlayerSummary } from "../types";
import { usePlayer } from "../../../../context/models/player";
import { FormationItem } from "../../../../types/formation";
import { positionBase } from "../../../../components/formation/positionBase";

export const usePlayerSummary = (id: string): UsePlayerSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = usePlayer();

  const [selectedTab, setSelectedTab] = useState<PlayerTab>(
    PLAYER_TAB.TRANSFER,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as PlayerTab);
  };

  const { injuries, readinjuries } = useInjuryPanel();
  const { nationalCallups, readNationalCallups } = useNationalCallupPanel();
  const { playerRegistrations, readPlayerRegistrations } =
    usePlayerRegistrationPanel();
  const { transfers, readTransfers } = useTransferPanel();
  const { statistics, readStatistics } = useStatisticsPanel();

  const positions: FormationItem[] = useMemo(() => {
    const result: FormationItem[] = [];

    statistics.data.forEach((statistic) => {
      for (const [key, value] of Object.entries(statistic.positionCounts)) {
        const point = positionBase[key as keyof typeof positionBase];

        result.push({
          position: key as FormationItem["position"],
          centerText: value,
          label: key,
          size: 24 + ((value || 0) / statistic.appearances) * 28,
          color: point.color,
          tooltip: [
            { text: key, bold: true },
            {
              text: `${value}試合`,
            },
          ],
        });
      }
    });

    return result;
  }, [statistics]);

  const readDatas = async (playerId: string) => {
    await Promise.all([
      readinjuries(playerId),
      readNationalCallups(playerId),
      readPlayerRegistrations(playerId),
      readTransfers(playerId),
      readStatistics(playerId),
    ]);
  };

  // id変更で読み込む
  const onChangeId = async (playerId: string) => {
    readDatas(playerId);
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
      nationalCallup: {
        key: `${selectedTab}`,
        items: nationalCallups.data,
        isLoading: nationalCallups.isLoading,
        reloadFun: async () => readNationalCallups(id),
      },

      position: {
        key: `${selectedTab}`,
        items: positions,
        isLoading: statistics.isLoading,
        reloadFun: async () => readStatistics(id),
      },
      transfer: {
        key: `${selectedTab}`,
        items: transfers.data,
        isLoading: transfers.isLoading,
        reloadFun: async () => readTransfers(id),
      },
      injury: {
        key: `${selectedTab}`,
        items: injuries.data,
        isLoading: injuries.isLoading,
        reloadFun: async () => readinjuries(id),
      },
      playerRegistration: {
        key: `${selectedTab}`,
        items: playerRegistrations.data,
        isLoading: playerRegistrations.isLoading,
        reloadFun: async () => readPlayerRegistrations(id),
      },
      statistics: {
        key: `${selectedTab}`,
        items: statistics.data,
        isLoading: statistics.isLoading,
        reloadFun: async () => readStatistics(id),
      },
    },
  };
};
