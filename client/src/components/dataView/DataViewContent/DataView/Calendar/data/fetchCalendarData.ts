import { API_PATHS } from "@dai0413/myorg-shared";
import { getMonthDateRange } from "../utils";
import { readItemsBase } from "../../../../../../lib/api";
import { Match } from "../../../../../../types/models/match";
import { api } from "../../../../../../context/api-context";
import { PlayerRegistration } from "../../../../../../types/models/player-registration";
import { StaffRegistration } from "../../../../../../types/models/staff-registration";
import { NationalMatchSeries } from "../../../../../../types/models/national-match-series";
import { Transfer } from "../../../../../../types/models/transfer";
import { Injury } from "../../../../../../types/models/injury";
import { ModelType } from "../../../../../../types/models";
import { convert } from "../../../../../../lib/convert/CreateLabel";
import { CalendarSourceData } from "../../../../../../types/table/calendar";

export const fetchCalendarData = async (
  currentDate: Date,
): Promise<CalendarSourceData[]> => {
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

  const datas: CalendarSourceData[] = [];

  if (matchRes) {
    const targets: CalendarSourceData[] = matchRes.data.map((d) => {
      return {
        data: d,
        label: convert(ModelType.MATCH, d),
        modelType: ModelType.MATCH,
      };
    });
    datas.push(...targets);
  }

  if (playerRegistrationRes) {
    const targets: CalendarSourceData[] = playerRegistrationRes.data.map(
      (d) => {
        return {
          data: d,
          label: convert(ModelType.PLAYER_REGISTRATION, d),
          modelType: ModelType.PLAYER_REGISTRATION,
        };
      },
    );
    datas.push(...targets);
  }

  if (staffRegistrationRes) {
    const targets: CalendarSourceData[] = staffRegistrationRes.data.map((d) => {
      return {
        data: d,
        label: convert(ModelType.STAFF_REGISTRATION, d),
        modelType: ModelType.STAFF_REGISTRATION,
      };
    });
    datas.push(...targets);
  }

  if (nationalMatchSeriesRes) {
    const targets: CalendarSourceData[] = nationalMatchSeriesRes.data.map(
      (d) => {
        return {
          data: d,
          label: convert(ModelType.NATIONAL_MATCH_SERIES, d),
          modelType: ModelType.NATIONAL_MATCH_SERIES,
        };
      },
    );
    datas.push(...targets);
  }

  if (transfersRes) {
    const targets: CalendarSourceData[] = transfersRes.data.map((d) => {
      return {
        data: d,
        label: convert(ModelType.TRANSFER, d),
        modelType: ModelType.TRANSFER,
      };
    });
    datas.push(...targets);
  }

  if (injuriesRes) {
    const targets: CalendarSourceData[] = injuriesRes.data.map((d) => {
      return {
        data: d,
        label: convert(ModelType.INJURY, d),
        modelType: ModelType.INJURY,
      };
    });
    datas.push(...targets);
  }

  return datas;
};
