import { Label } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CalendarDataItem, CalendarEvent } from "../types";
import { GettedModelDataMap, ModelType } from "../../../../types/models";

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
  dateField: Extract<CalendarDateField, keyof GettedModelDataMap[K]>;
  groupByField?: Extract<CalendarGroupByField, keyof GettedModelDataMap[K]>;
};

const readConfig: {
  [K in ModelType]?: CalendarReadConfig<K>;
} = {
  [ModelType.TRANSFER]: {
    dateField: CalendarDateField.DOA,
  },
  [ModelType.INJURY]: {
    dateField: CalendarDateField.DOA,
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    groupByField: CalendarGroupByField.TEAM,
    dateField: CalendarDateField.JOINED_AT,
  },
  [ModelType.MATCH]: {
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
  },
  [ModelType.PLAYER_REGISTRATION]: {
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
  },
  [ModelType.STAFF_REGISTRATION]: {
    groupByField: CalendarGroupByField.COMPETITION,
    dateField: CalendarDateField.DATE,
  },
} as const;

const getCalendarDate = <K extends ModelType>(
  data: GettedModelDataMap[K],
  field: Extract<CalendarDateField, keyof GettedModelDataMap[K]>,
) => {
  return data[field] as Date;
};

const getCalendarGroup = <K extends ModelType>(
  data: GettedModelDataMap[K],
  field: Extract<CalendarGroupByField, keyof GettedModelDataMap[K]>,
) => {
  return data[field] as Label;
};

export const createData = <K extends ModelType>(
  datas: GettedModelDataMap[K][],
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
      const group = getCalendarGroup(data, config.groupByField);

      if (!group) {
        continue;
      }

      const groupId = group.id || "";

      const existing = day.groups.get(groupId);

      if (existing) {
        existing.counts += 1;
      } else {
        day.groups.set(groupId, {
          data: group,
          counts: 1,
        });
      }
    } else {
      const existing = day.groups.get("");

      if (existing) {
        existing.counts += 1;
      } else {
        day.groups.set("", {
          counts: 1,
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
