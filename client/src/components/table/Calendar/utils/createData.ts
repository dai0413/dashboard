import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CalendarDataItem, CalendarEvent } from "../types";
import { ModelDataMap, ModelType } from "../../../../types/models";
import { convert } from "../../../../lib/convert/CreateLabel";
import { APP_ROUTES } from "../../../../lib/appRoutes";

enum CalendarGroupByField {
  COMPETITION = "competition",
  TEAM = "team",
}

enum CalendarDateField {
  DOA = "doa",
  DATE = "date",
  JOINED_AT = "joined_at",
}

type CalendarReadConfig<K extends ModelType> = {
  createToLink?: (data: ModelDataMap[K]) => string;
  dateField: Extract<CalendarDateField, keyof ModelDataMap[K]>;
  groupByField?: Extract<CalendarGroupByField, keyof ModelDataMap[K]>;
};

const readConfig: {
  [K in ModelType]?: CalendarReadConfig<K>;
} = {
  [ModelType.TRANSFER]: {
    dateField: CalendarDateField.DOA,
    createToLink: (data) => {
      return `${APP_ROUTES.PLAYER_SUMMARY}/${data.player._id}`;
    },
  },
  [ModelType.INJURY]: {
    dateField: CalendarDateField.DOA,
    createToLink: (data) => {
      return `${APP_ROUTES.PLAYER_SUMMARY}/${data.player._id}`;
    },
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    createToLink: (data) => {
      return `${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/${data._id}`;
    },
    groupByField: CalendarGroupByField.TEAM,
    dateField: CalendarDateField.JOINED_AT,
  },
  [ModelType.MATCH]: {
    createToLink: (data) => {
      return `${APP_ROUTES.MATCH_SUMMARY}/${data._id}`;
    },
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
  },
  [ModelType.PLAYER_REGISTRATION]: {
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
    createToLink: (data) => {
      return `${APP_ROUTES.PLAYER_SUMMARY}/${data.player._id}`;
    },
  },
  [ModelType.STAFF_REGISTRATION]: {
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
    createToLink: (data) => {
      return `${APP_ROUTES.STAFF_SUMMARY}/${data.staff._id}`;
    },
  },
} as const;

const getCalendarDate = <K extends ModelType>(
  data: ModelDataMap[K],
  field: Extract<CalendarDateField, keyof ModelDataMap[K]>,
): Date | undefined => {
  const value = data[field];

  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value as string);

  return Number.isNaN(date.getTime()) ? undefined : date;
};

const getCalendarGroup = <K extends ModelType>(
  data: ModelDataMap[K],
  field: Extract<CalendarGroupByField, keyof ModelDataMap[K]>,
): { id: string; label: string } | undefined => {
  if (
    field === CalendarGroupByField.COMPETITION &&
    CalendarGroupByField.COMPETITION in data
  ) {
    return {
      id: data[CalendarGroupByField.COMPETITION]._id,
      label: convert(
        ModelType.COMPETITION,
        data[CalendarGroupByField.COMPETITION],
      ),
    };
  } else if (
    field === CalendarGroupByField.TEAM &&
    CalendarGroupByField.TEAM in data &&
    data[CalendarGroupByField.TEAM] &&
    typeof data[CalendarGroupByField.TEAM] === "object"
  ) {
    return {
      id: data[CalendarGroupByField.TEAM]._id,
      label: convert(ModelType.TEAM, data[CalendarGroupByField.TEAM]),
    };
  }

  return undefined;
};

export const createData = <K extends ModelType>(
  datas: ModelDataMap[K][],
  modelType: K,
): CalendarDataItem[] => {
  const config = readConfig[modelType];

  if (!config) {
    return [];
  }
  const map = new Map<
    string,
    {
      date: Date;
      groups: Map<string, CalendarEvent>;
    }
  >();

  for (const data of datas) {
    const date = getCalendarDate(data, config.dateField);

    if (!date) {
      continue;
    }
    const dateKey = toDateKey(date) as string;

    let day = map.get(dateKey);

    if (!day) {
      day = {
        date: date,
        groups: new Map(),
      };

      map.set(dateKey, day);
    }

    if (config.groupByField) {
      const groupObj = getCalendarGroup(data, config.groupByField);

      if (!groupObj) {
        continue;
      }

      const groupId = groupObj.id || "";

      const existing = day.groups.get(groupId);
      const converted = config.createToLink
        ? { label: convert(modelType, data), to: config.createToLink(data) }
        : { label: convert(modelType, data) };

      if (existing) {
        existing.counts += 1;
        existing.datas.push(converted);
      } else {
        day.groups.set(groupId, {
          groupByData: groupObj,
          counts: 1,
          datas: [converted],
        });
      }
    } else {
      const existing = day.groups.get("");
      const converted = config.createToLink
        ? { label: convert(modelType, data), to: config.createToLink(data) }
        : { label: convert(modelType, data) };

      if (existing) {
        existing.counts += 1;
        existing.datas.push(converted);
      } else {
        day.groups.set("", {
          counts: 1,
          datas: [converted],
        });
      }
    }
  }

  return [...map.values()]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ date, groups }) => ({
      date,
      data: {
        [modelType]: [...groups.values()],
      },
    }));
};
