import { PlayerMatchEventLogForm } from "../../types/models/player-match-event-log";
import { ModelType } from "../../types/models";
import { Confirm } from "./Confirm";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";
import { countFn } from "./utils/countFun";
import { RenderTeamCount } from "./utils/renderTeamCount";

export const playerMatchEventLog = (formDatas: PlayerMatchEventLogForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: PlayerMatchEventLogForm) => boolean,
    options?: RenderLineOptions<ModelType.PLAYER_MATCH_EVENT_LOG>,
  ) =>
    RenderLine<ModelType.PLAYER_MATCH_EVENT_LOG>(
      formDatas,
      label,
      filterFn,
      options,
    );

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, {
        countFn: (d: PlayerMatchEventLogForm[]) => countFn(d, "match"),
      })}
      {renderLine("登録済み選手", (d) => !!d.player, {
        renderContent: RenderTeamCount,
      })}
      {renderLine("登録外選手", (d) => !!d.player_name, {
        renderContent: RenderTeamCount,
      })}
    </Confirm>
  );
};
