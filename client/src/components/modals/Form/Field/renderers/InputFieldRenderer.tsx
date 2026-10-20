import { SingleInput, MultiInput } from "./Input/components";
import { MultiInputProps, SingleInputProps } from "./Input/types";

type InputFieldRendererProps = SingleInputProps | MultiInputProps;

export const InputFieldRenderer = (props: InputFieldRendererProps) => {
  const { multi, type } = props;

  if (!multi) {
    const { value, supportButton, onChange, color } = props;

    return (
      <SingleInput
        color={color}
        type={type}
        value={value}
        supportButton={supportButton}
        onChange={onChange}
      />
    );
  }

  const { values, supportButton, onChangeItem, color } = props;

  return (
    <MultiInput
      color={color}
      type={type}
      values={values}
      onChangeItem={onChangeItem}
      supportButton={supportButton}
    />
  );
};
