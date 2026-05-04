import { MultiSelect, SingleSelect } from "./Select/components";
import { MultiSelectProps, SingleSelectProps } from "./Select/types";

type SelectFieldRendererProps = SingleSelectProps | MultiSelectProps;

export const SelectFieldRenderer = (props: SelectFieldRendererProps) => {
  const { multi, options } = props;

  if (!multi) {
    const { value, onChangeObj } = props;

    return (
      <SingleSelect value={value} onChangeObj={onChangeObj} options={options} />
    );
  }

  const { uniqueInArray, lengthInArray, values, onChangeItem } = props;

  return (
    <MultiSelect
      values={values}
      options={options}
      uniqueInArray={uniqueInArray}
      lengthInArray={lengthInArray}
      onChangeItem={onChangeItem}
    />
  );
};
