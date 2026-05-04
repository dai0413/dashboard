import { SingleInput, MultiInput } from "./Input/components";
import { MultiInputProps, SingleInputProps } from "./Input/types";

type InputFieldRendererProps = SingleInputProps | MultiInputProps;

export const InputFieldRenderer = (props: InputFieldRendererProps) => {
  const { multi, type } = props;

  if (!multi) {
    const { value, supportButton, onChange } = props;

    return (
      <SingleInput
        type={type}
        value={value}
        supportButton={supportButton}
        onChange={onChange}
      />
    );
  }

  const { values, supportButton, onChangeItem } = props;

  return (
    <MultiInput
      type={type}
      values={values}
      onChangeItem={onChangeItem}
      supportButton={supportButton}
    />
  );
};
