export enum SelectKey {
  ID = "id",
  LABEL = "label",
}

type WithSelectable = {
  id?: string;
  label?: string;
};

const isSelectable = (v: any): v is WithSelectable => {
  return v && typeof v === "object" && ("id" in v || "label" in v);
};

type ReplaceSelectable<T, Keys extends keyof T, K extends SelectKey> = Omit<
  T,
  Keys
> & {
  [P in Keys]: K extends "id" ? string | undefined : string | undefined;
};

export const mapSelectableFields = <
  T extends Record<string, any>,
  K extends SelectKey,
  Keys extends keyof T,
>(
  data: T[],
  key: K,
  targetKeys: readonly Keys[],
): ReplaceSelectable<T, Keys, K>[] => {
  return data.map((item) => {
    const result = { ...item } as ReplaceSelectable<T, Keys, K>;

    targetKeys.forEach((field) => {
      const value = item[field];

      if (isSelectable(value)) {
        result[field] = value[key] as any;
      }
    });

    return result;
  });
};
