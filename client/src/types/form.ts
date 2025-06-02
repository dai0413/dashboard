import { ModelType } from "./models";
import { TransferForm } from "./models/transfer";
import { InjuryForm } from "./models/injury";
import { ResponseStatus } from "./types";

type FieldType =
  | "input" // <input type = "text">
  | "date" // <input type = "date">
  | "number" // <input type = "number">
  | "select" // <select>
  | "multiurl" // .map {<input type = "text">}
  | "multiselect" // .map {<select>}
  | "table"; // <table>
type StepType = "form" | "confirm";

export interface FieldDefinition<T extends Record<string, any>> {
  key: keyof T;
  label: string;
  type: FieldType;
  options?: { key: string; label: string }[];
  required?: boolean;
}

export type ValidationFunction<T> = (data: T) => ResponseStatus;

export interface FormStep<T extends Record<string, any>> {
  stepLabel: string;
  type: StepType;
  fields?: FieldDefinition<T>[];
  validate?: ValidationFunction<T>;
}

export type FormTypeMap = {
  [ModelType.INJURY]: InjuryForm;
  [ModelType.TRANSFER]: TransferForm;
};
