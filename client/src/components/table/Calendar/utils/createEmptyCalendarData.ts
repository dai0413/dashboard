import { ModelType } from "../../../../types/models";
import { CalendarData } from "../types";

export const createEmptyCalendarData = (): CalendarData => {
  return {
    [ModelType.TRANSFER]: [],
    [ModelType.INJURY]: [],
    [ModelType.NATIONAL_MATCH_SERIES]: [],
    [ModelType.MATCH]: [],
    [ModelType.PLAYER_REGISTRATION]: [],
    [ModelType.STAFF_REGISTRATION]: [],
  };
};
