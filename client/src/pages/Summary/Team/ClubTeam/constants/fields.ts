import {
  defFields,
  offFields,
} from "../../../../../components/plot/RadarChart/radarFields";
import { RadarField } from "../../../../../components/plot/RadarChart/types";
import { UIFieldDefinition } from "../../../../../types/field";
import { ColumnType } from "../../../../../types/table";
import { RadarValues } from "../../../../../utils/plot/buildRadarPlotData";

const createField = (field: RadarField): UIFieldDefinition<RadarValues> => {
  const formattedKey = field.key as keyof RadarValues;
  return {
    key: formattedKey,
    filterKey: `${formattedKey}.actual`,
    label: field.label,
    type: "number",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.CUSTOM,
    getData: (d) => {
      if (formattedKey in d) {
        return {
          label: `${d[formattedKey].actual} / ${d[formattedKey].rank}位 / ${d[formattedKey].deviation}`,
        };
      }

      return { label: "" };
    },
  };
};

export const offFieldDefinitions: UIFieldDefinition<RadarValues>[] = [
  ...offFields.map((field) => createField(field)),
];

export const defFieldDefinitions: UIFieldDefinition<RadarValues>[] = [
  ...defFields.map((field) => createField(field)),
];
