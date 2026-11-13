import { useMemo, useState } from "react";
import { API_PATHS, OptionArray } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { Season } from "../../../../types/models/season";
import { readItemsBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { convert } from "../../../../lib/convert/DBtoGetted";

export const useSeasonPanel = () => {
  const [season, setSeason] = useState<
    Data<GettedModelDataMap[ModelType.SEASON]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readSeason = async (
    competitionId: string,
  ): Promise<Data<GettedModelDataMap[ModelType.SEASON]> | null> => {
    const obj = await readItemsBase<Season[]>({
      apiInstance: api,
      backendRoute: API_PATHS.SEASON.ROOT,
      params: { competition: competitionId, getAll: true },
      handleLoading: (time) => {
        setSeason((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.SEASON, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setSeason(nextItems);

    return nextItems;
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      season.data.map((s) => ({
        key: s._id,
        label: s.name,
      })),
    [season],
  );

  return {
    season,
    readSeason,
    setSeason,
    seasonOptions,
  };
};
