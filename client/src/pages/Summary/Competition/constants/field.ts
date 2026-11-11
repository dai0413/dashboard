import { UIFieldDefinition } from "../../../../types/field";
import { getDataFields } from "../../../../utils/data-field";
import { ModelType } from "../../../../types/models";
import { StatsActual } from "../types";
import { ColumnType } from "../../../../types/table";
import { radarFields } from "../../../../components/plot/RadarChart/radarFields";

const defaultFields = ["goal", "against_goal"];

const valueFields: string[] = radarFields.map((f) => f.key);
const addField: UIFieldDefinition<StatsActual>[] = [
  {
    key: "teamColor",
    label: "チームカラー",
    type: "string",
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
    field: "teamColor",
  },
  {
    key: "goal",
    label: "得点",
    type: "number",
    displayOnTable: defaultFields.includes("goal"),
    getValueType: ColumnType.CUSTOM,
    sortable: true,
    getNumData: (d) => {
      return d["goal"]?.actual;
    },
    getData: (d) => {
      if (!d) return { label: "" };

      const key = "goal";
      const value = d[key];

      if (!value || typeof value !== "object" || !("actual" in value)) {
        return { label: "" };
      }

      const label = [
        value.actual != null ? value.actual : undefined,
        value.rank != null ? `${value.rank}位` : undefined,
        value.deviation != null ? value.deviation : undefined,
      ]
        .filter((v) => v != null)
        .join(" : ");

      return { label };
    },
  },
  {
    key: "against_goal",
    label: "失点",
    type: "number",
    displayOnTable: defaultFields.includes("against_goal"),
    getValueType: ColumnType.CUSTOM,
    getNumData: (d) => {
      return d["against_goal"]?.actual;
    },
    getData: (d) => {
      if (!d) return { label: "" };

      const key = "against_goal";
      const value = d[key];

      if (!value || typeof value !== "object" || !("actual" in value)) {
        return { label: "" };
      }

      const label = [
        value.actual != null ? value.actual : undefined,
        value.rank != null ? `${value.rank}位` : undefined,
        value.deviation != null ? value.deviation : undefined,
      ]
        .filter((v) => v != null)
        .join(" : ");

      return { label };
    },
  },
];

const base: UIFieldDefinition<StatsActual>[] = [
  ...(getDataFields(ModelType.STATS_L).filter(
    (field) => field.key !== "match",
  ) as UIFieldDefinition<StatsActual>[]),
  ...addField,
];

export const statsFields: UIFieldDefinition<StatsActual>[] = base.map((f) => {
  if (!valueFields.includes(f.key) && !defaultFields.includes(f.key)) {
    return f;
  }

  return {
    ...f,
    displayOnTable: defaultFields.includes(f.key),
    getValueType: ColumnType.CUSTOM,
    getNumData: (d) => {
      const key = f.key as keyof typeof d;
      const value = d[key];

      if (typeof value === "number") return value;

      if (!value || typeof value !== "object" || !("actual" in value)) {
        return undefined;
      }

      return typeof value.actual === "number" ? value.actual : undefined;
    },
    getData: (d) => {
      if (!d) return { label: "" };

      const key = f.key as keyof typeof d;
      const value = d[key];

      if (typeof value === "number") {
        return { label: String(value) };
      }

      if (!value || typeof value !== "object" || !("actual" in value)) {
        return { label: "" };
      }

      const label = [
        value.actual != null ? value.actual : undefined,
        "rank" in value && value.rank != null ? `${value.rank}位` : undefined,
        "deviation" in value && value.deviation != null
          ? value.deviation
          : undefined,
      ]
        .filter((v) => v != null)
        .join(" : ");

      return { label };
    },
  };
});
