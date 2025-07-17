import { createContext, ReactNode, useContext, useState } from "react";
import { FilterOperator } from "../types/types";
import { FilterableFieldDefinition } from "../types/field";
import { isLabelObject, toDateKey } from "../utils";

type FilterState = {
  filterOpen: boolean;
  handleFilter: (data: any) => any;

  filterConditions: FilterableFieldDefinition[];
  handleAddCondition: (index?: number) => void;

  filterCondition: FilterableFieldDefinition;
  handleFieldSelect: (field: FilterableFieldDefinition) => void;
  handleFieldValue: (value: string | number | Date) => void;
  handleFieldOperator: (value: string | number | Date) => void;

  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;

  openFilter: () => void;
  closeFilter: () => void;

  editingIndex: number | null;
  isAdding: boolean;
  toggleAdding: () => void;
};

const defaultFilterCondition: FilterableFieldDefinition = {
  key: "",
  label: "",
  filterType: "string",
  value: "",
  operator: "equals",
};

const defaultValue: FilterState = {
  filterOpen: false,
  handleFilter: () => {},

  filterConditions: [],
  handleAddCondition: () => {},

  filterCondition: defaultFilterCondition,
  handleFieldSelect: () => {},
  handleFieldValue: () => {},
  handleFieldOperator: () => {},

  handleEdit: () => {},
  handleDelete: () => {},

  openFilter: () => {},
  closeFilter: () => {},

  editingIndex: null,
  isAdding: false,
  toggleAdding: () => {},
};

const FilterContext = createContext<FilterState>(defaultValue);

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterConditions, setFilterConditions] = useState<
    FilterableFieldDefinition[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<null | number>(null);
  const [filterCondition, setFilterCondition] =
    useState<FilterableFieldDefinition>(defaultFilterCondition);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const toggleAdding = () => setIsAdding((prev) => !prev);

  // add filter contition
  const handleAddCondition = (index?: number) => {
    const { key, value, label, filterType, operator } = filterCondition;

    if (!key || value == "") return;

    const newCondition: FilterableFieldDefinition = {
      key,
      label,
      value,
      filterType,
      operator,
      logic: "AND",
    };

    // 編集モード（index 指定あり）
    if (typeof index === "number") {
      setFilterConditions((prev) =>
        prev.map((cond, i) => (i === index ? newCondition : cond))
      );
    } else {
      // 新規追加モード
      setFilterConditions((prev) => [...prev, newCondition]);
    }

    // 入力フィールド初期化
    setFilterCondition(defaultFilterCondition);
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setFilterCondition(filterConditions[index]);
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    setFilterConditions((prev) => prev.filter((_, i) => i !== index));
    setIsAdding(false);
  };

  // ---------- add filter ----------
  const handleFilter = (data: any[]): any[] => {
    return data.filter((item) =>
      filterConditions.every((cond) => {
        const itemValue = item[cond.key];

        const compareValue = isLabelObject(itemValue)
          ? itemValue.label
          : itemValue;

        const condVal = cond.value;

        if (condVal === undefined || condVal === null) return true;

        switch (cond.operator) {
          case "equals":
            if (cond.filterType === "Date") {
              return toDateKey(compareValue) === toDateKey(condVal);
            }
            return compareValue == condVal;

          case "contains":
            if (
              typeof compareValue === "string" &&
              typeof condVal === "string"
            ) {
              return compareValue.includes(condVal);
            }
            return false;

          case "gte":
            if (cond.filterType === "Date") {
              return new Date(compareValue) >= new Date(condVal);
            }
            return Number(compareValue) >= Number(condVal);

          case "lte":
            if (cond.filterType === "Date") {
              return new Date(compareValue) >= new Date(condVal);
            }
            return Number(compareValue) <= Number(condVal);

          default:
            return true;
        }
      })
    );
  };

  // フィルターオープン
  const openFilter = () => {
    setFilterOpen(true);
  };

  const closeFilter = () => {
    setFilterOpen(false);
  };

  const handleFieldSelect = (field: FilterableFieldDefinition) => {
    const value =
      field.key === "position" ? "GK" : field.key === "form" ? "完全" : "";

    setFilterCondition({
      key: field.key,
      label: field.label,
      filterType: field.filterType,
      value: value,
      operator: "equals",
    });
  };

  const handleFieldValue = (value: string | number | Date) =>
    setFilterCondition((prev) => ({
      ...prev,
      value: value,
    }));

  const handleFieldOperator = (value: string | number | Date) => {
    setFilterCondition((prev) => ({
      ...prev,
      operator: value as FilterOperator,
    }));
  };

  const value = {
    filterOpen,
    handleFilter,

    filterConditions,
    handleAddCondition,

    filterCondition,
    handleFieldSelect,
    handleFieldValue,
    handleFieldOperator,

    handleEdit,
    handleDelete,

    openFilter,
    closeFilter,

    editingIndex,
    isAdding,
    toggleAdding,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export { useFilter, FilterProvider };
