import {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { FormStep } from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { ModelContext } from "../types/context";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { useOptions } from "./options-provider";
import { useTransfer } from "./models/transfer-context";
import { useInjury } from "./models/injury-context";
import { usePlayer } from "./models/player-context";
import { useTeam } from "./models/team-context";
import { useCountry } from "./models/country-context";
import { useNationalMatchSeries } from "./models/national-match-series-context";
import { useNationalCallup } from "./models/national-callup";
import { useReferee } from "./models/referee-context";
import { useCompetition } from "./models/competition-context";
import { useSeason } from "./models/season-context";

type FormContextValue<T extends keyof FormTypeMap> = {
  modelType: T | null;
  mode: "single" | "many";

  formOperator: {
    openForm: (
      newData: boolean,
      model: T | null,
      editItem?: GettedModelDataMap[T],
      initialFormData?: Partial<FormTypeMap[T]>,
      many?: boolean
    ) => void;
    closeForm: () => void;
  };

  isOpen: boolean;
  isEditing: boolean;
  newData: boolean;

  single: {
    formData: FormTypeMap[T];
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K]
    ) => void;
    formSteps: FormStep<T>[];
  };

  many?: {
    formData: FormTypeMap[T][];
    handleFormData: <K extends keyof FormTypeMap[T]>(
      index: number,
      key: K,
      value: FormTypeMap[T][K]
    ) => void;
    formSteps: FormStep<T>[];
    addFormDatas: (setPage?: (p: number) => void) => void;
    deleteFormDatas: (index: number) => void;
    renderConfirmMes: (
      confirmData: Record<string, string | number | undefined>[]
    ) => JSX.Element;
  };

  steps: {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    nextData: () => void;
    sendData: () => Promise<void>;
  };

  getDiffKeys: (() => string[]) | undefined;
  createFormMenuItems: (
    modelType: T,
    formInitialData: Partial<FormTypeMap[T]>
  ) => any[];
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

  const [mode, setMode] = useState<"many" | "single">("single");

  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  const modelContextMap: {
    [K in keyof FormTypeMap]: ModelContext<K>;
  } = {
    [ModelType.COMPETITION]: useCompetition(),
    [ModelType.COUNTRY]: useCountry(),
    [ModelType.INJURY]: useInjury(),
    [ModelType.NATIONAL_CALLUP]: useNationalCallup(),
    [ModelType.NATIONAL_MATCH_SERIES]: useNationalMatchSeries(),
    [ModelType.PLAYER]: usePlayer(),
    [ModelType.REFEREE]: useReferee(),
    [ModelType.SEASON]: useSeason(),
    [ModelType.TEAM]: useTeam(),
    [ModelType.TRANSFER]: useTransfer(),
  };

  const modelContext = useMemo(() => {
    return modelType ? modelContextMap[modelType] : null;
  }, [
    modelType,
    modelContextMap[ModelType.COMPETITION].single.formData,
    modelContextMap[ModelType.COUNTRY].single.formData,
    modelContextMap[ModelType.INJURY].single.formData,
    modelContextMap[ModelType.NATIONAL_CALLUP].single.formData,
    modelContextMap[ModelType.NATIONAL_MATCH_SERIES].single.formData,
    modelContextMap[ModelType.PLAYER].single.formData,
    modelContextMap[ModelType.REFEREE].single.formData,
    modelContextMap[ModelType.SEASON].single.formData,
    modelContextMap[ModelType.TEAM].single.formData,
    modelContextMap[ModelType.TRANSFER].single.formData,
  ]);

  const getDiffKeys = modelContext?.metacrud.getDiffKeys;

  const startNewDatas = (item?: FormTypeMap[T]) => {
    if (item) {
      setFormDatas([item]);
      modelContext?.bulk.setFormDatas([item]);
    } else {
      setFormDatas([]);
    }
  };

  const openForm = (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: object,
    many?: boolean
  ) => {
    many ? setMode("many") : setMode("single");

    if (newData) {
      setNewData(true);

      model &&
        initialFormData &&
        modelContextMap[model].single.startNewData(initialFormData);
    } else {
      setNewData(false);
      model ? modelContextMap[model].single.startEdit(editItem) : () => {};
    }

    if (many) {
      startNewDatas(initialFormData);
    } else {
      model ? modelContextMap[model].single.startEdit(editItem) : () => {};
    }

    setIsOpen(true);
    setModelType(model);
    setIsEditing(true);
  };

  const { resetFilter } = useOptions();

  const closeForm = () => {
    modelContext?.single.resetFormData();
    resetFilter();
    setIsOpen(false);
    setModelType(null);
    setCurrentStep(0);
    resetAlert();
    setIsEditing(false);
    setNewData(true);
    setMode("single");
  };

  const nextData = () => {
    modelContext?.single.resetFormData();
    resetFilter();
    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);
    setNewData(true);
    setMode("single");
  };

  const sendData = async () => {
    if (!modelContext) return;

    if (mode === "single") {
      if (newData) {
        modelContext?.metacrud.createItem();
      } else {
        const difKeys = getDiffKeys && getDiffKeys();
        if (!difKeys || difKeys?.length === 0)
          return handleSetAlert({
            success: false,
            message: "変更点がありません",
          });

        const updated: FormTypeMap[T] = Object.fromEntries(
          Object.entries(modelContext.single.formData).filter(([key]) =>
            difKeys.includes(key)
          )
        );

        modelContext?.metacrud.updateItem(updated);
      }

      setCurrentStep((prev) =>
        Math.min(
          prev + 1,
          modelContext?.single.formSteps
            ? modelContext?.single.formSteps.length - 1
            : 0
        )
      );
    }

    if (mode === "many") {
      modelContext.metacrud.createItems(formDatas);

      setCurrentStep((prev) =>
        Math.min(
          prev + 1,
          modelContext.bulk.manyDataFormSteps
            ? modelContext.bulk.manyDataFormSteps.length - 1
            : 0
        )
      );
    }

    setIsEditing(false);
  };

  const nextStep = () => {
    setCurrentStep((prev) =>
      Math.min(
        prev + 1,
        modelContext?.single.formSteps
          ? modelContext?.single.formSteps.length - 1
          : 0
      )
    );
    resetAlert();
  };

  const singleValidation = () => {
    const current = modelContext?.single.formSteps[currentStep];

    if (!current) return;

    if (current.validate) {
      const valid = current.validate(modelContext?.single.formData);
      if (!valid.success) return handleSetAlert(valid);
    }

    const missing = current.fields?.filter((f) => {
      const value = modelContext?.single.formData[f.key];

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
      handleSetAlert(payload);
      return false;
    }

    return true;
  };

  const manyValidation = () => {
    const current = modelContext?.bulk.manyDataFormSteps[currentStep];

    if (!current) return;

    if (current.validate) {
      for (const d of formDatas ?? []) {
        const valid = current.validate(d);
        if (!valid.success) {
          return handleSetAlert(valid);
        }
      }
    }

    const missing = current.fields?.filter((f) => {
      return (formDatas ?? []).some((d) => {
        const value = d[f.key];
        if (!f.required) return false;

        if (Array.isArray(value)) {
          return (value as string[]).every((v) => v.trim() === "");
        }

        if (typeof value === "string") {
          return (value as string).trim() === "";
        }

        return !value;
      });
    });

    if (missing && missing.length > 0) {
      const payload = {
        success: false,
        message: `${missing[0].label}は必須項目です。`,
      };
      handleSetAlert(payload);
      return false;
    }

    return true;
  };

  const nextStepWithValidation = () => {
    if (mode === "single" && !singleValidation()) return;
    if (mode === "many" && !manyValidation()) return;
    nextStep();
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  ////////////////////////// many data edit //////////////////////////
  const [formDatas, setFormDatas] = useState<FormTypeMap[T][]>([]);

  useEffect(() => {
    if (modelContext) {
      modelContext.bulk.setFormDatas(formDatas);
    }
  }, [formDatas]);

  const handleFormData = <K extends keyof FormTypeMap[T]>(
    index: number,
    key: K,
    value: FormTypeMap[T][K]
  ) => {
    const newFormDatas = formDatas.map((item, i) => {
      if (i !== index) return item;

      // 同じ値を選んだら解除（null）
      if (item[key] === value) {
        return { ...item, [key]: null };
      }

      // 違う値なら更新
      return { ...item, [key]: value };
    });

    setFormDatas(newFormDatas);
    modelContext?.bulk.setFormDatas(newFormDatas);
  };

  const addFormDatas = (setPage?: (p: number) => void) => {
    const base = modelContext?.single.formData
      ? { ...modelContext.single.formData }
      : ({} as FormTypeMap[T]);

    const newFormDatas = [...formDatas, base];

    setFormDatas(newFormDatas);
    modelContext?.bulk.setFormDatas(newFormDatas);

    // 件数が 10 の倍数 + 1 のときにページを進める
    const newCount = newFormDatas.length;
    if ((newCount - 1) % 10 === 0 && newCount > 1) {
      const newPage = Math.ceil(newCount / 10);
      setPage && setPage(newPage);
    }
  };

  const deleteFormDatas = (index: number) => {
    const newFormDatas = formDatas.filter((_d, i) => i !== index);

    setFormDatas(newFormDatas);
    modelContext?.bulk.setFormDatas(newFormDatas);
  };

  const createFormMenuItems = (
    model: T,
    formInitialData: Partial<FormTypeMap[T]>
  ) => {
    const hasSingle =
      modelContextMap[model]?.single.formSteps &&
      modelContextMap[model]?.single.formSteps.length > 0;
    const hasBulk =
      modelContextMap[model]?.bulk.manyDataFormSteps &&
      modelContextMap[model]?.bulk.manyDataFormSteps.length > 0;

    const menuItems = [
      hasSingle && {
        label: "Single",
        onClick: () => {
          openForm(true, model || null, undefined, formInitialData);
        },
      },
      hasBulk && {
        label: "Many",
        onClick: () => {
          openForm(true, model || null, undefined, formInitialData, true);
        },
      },
    ].filter(Boolean) as { label: string; onClick: () => void }[];

    return menuItems;
  };

  const renderer: (
    confirmData: Record<string, string | number | undefined>[]
  ) => JSX.Element = modelType ? getConfirmMes(modelType) : () => <></>;

  const many = {
    formSteps: modelContext?.bulk.manyDataFormSteps ?? [],
    formData: formDatas,
    handleFormData,
    addFormDatas,
    deleteFormDatas,
    renderConfirmMes: renderer,
  };

  const value: FormContextValue<T> = {
    modelType,
    mode,

    formOperator: {
      openForm,
      closeForm,
    },
    isOpen,
    isEditing,
    newData,

    single: {
      formSteps: (modelContext?.single.formSteps as FormStep<T>[]) ?? [],
      formData: (modelContext?.single.formData as FormTypeMap[T]) ?? {},
      handleFormData:
        (modelContext?.single
          .handleFormData as FormContextValue<T>["single"]["handleFormData"]) ??
        (() => {}),
    },

    many,

    steps: {
      currentStep,
      nextStep: nextStepWithValidation,
      prevStep,
      nextData,
      sendData,
    },

    getDiffKeys,
    createFormMenuItems,
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
