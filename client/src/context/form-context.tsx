import {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import {
  DataSource,
  DraftData,
  FilterConditionsByKey,
  FormFieldDefinition,
  FormStep,
  PostedDraftData,
  QuickFilterItemsByKey,
  StepType,
} from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/updateFormValue";
import { getSteps } from "../lib/form-steps";
import { isEmptyObject, objectIsEqual } from "../utils";
import { fieldDefinition } from "../lib/model-fields";
import {
  DetailFieldDefinition,
  isDisplayOnDetail,
  isModelType,
} from "../types/field";
import { useOptions } from "./options-provider";
import { api } from "./api-context";
import { getDefault } from "../lib/default-formData";
import { useModelContext } from "./models/model-wrapper";
import { getOptionKey } from "../lib/options";
import { From } from "../types/types";
import { DataResoonse } from "../types/api";

const checkRequiredFields = <T extends ModelType>(
  fields: FormFieldDefinition<T>[] | undefined,
  data: FormTypeMap[T] | FormTypeMap[T][],
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
enum InputMode {
  SINGLE = "single",
  MANY = "many",
}

type FormContextValue<T extends ModelType> = {
  modelType: T | null;
  inputMode: InputMode;

  formOperator: {
    startForm: (
      newData: boolean,
      model: T | null,
      editItem?: GettedModelDataMap[T],
      initialFormData?: Partial<FormTypeMap[T]>,
      many?: boolean,
      from?: From,
      allRelated?: boolean,
    ) => void;
  };

  isEditing: boolean;
  formMode: FormMode;

  single: {
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K] | undefined,
      dataSource?: DataSource,
    ) => void;
    state: Record<string, any>;
    stateLabel: Record<string, any>;
  };

  many?: {
    bulkCommonData: FormTypeMap[T];
    bulkCommonLabel: Record<string, any>;
    handleFormData: <K extends keyof FormTypeMap[T]>(
      index: number,
      key: K,
      value: FormTypeMap[T][K] | undefined,
    ) => void;
    addFormDatas: (baseCopy: boolean, setPage?: (p: number) => void) => void;
    deleteFormDatas: (index: number) => void;
    renderConfirmMes: (
      confirmData: Record<string, string | number | undefined>[],
    ) => JSX.Element;
    state: Record<string, any>[];
    stateLabel: Record<string, any>[];
  };

  steps: {
    currentStep: number;
    formSteps: FormStep<T>[];
    prevStep: () => void;
    nextData: () => void;
    handleStep: (nextStepIndex: number) => void;
    processStep: () => Promise<void>;
  };

  displayableField: DetailFieldDefinition[];
  getDiffKeys: (() => string[]) | undefined;
  createFormMenuItems: (
    modelType: T,
    formInitialData: Partial<FormTypeMap[T]>,
  ) => any[];
  autoFill: () => Promise<void>;
  filterConditionsObj: FilterConditionsByKey | null;
  removeFilterConditionsObj: (key: keyof FilterConditionsByKey) => void;
  quickFilterItemsObj: QuickFilterItemsByKey | null;
  removeQuickFilterItemsObj: (key: keyof QuickFilterItemsByKey) => void;
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

  const { getLabelById } = useOptions();

  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.SINGLE);

  const [formSteps, setFormSteps] = useState<FormStep<T>[]>([]);

  const [formData, setFormData] = useState<FormTypeMap[T]>({});
  const [formLabel, setFormLabel] = useState<Record<string, any>>({});

  const [formDatas, setFormDatas] = useState<FormTypeMap[T][]>([{}]);
  const [formLabels, setFormLabels] = useState<Record<string, any>[]>([{}]);

  const [filterConditionsObj, setFilterConditionsObj] =
    useState<FilterConditionsByKey | null>(null);

  const [quickFilterItemsObj, setQuickFilterIteemsObj] =
    useState<QuickFilterItemsByKey | null>(null);

  const [initialFormData, setInitialFormData] =
    useState<Partial<FormTypeMap[T] | null>>(null);

  const [bulkCommonData, setBulkCommonData] = useState<FormTypeMap[T]>({});
  const [bulkCommonLabel, setBulkCommonLabel] = useState<Record<string, any>>(
    {},
  );

  const [metaData, setMetaData] = useState<Record<string, any>>({});
  const [metaDataLabel, setMetaDataLabel] = useState<Record<string, any>>({});
  const [metaDatas, setMetaDatas] = useState<Record<string, any>[]>([]);
  const [metaDataLabels, setMetaDataLabels] = useState<Record<string, any>[]>(
    [],
  );

  const [state, setState] = useState<Record<string, any>>({});
  const [states, setStates] = useState<Record<string, any>[]>([]);

  const [stateLabel, setStateLabel] = useState<Record<string, any>>({});
  const [stateLabels, setStateLabels] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const newState: Record<string, any> = { ...formData, ...metaData };
    setState(newState);
  }, [formData, metaData]);

  useEffect(() => {
    const newStates: Record<string, any>[] = formDatas.map((d, i) => {
      return {
        ...d,
        ...metaDatas[i],
      };
    });
    setStates(newStates);
  }, [formDatas, metaDatas]);

  useEffect(() => {
    const newStateLabel: Record<string, any> = {
      ...formLabel,
      ...metaDataLabel,
    };
    setStateLabel(newStateLabel);
  }, [formLabel, metaDataLabel]);

  useEffect(() => {
    const newStateLabels: Record<string, any>[] = formLabels.map((d, i) => {
      return {
        ...d,
        ...metaDataLabels[i],
      };
    });
    setStateLabels(newStateLabels);
  }, [formLabels, metaDataLabels]);

  // match関連のモデル（複数同時取得時）に使用
  const [draftData, setDraftData] = useState<DraftData>({});
  const [postedDraftData, setPostedDraftData] = useState<PostedDraftData>({});

  const modelContext = useModelContext(modelType);

  const resetDraftData = () => {
    setDraftData({});
  };

  const removeFilterConditionsObj = (key: keyof FilterConditionsByKey) => {
    setFilterConditionsObj((prev) => {
      if (!prev) return prev;

      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeQuickFilterItemsObj = (key: keyof FilterConditionsByKey) => {
    setQuickFilterIteemsObj((prev) => {
      if (!prev) return prev;

      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

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
    initialFormLabel: Record<string, any>,
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
    many?: boolean,
    from?: From,
    allRelated?: boolean,
  ) => {
    if (!model) return;

    const newSteps = getSteps(model, many, from, allRelated);

    setFormSteps(newSteps);

    if (!newData) {
      setCurrentStep(newSteps.length - 1);
    } else {
      setCurrentStep(0);
    }

    many ? setInputMode(InputMode.MANY) : setInputMode(InputMode.SINGLE);

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
        dat
          ? setFormDatas(periodArray as FormTypeMap[ModelType.MATCH_FORMAT][])
          : setFormDatas([]);

        const { period, ...data } = matchFormatEditItem;

        matchFormatEditItem &&
          setFormData(
            convertGettedToForm(ModelType.MATCH_FORMAT, {
              ...data,
              period: [],
            }),
          );
      }
    }

    setModelType(model);
    setIsEditing(true);
    setFilterConditionsObj(null);
    setQuickFilterIteemsObj(null);
  };

  const nextData = () => {
    resetFormData();
    resetFormDatas();
    resetDraftData();

    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);
    setFilterConditionsObj(null);
    setQuickFilterIteemsObj(null);

    startForm(
      true,
      modelType,
      undefined,
      initialFormData ? initialFormData : undefined,
      inputMode === "many",
    );
  };

  const sendData = async (modelType: ModelType): Promise<boolean> => {
    let res: DataResoonse | null = null;
    if (!modelContext || !modelType) return false;

    if (inputMode === "single") {
      let item: FormTypeMap[T];
      if (modelType === ModelType.MATCH_FORMAT) {
        item = { ...formData, period: formDatas };
      } else {
        item = formData;
      }

      if (formMode === "create") {
        res = await modelContext.createItem(item);
      } else {
        const difKeys = getDiffKeys && getDiffKeys();
        if (!difKeys || difKeys?.length === 0) {
          handleSetAlert({
            success: false,
            message: "変更点がありません",
          });
          return false;
        }

        const updated: FormTypeMap[T] = Object.fromEntries(
          Object.entries(formData).filter(([key]) => difKeys.includes(key)),
        );

        res = await modelContext.updateItem({
          ...getDefault(modelType),
          ...updated,
        });
      }
    }

    if (inputMode === "many") {
      res = await modelContext.createItems(formDatas);
    }

    if (res?.success) {
      const current = formSteps[currentStep];

      if (!current) return false;
      const addPostedDraftData = current.addPostedDraftData;
      if (addPostedDraftData && res) {
        const newDraftData = addPostedDraftData({
          draftData,
          postedDraftData,
          metaData,
          res,
        });
        setPostedDraftData(newDraftData);
      }

      if (formSteps.length - 1 === currentStep) {
        setIsEditing(false);
      }

      resetFormDatas();
    }

    return res?.success ? true : false;
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
    setInputMode(current.many ? InputMode.MANY : InputMode.SINGLE);
    const onChange = current.onChange;
    const isArray = current.many;
    const checkData = isArray ? states : state;

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
    if (inputMode === "single" && formMode === "create" && onChange) {
      const updatePaires = await onChange(formData, api);

      updatePaires.forEach((da) => {
        singleHandleFormData(da.key as keyof FormTypeMap[T], da.value);
      });
    }

    let newDraftData: DraftData = {};

    if (current.addDraftData) {
      newDraftData = await current.addDraftData({
        data: formData,
        metaData,
        api,
      });
      setDraftData({ ...draftData, ...newDraftData });
    }

    if (current.getDraftData) {
      if (current.many) {
        const { value, label } = current.getDraftData({
          draftData: {
            ...draftData,
            ...newDraftData,
          },
          postedDraftData,
          metaData,
        });

        setFormDatas(value);
        setFormLabels(label);
      } else {
        const { value, label } = current.getDraftData({
          draftData: {
            ...draftData,
            ...newDraftData,
          },
          postedDraftData,
          metaData,
        });

        setFormData(value);
        setFormLabel(label);
      }
    }

    if (current.many && formMode === "create") {
      const fetchValue = current.fetchValue;
      let arrayCheckData = formDatas;
      if (fetchValue) {
        const fetchedValues = await fetchValue(formData, api);
        setFormDatas(fetchedValues);
        arrayCheckData = fetchedValues;
        const resolvedLabels = await Promise.all(
          fetchedValues.map((v) => resolveForeignKeyLabels(v)),
        );
        setFormLabels(resolvedLabels);
      }

      if (onChange) {
        await Promise.all(
          arrayCheckData.map(async (value, index) => {
            const updatePaires = await onChange(value, api);

            updatePaires.forEach((da) => {
              handleFormData(index, da.key as keyof FormTypeMap[T], da.value);
            });
          }),
        );
      }
    }

    // --- many入力時の共通要素
    if (
      inputMode === "many" &&
      bulkCommonData &&
      !isEmptyObject(bulkCommonData) &&
      current.fields
    ) {
      current.fields.forEach((field) => {
        if (field.dataSource === DataSource.BULK_COMMON) {
          setFormDatas([bulkCommonData]);
          setFormLabels([bulkCommonLabel]);
        }
      });
    }

    let nextStepIndex = Math.min(
      currentStep + 1,
      formSteps ? formSteps.length - 1 : 0,
    );

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    if (inputMode === "single") {
      while (stepSkip(nextStepIndex) && nextStepIndex < formSteps.length - 1) {
        nextStepIndex++;
      }
    }

    if (current.createFilterConditions) {
      if (!Array.isArray(checkData)) {
        const filterConditionsObj = await current.createFilterConditions({
          data: formData,
          metaData,
          api,
        });

        if (filterConditionsObj) {
          setFilterConditionsObj((prev) => ({
            ...(prev ?? {}),
            ...filterConditionsObj,
          }));
        }
      }
    }

    if (current.createQuickFilterItems) {
      if (!Array.isArray(checkData)) {
        const quickFilterItemsObj = await current.createQuickFilterItems({
          data: formData,
          metaData,
          api,
        });

        if (quickFilterItemsObj) {
          setQuickFilterIteemsObj((prev) => ({
            ...(prev ?? {}),
            ...quickFilterItemsObj,
          }));
        }
      }
    }

    setCurrentStep(nextStepIndex);
    resetAlert();
  };

  const processStep = async () => {
    const current = formSteps[currentStep];

    if (!current) return;
    if (current.modelType) {
      setModelType(current.modelType as T);
    }

    if (current.type === StepType.CONFIRM) {
      sendData(current.modelType);
    }
    nextStep();
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
    dataSource?: DataSource,
  ) => {
    if (dataSource === DataSource.BULK_COMMON) {
      return setBulkCommonData((prev) =>
        updateFormValue(prev, key, value, setBulkCommonLabel),
      );
    }
    if (dataSource === DataSource.META_DATA) {
      return setMetaData((prev) =>
        updateFormValue(prev, key as string, value, setMetaDataLabel),
      );
    }
    setFormData((prev) => updateFormValue(prev, key, value, setFormLabel));
  };

  const resetFormData = () => {
    setFormData(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    );
    setFormLabel(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    );
    setMetaData({});
    setMetaDataLabel({});
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
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    );
    setBulkCommonLabel(
      modelType ? ({ ...getDefault(modelType) } as FormTypeMap[T]) : {},
    );
    setMetaDatas([]);
    setMetaDataLabels([]);
  };

  const handleFormData = <K extends keyof FormTypeMap[T]>(
    index: number,
    key: K,
    value: FormTypeMap[T][K] | undefined,
    dataSource?: DataSource,
  ) => {
    if (dataSource === DataSource.META_DATA) {
      return setMetaDatas((prev) => {
        const newData = prev.map((item, i) =>
          i === index
            ? updateFormValue(item, key as string, value, (updater) =>
                setMetaDataLabels((prevLabels) => {
                  const arr = [...(prevLabels ?? [])];
                  // 存在チェック：なければ空オブジェクトを入れておく
                  if (!arr[index]) arr[index] = {};
                  arr[index] = updater(arr[index] ?? {});
                  return arr;
                }),
              )
            : item,
        );
        return newData;
      });
    }

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
              }),
            )
          : item,
      );
      return newData;
    });
  };

  const addFormDatas = (
    baseCopy: boolean,
    setPage?: (p: number) => void,
    formData?: FormTypeMap[T],
  ) => {
    const baseData = bulkCommonData ? { ...bulkCommonData } : {};
    const baseLabel = bulkCommonLabel ? { ...bulkCommonLabel } : {};

    const newFormDatas = [
      ...formDatas,
      {
        ...(baseCopy ? baseData : {}),
        ...(formData || {}),
      },
    ];
    const newFormLabels = [
      ...formLabels,
      {
        ...(baseCopy ? baseLabel : {}),
        ...(formData || {}),
      },
    ];

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

    const newMetaDatas = metaDatas.filter((_d, i) => i !== index);
    const newMetaDataLabes = metaDataLabels.filter((_d, i) => i !== index);

    setFormDatas(newFormDatas);
    setFormLabels(newFormLabels);

    setMetaDatas(newMetaDatas);
    setMetaDataLabels(newMetaDataLabes);
  };

  const createFormMenuItems = (
    model: T,
    formInitialData: Partial<FormTypeMap[T]>,
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
    confirmData: Record<string, string | number | undefined>[],
  ) => JSX.Element = modelType ? getConfirmMes(modelType) : () => <></>;

  // 確認画面
  const displayableField = useMemo(
    () =>
      modelType
        ? (fieldDefinition[modelType].filter(
            isDisplayOnDetail,
          ) as DetailFieldDefinition[])
        : [],
    [modelType],
  );

  const value: FormContextValue<T> = {
    modelType,
    inputMode,

    formOperator: {
      startForm,
    },
    isEditing,
    formMode,

    single: {
      handleFormData: singleHandleFormData,
      state,
      stateLabel,
    },

    many: {
      bulkCommonData,
      bulkCommonLabel,
      handleFormData,
      addFormDatas,
      deleteFormDatas,
      renderConfirmMes: renderer,
      state: states,
      stateLabel: stateLabels,
    },

    steps: {
      currentStep,
      formSteps,
      prevStep,
      nextData,
      handleStep,
      processStep,
    },

    displayableField,
    getDiffKeys,
    createFormMenuItems,
    autoFill,
    filterConditionsObj,
    removeFilterConditionsObj,
    quickFilterItemsObj,
    removeQuickFilterItemsObj,
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
