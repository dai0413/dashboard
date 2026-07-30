import { useMemo, useState } from "react";
import { API_PATHS, OptionArray } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { Season, SeasonGet } from "../../../../types/models/season";
import { readItemsBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { ModelType } from "../../../../types/models";
import { convert } from "../../../../lib/convert/DBtoGetted";

export const useSeasonPanel = () => {
  const [season, setSeason] = useState<Data<SeasonGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const seasonOptions: OptionArray = useMemo(
    () =>
      season.data.map((s) => ({
        key: s._id,
        label: s.name,
      })),
    [season],
  );

  const readSeason = async (competitionId: string) => {
    const obj = await readItemsBase<Season[]>({
      apiInstance: api,
      backendRoute: API_PATHS.SEASON.ROOT,
      params: { competition: competitionId, getAll: true },
      handleLoading: (time) => {
        setSeason((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return;

    const newData = convert(ModelType.SEASON, obj.data);

    setSeason({
      data: newData,
      page: obj.page,
      totalCount: obj.totalCount,
      isLoading: true,
    });

    return newData;
  };

  return {
    season,
    readSeason,
    seasonOptions,
  };
};
