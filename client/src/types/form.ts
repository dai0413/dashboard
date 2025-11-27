import { FormTypeMap } from "./models";
import { AlertStatus } from "./alert";
import { AxiosInstance } from "axios";
import { FilterableFieldDefinition } from "@myorg/shared";

type StepType = "form" | "confirm";

type FieldKey<T extends keyof FormTypeMap> = keyof FormTypeMap[T] | string;

type FieldDefinitionBase<T extends keyof FormTypeMap> = {
  key: FieldKey<T>;
  label: string;
  required?: boolean;
  width?: string;
  multi?: boolean;
  // update?: boolean;
  overwriteByMany?: boolean;
};

type MultiValueField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  multi: true;
};

// <input type = "text">
type InputField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "text";
};
// <input type = "date">
type DateField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "date";
};
// <input type = "datetime-local">
type DateTimeLocalField<T extends keyof FormTypeMap> =
  FieldDefinitionBase<T> & {
    fieldType: "input";
    valueType: "datetime-local";
  };
// <input type = "number">
type NumberField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "number";
};
// <input type = "checkbox">
type CheckboxField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "boolean";
};
// <select>
type SelectField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "select";
  valueType: "option";
};
// <table>
type TableField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "table";
  valueType: "option";
};

// .map{<input type = "text">}
type MultiInputField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "input";
  valueType: "text";
};
// .map {<textarea>}
type MultiTextareaField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "textarea";
  valueType: "text";
};
// .map {<select>}
type MultiSelectField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "select";
  valueType: "option";
};

export type FormFieldDefinition<T extends keyof FormTypeMap> =
  | InputField<T>
  | DateField<T>
  | DateTimeLocalField<T>
  | NumberField<T>
  | CheckboxField<T>
  | SelectField<T>
  | MultiInputField<T>
  | MultiTextareaField<T>
  | MultiSelectField<T>
  | TableField<T>;

export type FormUpdatePair = {
  key: string;
  value: any;
}[];

export interface FormStep<K extends keyof FormTypeMap> {
  stepLabel: string;
  type: StepType;
  fields?: FormFieldDefinition<K>[];
  many?: boolean;
  validate?: (data: FormTypeMap[K]) => AlertStatus;
  onChange?:
    | ((data: FormTypeMap[K], api: AxiosInstance) => Promise<FormUpdatePair>)
    | ((data: FormTypeMap[K]) => FormUpdatePair);
  filterConditions?:
    | ((
        data: FormTypeMap[K],
        api: AxiosInstance
      ) => Promise<FilterableFieldDefinition[]>)
    | ((data: FormTypeMap[K]) => Promise<FilterableFieldDefinition[]>);
  skip?: (data: FormTypeMap[K]) => boolean;
}

//  multiurl
//  multiselect
//  multiInput
