import { StaffMatchEventLogForm } from "../../types/models/staff-match-event-log";
import { ModelType } from "../../types/models";
import { Confirm } from "./Confirm";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";

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

  const countFn = (d: StaffMatchEventLogForm[]) => {
    return new Set(d.map((d) => d.match)).size;
  };

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, { countFn })}
      {renderLine("登録済みスタッフ", (d) => !!d.staff)}
      {renderLine("登録外スタッフ", (d) => !!d.staff_name)}
    </Confirm>
  );
};
