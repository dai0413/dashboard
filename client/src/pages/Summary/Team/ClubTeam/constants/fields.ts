import {
  defFields,
  offFields,
} from "../../../../../components/plot/RadarChart/radarFields";
import { RadarField } from "../../../../../components/plot/RadarChart/types";
import { UIFieldDefinition } from "../../../../../types/field";
import { ColumnType } from "../../../../../types/table";
import { StatsActual } from "../../../Competition/types";

const createField = (field: RadarField): UIFieldDefinition<StatsActual> => {
  const formattedKey = field.key as keyof StatsActual;
  return {
    key: formattedKey,
    filterKey: `${formattedKey}.actual`,
    label: field.label,
    type: "number",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: field.default,
    getValueType: ColumnType.CUSTOM,
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
  };
};

export const offFieldDefinitions: UIFieldDefinition<StatsActual>[] = [
  ...offFields.map((field) => createField(field)),
];

export const defFieldDefinitions: UIFieldDefinition<StatsActual>[] = [
  ...defFields.map((field) => createField(field)),
];
