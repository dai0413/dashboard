import { StaffMatchEventLogForm } from "../../types/models/staff-match-event-log";
import { ModelType } from "../../types/models";
import { Confirm } from "./Confirm";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";
import { countFn } from "./utils/countFun";
import { RenderTeamCount } from "./utils/renderTeamCount";

export const staffMatchEventLog = (formDatas: StaffMatchEventLogForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: StaffMatchEventLogForm) => boolean,
    options?: RenderLineOptions<ModelType.STAFF_MATCH_EVENT_LOG>,
  ) =>
    RenderLine<ModelType.STAFF_MATCH_EVENT_LOG>(
      formDatas,
      label,
      filterFn,
      options,
    );

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, {
        countFn: (d: StaffMatchEventLogForm[]) => countFn(d, "match"),
      })}
      {renderLine("登録済みスタッフ", (d) => !!d.staff, {
        renderContent: RenderTeamCount,
      })}
      {renderLine("登録外スタッフ", (d) => !!d.staff_name, {
        renderContent: RenderTeamCount,
      })}
    </Confirm>
  );
};
