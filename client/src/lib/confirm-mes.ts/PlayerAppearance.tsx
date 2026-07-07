import { PlayerAppearanceForm } from "../../types/models/player-appearance";
import { Confirm } from "./Confirm";
import { ModelType } from "../../types/models";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";
import { countFn } from "./utils/countFun";
import { RenderTeamCount } from "./utils/RenderTeamCount";

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

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, {
        countFn: (d: PlayerAppearanceForm[]) => countFn(d, "match"),
      })}
      {renderLine("登録済み選手", (d) => !!d.player, {
        renderContent: RenderTeamCount,
      })}
      {renderLine("登録外選手", (d) => !!d.player_name, {
        renderContent: RenderTeamCount,
      })}
      {renderLine("ポジション持ち選手", (d) => !!d.position, {
        renderContent: RenderTeamCount,
      })}
    </Confirm>
  );
};
