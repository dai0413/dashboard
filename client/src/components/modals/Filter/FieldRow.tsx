import { IconButton } from "../../buttons/index";
import { SelectField } from "../../field";
import FilterFields from "../../field/FilterFields";
import { FilterableFieldDefinition } from "../../../types/field";
import { OptionArray } from "../../../context/options-provider";

type OptionsProps = {
  fieldOptions: OptionArray;
  valueOptions: OptionArray;
  operatorOptions: OptionArray;
};

type OnchangeProps = {
  handleFieldValue: (value: string | number | Date) => void;
  handleFieldOperator: (value: string | number | Date) => void;
  handleFieldSelect: (e: string | number | Date) => void;
};

type OnApplyProps = {
  addOnClick: (index?: number) => void;
  deleteOnClick: () => void;
};

type FieldRowProps = {
  filterCondition: FilterableFieldDefinition;
  options: OptionsProps;
  onChange: OnchangeProps;
  onApply: OnApplyProps;
};

const FieldRow = ({
  filterCondition,
  options,
  onChange,
  onApply,
}: FieldRowProps) => {
  const { handleFieldValue, handleFieldOperator, handleFieldSelect } = onChange;
  const { addOnClick, deleteOnClick } = onApply;
  const { fieldOptions, valueOptions, operatorOptions } = options;

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
        filterCondition.operator !== "is-not-empty" && (
          <FilterFields
            type={filterCondition.type}
            value={filterCondition.value ? filterCondition.value : ""}
            onChange={handleFieldValue}
            options={valueOptions}
          />
        )}

      <SelectField
        type={"text"}
        value={filterCondition.operator as string}
        onChange={handleFieldOperator}
        options={operatorOptions}
      />

      <div className="space-x-2 flex">
        <IconButton icon="add" onClick={addOnClick} color="blue" />
        <IconButton icon="delete" onClick={deleteOnClick} color="red" />
      </div>
    </div>
  );
};

export default FieldRow;
