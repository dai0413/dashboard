import { useEffect, useState } from "react";
import { QuickFilterItem } from "../../types/table";
import { useFilter } from "../../context/filter-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useSort } from "../../context/sort-context";
import { toggleQuickFilter } from "../../utils/quickFilter/toggleQuickFilter";

type QuickFilterBarProps = {
  items: QuickFilterItem[];
  loading: boolean;
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

    setSelectTab(defaultItem.key);
    defaultItem.filterCondition && handleOnClick?.(defaultItem.filterCondition);
    defaultItem.onClick?.();
  }, [items, loading]);

  if (loading) return null;

  const handleOnClick = (
    filterCondition: FilterableFieldDefinition,
    removeKey?: string[],
  ): void => {
    const newFilterConditions = toggleQuickFilter(
      filterCondition,
      filterConditions,
      removeKey,
    );
    setFilterConditions(newFilterConditions);
    reloadFun && reloadFun(newFilterConditions, sortConditions);
  };

  return (
    <div className="flex items-center gap-x-1">
      {items.map((tab) => {
        return (
          <button
            key={tab.key}
            onClick={async () => {
              if (selectTab !== tab.key) {
                setSelectTab(tab.key);
                tab.onClick && (await tab.onClick());
                tab.filterCondition &&
                  handleOnClick(tab.filterCondition, tab.removeKey);
              }
            }}
            className={`cursor-pointer flex items-center p-1 border rounded-md ${
              tab.key === selectTab
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <span>{tab.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilterBar;
