import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTransfer } from "./transfer-context";
import { useAlert } from "./alert-context";
import { FormStep } from "../types/form";
import { useInjury } from "./injury-context";
import { usePlayer } from "./player-context";
import { ConvertedDataMap, FormTypeMap, ModelType } from "../types/models";

type FormContextValue<T extends keyof FormTypeMap> = {
  isOpen: boolean;
  modelType: T | null;
  openForm: (model: T | null) => void;
  closeForm: () => void;

  nextStep: () => void;
  prevStep: () => void;
  nextData: () => void;
  sendData: () => Promise<void>;

  currentStep: number;
  formData: FormTypeMap[T];
  formSteps: FormStep<T>[];
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => void;
};

export type ModelContext<K extends keyof FormTypeMap> = {
  items: ConvertedDataMap[K][];
  selected: ConvertedDataMap[K] | null;
  setSelected: (id: string) => void;

  formData: FormTypeMap[K];
  handleFormData: (key: keyof FormTypeMap[K], value: any) => void;
  resetFormData: () => void;

  formSteps: FormStep<K>[];

  createItem: () => void;
  readItem: (id: string) => Promise<void>;
  readItems: () => Promise<void>;
  updateItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

export const FormModalContext = createContext<
  FormContextValue<any> | undefined
>(undefined);

export const FormProvider = <T extends keyof FormTypeMap>({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // console.log("modeltype in context", modelType);

  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  const modelContextMap: {
    [K in keyof FormTypeMap]: ModelContext<K>;
  } = {
    [ModelType.PLAYER]: usePlayer(),
    [ModelType.TRANSFER]: useTransfer(),
    [ModelType.INJURY]: useInjury(),
  };

  const modelContext = useMemo(() => {
    console.log(modelType);
    return modelType ? modelContextMap[modelType] : null;
  }, [
    modelType,
    modelContextMap[ModelType.PLAYER].formData,
    modelContextMap[ModelType.TRANSFER].formData,
    modelContextMap[ModelType.INJURY].formData,
  ]);

  useEffect(() => {
    console.log(modelType);
    console.log(modelContext?.formSteps);
  }, [modelType]);

  const openForm = (model: T | null) => {
    setIsOpen(true);
    setModelType(model);
  };

  const closeForm = () => {
    modelContext?.resetFormData();
    setIsOpen(false);
    setModelType(null);
    setCurrentStep(0);
    resetAlert();
  };

  const nextData = () => {
    setCurrentStep(0);
    modelContext?.resetFormData();
    resetAlert();
  };

  const sendData = async () => {
    if (!modelContext) return;
    modelContext?.createItem();
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
        const arr = value as string[];
        return arr.every((v) => v.trim() === "");
      }

      if (typeof value === "string") {
        const arr = value as string;
        return arr.trim() === "";
      }

      return !value;
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
    formData: (modelContext?.formData as FormTypeMap[T]) ?? {},
    formSteps: (modelContext?.formSteps as FormStep<T>[]) ?? [],
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

export const useForm = <T extends keyof FormTypeMap>() => {
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
