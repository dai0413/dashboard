import { JSX } from "react";
import { NationalCallupForm } from "../../types/models/national-callup";
import { Confirm } from "./Confirm";

export const nationalCallup = (formDatas: NationalCallupForm[]) => {
  const getNames = (filterFn: (d: NationalCallupForm) => boolean) =>
    formDatas
      .filter(filterFn)
      .map((d) => d.player)
      .join(",");

  // 件数と名前をまとめるユーティリティ
  const renderLine = (
    label: string,
    filterFn: (d: NationalCallupForm) => boolean
  ): JSX.Element | null => {
    const filtered = formDatas.filter(filterFn);
    if (filtered.length === 0) return null;

    return (
      <div>
        <span className="text-gray-400 ml-2">{`・${label} `}</span>
        <span className="font-bold">{`${filtered.length}件 ${getNames(
          filterFn
        )}`}</span>
      </div>
    );
  };

  return (
    <Confirm count={formDatas.length}>
      {renderLine("追加招集", (d) => d.is_additional_call ?? false)}
      {renderLine("辞退", (d) => d.status === "事前辞退")}
      {renderLine("途中離脱", (d) => d.status === "途中離脱")}
      {renderLine(
        "トレーニングパートナー",
        (d) => d.is_training_partner ?? false
      )}
      {renderLine("バックアップ", (d) => d.is_backup ?? false)}
      {renderLine("OA", (d) => d.is_overage ?? false)}
      {renderLine("キャプテン", (d) => d.is_captain ?? false)}
    </Confirm>
  );
};
