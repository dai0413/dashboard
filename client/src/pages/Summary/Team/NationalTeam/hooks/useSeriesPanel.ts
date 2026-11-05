import { useMemo, useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../../types/models";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { NationalMatchSeriesGet } from "../../../../../types/models/national-match-series";
import {
  CalendarRangeItem,
  MonthleyCalendarHeaderItem,
  MonthlyCalendarGroup,
} from "../../../../../types/calendar";
import { fullNationalPeriods } from "../../../../../constants/period";

const headerItems: MonthleyCalendarHeaderItem[] = fullNationalPeriods
  .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  .map((d, i) => {
    if (i === fullNationalPeriods.length - 1) {
      return {
        ...d,
        default: true,
      };
    }
    return d;
  });

const defaultKey = headerItems.find((i) => i.default)?.key || "";

const convertToMonthlyCalendarTableData = (
  data: NationalMatchSeriesGet[],
  startDate: Date,
  endDate: Date,
): MonthlyCalendarGroup[] => {
  const converted: CalendarRangeItem[] = data.map((d) => ({
    start_date: d.joined_at,
    end_date: d.left_at,
    value: {
      label: d.name,
      to: `${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${d._id}`,
    },
  }));

  const groups: MonthlyCalendarGroup[] = [];

  for (
    let year = startDate.getFullYear();
    year <= endDate.getFullYear();
    year++
  ) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    const yearData = converted.filter((item) => {
      if (!item.start_date) return false;

      const itemStart = new Date(item.start_date);
      const itemEnd = item.end_date ? new Date(item.end_date) : itemStart;

      return itemStart <= yearEnd && itemEnd >= yearStart;
    });

    groups.push({
      data: yearData,
      label: `${year}年`,
      year,
    });
  }

  return groups;
};

const filterDatas = (
  data: NationalMatchSeriesGet[],
  startDate: Date,
  endDate: Date,
) => {
  return data.filter((d) => {
    if (!d.joined_at) return false;

    const joinedAt = d.joined_at;
    const leftAt = d.left_at;

    return joinedAt <= endDate && (!leftAt || leftAt >= startDate);
  });
};

export const useSeriesPanel = () => {
  const [selectedKey, setSelectedKey] = useState<string>(defaultKey);
  const [series, setSeries] = useState<
    Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readItems = async (teamId: string) => {
    const obj = await readItemsBase<
      ModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        getAll: true,
        team: teamId,
        sort: "-joined_at",
      },
      handleLoading: (time) => {
        setSeries((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      const processed = convert(ModelType.NATIONAL_MATCH_SERIES, obj.data);

      setSeries({
        data: processed,
        totalCount: obj.totalCount ?? 0,
        page: obj.page ?? 1,
        isLoading: false,
      });
    }
  };

  const { filteredDatas, groups } = useMemo(() => {
    const target = fullNationalPeriods.find((i) => i.key === selectedKey);

    if (!target) return { filteredDatas: [], groups: [] };

    const startDate = new Date(target.startDate);
    const endDate = new Date(target.endDate);

    const filteredDatas = filterDatas(series.data, startDate, endDate);

    const groups = convertToMonthlyCalendarTableData(
      filteredDatas,
      startDate,
      endDate,
    );

    return { filteredDatas, groups };
  }, [series.data, selectedKey]);

  return {
    isLoading: series.isLoading,
    readItems,
    items: {
      series: filteredDatas,
      monthlyCalendar: {
        groups,
        headerItems,
        selectedKey,
        headerOnChange: (key: string) => {
          setSelectedKey(key);
        },
      },
    },
  };
};
