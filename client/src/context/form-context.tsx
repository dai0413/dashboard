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
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/updateFormValue";
import { getSteps } from "../lib/form-steps";
import { objectIsEqual } from "../utils";
import { fieldDefinition } from "../lib/model-fields";
import {
  DetailFieldDefinition,
  isDisplayOnDetail,
  isModelType,
} from "../types/field";
import { getOptionKey, useOptions } from "./options-provider";
import { useApi } from "./api-context";
import { getDefault } from "../lib/default-formData";
import { useModelContext } from "./models/model-wrapper";

const checkRequiredFields = <T extends ModelType>(
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

type FormMode = "create" | "update";
type InputMode = "single" | "many";

type FormContextValue<T extends ModelType> = {
  inputMode: InputMode;

  formOperator: {
    startForm: (
      newData: boolean,
      model: T | null,
      editItem?: GettedModelDataMap[T],
      initialFormData?: Partial<FormTypeMap[T]>,
      many?: boolean
    ) => void;
  };

  isEditing: boolean;
  formMode: FormMode;

  single: {
    formData: FormTypeMap[T];
    formLabel: Record<string, any>;
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K] | undefined,
      overwriteByMany?: boolean
    ) => void;
  };

  many?: {
    bulkCommonData: FormTypeMap[T];
    bulkCommonLabel: Record<string, any>;
    formData: FormTypeMap[T][];
    formLabels: Record<string, any>[];
    handleFormData: <K extends keyof FormTypeMap[T]>(
      index: number,
      key: K,
      value: FormTypeMap[T][K] | undefined
    ) => void;
    addFormDatas: (baseCopy: boolean, setPage?: (p: number) => void) => void;
    deleteFormDatas: (index: number) => void;
    renderConfirmMes: (
      confirmData: Record<string, string | number | undefined>[]
    ) => JSX.Element;
  };

  steps: {
    currentStep: number;
    formSteps: FormStep<T>[];
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

export const FormProvider = <T extends ModelType>({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    modal: { handleSetAlert, resetAlert },
  } = useAlert();

  const api = useApi();
  const { getLabelById } = useOptions();

  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [inputMode, setInputMode] = useState<InputMode>("single");

  const [formSteps, setFormSteps] = useState<FormStep<T>[]>([]);

  const [formData, setFormData] = useState<FormTypeMap[T]>({});
  const [formLabel, setFormLabel] = useState<Record<string, any>>({});

  const [formDatas, setFormDatas] = useState<FormTypeMap[T][]>([{}]);
  const [formLabels, setFormLabels] = useState<Record<string, any>[]>([{}]);
  // useEffect(() => console.log("formData", formData), [formData]);

  const [initialFormData, setInitialFormData] =
    useState<Partial<FormTypeMap[T] | null>>(null);

  const [bulkCommonData, setBulkCommonData] = useState<FormTypeMap[T]>({});
  const [bulkCommonLabel, setBulkCommonLabel] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    if (!modelType) return;
    inputMode === "single"
      ? setFormSteps(getSteps(modelType, false))
      : setFormSteps(getSteps(modelType, true));
  }, [modelType, inputMode]);

  const modelContext = useModelContext(modelType);

  const getDiffKeys = () => {
    if (!modelType || !modelContext || !modelContext.selected) return [];
    const selected = modelContext.selected;

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(modelType, selected)[typedKey];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

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

  const startForm = async (
    newData: boolean,
    model: T | null,
    editItem?: GettedModelDataMap[T],
    initialFormData?: FormTypeMap[T],
    many?: boolean
  ) => {
    if (!model) return;

    if (!newData) {
      inputMode === "many"
        ? setCurrentStep(getSteps(model, true).length - 1)
        : setCurrentStep(getSteps(model, false).length - 1);
    } else {
      setCurrentStep(0);
    }

    many ? setInputMode("many") : setInputMode("single");

    console.log("initialFormData in startForm", initialFormData);

    if (newData) {
      setFormMode("create");

      if (initialFormData) {
        setInitialFormData(initialFormData);
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
      setFormMode("update");
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

    setModelType(model);
    setIsEditing(true);
  };

  const finishForm = () => {
    setIsEditing(false);
  };

  const nextData = () => {
    resetFormData();
    resetFormDatas();

    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);

    startForm(
      true,
      modelType,
      undefined,
      initialFormData ? initialFormData : undefined,
      inputMode === "many"
    );
  };

  const sendData = async () => {
    let result: boolean = false;
    if (!modelContext || !modelType) return;

    if (inputMode === "single") {
      let item: FormTypeMap[T];
      if (modelType === ModelType.MATCH_FORMAT) {
        item = { ...formData, period: formDatas };
      } else {
        item = formData;
      }

      if (formMode === "create") {
        result = await modelContext.createItem(item);
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

        result = await modelContext.updateItem({
          ...getDefault(modelType),
          ...updated,
        });
      }

      setCurrentStep((prev) =>
        Math.min(prev + 1, formSteps ? formSteps.length - 1 : 0)
      );
    }

    if (inputMode === "many") {
      result = await modelContext.createItems(formDatas);

      setCurrentStep((prev) =>
        Math.min(prev + 1, formSteps ? formSteps.length - 1 : 0)
      );
    }

    if (result) {
      handleSetAlert({
        success: true,
        message: "データを追加しました",
      });
      finishForm();
    }
  };

  const stepSkip = (next: number) => {
    const current = formSteps[next];

    if (current?.skip) {
      const skip = current.skip(formData);

      return skip;
    }

    return false;
  };

  const nextStep = async (): Promise<void> => {
    const current = formSteps[currentStep];

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
    if (formMode === "create" && current.onChange) {
      if (!Array.isArray(checkData)) {
        const updatePaires = await current.onChange(checkData, api);

        updatePaires.forEach((da) => {
          singleHandleFormData(da.key as keyof FormTypeMap[T], da.value);
        });
      }
    }

    // --- many入力時の共通要素
    if (inputMode === "many" && bulkCommonData && current.fields) {
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

    let nextStepIndex = Math.min(
      currentStep + 1,
      formSteps ? formSteps.length - 1 : 0
    );

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    if (inputMode === "single") {
      while (stepSkip(nextStepIndex) && nextStepIndex < formSteps.length - 1) {
        nextStepIndex++;
      }
    }

    setCurrentStep(nextStepIndex);
    resetAlert();
  };

  const prevStep = () => {
    if (!formSteps) return;
    let nextStepIndex = Math.max(currentStep - 1, 0);

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    while (stepSkip(nextStepIndex) && nextStepIndex < formSteps.length - 1) {
      nextStepIndex--;
    }

    setCurrentStep(nextStepIndex);
  };

  const handleStep = (nextStepIndex: number) => {
    setCurrentStep(nextStepIndex);
  };

  ////////////////////////// single data edit //////////////////////////

  const singleHandleFormData = <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K] | undefined,
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
    setFormData(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {}
    );
    setFormLabel(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {}
    );
  };

  ////////////////////////// many data edit //////////////////////////

  const resetFormDatas = () => {
    setFormDatas([
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    ]);
    setFormLabels([
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    ]);
    setBulkCommonData(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {}
    );
    setBulkCommonLabel(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {}
    );
  };

  const handleFormData = <K extends keyof FormTypeMap[T]>(
    index: number,
    key: K,
    value: FormTypeMap[T][K] | undefined
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
          startForm(true, model || null, undefined, formInitialData);
        },
      },
      hasBulk && {
        label: "Many",
        onClick: () => {
          startForm(true, model || null, undefined, formInitialData, true);
        },
      },
    ].filter(Boolean) as { label: string; onClick: () => void }[];

    return menuItems;
  };
  // ////////////////////////////////////////////////////// //
  const autoFill = async (): Promise<void> => {
    const current = formSteps[currentStep];

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
    // formSteps: bulkStep,
    formData: formDatas,
    formLabels,
    handleFormData,
    addFormDatas,
    deleteFormDatas,
    renderConfirmMes: renderer,
  };

  // 確認画面
  const displayableField = useMemo(
    () =>
      modelType
        ? (fieldDefinition[modelType].filter(
            isDisplayOnDetail
          ) as DetailFieldDefinition[])
        : [],
    [modelType]
  );

  const value: FormContextValue<T> = {
    inputMode,

    formOperator: {
      startForm,
    },
    isEditing,
    formMode,

    single: {
      formData: formData,
      handleFormData: singleHandleFormData,
      formLabel,
    },

    many,

    steps: {
      currentStep,
      formSteps,
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

export const useForm = <T extends ModelType>() => {
  const context = useContext(FormModalContext) as
    | FormContextValue<T>
    | undefined;
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
