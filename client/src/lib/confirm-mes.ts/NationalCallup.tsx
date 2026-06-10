import { ModelType } from "../../types/models";
import { NationalCallupForm } from "../../types/models/national-callup";
import { Confirm } from "./Confirm";
import { RenderLine } from "./utils/RenderLine";

export const nationalCallup = (formDatas: NationalCallupForm[]) => {
  const getNames = (d: NationalCallupForm[]) =>
    d.map((d) => d.player).join(" , ");

  const renderLine = (
    label: string,
    filterFn: (d: NationalCallupForm) => boolean,
  ) =>
    RenderLine<ModelType.NATIONAL_CALLUP>(formDatas, label, filterFn, {
      getString: getNames,
    });

  return (
    <Confirm count={formDatas.length}>
      {renderLine("追加招集", (d) => d.is_additional_call ?? false)}
      {renderLine("辞退", (d) => d.status === "事前辞退")}
      {renderLine("途中離脱", (d) => d.status === "途中離脱")}
      {renderLine(
        "トレーニングパートナー",
        (d) => d.is_training_partner ?? false,
      )}
      {renderLine("バックアップ", (d) => d.is_backup ?? false)}
      {renderLine("OA", (d) => d.is_overage ?? false)}
      {renderLine("キャプテン", (d) => d.is_captain ?? false)}
    </Confirm>
  );
};
