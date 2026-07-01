import { StaffAppearanceForm } from "../../types/models/staff-appearance";
import { Confirm } from "./Confirm";
import { ModelType } from "../../types/models";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";
import { countFn } from "./utils/countFun";
import { RenderTeamCount } from "./utils/RenderTeamCount";

export const staffAppearance = (formDatas: StaffAppearanceForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: StaffAppearanceForm) => boolean,
    options?: RenderLineOptions<ModelType.STAFF_APPEARANCE>,
  ) =>
    RenderLine<ModelType.STAFF_APPEARANCE>(formDatas, label, filterFn, options);

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, {
        countFn: (d: StaffAppearanceForm[]) => countFn(d, "match"),
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
