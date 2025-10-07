import { createContext, ReactNode, useContext, useState } from "react";
import { FilterOperator, FilterableFieldDefinition } from "../types/field";
import { isLabelObject, toDateKey } from "../utils";
import { useOptions } from "./options-provider";

type FilterState = {
  filterOpen: boolean;
  handleFilter: (data: any) => any;

  filterConditions: FilterableFieldDefinition[];
  handleAddCondition: (index?: number) => void;

  filterCondition: FilterableFieldDefinition;
  resetFilterConditions: () => void;
  handleFieldSelect: (field: FilterableFieldDefinition) => void;
  handleFieldValue: (value: string | number | Date | boolean) => void;
  handleFieldOperator: (value: string | number | Date | boolean) => void;

  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;

  openFilter: () => void;
  closeFilter: () => void;

  editingIndex: number | null;
  isAdding: boolean;
  toggleAdding: () => void;

  getFilterConditions: (filterCondition: FilterableFieldDefinition) => string;
};

const defaultFilterCondition: FilterableFieldDefinition = {
  key: "",
  label: "",
  type: "string",
  value: "",
  operator: "equals",
};

const defaultValue: FilterState = {
  filterOpen: false,
  handleFilter: () => {},

  filterConditions: [],
  handleAddCondition: () => {},

  filterCondition: defaultFilterCondition,
  resetFilterConditions: () => {},
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

  getFilterConditions: () => "",
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

  const { getOptions } = useOptions();

  const resetFilterConditions = () => {
    setFilterConditions([]);
  };

  const getFilterConditions = (
    filterCondition: FilterableFieldDefinition
  ): string => {
    if (typeof filterCondition.key !== "string") return "";
    const nowOperator = getOptions("operator").find(
      (op) => op.key === filterCondition.operator
    )?.label;

    const valueOptions = getOptions(filterCondition.key);
    const valueLabel = valueOptions.find(
      (item) => item.key === filterCondition.value
    )?.label;
    const val = valueLabel ? valueLabel : filterCondition.value;

    const nowValue =
      filterCondition.operator === "is-empty" ||
      filterCondition.operator === "is-not-empty"
        ? ""
        : filterCondition.type === "Date" && val instanceof Date
        ? toDateKey(val)
        : String(val);

    return `${filterCondition.label} が ${nowValue} ${nowOperator}`;
  };

  // add filter contition
  const handleAddCondition = (index?: number) => {
    const { key, value, label, type, operator } = filterCondition;

    if (!key) return;

    const newCondition: FilterableFieldDefinition = {
      key,
      label,
      value,
      type,
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
        if (typeof cond.key !== "string") return false;
        const itemValue = item[cond.key];

        // 配列 string[]に修正
        let compareValue: string[] = [];

        if (Array.isArray(itemValue)) {
          // すでに配列の場合 → string に変換
          compareValue = itemValue.map((v) => String(v));
        } else if (itemValue && typeof itemValue === "object") {
          if (isLabelObject(itemValue)) {
            compareValue = [String(itemValue.label)];
          } else {
            compareValue = [JSON.stringify(itemValue)];
          }
        } else if (typeof itemValue !== "undefined" && itemValue !== null) {
          compareValue = [String(itemValue)];
        }

        const condOptions = getOptions(cond.key);
        const condValue = condOptions
          ? condOptions.find((val) => val.key === cond.value)?.label
          : null;
        const condVal = condValue ? condValue : cond.value;

        switch (cond.operator) {
          case "equals":
            if (cond.type === "Date" && condVal) {
              return compareValue
                .map((c) => toDateKey(c))
                .includes(toDateKey(condVal));
            }
            return compareValue.includes(String(condVal));

          case "not-equal":
            if (cond.type === "Date" && condVal) {
              return !compareValue
                .map((c) => toDateKey(c))
                .includes(toDateKey(condVal));
            }
            return !compareValue.includes(String(condVal));

          case "contains":
            if (typeof condVal === "string") {
              // compareValue のいずれかが condVal を含む
              return compareValue.some((val) => val.includes(condVal));
            }
            return false;

          case "gte":
            if (
              cond.type === "Date" &&
              condVal &&
              typeof condVal !== "boolean"
            ) {
              return compareValue.some(
                (val) =>
                  !isNaN(new Date(val).getTime()) &&
                  new Date(val) >= new Date(condVal)
              );
            }
            return compareValue.some((val) => Number(val) >= Number(condVal));

          case "lte":
            if (
              cond.type === "Date" &&
              condVal &&
              typeof condVal !== "boolean"
            ) {
              return compareValue.some(
                (val) =>
                  !isNaN(new Date(val).getTime()) &&
                  new Date(val) <= new Date(condVal)
              );
            }
            return compareValue.some((val) => Number(val) <= Number(condVal));

          case "greater":
            if (
              cond.type === "Date" &&
              condVal &&
              typeof condVal !== "boolean"
            ) {
              return compareValue.some(
                (val) =>
                  !isNaN(new Date(val).getTime()) &&
                  new Date(val) > new Date(condVal)
              );
            }
            return compareValue.some((val) => Number(val) > Number(condVal));

          case "less":
            if (
              cond.type === "Date" &&
              condVal &&
              typeof condVal !== "boolean"
            ) {
              return compareValue.some(
                (val) =>
                  !isNaN(new Date(val).getTime()) &&
                  new Date(val) < new Date(condVal)
              );
            }
            return compareValue.some((val) => Number(val) < Number(condVal));

          case "is-empty":
            return (
              compareValue === null ||
              compareValue === undefined ||
              compareValue.length === 0 ||
              compareValue.every((val) => val === "")
            );

          case "is-not-empty":
            return (
              compareValue !== null &&
              compareValue !== undefined &&
              compareValue.length !== 0 &&
              compareValue.some((val) => val !== "")
            );

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
    let value = "";
    switch (field.key) {
      case "position":
        value = "GK";
        break;
      case "form":
        value = "完全";
        break;
      case "age_group":
        value = "full";
        break;
      case "genre":
        value = "club";
        break;
    }

    setFilterCondition({
      key: field.key,
      label: field.label,
      type: field.type,
      value: value,
      operator: "equals",
    });
  };

  const handleFieldValue = (value: string | number | Date | boolean) =>
    setFilterCondition((prev) => ({
      ...prev,
      value: value,
    }));

  const handleFieldOperator = (value: string | number | Date | boolean) => {
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
    resetFilterConditions,
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

    getFilterConditions,
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
