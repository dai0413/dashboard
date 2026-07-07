import { Pitch } from "./Pitch";
import { PlayerMarker } from "./PlayerMarker";
import { FormationItem } from "../../types/formation";

type FormationParams = {
  datas: FormationItem[];
};

export const Formation = ({ datas }: FormationParams) => {
  return (
    <div className="relative h-[550px] w-[550px]">
      <Pitch />

      {datas.map((data, i) => {
        return <PlayerMarker key={i} {...data} />;
      })}
    </div>
  );
};
