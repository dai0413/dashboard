import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

const normalizeDateOnly = (value: any) => {
  if (!value) return null;

  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
};

export const normalizeFilterValue = (
  value: any,
  type: FilterableFieldDefinition["type"],
) => {
  switch (type) {
    case "Date":
      return normalizeDateOnly(value);

    case "datetime-local":
      return value ? new Date(value).getTime() : null;

    case "number":
      return Number(value);

    case "checkbox":
      return Boolean(value);

    case "string":
      return String(value ?? "");

    default:
      return value;
  }
};
