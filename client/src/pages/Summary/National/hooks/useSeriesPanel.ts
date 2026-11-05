import { useMemo, useState } from "react";
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
    totalCount: 1,
    isLoading: false,
  });
  const [selectedKey, setSelectedKey] = useState<string>("");

  const years = useMemo(() => collectYearKeys(series.data), [series.data]);

  const readItems = async (teamIds: string[]) => {
    const obj = await readItemsBase<
      ModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: { getAll: true, team: teamIds },
      handleLoading: (time) =>
        setSeries((prev) => ({ ...prev, isLoading: time === "start" })),
    });

    if (!obj) return;

    const processed = convert(ModelType.NATIONAL_MATCH_SERIES, obj.data);
    const currentYear = String(new Date().getFullYear());

    setSelectedKey(
      collectYearKeys(processed).includes(currentYear) ? currentYear : "",
    );
    setSeries({
      data: processed,
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    });
  };

  const headerItems = useMemo<MonthleyCalendarHeaderItem[]>(
    () =>
      years.map((year, index) => ({
        key: year,
        label: year === UNDEFINED_YEAR ? "未定義" : `${year}年`,
        ...(index === years.length - 1 ? { default: true } : {}),
      })),
    [years],
  );

  const { filteredDatas, groups } = useMemo(() => {
    if (!years.includes(selectedKey)) {
      return { filteredDatas: [], groups: [] };
    }

    const startDate = new Date(`${selectedKey}/1/1`);
    const endDate = new Date(`${selectedKey}/12/31`);

    const filteredDatas = filterDatas(series.data, startDate, endDate);
    const groups = toMonthlyCalendarGroups(Number(selectedKey), filteredDatas);

    return { filteredDatas, groups };
  }, [series.data, selectedKey, years]);

  const monthlyCalendar = useMemo(
    () => ({
      groups,
      headerItems,
      selectedKey,
      headerOnChange: setSelectedKey,
    }),
    [groups, headerItems, selectedKey],
  );

  return {
    isLoading: series.isLoading,
    items: { data: filteredDatas, monthlyCalendar },
    readItems,
  };
};
