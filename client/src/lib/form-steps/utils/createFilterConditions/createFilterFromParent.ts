import { readItemsBase } from "../../../api";
import { QueryParams } from "@dai0413/myorg-shared";
import { FilterConditionsByKey } from "../../../../types/form";
import { AxiosInstance } from "axios";

type ReadItemParams = {
  apiInstance: AxiosInstance;
  params?: QueryParams;
  backendRoute: string;
};

export const createFilterFromParent = async <T extends { _id: string }>({
  readItemParams,
  convertValueLabel,
  filterKey,
  label,
}: {
  readItemParams: ReadItemParams;
  convertValueLabel: (item: T) => any;
  filterKey: string;
  label: string;
}): Promise<FilterConditionsByKey | null> => {
  const obj = await readItemsBase<T[]>({
    ...readItemParams,
    returnResponse: true,
  });

  if (!obj?.data) return null;

  const items = obj.data;

  if (items.length === 0) return null;

  return {
    [filterKey]: [
      {
        key: "_id",
        label,
        type: "string",
        filterKey,
        filterable: true,
        value: items.map((i: any) => i._id),
        valueLabel: items.map(convertValueLabel),
        operator: "equals",
      },
    ],
  };
};
