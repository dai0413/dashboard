import { RefereeAppearanceForm } from "../../types/models/referee-appearance";
import { Confirm } from "./Confirm";
import { ModelType } from "../../types/models";
import { RenderLine, RenderLineOptions } from "./utils/RenderLine";

export const refereeAppearance = (formDatas: RefereeAppearanceForm[]) => {
  const renderLine = (
    label: string,
    filterFn: (d: RefereeAppearanceForm) => boolean,
    options?: RenderLineOptions<ModelType.REFEREE_APPEARANCE>,
  ) =>
    RenderLine<ModelType.REFEREE_APPEARANCE>(
      formDatas,
      label,
      filterFn,
      options,
    );

  const countFn = (d: RefereeAppearanceForm[]) => {
    return new Set(d.map((d) => d.match)).size;
  };

  return (
    <Confirm count={formDatas.length}>
      {renderLine("試合数", () => true, { countFn })}
      {renderLine("登録済み審判", (d) => !!d.referee)}
      {renderLine("登録外審判", (d) => !!d.referee_name)}
    </Confirm>
  );
};
