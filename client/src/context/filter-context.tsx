import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { FilterableFieldDefinition, FilterOperator } from ""@dai0413/myorg-shared";

type FilterState = {
  filterOpen: boolean;

  filterConditions: FilterableFieldDefinition[];
  setFilterConditions: Dispatch<SetStateAction<FilterableFieldDefinition[]>>;
  handleAddCondition: (index?: number) => void;

  filterCondition: FilterableFieldDefinition;
  resetFilterConditions: (all?: boolean) => void;
  handleFieldSelect: (field: FilterableFieldDefinition) => void;
  handleFieldValue: (value: string | number | Date | boolean) => void;
  handleFieldObjValue: (value: Record<string, any>) => void;
  handleFieldOperator: (value: string | number | Date | boolean) => void;

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
  type: "string",
  value: [""],
  operator: "equals",
};

const defaultValue: FilterState = {
  filterOpen: false,

  filterConditions: [],
  setFilterConditions: () => {},
  handleAddCondition: () => {},

  filterCondition: defaultFilterCondition,
  resetFilterConditions: () => {},
  handleFieldSelect: () => {},
  handleFieldValue: () => {},
  handleFieldObjValue: () => {},
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

  const resetFilterConditions = () => {
    setFilterConditions([]);
  };

  useEffect(
    () => console.log("filterConditions", filterConditions),
    [filterConditions]
  );

  // add filter contition
  const handleAddCondition = (index?: number) => {
    const { key, value, label, type, operator, valueLabel } = filterCondition;

    if (!key) return;

    const newCondition: FilterableFieldDefinition = {
      key,
      label,
      value,
      type,
      operator,
      valueLabel,
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
      value: [value],
      valueLabel: [value],
      operator: "equals",
    });
  };

  const handleFieldValue = (value: string | number | Date | boolean) =>
    setFilterCondition((prev) => ({
      ...prev,
      value: [value],
      valueLabel: [value],
    }));

  const handleFieldObjValue = (obj: Record<string, any>): void => {
    console.log("in handleFieldObjValue getted obj", obj.label);
    setFilterCondition((prev) => ({
      ...prev,
      value: obj.key,
      valueLabel: obj.label,
    }));
  };

  const handleFieldOperator = (value: string | number | Date | boolean) => {
    setFilterCondition((prev) => ({
      ...prev,
      operator: value as FilterOperator,
    }));
  };

  const value = {
    filterOpen,

    filterConditions,
    setFilterConditions,
    handleAddCondition,

    filterCondition,
    resetFilterConditions,
    handleFieldSelect,
    handleFieldValue,
    handleFieldObjValue,
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
