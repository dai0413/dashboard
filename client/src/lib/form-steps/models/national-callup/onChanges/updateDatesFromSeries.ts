import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../../../../types/models/national-match-series";
import { convert } from "../../../../convert/DBtoGetted";
import { ModelType } from "../../../../../types/models";
import { OnChange } from "../../../../../types/form/onChange";

export const updateDatesFromSeries: OnChange<NationalCallupForm> = async (
  formData,
  formLabel,
  api,
) => {
  if (!formData.series || !api) return { formData, formLabel };

  const item = await readItemBase<NationalMatchSeries>({
    apiInstance: api,
    backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.DETAIL(formData.series),
  });

  if (!item) return { formData, formLabel };

  const data: NationalMatchSeriesGet = convert(
    ModelType.NATIONAL_MATCH_SERIES,
    item,
  );

  if (!data) return { formData, formLabel };

  const { joined_at, left_at } = data;

  const returnValue = {
    joined_at: joined_at?.toISOString(),
    left_at: left_at?.toISOString(),
  };

  const returnFormLabel = {
    joined_at,
    left_at,
  };

  return { formData: returnValue, formLabel: returnFormLabel };
};
