import { PlayerAppearanceForm } from "../../types/models/player-appearance";
import { Confirm } from "./Confirm";
import { ModelType } from "../../types/models";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";

export const playerAppearance = (formDatas: PlayerAppearanceForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: PlayerAppearanceForm) => boolean,
    options?: RenderLineOptions<ModelType.PLAYER_APPEARANCE>,
  ) =>
    RenderLine<ModelType.PLAYER_APPEARANCE>(
      formDatas,
      label,
      filterFn,
      options,
    );

  const countFn = (d: PlayerAppearanceForm[]) => {
    return new Set(d.map((d) => d.match)).size;
  };

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, { countFn })}
      {renderLine("登録済み選手", (d) => !!d.player)}
      {renderLine("登録外選手", (d) => !!d.player_name)}
    </Confirm>
  );
};
