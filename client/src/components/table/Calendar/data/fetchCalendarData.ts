import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../../lib/api";
import { createData, getMonthDateRange, mergeCalendarData } from "../utils";
import { api } from "../../../../context/api-context";
import { Match } from "../../../../types/models/match";
import { PlayerRegistration } from "../../../../types/models/player-registration";
import { StaffRegistration } from "../../../../types/models/staff-registration";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";
import { Transfer } from "../../../../types/models/transfer";
import { Injury } from "../../../../types/models/injury";
import { CalendarDataItem } from "../types";
import { ModelType } from "../../../../types/models";

export const fetchCalendarData = async (
  currentDate: Date,
): Promise<CalendarDataItem[]> => {
  const { fromDate, endDate } = getMonthDateRange(currentDate);

  const [
    matchRes,
    playerRegistrationRes,
    staffRegistrationRes,
    nationalMatchSeriesRes,
    transfersRes,
    injuriesRes,
  ] = await Promise.all([
    readItemsBase<Match[]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: {
        getAll: true,
        date: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),

    readItemsBase<PlayerRegistration[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
      params: {
        getAll: true,
        date: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),

    readItemsBase<StaffRegistration[]>({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF_REGISTRATION.ROOT,
      params: {
        getAll: true,
        date: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),

    readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        getAll: true,
        joined_at: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),

    readItemsBase<Transfer[]>({
      apiInstance: api,
      backendRoute: API_PATHS.TRANSFER.ROOT,
      params: {
        getAll: true,
        doa: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),

    readItemsBase<Injury[]>({
      apiInstance: api,
      backendRoute: API_PATHS.INJURY.ROOT,
      params: {
        getAll: true,
        doa: [`>=${fromDate}`, `<=${endDate}`],
      },
    }),
  ]);

  const calendarDataList: CalendarDataItem[][] = [];

  if (matchRes) {
    const newCalendarDataList = createData(matchRes.data, ModelType.MATCH);
    calendarDataList.push(newCalendarDataList);
  }

  if (playerRegistrationRes) {
    const newCalendarDataList = createData(
      playerRegistrationRes.data,
      ModelType.PLAYER_REGISTRATION,
    );
    calendarDataList.push(newCalendarDataList);
  }

  if (staffRegistrationRes) {
    const newCalendarDataList = createData(
      staffRegistrationRes.data,
      ModelType.STAFF_REGISTRATION,
    );
    calendarDataList.push(newCalendarDataList);
  }

  if (nationalMatchSeriesRes) {
    const newCalendarDataList = createData(
      nationalMatchSeriesRes.data,
      ModelType.NATIONAL_MATCH_SERIES,
    );
    calendarDataList.push(newCalendarDataList);
  }

  if (transfersRes) {
    const newCalendarDataList = createData(
      transfersRes.data,
      ModelType.TRANSFER,
    );
    calendarDataList.push(newCalendarDataList);
  }

  if (injuriesRes) {
    const newCalendarDataList = createData(injuriesRes.data, ModelType.INJURY);
    calendarDataList.push(newCalendarDataList);
  }

  const calendarData = mergeCalendarData(...calendarDataList);

  return calendarData;
};
