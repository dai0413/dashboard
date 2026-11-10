import { useSort } from "../../context/sort-context";
import { useEffect } from "react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { useFilter } from "../../context/filter-context";
import { FieldSettingModal } from "./FieldSettingModal";

type SortProps = {
  sortableField: SortableFieldDefinition[];
  onApply: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
};

const Sort = ({ sortableField, onApply }: SortProps) => {
  const { filterConditions } = useFilter();
  const { sortOpen, sortConditions, closeSort, resetSort, setSortConditions } =
    useSort();

  useEffect(() => {
    if (!sortableField || sortableField.length === 0) return;

    resetSort(sortableField);
  }, [sortableField]);

  return (
    <FieldSettingModal
      mode="sort"
      fields={sortConditions.map((c) => ({
        ...c,
        label: c.label,
        key: c.key,
        selecting: c.asc !== null && c.asc !== undefined,
        asc: c.asc,
      }))}
      isOpen={sortOpen}
      onClose={closeSort}
      onReset={() => resetSort(sortableField)}
      updateFields={async (newFields: SortableFieldDefinition[]) => {
        setSortConditions(newFields);
        onApply(filterConditions, newFields);
      }}
    />
  );
};

export default Sort;
