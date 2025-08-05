import { createContext, useContext, useMemo, useState } from "react";
import { useTransfer } from "./models/transfer-context";
import { useInjury } from "./models/injury-context";
import { usePlayer } from "./models/player-context";
import { useAlert } from "./alert-context";
import { FormStep } from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { ModelContext } from "../types/context";
import { useTeam } from "./models/team-context";
import { useOptions } from "./options-provider";
import { useCountry } from "./models/country-context";
import { useNationalMatchSeries } from "./models/national-match-series-context";

type FormContextValue<T extends keyof FormTypeMap> = {
  newData: boolean;
  isOpen: boolean;
  isEditing: boolean;
  modelType: T | null;
  openForm: (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: Partial<FormTypeMap[T]>
  ) => void;
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
  getDiffKeys: (() => string[]) | undefined;
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
  const [newData, setNewData] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  const modelContextMap: {
    [K in keyof FormTypeMap]: ModelContext<K>;
  } = {
    [ModelType.COUNTRY]: useCountry(),
    [ModelType.INJURY]: useInjury(),
    [ModelType.NATIONAL_MATCH_SERIES]: useNationalMatchSeries(),
    [ModelType.PLAYER]: usePlayer(),
    [ModelType.TEAM]: useTeam(),
    [ModelType.TRANSFER]: useTransfer(),
  };

  const modelContext = useMemo(() => {
    return modelType ? modelContextMap[modelType] : null;
  }, [
    modelType,
    modelContextMap[ModelType.COUNTRY].formData,
    modelContextMap[ModelType.INJURY].formData,
    modelContextMap[ModelType.NATIONAL_MATCH_SERIES].formData,
    modelContextMap[ModelType.PLAYER].formData,
    modelContextMap[ModelType.TEAM].formData,
    modelContextMap[ModelType.TRANSFER].formData,
  ]);

  const getDiffKeys = modelContext?.getDiffKeys;

  const openForm = (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: object
  ) => {
    if (newData) {
      setNewData(true);

      model &&
        initialFormData &&
        modelContextMap[model].startNewData(initialFormData);
    } else {
      setNewData(false);
      model ? modelContextMap[model].startEdit(editItem) : () => {};
    }
    setIsOpen(true);
    setModelType(model);
    setIsEditing(true);
  };

  const { resetFilter } = useOptions();

  const closeForm = () => {
    modelContext?.resetFormData();
    resetFilter();
    setIsOpen(false);
    setModelType(null);
    setCurrentStep(0);
    resetAlert();
    setIsEditing(false);
  };

  const nextData = () => {
    setCurrentStep(0);
    resetFilter();
    modelContext?.resetFormData();
    resetAlert();
    setIsEditing(false);
  };

  const sendData = async () => {
    if (!modelContext) return;

    if (newData) {
      modelContext?.createItem();
    } else {
      const difKeys = getDiffKeys && getDiffKeys();
      if (!difKeys || difKeys?.length === 0)
        return handleSetAlert({
          success: false,
          message: "変更点がありません",
        });

      console.log(modelContext.formData);
      const updated: FormTypeMap[T] = Object.fromEntries(
        Object.entries(modelContext.formData).filter(([key]) =>
          difKeys.includes(key)
        )
      );

      modelContext?.updateItem(updated);
    }

    setCurrentStep((prev) =>
      Math.min(
        prev + 1,
        modelContext?.formSteps ? modelContext?.formSteps.length - 1 : 0
      )
    );
    setIsEditing(false);
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
    return nextStep();
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const value: FormContextValue<T> = {
    newData,
    isOpen,
    isEditing,
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
    getDiffKeys,
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
