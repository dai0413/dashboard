import { useCallback, useEffect, useRef, useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../types/models";
import { Data } from "../../../../types/types";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import {
  MonthleyCalendarHeaderItem,
  MonthlyCalendarGroup,
} from "../../../../types/calendar";
import { filterDatas } from "../../../../utils/calendar/filterDatas";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { NationalMatchSeriesCache, SeriesByMonth } from "../types";

const UNDEFINED_YEAR = "undefined";
const BASE_TEAM_LABEL = "JPN";
const AGE_TEAM_PATTERN = new RegExp(`^U(\\d+)${BASE_TEAM_LABEL}$`);

// 0: JPN のみ / 1: U+数字+JPN / 2: それ以外
const getTeamLabelRank = (label: string): number => {
  if (label === BASE_TEAM_LABEL) return 0;
  if (AGE_TEAM_PATTERN.test(label)) return 1;
  return 2;
};

const compareTeamLabel = (a: string, b: string): number => {
  const rankA = getTeamLabelRank(a);
  const rankB = getTeamLabelRank(b);
  if (rankA !== rankB) return rankA - rankB;

  if (rankA === 1) {
    // 年齢の大きい順 (U23 → U22 → ... → U15)
    const ageA = Number(a.match(AGE_TEAM_PATTERN)![1]);
    const ageB = Number(b.match(AGE_TEAM_PATTERN)![1]);
    return ageB - ageA;
  }

  // それ以外はラベル順 (HighJPN → UniJPN → YouJPN)
  return a.localeCompare(b);
};

const getYearKey = (date?: Date | null): string =>
  date ? String(date.getFullYear()) : UNDEFINED_YEAR;

const compareYearKey = (a: string, b: string): number => {
  if (a === b) return 0;
  if (a === UNDEFINED_YEAR) return 1;
  if (b === UNDEFINED_YEAR) return -1;
  return Number(a) - Number(b);
};

const collectYearKeys = (
  data: GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][],
): string[] =>
  [...new Set(data.map((d) => getYearKey(d.joined_at)))].sort(compareYearKey);

const toMonthlyCalendarGroups = (
  year: number,
  data: GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][],
): MonthlyCalendarGroup[] => {
  const groups = new Map<string, MonthlyCalendarGroup>();

  for (const d of data) {
    const teamId = d.team.id;
    if (!teamId) continue;

    let group = groups.get(teamId);
    if (!group) {
      group = { label: d.team.label, year, data: [] };
      groups.set(teamId, group);
    }

    group.data.push({
      start_date: d.joined_at,
      end_date: d.left_at,
      value: {
        label: d.name,
        to: `${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${d._id}`,
      },
    });
  }

  return Array.from(groups.values()).sort((a, b) =>
    compareTeamLabel(a.label, b.label),
  );
};

export const useSeriesPanel = () => {
  const [series, setSeries] = useState<
    Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>
  >({
    data: [],
    page: 1,
    totalCount: 0,
    isLoading: false,
  });
  const [seriesData, setSeriesData] = useState<SeriesByMonth>({
    data: {
      data: [],
      monthlyCalendar: {
        groups: [],
        headerItems: [],
        selectedKey: "",
        headerOnChange: () => {},
      },
    },
    page: 1,
    isLoading: false,
    totalCount: 0,
  });
  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectedKeyRef = useRef(selectedKey);

  const handleSelectedKey = useCallback((key: string) => {
    selectedKeyRef.current = key;
    setSelectedKey(key);
  }, []);

  const buildSeriesData = useCallback(
    (
      original: Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>,
      key: string,
    ): SeriesByMonth => {
      const newYears = collectYearKeys(original.data);

      const filteredDatas = key
        ? filterDatas(
            original.data,
            new Date(`${key}/1/1`),
            new Date(`${key}/12/31`),
          )
        : original.data;

      const groups = key
        ? toMonthlyCalendarGroups(Number(key), filteredDatas)
        : [];

      const headerItems: MonthleyCalendarHeaderItem[] = newYears.map(
        (year, index) => ({
          key: year,
          label: year === UNDEFINED_YEAR ? "未定義" : `${year}年`,
          ...(index === newYears.length - 1 ? { default: true } : {}),
        }),
      );

      return {
        page: 1,
        isLoading: false,
        totalCount: filteredDatas.length,
        data: {
          data: filteredDatas,
          monthlyCalendar: {
            groups,
            headerItems,
            selectedKey: key,
            headerOnChange: handleSelectedKey,
          },
        },
      };
    },
    [],
  );

  useEffect(() => {
    setSeriesData(buildSeriesData(series, selectedKey));
  }, [series, selectedKey, buildSeriesData]);

  const readSeriesData = useCallback(
    async (
      teamIds: string[],
      nextSelectedKey?: string,
    ): Promise<NationalMatchSeriesCache | null> => {
      const obj = await readItemsBase<
        ModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]
      >({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
        params: { getAll: true, team: teamIds },
        handleLoading: (time) =>
          setSeries((prev) => ({
            ...prev,
            isLoading: time === "start",
          })),
      });

      if (!obj) return null;

      const processed = convert(ModelType.NATIONAL_MATCH_SERIES, obj.data);

      const original = {
        data: processed,
        page: 1,
        totalCount: processed.length,
        isLoading: false,
      };

      const currentYear = String(new Date().getFullYear());
      const newSelectedKey =
        nextSelectedKey !== undefined
          ? nextSelectedKey
          : collectYearKeys(processed).includes(currentYear)
            ? currentYear
            : "";

      setSeries(original);
      handleSelectedKey(newSelectedKey);

      return {
        original,
        selectedKey: newSelectedKey,
      };
    },
    [selectedKey],
  );

  const restoreSeries = ({
    original,
    selectedKey,
  }: NationalMatchSeriesCache) => {
    setSeries(original);
    handleSelectedKey(selectedKey);
  };

  const reloadSeries = useCallback(
    async (teamIds: string[]) => {
      const currentKey = selectedKeyRef.current;

      const newData = await readSeriesData(teamIds, currentKey);

      return newData;
    },
    [readSeriesData],
  );

  return {
    isLoading: series.isLoading,
    seriesData,
    readSeriesData,
    restoreSeries,
    reloadSeries,
  };
};
