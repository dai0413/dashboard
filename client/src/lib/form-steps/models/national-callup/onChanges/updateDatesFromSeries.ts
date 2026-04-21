import { AxiosInstance } from "axios";
import { FormUpdatePair } from "../../../../../types/form";
import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { NationalMatchSeriesGet } from "../../../../../types/models/national-match-series";
import { convert } from "../../../../convert/DBtoGetted";
import { ModelType } from "../../../../../types/models";

export async function updateDatesFromSeries(
  formData: Partial<NationalCallupForm>,
  api?: AxiosInstance,
): Promise<FormUpdatePair> {
  if (!formData.series || !api) return [];

  const res = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.DETAIL(formData.series),
    returnResponse: true,
  });

  if (!res) return [];

  const data: NationalMatchSeriesGet = convert(
    ModelType.NATIONAL_MATCH_SERIES,
    res.data,
  );

  if (!data) return [];

  const { joined_at, left_at } = data;

  let obj: FormUpdatePair = [];
  if (joined_at) {
    obj.push({
      key: "joined_at",
      value: joined_at,
    });
  }

  if (left_at) {
    obj.push({
      key: "left_at",
      value: left_at,
    });
  }

  console.log("obj", obj);

  return obj;
}
