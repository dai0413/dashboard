import { DataSource, FormStep, StepType } from "../../../../types/form";
import { FormTypeMap } from "../../../../types/models";
import { InputMode } from "../../../../types/types";
import BulkConfirmForm from "../Bulk/BulkConfirmForm";
import BulkEditForm from "../Bulk/BulkEditForm";
import SingleConfirmForm from "../Single/SingleConfirmForm";
import SingleEditForm from "../Single/SingleEditForm";

type StepRenderer<T extends keyof FormTypeMap> = {
  inputMode: InputMode;
  formSteps: FormStep<T>[];
  currentStep: number;
  isTableOpen: boolean;
  toggleTableOpen: () => void;
};

export const StepRenderer = <T extends keyof FormTypeMap>({
  inputMode,
  formSteps,
  currentStep,
  isTableOpen,
  toggleTableOpen,
}: StepRenderer<T>) => {
  const current = formSteps[currentStep];

  if (current.type === StepType.FORM) {
    if (inputMode === InputMode.SINGLE) {
      return <SingleEditForm />;
    }

    if (
      current.dataSource === DataSource.BULK_COMMON ||
      current.dataSource === DataSource.META_DATA
    ) {
      return <SingleEditForm />;
    }

    if (inputMode === InputMode.MANY || current.many) {
      return (
        <BulkEditForm
          isTableOpen={isTableOpen}
          toggleTableOpen={toggleTableOpen}
        />
      );
    }
  }

  if (current.type === StepType.CONFIRM) {
    return (
      <>
        <SingleConfirmForm />
        <BulkConfirmForm />
      </>
    );
  }

  return null;
};
