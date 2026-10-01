import { Pitch } from "./Pitch";
import { PositionPlayerList } from "./PositionPlayerList";
import { GroupedPlayers } from "../dataView/DataViewContent/DataView/Matrix/type";

type PositionPlayersProps = {
  groupedPlayers: GroupedPlayers[];
};

export const PositionPlayers = ({ groupedPlayers }: PositionPlayersProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-[800px] w-[800px] rounded-md border border-gray-300">
        <Pitch />

        {groupedPlayers.map(({ key, ...data }) => (
          <PositionPlayerList key={key} {...data} />
        ))}
      </div>
    </div>
  );
};
