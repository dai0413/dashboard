import { createContext, useContext, useMemo, useState } from "react";
import { useTransfer } from "./transfer-context";
import { useAlert } from "./alert-context";
import { FormStep } from "../types/form";
import { ModelType } from "../types/models";

type FormContextValue<T extends Record<string, any>> = {
  isOpen: boolean;
  modelType: ModelType | null;
  openForm: (model: ModelType | null) => void;
  closeForm: () => void;

  nextStep: () => void;
  prevStep: () => void;
  nextData: () => void;
  sendData: () => Promise<void>;

  currentStep: number;
  formData: T;
  formSteps: FormStep<T>[];
  handleFormData: (key: keyof T, value: T[keyof T]) => void;
};

export const FormModalContext = createContext<
  FormContextValue<any> | undefined
>(undefined);

export const FormProvider = <T extends Record<string, any>>({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelType, setModelType] = useState<ModelType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  //   console.log("modeltype in context", modelType);

  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  // 各モデル用 hook を呼ぶ（安全！hook外で切り分けない）
  const transfer = useTransfer();
  // const injury = useInjury();

  const getModelContext = () => {
    switch (modelType) {
      case "transfer":
        return {
          formData: transfer.formData,
          formSteps: transfer.formSteps,
          handleFormData: transfer.handleFormData,
          resetFormData: transfer.resetFormData,
          onSubmit: transfer.createItem,
        };
      case "injury":
        // return {...injury related things}
        return null;
      default:
        return null;
    }
  };

  const modelContext = useMemo(
    () => getModelContext(),
    [modelType, transfer.formData]
  );

  const openForm = (model: ModelType | null) => {
    setIsOpen(true);
    setModelType(model);
  };

  const closeForm = () => {
    setIsOpen(false);
    setModelType(null);
    modelContext?.resetFormData();
    setCurrentStep(0);
    resetAlert();
  };

  const nextData = () => {
    setCurrentStep(0);
    modelContext?.resetFormData();
    resetAlert();
  };

  const sendData = async () => {
    modelContext?.onSubmit();
    setCurrentStep((prev) =>
      Math.min(
        prev + 1,
        modelContext?.formSteps ? modelContext?.formSteps.length - 1 : 0
      )
    );
  };

  const nextStep = () => {
    setCurrentStep((prev) =>
      Math.min(
        prev + 1,
        modelContext?.formSteps ? modelContext?.formSteps.length - 1 : 0
      )
    );
    resetAlert();
  };

  const nextStepWithValidation = () => {
    const current = modelContext?.formSteps[currentStep];

    if (!current) return;

    if (current.validate) {
      const valid = current.validate(modelContext?.formData);
      if (!valid.success) return handleSetAlert(valid);
      return nextStep();
    }

    const missing = current.fields?.filter((f) => {
      const value = modelContext?.formData[f.key];

      if (!f.required) return false;

      if (Array.isArray(value)) {
        return value.filter((v) => v && v.trim() !== "").length === 0;
      }

      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (missing && missing.length > 0) {
      const payload = {
        success: false,
        message: `${missing[0].label}は必須項目です。`,
      };
      return handleSetAlert(payload);
    }
    console.log(modelContext?.formData);
    return nextStep();
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const value: FormContextValue<T> = {
    isOpen,
    modelType,
    openForm,
    closeForm,

    nextStep: nextStepWithValidation,
    prevStep,
    nextData,
    sendData,

    currentStep,
    formData: (modelContext?.formData as T) ?? {},
    formSteps: modelContext?.formSteps ?? [],
    handleFormData:
      (modelContext?.handleFormData as FormContextValue<T>["handleFormData"]) ??
      (() => {}),
  };

  return (
    <FormModalContext.Provider value={value}>
      {children}
    </FormModalContext.Provider>
  );
};

export const useForm = <T extends Record<string, any>>() => {
  const context = useContext(FormModalContext) as
    | FormContextValue<T>
    | undefined;
  if (!context) {
    throw new Error(
      "useTypedFormContext must be used within a FormModalProvider"
    );
  }
  return context;
};
