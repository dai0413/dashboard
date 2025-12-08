import {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { FormFieldDefinition, FormStep } from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { ModelContext } from "../types/context";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { useTransfer } from "./models/transfer";
import { useInjury } from "./models/injury";
import { usePlayer } from "./models/player";
import { useTeam } from "./models/team";
import { useCountry } from "./models/country";
import { useNationalMatchSeries } from "./models/national-match-series";
import { useNationalCallup } from "./models/national-callup";
import { useReferee } from "./models/referee";
import { useCompetition } from "./models/competition";
import { useSeason } from "./models/season";
import { useTeamCompetitionSeason } from "./models/team-competition-season";
import { useStadium } from "./models/stadium";
import { useCompetitionStage } from "./models/competition-stage";
import { useMatchFormat } from "./models/match-format";
import { useMatch } from "./models/match";
import { usePlayerRegistration } from "./models/player-registration";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/updateFormValue";
import { getSteps } from "../lib/form-steps";
import { objectIsEqual } from "../utils";
import { fieldDefinition } from "../lib/model-fields";
import {
  DetailFieldDefinition,
  isDisplayOnDetail,
  isModelType,
  isSortable,
} from "../types/field";
import { useFilter } from "./filter-context";
import { useSort } from "./sort-context";
import { getOptionKey, useOptions } from "./options-provider";
import { useApi } from "./api-context";
import { getDefault } from "../lib/default-formData";
import { usePlayerRegistrationHistory } from "./models/player-registration-history";
import { useMatchEventType } from "./models/match-event-type";

const checkRequiredFields = <T extends keyof FormTypeMap>(
  fields: FormFieldDefinition<T>[] | undefined,
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
    formLabel: Record<string, any>;
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K],
      overwriteByMany?: boolean
    ) => void;
    formSteps: FormStep<T>[];
  };

  many?: {
    bulkCommonData: FormTypeMap[T];
    bulkCommonLabel: Record<string, any>;
    formData: FormTypeMap[T][];
    formLabels: Record<string, any>[];
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
    nextStep: () => Promise<void>;
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
  autoFill: () => Promise<void>;
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
    [ModelType.MATCH_EVENT_TYPE]: useMatchEventType(),
    [ModelType.MATCH_FORMAT]: useMatchFormat(),
    [ModelType.MATCH]: useMatch(),
    [ModelType.NATIONAL_CALLUP]: useNationalCallup(),
    [ModelType.NATIONAL_MATCH_SERIES]: useNationalMatchSeries(),
    [ModelType.PLAYER]: usePlayer(),
    [ModelType.PLAYER_REGISTRATION_HISTORY]: usePlayerRegistrationHistory(),
    [ModelType.PLAYER_REGISTRATION]: usePlayerRegistration(),
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

  const api = useApi();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [newData, setNewData] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [mode, setMode] = useState<"many" | "single">("single");

  const [singleStep, setSingleStep] = useState<FormStep<T>[]>([]);
  const [bulkStep, setBulkStep] = useState<FormStep<T>[]>([]);

  useEffect(() => {
    setSingleStep(modelType ? getSteps(modelType, false) : []);
    setBulkStep(modelType ? getSteps(modelType, true) : []);
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

  const { getLabelById } = useOptions();

  async function resolveForeignKeyLabels(
    initialFormLabel: Record<string, any>
  ) {
    const resolved = { ...initialFormLabel };

    for (const key of Object.keys(resolved)) {
      const id = resolved[key];
      if (!id || !isModelType(getOptionKey(key))) continue;

      if (Array.isArray(id)) {
        resolved[key] = (
          await Promise.all(id.map((i) => getLabelById(key as ModelType, i)))
        ).filter(Boolean);
      } else {
        resolved[key] = await getLabelById(key as ModelType, id);
      }
    }

    return resolved;
  }

  const openForm = async (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: FormTypeMap[T],
    many?: boolean
  ) => {
    if (!model) return;

    many ? setMode("many") : setMode("single");

    if (newData) {
      setNewData(true);

      if (initialFormData) {
        const data = { ...getDefault(model), ...initialFormData };

        setFormData(data);
        setFormDatas([data]);
        setBulkCommonData(data);
        const resolvedLabels = await resolveForeignKeyLabels(data);
        setFormLabel(resolvedLabels);
        setFormLabels([resolvedLabels]);
        setBulkCommonLabel(resolvedLabels);
      } else {
        resetFormData();
        resetFormDatas();
      }
    } else {
      setNewData(false);
      if (editItem) {
        const newFormData = {
          ...getDefault(model),
          ...convertGettedToForm(model, editItem),
        };
        setFormData(newFormData);

        const resolvedLabels = await resolveForeignKeyLabels(newFormData);

        setFormLabel(resolvedLabels);
      }

      if (model === ModelType.MATCH_FORMAT) {
        const matchFormatEditItem =
          editItem as GettedModelDataMap[ModelType.MATCH_FORMAT];
        const dat = editItem && {
          ...getDefault(ModelType.MATCH_FORMAT),
          ...convertGettedToForm(ModelType.MATCH_FORMAT, matchFormatEditItem),
        };
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
        ? setCurrentStep(getSteps(model, true).length - 1)
        : setCurrentStep(getSteps(model, false).length - 1);
    }
  };

  const closeForm = () => {
    resetFormData();
    resetFormDatas();
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
    resetFormDatas();
    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);
    setNewData(true);
    setMode("single");
  };

  const sendData = async () => {
    let result: boolean = false;
    if (!modelContext || !modelType) return;

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

        result = await modelContext?.metacrud.updateItem({
          ...getDefault(modelType),
          ...updated,
        });
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

  const [bulkCommonData, setBulkCommonData] = useState<FormTypeMap[T]>({});
  const [bulkCommonLabel, setBulkCommonLabel] = useState<Record<string, any>>(
    {}
  );

  const stepSkip = (next: number) => {
    const current = singleStep[next];

    if (!current) return;

    if (current?.skip) {
      const skip = current.skip(formData);

      return skip;
    }

    return false;
  };

  const nextStep = async (): Promise<void> => {
    const current =
      mode === "single" ? singleStep[currentStep] : bulkStep[currentStep];

    if (!current) return;
    const checkData = current.many ? formDatas : formData;

    // --- 必須チェック ---
    const requiredCheck = checkRequiredFields(current.fields, checkData ?? []);
    if (!requiredCheck.success) {
      return handleSetAlert(requiredCheck);
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

    // --- onChange 関数による値変更 ---
    if (current.onChange) {
      if (!Array.isArray(checkData)) {
        const updatePaires = await current.onChange(checkData, api);

        updatePaires.forEach((da) => {
          singleHandleFormData(da.key as keyof FormTypeMap[T], da.value);
        });
      }
    }

    // --- table の filter操作
    if (current.filterConditions) {
      const getCondition = await current.filterConditions(formData, api);
      setFilterConditions(getCondition);
    } else {
      resetFilterConditions();
    }

    // --- many入力時の共通要素
    if (mode === "many" && bulkCommonData && current.fields) {
      current.fields.forEach((field) => {
        if (field.overwriteByMany) {
          const valueKey = field.key as keyof FormTypeMap[T];
          const value = bulkCommonData[valueKey];

          if (value) {
            formDatas.forEach((_formData, index) => {
              handleFormData(index, valueKey, value);
            });
          }
        }
      });
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

    const sortableField =
      modelType && isModelType(modelType)
        ? fieldDefinition[modelType].filter(isSortable)
        : undefined;
    sortableField && resetSort(sortableField);
  };

  const { setFilterConditions, resetFilterConditions } = useFilter();

  const { resetSort } = useSort();

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
  const [formLabel, setFormLabel] = useState<Record<string, any>>({});

  const singleHandleFormData = <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K],
    overwriteByMany?: boolean
  ) => {
    if (overwriteByMany) {
      return setBulkCommonData((prev) =>
        updateFormValue(prev, key, value, setBulkCommonLabel)
      );
    }
    setFormData((prev) => updateFormValue(prev, key, value, setFormLabel));
  };

  const resetFormData = () => {
    setFormData({});
    setFormLabel({});
  };

  ////////////////////////// many data edit //////////////////////////

  const [formDatas, setFormDatas] = useState<FormTypeMap[T][]>([{}]);
  const [formLabels, setFormLabels] = useState<Record<string, any>[]>([{}]);

  const resetFormDatas = () => {
    setFormDatas([]);
    setFormLabels([]);
    setBulkCommonData({});
    setBulkCommonLabel({});
  };

  const handleFormData = <K extends keyof FormTypeMap[T]>(
    index: number,
    key: K,
    value: FormTypeMap[T][K]
  ) => {
    setFormDatas((prev) => {
      const newData = prev.map((item, i) =>
        i === index
          ? updateFormValue(item, key, value, (updater) =>
              setFormLabels((prevLabels) => {
                const arr = [...(prevLabels ?? [])];
                // 存在チェック：なければ空オブジェクトを入れておく
                if (!arr[index]) arr[index] = {};
                arr[index] = updater(arr[index] ?? {});
                return arr;
              })
            )
          : item
      );
      return newData;
    });
  };

  const addFormDatas = (baseCopy: boolean, setPage?: (p: number) => void) => {
    // const baseData = formData ? { ...formData } : ({} as FormTypeMap[T]);
    // const baseLabel = formLabel ? { ...formLabel } : {};

    const baseData = bulkCommonData ? { ...bulkCommonData } : {};
    const baseLabel = bulkCommonLabel ? { ...bulkCommonLabel } : {};

    const newFormDatas = [...formDatas, baseCopy ? baseData : {}];
    const newFormLabels = [...formLabels, baseCopy ? baseLabel : {}];

    setFormDatas(newFormDatas);
    setFormLabels(newFormLabels);

    // 件数が 10 の倍数 + 1 のときにページを進める
    const newCount = newFormDatas.length;
    if ((newCount - 1) % 10 === 0 && newCount > 1) {
      const newPage = Math.ceil(newCount / 10);
      setPage?.(newPage);
    }
  };

  const deleteFormDatas = (index: number) => {
    const newFormDatas = formDatas.filter((_d, i) => i !== index);
    const newFormLabels = formLabels.filter((_d, i) => i !== index);

    setFormDatas(newFormDatas);
    setFormLabels(newFormLabels);
  };

  const createFormMenuItems = (
    model: T,
    formInitialData: Partial<FormTypeMap[T]>
  ) => {
    const singleStep = getSteps(model, false);
    const bulkStep = getSteps(model, true);

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
  // ////////////////////////////////////////////////////// //
  const autoFill = async (): Promise<void> => {
    const current =
      mode === "single" ? singleStep[currentStep] : bulkStep[currentStep];

    if (current?.onChange) {
      for (const [dataIndex, formData] of formDatas.entries()) {
        if (!formData) continue;
        const updatePaires = await current.onChange(formData, api);

        for (const da of updatePaires) {
          handleFormData(dataIndex, da.key as keyof FormTypeMap[T], da.value);
        }
      }
    }
  };

  const renderer: (
    confirmData: Record<string, string | number | undefined>[]
  ) => JSX.Element = modelType ? getConfirmMes(modelType) : () => <></>;

  const many = {
    bulkCommonData,
    bulkCommonLabel,
    formSteps: bulkStep,
    formData: formDatas,
    formLabels,
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
      formLabel,
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
    autoFill,
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
