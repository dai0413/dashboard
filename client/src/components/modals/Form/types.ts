import { AlertStatus } from "../../../types/alert";
import { FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { FormMode, InputMode } from "../../../types/types";

export type FormController<T extends keyof FormTypeMap> = {
  isOpen: boolean;
  close: () => void;

  inputMode: InputMode;
  isEditing: boolean;
  formMode: FormMode;

  formSteps: FormStep<T>[];
  currentStep: number;
  prevStep: () => void;
  nextData: () => void;
  processStep: () => void;

  alert: AlertStatus;
  resetAlert: () => void;

  isTableOpen: boolean;
  toggleTableOpen: () => void;
  setIsTableOpen: (v: boolean) => void;
  setFormPage: (p: number) => void;
};
