import { UIFieldDefinition } from "../../../../types/field";
import { getDataFields } from "../../../../utils/data-field";
import { ModelType } from "../../../../types/models";
import { StatsActual } from "../types";
import { ColumnType } from "../../../../types/table";

const defaultFields = ["xgFor", "xgAgainst"];

const colorField: UIFieldDefinition<StatsActual> = {
  key: "teamColor",
  label: "チームカラー",
  type: "string",
  displayOnTable: false,
  getValueType: ColumnType.FIELD,
  field: "teamColor",
};

const base: UIFieldDefinition<StatsActual>[] = [
  ...(getDataFields(ModelType.STATS_L).filter(
    (field) => field.key !== "match",
  ) as UIFieldDefinition<StatsActual>[]),
  colorField,
];

export const statsFields: UIFieldDefinition<StatsActual>[] =
  base.map((f) => {
    if (defaultFields.includes(f.key)) {
      return { ...f, displayOnTable: true };
    }

    return f;
  }) || [];
