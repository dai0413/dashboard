import { IconButton } from "../../buttons/index";
import { SelectField } from "../../field";
import FilterFields from "../../field/FilterFields";
import { OptionArray } from "../../../types/option";
import { FilterableFieldDefinition, operator } from "@myorg/shared";
import { useOptions } from "../../../context/options-provider";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!filterCondition.key) return;
    updateOption(
      filterCondition.key,
      "select",
      undefined,
      undefined,
      setOptionSelectData
    );
  }, [filterCondition.key]);

  return (
    <div className="mb-4 flex justify-between items-center space-x-2">
      <SelectField
        type={"text"}
        value={filterCondition.key}
        onChange={handleFieldSelect}
        options={fieldOptions}
        defaultOption="-- 項目を選択 --"
      />

      {filterCondition.operator !== "is-empty" &&
        filterCondition.operator !== "is-not-empty" &&
        !Array.isArray(filterCondition.value) && (
          <FilterFields
            type={filterCondition.type}
            value={filterCondition.value ?? ""}
            onChange={handleFieldValue}
            onChangeObj={handleFieldObjValue}
            options={optionSelectData ?? []}
          />
        )}

      <SelectField
        type={"text"}
        value={filterCondition.operator as string}
        onChange={handleFieldOperator}
        options={operator()}
      />

      <div className="space-x-2 flex">
        <IconButton icon="add" onClick={addOnClick} color="blue" />
        <IconButton icon="delete" onClick={deleteOnClick} color="red" />
      </div>
    </div>
  );
};

export default FieldRow;
