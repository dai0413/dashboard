import { IconButton } from "../../buttons/index";
import { SelectField } from "../../field";
import FilterFields from "../../field/FilterFields";
import { OptionArray } from "../../../types/option";
import { FilterableFieldDefinition, operator } from "@myorg/shared";
import { useOptions } from "../../../context/options-provider";
import { useEffect, useState } from "react";
import { useFilter } from "../../../context/filter-context";
import { useSort } from "../../../context/sort-context";

type OnchangeProps = {
  handleFieldValue: (value: string | number | Date | boolean) => void;
  handleFieldObjValue: (value: Record<string, any>) => void;
  handleFieldOperator: (value: string | number | Date | boolean) => void;
  handleFieldSelect: (e: string | number | Date | boolean) => void;
};

type OnApplyProps = {
  addOnClick: (index?: number) => void;
  deleteOnClick: () => void;
};

type FieldRowProps = {
  filterCondition: FilterableFieldDefinition;
  fieldOptions: OptionArray;
  onChange: OnchangeProps;
  onApply: OnApplyProps;
};

const FieldRow = ({
  filterCondition,
  fieldOptions,
  onChange,
  onApply,
}: FieldRowProps) => {
  const {
    handleFieldValue,
    handleFieldObjValue,
    handleFieldOperator,
    handleFieldSelect,
  } = onChange;
  const { addOnClick, deleteOnClick } = onApply;

  const { updateOption } = useOptions();

  const [optionSelectData, setOptionSelectData] = useState<OptionArray | null>(
    null
  );

  const { filterConditions } = useFilter();
  const { sortConditions } = useSort();

  useEffect(() => {
    if (!filterCondition.key) return;
    updateOption(
      filterCondition.key,
      "select",
      filterConditions,
      sortConditions,
      undefined,
      undefined,
      setOptionSelectData
    );
  }, [filterCondition.key]);

  return (
    <div className="mb-4 grid grid-cols-3 gap-3 items-center">
      {/* フィールド選択 */}
      <SelectField
        type="text"
        value={filterCondition.key}
        onChange={handleFieldSelect}
        options={fieldOptions}
        defaultOption="-- 項目を選択 --"
      />

      {/* 値入力 */}
      {filterCondition.operator !== "is-empty" &&
      filterCondition.operator !== "is-not-empty" &&
      filterCondition.value?.length === 1 ? (
        <FilterFields
          type={filterCondition.type}
          value={filterCondition.value[0] ?? ""}
          onChange={handleFieldValue}
          onChangeObj={handleFieldObjValue}
          options={optionSelectData ?? []}
        />
      ) : (
        <div></div>
      )}

      {/* 演算子選択 + ボタン */}
      <div className="flex items-center gap-2">
        <SelectField
          type="text"
          value={filterCondition.operator as string}
          onChange={handleFieldOperator}
          options={operator()}
        />

        <IconButton icon="add" onClick={addOnClick} color="blue" />
        <IconButton icon="delete" onClick={deleteOnClick} color="red" />
      </div>
    </div>
  );
};

export default FieldRow;
