import {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { FieldDefinition, FormStep } from "../types/form";
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
import { useTeamCompetitionSeason } from "./models/team-competition-season-context";
import { useStadium } from "./models/stadium-context";
import { useCompetitionStage } from "./models/competition-stage-context";
import { useMatchFormat } from "./models/match-format";
import { useMatch } from "./models/match-context";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/updateFormValue";
import { getSingleSteps } from "../lib/form-steps";
import { getBulkSteps } from "../lib/form-steps/many";
import { objectIsEqual } from "../utils";
import { fieldDefinition } from "../lib/model-fields";
import { DetailFieldDefinition, isDisplayOnDetail } from "../types/field";

const checkRequiredFields = <T extends keyof FormTypeMap>(
  fields: FieldDefinition<T>[] | undefined,
  data: FormTypeMap[T] | FormTypeMap[T][]
): { success: boolean; message?: string } => {
  if (!fields) return { success: true };

  // 複数モードか単一モードかを統一して扱う
  const dataArray = Array.isArray(data) ? data : [data];

  for (const f of fields) {
    if (!f.required) continue;

    for (const d of dataArray) {
      const value = d[f.key as keyof FormTypeMap[T]];

      if (Array.isArray(value)) {
        if ((value as string[]).every((v) => v.trim() === "")) {
          return { success: false, message: `${f.label}は必須項目です。` };
        }
      } else if (typeof value === "string") {
        if (value.trim() === "") {
          return { success: false, message: `${f.label}は必須項目です。` };
        }
      } else if (!value) {
        return { success: false, message: `${f.label}は必須項目です。` };
      }
    }
  }

  return { success: true };
};

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
    addFormDatas: (baseCopy: boolean, setPage?: (p: number) => void) => void;
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
    handleStep: (nextStepIndex: number) => void;
  };

  displayableField: DetailFieldDefinition[];
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
  const modelContextMap: {
    [K in keyof FormTypeMap]: ModelContext<K>;
  } = {
    [ModelType.COMPETITION]: useCompetition(),
    [ModelType.COMPETITION_STAGE]: useCompetitionStage(),
    [ModelType.COUNTRY]: useCountry(),
    [ModelType.INJURY]: useInjury(),
    [ModelType.MATCH_FORMAT]: useMatchFormat(),
    [ModelType.MATCH]: useMatch(),
    [ModelType.NATIONAL_CALLUP]: useNationalCallup(),
    [ModelType.NATIONAL_MATCH_SERIES]: useNationalMatchSeries(),
    [ModelType.PLAYER]: usePlayer(),
    [ModelType.REFEREE]: useReferee(),
    [ModelType.SEASON]: useSeason(),
    [ModelType.STADIUM]: useStadium(),
    [ModelType.TEAM_COMPETITION_SEASON]: useTeamCompetitionSeason(),
    [ModelType.TEAM]: useTeam(),
    [ModelType.TRANSFER]: useTransfer(),
  };
  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [newData, setNewData] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [mode, setMode] = useState<"many" | "single">("single");

  const [singleStep, setSingleStep] = useState<FormStep<T>[]>([]);
  const [bulkStep, setBulkStep] = useState<FormStep<T>[]>([]);

  useEffect(() => {
    setSingleStep(modelType ? getSingleSteps(modelType) : []);
    setBulkStep(modelType ? getBulkSteps(modelType) : []);
  }, [modelType]);

  const modelContext = useMemo(() => {
    return modelType ? modelContextMap[modelType] : null;
  }, [modelType]);

  const getDiffKeys = () => {
    if (!modelType) return [];
    const selected = modelType && modelContext?.metacrud.selected;

    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(modelType, selected)[typedKey];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const openForm = (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: object,
    many?: boolean
  ) => {
    if (!model) return;

    many ? setMode("many") : setMode("single");

    if (newData) {
      setNewData(true);

      initialFormData ? setFormData(initialFormData) : setFormData({});
      initialFormData ? setFormDatas([initialFormData]) : setFormDatas([]);
    } else {
      setNewData(false);
      editItem && setFormData(convertGettedToForm(model, editItem));

      if (model === ModelType.MATCH_FORMAT) {
        const matchFormatEditItem =
          editItem as GettedModelDataMap[ModelType.MATCH_FORMAT];
        const dat =
          editItem &&
          convertGettedToForm(ModelType.MATCH_FORMAT, matchFormatEditItem);
        const periodArray = dat && "period" in dat ? dat["period"] || [] : [];
        dat ? setFormDatas(periodArray) : setFormDatas([]);

        const { period, ...data } = matchFormatEditItem;

        matchFormatEditItem &&
          setFormData(
            convertGettedToForm(ModelType.MATCH_FORMAT, {
              ...data,
              period: [],
            })
          );
      }
    }

    setIsOpen(true);
    setModelType(model);
    setIsEditing(true);

    if (!newData) {
      mode === "many"
        ? setCurrentStep(getBulkSteps(model).length - 1)
        : setCurrentStep(getSingleSteps(model).length - 1);
    }
  };

  const { resetFilter } = useOptions();

  const closeForm = () => {
    resetFormData();
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
    resetFormData();
    resetFilter();
    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);
    setNewData(true);
    setMode("single");
  };

  const sendData = async () => {
    let result: boolean = false;
    if (!modelContext) return;

    if (mode === "single") {
      let item: FormTypeMap[T];
      if (modelType === ModelType.MATCH_FORMAT) {
        item = { ...formData, period: formDatas };
      } else {
        item = formData;
      }

      if (newData) {
        result = await modelContext?.metacrud.createItem(item);
      } else {
        const difKeys = getDiffKeys && getDiffKeys();
        if (!difKeys || difKeys?.length === 0)
          return handleSetAlert({
            success: false,
            message: "変更点がありません",
          });

        const updated: FormTypeMap[T] = Object.fromEntries(
          Object.entries(formData).filter(([key]) => difKeys.includes(key))
        );

        result = await modelContext?.metacrud.updateItem(updated);
      }

      setCurrentStep((prev) =>
        Math.min(prev + 1, singleStep ? singleStep.length - 1 : 0)
      );
    }

    if (mode === "many") {
      result = await modelContext.metacrud.createItems(formDatas);

      setCurrentStep((prev) =>
        Math.min(prev + 1, bulkStep ? bulkStep.length - 1 : 0)
      );
    }

    if (result) setIsEditing(false);
  };

  const stepSkip = (next: number) => {
    const current = singleStep[next];

    if (!current) return;

    if (current?.skip) {
      const skip = current.skip(formData);

      return skip;
    }

    return false;
  };

  const nextStep = () => {
    const current =
      mode === "single" ? singleStep[currentStep] : bulkStep[currentStep];

    if (!current) return;
    const checkData = current.many ? formDatas : formData;

    // --- 必須チェック ---
    const requiredCheck = checkRequiredFields(current.fields, checkData ?? []);
    if (!requiredCheck.success) {
      handleSetAlert(requiredCheck);
      return false;
    }

    // --- validate 関数によるバリデーション ---
    if (checkData && current.validate) {
      if (Array.isArray(checkData)) {
        for (const d of formDatas ?? []) {
          const valid = current.validate(d);
          if (!valid.success) return handleSetAlert(valid);
        }
      } else {
        const valid = current.validate(checkData);
        if (!valid.success) return handleSetAlert(valid);
      }
    }

    if (!singleStep) {
      return;
    }

    let nextStepIndex = Math.min(
      currentStep + 1,
      singleStep ? singleStep.length - 1 : 0
    );

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    while (stepSkip(nextStepIndex) && nextStepIndex < singleStep.length - 1) {
      nextStepIndex++;
    }

    setCurrentStep(nextStepIndex);
    resetAlert();
  };

  const prevStep = () => {
    if (!singleStep) return;
    let nextStepIndex = Math.max(currentStep - 1, 0);

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    while (stepSkip(nextStepIndex) && nextStepIndex < singleStep.length - 1) {
      nextStepIndex--;
    }

    setCurrentStep(nextStepIndex);
  };

  const handleStep = (nextStepIndex: number) => {
    setCurrentStep(nextStepIndex);
  };

  ////////////////////////// single data edit //////////////////////////
  const [formData, setFormData] = useState<FormTypeMap[T]>({});

  const singleHandleFormData = <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => {
    setFormData((prev) => updateFormValue(prev, key, value));
  };

  const resetFormData = () => {
    setFormData({});
  };

  ////////////////////////// many data edit //////////////////////////

  const [formDatas, setFormDatas] = useState<FormTypeMap[T][]>([{}]);
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
  };

  const addFormDatas = (baseCopy: boolean, setPage?: (p: number) => void) => {
    const base = formData ? { ...formData } : ({} as FormTypeMap[T]);

    const newFormDatas = [...formDatas, baseCopy ? base : {}];

    setFormDatas(newFormDatas);

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
  };

  const createFormMenuItems = (
    model: T,
    formInitialData: Partial<FormTypeMap[T]>
  ) => {
    const singleStep = getSingleSteps(model);
    const bulkStep = getBulkSteps(model);

    const hasSingle = singleStep && singleStep.length > 0;
    const hasBulk = bulkStep && bulkStep.length > 0;

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
    formSteps: bulkStep,
    formData: formDatas,
    handleFormData,
    addFormDatas,
    deleteFormDatas,
    renderConfirmMes: renderer,
  };

  // 確認画面
  const displayableField = modelType
    ? (fieldDefinition[modelType].filter(
        isDisplayOnDetail
      ) as DetailFieldDefinition[])
    : [];

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
      formSteps: singleStep,
      formData: formData,
      handleFormData: singleHandleFormData,
    },

    many,

    steps: {
      currentStep,
      nextStep,
      prevStep,
      nextData,
      sendData,
      handleStep,
    },

    displayableField,
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
