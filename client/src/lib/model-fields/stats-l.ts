import { numberFields } from "@dai0413/myorg-shared";
import { UIFieldDefinition } from "../../types/field";

const createField = (key: string): UIFieldDefinition => {
  return {
    key,
    filterKey: key,
    label: key,
    type: "number",
    filterable: false,
    sortable: true,
    displayOnDetail: true,
  };
};

const fields = numberFields.map((field) => createField(field));

export const statsL: UIFieldDefinition[] = [
  {
    key: "team",
    filterKey: "team.team",
    label: "チーム",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "match",
    filterKey: "match",
    label: "試合",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  ...fields,
];
