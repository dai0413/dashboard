import { useEffect, useState } from "react";
import {
  useInjuryPanel,
  useNationalCallupPanel,
  usePlayerRegistrationPanel,
  usePositionPanel,
  useTransferPanel,
} from "./index";
import { PLAYER_TAB, PlayerTab, UsePlayerSummary } from "../types";
import { usePlayer } from "../../../../context/models/player";

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
  const { positions, readPositions } = usePositionPanel();
  const { transfers, readTransfers } = useTransferPanel();

  const readDatas = async (playerId: string) => {
    await Promise.all([
      readinjuries(playerId),
      readNationalCallups(playerId),
      readPlayerRegistrations(playerId),
      readPositions(playerId),
      readTransfers(playerId),
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
        reloadFun: async () => readNationalCallups(id),
      },

      position: {
        key: `${selectedTab}`,
        items: positions,
        reloadFun: async () => readPositions(id),
      },
      transfer: {
        key: `${selectedTab}`,
        items: transfers.data,
        reloadFun: async () => readTransfers(id),
      },
      injury: {
        key: `${selectedTab}`,
        items: injuries.data,
        reloadFun: async () => readinjuries(id),
      },
      playerRegistration: {
        key: `${selectedTab}`,
        items: playerRegistrations.data,
        reloadFun: async () => readPlayerRegistrations(id),
      },
    },
  };
};
