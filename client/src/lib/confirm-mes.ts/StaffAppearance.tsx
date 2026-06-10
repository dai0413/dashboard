import { StaffAppearanceForm } from "../../types/models/staff-appearance";
import { Confirm } from "./Confirm";
import { ModelType } from "../../types/models";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";

export const staffAppearance = (formDatas: StaffAppearanceForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: StaffAppearanceForm) => boolean,
    options?: RenderLineOptions<ModelType.STAFF_APPEARANCE>,
  ) =>
    RenderLine<ModelType.STAFF_APPEARANCE>(formDatas, label, filterFn, options);

  const countFn = (d: StaffAppearanceForm[]) => {
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
