import { OptionArray } from "@dai0413/myorg-shared";

export type PanelSummary<T> = {
  text?: string;
  key: string;
  items: T;
  isLoading?: boolean;
  reloadFun?: () => Promise<void>;
};

export type TabState<T> = {
  selectedTab: T | null;
  handleSelect: (value: string | number | Date | undefined) => void;
};

type SelectState<T> = {
  selectedOption: T | null;
  options: OptionArray;
  handleSelect: (seasonId: string | number | Date | undefined) => void;
};

export type UseSummary<TItem, TTab, TPanels, TSelect = never> = {
  id: string;
  isLoading: boolean;
  selected: TItem | null;

  select?: SelectState<TSelect>;

  tab: TabState<TTab>;

  panels: TPanels;
};
