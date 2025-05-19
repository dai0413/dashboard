import { ResponseStatus } from "./types";

type FieldType = "select" | "input" | "date" | "number" | "multiurl";
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
