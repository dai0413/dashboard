import { useEffect, useState } from "react";
import { QuickFilterItem } from "../../../types/table";
import { useFilter } from "../../../context/filter-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useSort } from "../../../context/sort-context";
import { toggleQuickFilter } from "../../../utils/quickFilter/toggleQuickFilter";
import QuickFilterTabs from "./QuickFilterTabs";

type QuickFilterBarProps = {
  items: QuickFilterItem[];
  loading?: boolean;
  reloadFun?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
};

const QuickFilterBar = ({ items, loading, reloadFun }: QuickFilterBarProps) => {
  const { filterConditions, setFilterConditions } = useFilter();
  const { sortConditions } = useSort();

  const [selectTab, setSelectTab] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const defaultItem = items.find((i) => i.defaultSelect);
    if (!defaultItem) return;

    setSelectTab((current) =>
      current === defaultItem.key ? null : defaultItem.key,
    );

    defaultItem.filterCondition && handleOnClick?.(defaultItem.filterCondition);
    defaultItem.onClick?.();
  }, [items, loading]);

  if (loading) return null;

  const handleOnClick = (
    newFilterCondition: FilterableFieldDefinition[],
    removeKey?: string[],
  ): void => {
    const newFilterConditions = toggleQuickFilter(
      newFilterCondition,
      filterConditions,
      removeKey,
    );
    setFilterConditions(newFilterConditions);
    reloadFun && reloadFun(newFilterConditions, sortConditions);
  };

  return (
    <QuickFilterTabs
      items={items.map((item) => ({
        ...item,
        value: item.key,
      }))}
      selectedKey={selectTab ?? undefined}
      onSelect={async (item) => {
        setSelectTab((current) => (current === item.key ? null : item.key));

        if (selectTab !== item.key) {
          await item.onClick?.();

          if (item.filterCondition) {
            handleOnClick(item.filterCondition, item.removeKey);
          }
        }
      }}
    />
  );
};

export default QuickFilterBar;
