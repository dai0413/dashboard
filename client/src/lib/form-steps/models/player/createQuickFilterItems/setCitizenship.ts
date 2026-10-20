import { AxiosInstance } from "axios";
import { readItemsBase } from "../../../../api";
import { Country } from "../../../../../types/models/country";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../../types/models";
import { convert } from "../../../../convert/CreateLabel";
import { QuickFilterItem } from "../../../../../types/table";

export const setCitizenship = async (api?: AxiosInstance | undefined) => {
  if (!api) return null;

  const countries = await readItemsBase<Country[]>({
    apiInstance: api,
    backendRoute: API_PATHS.COUNTRY.ROOT,
    params: {
      getAll: true,
      name: "日本",
      fifa_code: "JPN",
    },
  });

  if (!countries || countries.data.length !== 1) return null;

  const value = countries.data.map((country) => country._id);
  const valueLabel = countries.data.map((country) =>
    convert(ModelType.COUNTRY, country),
  );

  let result: QuickFilterItem[] = [
    {
      key: "citizenship",
      label: "日本",
      filterCondition: [
        {
          key: "_id",
          label: "日本",
          type: "string",
          filterable: true,
          value,
          valueLabel,
          operator: "equals",
        },
      ],
    },
  ];

  return { country: result };
};
