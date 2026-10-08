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
  selectedKeys?: string[];
  loading?: boolean;
  multi?: boolean;
  reloadFun?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
};

const QuickFilterBar = ({
  items,
  selectedKeys,
  loading,
  multi = false,
  reloadFun,
}: QuickFilterBarProps) => {
  const { filterConditions, setFilterConditions } = useFilter();
  const { sortConditions } = useSort();

  const [selectTab, setSelectTab] = useState<string[]>([]);

  useEffect(() => {
    if (selectedKeys) {
      setSelectTab(selectedKeys);
    }
  }, [selectedKeys]);

  const handleOnClick = async (
    newFilterCondition: FilterableFieldDefinition[],
    removeKey?: string[],
  ): Promise<void> => {
    const newFilterConditions = toggleQuickFilter(
      newFilterCondition,
      filterConditions,
      removeKey,
    );
    setFilterConditions(newFilterConditions);
    await reloadFun?.(newFilterConditions, sortConditions);
  };

  useEffect(() => {
    if (loading) return;

    const defaultItems = selectedKeys?.flatMap((selectedKey) => {
      return items.filter((i) => i.key === selectedKey);
    });

    if (!defaultItems || defaultItems.length === 0) return;
  }, []);

  if (loading) return null;

  return (
    <QuickFilterTabs
      items={items.map((item) => ({
        ...item,
        value: item.key,
      }))}
      selectedKey={multi ? selectTab : selectTab[0]}
      onSelect={async (item) => {
        const isSelected = selectTab.includes(item.key);

        if (multi) {
          // 複数選択
          setSelectTab((current) =>
            isSelected
              ? current.filter((key) => key !== item.key)
              : [...current, item.key],
          );

          await item.onClick?.();

          if (item.filterCondition) {
            await handleOnClick(item.filterCondition, item.removeKey);
          }

          return;
        }

        // 単一選択
        setSelectTab(isSelected ? [] : [item.key]);

        if (!isSelected) {
          await item.onClick?.();

          if (item.filterCondition) {
            await handleOnClick(item.filterCondition, item.removeKey);
          }
        }
      }}
    />
  );
};

export default QuickFilterBar;
