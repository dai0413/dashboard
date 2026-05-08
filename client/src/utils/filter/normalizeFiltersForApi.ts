import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

const jstDateStringToUTCISO = (dateStr: string): string => {
  // "2025-12-01"
  const [y, m, d] = dateStr.split("-").map(Number);

  // JST 00:00 → UTC
  return new Date(Date.UTC(y, m - 1, d, 15, 0, 0)).toISOString();
};

export const normalizeFiltersForApi = (filters: FilterableFieldDefinition[]) =>
  filters.map((f) => {
    if (f.type === "Date" && Array.isArray(f.value)) {
      return {
        ...f,
        value: f.value.map((v) =>
          typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)
            ? jstDateStringToUTCISO(v)
            : v
        ),
      };
    }
    return f;
  });
