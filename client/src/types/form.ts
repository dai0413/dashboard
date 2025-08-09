import { FormTypeMap } from "./models";
import { ResponseStatus } from "../types/api";

type StepType = "form" | "confirm";

// export interface FieldDefinition<T> {
//   key: keyof T;
//   label: string;
//   type: FieldType;
//   options?: { key: string; label: string }[];
//   required?: boolean;
// }

type FieldDefinitionBase<T extends keyof FormTypeMap> = {
  key: keyof FormTypeMap[T];
  label: string;
  required?: boolean;
};

// <input type = "text">
type InputField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "input";
};
// <input type = "date">
type DateField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "date";
};
// <input type = "number">
type NumberField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "number";
};
// <input type = "checkbox">
type CheckboxField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "checkbox";
};
// <select>
type SelectField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "select";
  options?: { key: string; label: string }[];
};
// .map{<input type = "text">}
type MultiInputField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "multiInput";
};
// .map {<textarea>}
type MultiTextareaField<T extends keyof FormTypeMap> =
  FieldDefinitionBase<T> & {
    type: "multiurl";
  };
// .map {<select>}
type MultiSelectField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "multiselect";
  options?: { key: string; label: string }[];
};
// <table>
type TableField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  type: "table";
  options?: { key: string; label: string }[];
};

export type FieldDefinition<T extends keyof FormTypeMap> =
  | InputField<T>
  | DateField<T>
  | NumberField<T>
  | CheckboxField<T>
  | SelectField<T>
  | MultiInputField<T>
  | MultiTextareaField<T>
  | MultiSelectField<T>
  | TableField<T>;

export interface FormStep<K extends keyof FormTypeMap> {
  stepLabel: string;
  type: StepType;
  fields?: FieldDefinition<K>[];
  validate?: (data: FormTypeMap[K]) => ResponseStatus;
}
