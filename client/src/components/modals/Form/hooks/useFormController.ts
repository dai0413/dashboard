import { useState } from "react";
import { useAlert } from "../../../../context/alert-context";
import { useForm } from "../../../../context/form-context";
import { useModal } from "../../../../context/modal-context";
import { useQuery } from "../../../../context/query-context";
import { FormTypeMap } from "../../../../types/models";
import { FormController } from "../types";

export const useFormController = <
  T extends keyof FormTypeMap,
>(): FormController<T> => {
  const {
    form: { isOpen, close },
  } = useModal();

  const {
    modelType,
    inputMode,
    isEditing,
    formMode,
    isProcessing,
    steps: { formSteps, currentStep, prevStep, nextData, processStep },
  } = useForm<T>();

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const { setPage } = useQuery();

  const [isTableOpen, setIsTableOpen] = useState(false);

  const toggleTableOpen = () => setIsTableOpen((prev) => !prev);
  const setFormPage = (p: number) => setPage("formPage", p);

  const value: FormController<T> = {
    modelType,

    isOpen,
    close,

    inputMode,
    isEditing,
    formMode,

    formSteps,
    currentStep,
    prevStep,
    nextData,
    processStep,
    isProcessing,

    alert,
    resetAlert,

    isTableOpen,
    toggleTableOpen,
    setIsTableOpen,
    setFormPage,
  };

  return value;
};
