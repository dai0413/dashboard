import {
  MonthleyCalendarHeaderItem,
  MonthlyCalendarGroup,
} from "../../../types/calendar";
import { GettedModelDataMap, ModelType } from "../../../types/models";
import { Data, ObjectData } from "../../../types/types";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../types";

export const NATIONAL_TAB = {
  COMPETITION: "competition",
  TEAM: "team",
  NATIONAL_MATCH_SERIES: "nationalMatchSeries",
} as const;

export type NationalTab = (typeof NATIONAL_TAB)[keyof typeof NATIONAL_TAB];

type NationalPanels = {
  competition: PanelSummary<GettedModelDataMap[ModelType.COMPETITION][]>;
  team: PanelSummary<GettedModelDataMap[ModelType.TEAM][]>;
  nationalMatchSeries: ServerDepPanelSummary<SeriesByMonth>;
};

export type SeriesByMonth = ObjectData<{
  data: GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][];
  monthlyCalendar: {
    groups: MonthlyCalendarGroup[];
    headerItems: MonthleyCalendarHeaderItem[];
    selectedKey: string;
    headerOnChange: (key: string) => void;
  };
}>;

export type UseNationalSummary = UseSummary<
  GettedModelDataMap[ModelType.COUNTRY],
  NationalTab,
  NationalPanels
>;

export type NationalMatchSeriesCache = {
  original: Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>;
  selectedKey: string;
};

export type NationalSummaryCache = {
  competition: Data<GettedModelDataMap[ModelType.COMPETITION]>;
  team: Data<GettedModelDataMap[ModelType.TEAM]>;
  nationalMatchSeries: NationalMatchSeriesCache;
};
