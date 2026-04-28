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
  FilterConditionsByKey,
  FormStep,
  QuickFilterItemsByKey,
  StepType,
} from "../types/form";
import { FormFieldDefinition } from "../types/form/field";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/updateFormValue";
import { getSteps } from "../lib/form-steps/core/getSteps";
import { objectIsEqual } from "../utils";
import { fieldDefinition } from "../lib/model-fields";
import {
  DetailFieldDefinition,
  isDisplayOnDetail,
  isModelType,
} from "../types/field";
import { api } from "./api-context";
import { getDefault } from "../lib/default-formData";
import { useModelContext } from "./models/model-wrapper";
import { getOptionKey } from "../lib/options";
import { FormMode, From, InputMode, StartFormArgs } from "../types/types";
import { DataResoonse } from "../types/api";
import { DraftData } from "../types/form/draftData";
import { PostedDraftData } from "../types/form/postedDraftData";
import { getLabelById } from "../utils/getLabelById";
import { OptionArray, OptionTable } from "../types/form/option";

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

type FormContextValue<T extends ModelType> = {
  modelType: T | null;
  inputMode: InputMode;

  formOperator: {
    startForm: ({}: StartFormArgs<T>) => void;
  };

  isEditing: boolean;
  formMode: FormMode;

  single: {
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K] | undefined,
      dataSource: DataSource | undefined,
      isArray?: boolean,
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
      dataSource?: DataSource,
      isArray?: boolean,
    ) => void;
    addFormDatas: (setPage?: (p: number) => void) => void;
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

  options: Record<string, OptionArray | OptionTable<any>>;

  displayableField: DetailFieldDefinition[];
  getDiffKeys: (() => string[]) | undefined;
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

  const [modelType, setModelType] = useState<T | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [formMode, setFormMode] = useState<FormMode>(FormMode.CREATE);
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
    console.log("metaData", metaData);
    console.log("metaDataLabel", metaDataLabel);
  }, [metaData]);

  const [options, setOptions] = useState<
    Record<string, OptionArray | OptionTable<any>>
  >({});

  const resetOptions = () => {
    setOptions({});
  };

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
          await Promise.all(
            id.map((i) => getLabelById(api, key as ModelType, i)),
          )
        ).filter(Boolean);
      } else {
        resolved[key] = await getLabelById(api, key as ModelType, id);
      }
    }

    return resolved;
  }

  const startForm = async (args: StartFormArgs<T>) => {
    if (!args.modelType) {
      console.error("error in startForm : modelType");
      return;
    }

    const stepsObj = getSteps({
      modelType: args.modelType,
      inputMode: args.inputMode,
      from: args.formMode === FormMode.CREATE ? args.from : undefined,
    });

    if (!stepsObj) console.error("error in startForm : getSteps");

    if (!stepsObj?.steps) return;

    const newSteps = stepsObj?.steps;

    setFormSteps(newSteps);

    if (args.formMode === FormMode.UPDATE) {
      setCurrentStep(newSteps.length - 1);
    } else {
      setCurrentStep(0);
    }

    if (args.inputMode === InputMode.MANY) {
      setInputMode(InputMode.MANY);
    } else {
      setInputMode(InputMode.SINGLE);
    }

    if (args.formMode === FormMode.CREATE) {
      setFormMode(FormMode.CREATE);

      if (args.initialData) {
        if (args.initialData.formData) {
          setInitialFormData(args.initialData.formData);
          const data = {
            ...getDefault(args.modelType),
            ...args.initialData.formData,
          };

          setFormData(data);
          setFormDatas([data]);
          setBulkCommonData(data);
          const resolvedLabels = await resolveForeignKeyLabels(data);
          setFormLabel(resolvedLabels);
          setFormLabels([resolvedLabels]);
          setBulkCommonLabel(resolvedLabels);
        }
        if (args.initialData.metaData) {
          setMetaData(args.initialData.metaData);
          const resolvedLabels = await resolveForeignKeyLabels(
            args.initialData.metaData,
          );
          setMetaDataLabel(resolvedLabels);
        }
      } else {
        resetFormData();
        resetFormDatas();
      }
    } else {
      setFormMode(FormMode.UPDATE);

      if (args.editItem) {
        const newFormData = {
          ...getDefault(args.modelType),
          ...convertGettedToForm(args.modelType, args.editItem),
        };
        setFormData(newFormData);

        const resolvedLabels = await resolveForeignKeyLabels(newFormData);

        setFormLabel(resolvedLabels);
      }

      if (modelType === ModelType.MATCH_FORMAT) {
        const matchFormatEditItem =
          args.editItem as GettedModelDataMap[ModelType.MATCH_FORMAT];
        const dat = args.editItem && {
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

    setModelType(modelType);
    setIsEditing(true);
    setFilterConditionsObj(null);
    setQuickFilterIteemsObj(null);
  };

  const nextData = () => {
    resetFormData();
    resetFormDatas();
    resetDraftData();
    resetOptions();

    setCurrentStep(0);
    resetAlert();
    setIsEditing(true);
    setFilterConditionsObj(null);
    setQuickFilterIteemsObj(null);

    if (modelType) {
      startForm({
        formMode: FormMode.CREATE,
        from: From.NORMAL,
        inputMode,
        modelType,
        initialData: initialFormData
          ? { formData: initialFormData, metaData: undefined }
          : undefined,
      });
    }
  };

  const sendData = async (modelType: ModelType): Promise<boolean> => {
    let res: DataResoonse | null = null;
    if (!modelContext || !modelType) return false;

    if (inputMode === InputMode.SINGLE) {
      let item: FormTypeMap[T];
      if (modelType === ModelType.MATCH_FORMAT) {
        item = { ...formData, period: formDatas };
      } else {
        item = formData;
      }

      if (formMode === FormMode.CREATE) {
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

    if (inputMode === InputMode.MANY) {
      res = await modelContext.createItems(formDatas);
    }

    if (res?.success) {
      const current = formSteps[currentStep];

      if (!current) return false;
      const addPostedDraftData = current.addPostedDraftData;
      if (addPostedDraftData && res) {
        const newPostedDraftData = addPostedDraftData({
          draftData,
          postedDraftData,
          metaData,
          res,
          formLabel,
        });
        setPostedDraftData(newPostedDraftData);
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
    const newInputMode = current.many ? InputMode.MANY : InputMode.SINGLE;
    setInputMode(newInputMode);
    const onChange = current.onChange;
    const isArray = current.many;
    const checkData =
      current.dataSource === DataSource.BULK_COMMON
        ? bulkCommonData
        : isArray === true
          ? states
          : state;

    let newFormData = { ...formData };
    let newFormLabel = { ...formLabel };

    let newBulkCommonData = bulkCommonData;
    let newBulkCommonLabel = bulkCommonLabel;

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
    if (onChange) {
      if (Array.isArray(checkData)) {
        const results = await Promise.all(
          formDatas.map(async (value, index) => {
            const { formData: changedData, formLabel: changedLabel } =
              await onChange(
                { ...bulkCommonData, ...value },
                formLabels[index],
                api,
              );

            return {
              formData: {
                ...value,
                ...(changedData ?? {}),
              },
              formLabel: {
                ...formLabels[index],
                ...(changedLabel ?? {}),
              },
            };
          }),
        );

        const newFormDatas = results.map((r) => r.formData);
        const newFormLabels = results.map((r) => r.formLabel);

        setFormDatas(newFormDatas);
        setFormLabels(newFormLabels);
      } else {
        const { formData: onChangedFormData, formLabel: onChangedFormLabel } =
          await onChange(formData, formLabel, api);
        newFormData = { ...newFormData, ...onChangedFormData };
        newFormLabel = { ...newFormLabel, ...onChangedFormLabel };

        setFormData(newFormData);
        setFormLabel(newFormLabel);
      }

      // 多数データ入力の共通要素適用
      if (current.dataSource === DataSource.BULK_COMMON) {
        const {
          formData: onChangedBulkCommonData,
          formLabel: onChangedBulkCommonLabel,
        } = await onChange(bulkCommonData, bulkCommonLabel, api);
        newBulkCommonData = {
          ...newBulkCommonData,
          ...onChangedBulkCommonData,
        };
        newBulkCommonLabel = {
          ...newBulkCommonLabel,
          ...onChangedBulkCommonLabel,
        };

        setBulkCommonData(newBulkCommonData);
        setBulkCommonLabel(newBulkCommonLabel);
        setFormDatas([newBulkCommonData]);
        setFormLabels([newBulkCommonLabel]);
      }
    }

    if (current.dataSource === DataSource.BULK_COMMON) {
      setFormDatas([newBulkCommonData]);
      setFormLabels([newBulkCommonLabel]);
    }

    // draftData関連
    let newDraftData: DraftData = {};

    if (current.addDraftData) {
      newDraftData = await current.addDraftData({
        data: formData,
        metaData,
        api,
        postedDraftData,
        draftData,
        formLabel,
      });
      setDraftData({ ...draftData, ...newDraftData });
    }

    if (current.getDraftData) {
      if (current.many) {
        const gettedDraftData = await current.getDraftData({
          draftData: {
            ...draftData,
            ...newDraftData,
          },
          postedDraftData,
          metaData,
          api,
        });
        if (gettedDraftData) {
          const { value, label } = gettedDraftData;
          setFormDatas(value);
          setFormLabels(label);
        }
      } else {
        const gettedDraftData = await current.getDraftData({
          draftData: {
            ...draftData,
            ...newDraftData,
          },
          postedDraftData,
          metaData,
          api,
        });
        if (gettedDraftData) {
          const { value, label } = gettedDraftData;
          setFormData(value);
          setFormLabel(label);
        }
      }
    }

    // fetchValues 関連
    if (current.many && formMode === FormMode.CREATE) {
      const fetchValue = current.fetchValue;
      if (fetchValue) {
        const fetchedValues = await fetchValue(formData, api);
        setFormDatas(fetchedValues);
        const resolvedLabels = await Promise.all(
          fetchedValues.map((v) => resolveForeignKeyLabels(v)),
        );
        setFormLabels(resolvedLabels);
      }
    }

    // options関連
    if (current.addOptions) {
      const newOptions = await current.addOptions({
        data: formData,
        metaData,
        api,
        formLabel,
      });
      console.log("newOptions", newOptions);
      setOptions({ ...options, ...newOptions });
    }

    let nextStepIndex = Math.min(
      currentStep + 1,
      formSteps ? formSteps.length - 1 : 0,
    );

    // スキップ可能なステップが続く場合は while で次の有効なステップまで進める
    if (newInputMode === InputMode.SINGLE) {
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
    isArray?: boolean,
  ) => {
    if (dataSource === DataSource.BULK_COMMON) {
      const { updatedValue, updatedLabel } = updateFormValue(
        bulkCommonData,
        bulkCommonLabel,
        key,
        value,
        isArray,
      );

      setBulkCommonData(updatedValue);
      setBulkCommonLabel(updatedLabel);
    } else if (dataSource === DataSource.META_DATA) {
      const { updatedValue, updatedLabel } = updateFormValue(
        metaData,
        metaDataLabel,
        key as string,
        value,
        isArray,
      );

      setMetaData(updatedValue);
      setMetaDataLabel(updatedLabel);
    } else {
      const { updatedValue, updatedLabel } = updateFormValue(
        formData,
        formLabel,
        key,
        value,
        isArray,
      );

      setFormData(updatedValue);
      setFormLabel(updatedLabel);
    }
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
    isArray?: boolean,
  ) => {
    if (dataSource === DataSource.META_DATA) {
      const newDatas = metaDatas.map((data, targetI) => {
        const label = metaDataLabels[index];
        if (index === targetI) {
          const { updatedValue, updatedLabel } = updateFormValue(
            data,
            label,
            String(key),
            value,
            isArray,
          );

          return { updatedValue, updatedLabel };
        } else {
          return { updatedValue: data, updatedLabel: label };
        }
      });

      const newMetaDatas = newDatas.map((d) => d.updatedValue);
      const newMetaDataLabels = newDatas.map((d) => d.updatedValue);

      setMetaDatas(newMetaDatas);
      setMetaDataLabels(newMetaDataLabels);
    } else {
      const newDatas = formDatas.map((data, targetI) => {
        const label = formLabels[index];
        if (index === targetI) {
          const { updatedValue, updatedLabel } = updateFormValue(
            data,
            label,
            key,
            value,
            isArray,
          );

          return { updatedValue, updatedLabel };
        } else {
          return { updatedValue: data, updatedLabel: label };
        }
      });

      const newFormDatas = newDatas.map((d) => d.updatedValue);
      const newFormLabels = newDatas.map((d) => d.updatedValue);

      setFormDatas(newFormDatas);
      setFormLabels(newFormLabels);
    }
  };

  const addFormDatas = (
    setPage?: (p: number) => void,
    formData?: FormTypeMap[T],
  ) => {
    const baseData = bulkCommonData ? { ...bulkCommonData } : {};
    const baseLabel = bulkCommonLabel ? { ...bulkCommonLabel } : {};

    const newFormDatas = [
      ...formDatas,
      {
        ...baseData,
        ...(formData || {}),
      },
    ];
    const newFormLabels = [
      ...formLabels,
      {
        ...baseLabel,
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

  // ////////////////////////////////////////////////////// //
  const autoFill = async (): Promise<void> => {
    const current = formSteps[currentStep];
    const onChange = current?.onChange;

    if (onChange) {
      const results = await Promise.all(
        formDatas.map(async (value, index) => {
          const { formData: changedData, formLabel: changedLabel } =
            await onChange(value, formLabels[index], api);

          return {
            formData: {
              ...value,
              ...(changedData ?? {}),
            },
            formLabel: {
              ...formLabels[index],
              ...(changedLabel ?? {}),
            },
          };
        }),
      );

      const newDatas = results.map((r) => r.formData);
      const newLabels = results.map((r) => r.formLabel);
      setFormDatas(newDatas);
      setFormLabels(newLabels);
    }
  };

  const renderer: (
    confirmData: Record<string, string | number | undefined>[],
  ) => JSX.Element = modelType ? getConfirmMes(modelType) : () => <></>;

  // 確認画面
  const displayableField = useMemo(
    () =>
      modelType
        ? fieldDefinition[modelType]?.filter(isDisplayOnDetail) || []
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

    options,

    displayableField,
    getDiffKeys,
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
