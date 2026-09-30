import { Pitch } from "./Pitch";
import { PositionPlayerList } from "./PositionPlayerList";
import QuickFilterTabs from "../dataView/DataViewToolbar/QuickFilterTabs";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { FormationCounts } from "../../pages/Summary/Team/ClubTeam/types";
import { useMemo, useState } from "react";
import { getGroupedPositions } from "../dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { displayPositions } from "../dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { createGroupedPlayers } from "../dataView/DataViewContent/DataView/Matrix/utils";

type PositionPlayersProps = {
  formationCounts: FormationCounts[];
  playerStatistics: PlayerStatistic[];
};

export const PositionPlayers = ({
  formationCounts,
  playerStatistics,
}: PositionPlayersProps) => {
  const [selectedFormation, setSelectedFormation] =
    useState<FormationCounts | null>(formationCounts[0]);

  const quickFilterItems = useMemo(() => {
    const items = formationCounts.map((formationCount) => {
      return {
        key: formationCount.key,
        value: formationCount,
        label: `${formationCount.name}  (${formationCount.count})`,
        onclick: setSelectedFormation,
      };
    });

    return items;
  }, [formationCounts]);

  const positionOptions = useMemo(() => {
    return getGroupedPositions(
      selectedFormation
        ? selectedFormation.position_formation
        : displayPositions.map((d) => d.key),
    );
  }, [selectedFormation]);

  const groupedPlayers = useMemo(() => {
    return createGroupedPlayers(playerStatistics, positionOptions);
  }, [selectedFormation, playerStatistics, positionOptions]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full">
        <QuickFilterTabs
          items={quickFilterItems}
          selectedKey={selectedFormation?.key}
          onSelect={(item) => {
            const nextItem = quickFilterItems.find(
              (quickFilterItem) => quickFilterItem.key === item.key,
            )?.value;

            if (!nextItem) return;

            setSelectedFormation((current) =>
              current === nextItem ? null : nextItem,
            );
          }}
        />
      </div>

      <div className="relative h-[800px] w-[800px] rounded-md border border-gray-300">
        <Pitch />

        {groupedPlayers.map(({ key, ...data }) => (
          <PositionPlayerList key={key} {...data} />
        ))}
      </div>
    </div>
  );
};
