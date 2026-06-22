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
  ApplyStateValue,
  DataSource,
  FilterConditionsByKey,
  FormState,
  FormStep,
  QuickFilterItemsByKey,
  StepType,
  UpdateData,
} from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/form/updateFormValue";
import { getSteps } from "../lib/form-steps/core/getSteps";
import { fieldDefinition } from "../lib/model-fields";
import { DetailFieldDefinition, isDisplayOnDetail } from "../types/field";
import { api } from "./api-context";
import { getDefault } from "../lib/default-formData";
import { useModelContext } from "./models/model-wrapper";
import { FormMode, From, InputMode, StartFormArgs } from "../types/types";
import { DraftData } from "../types/form/draftData";
import { PostedDraftData } from "../types/form/postedDraftData";
import { OptionObj } from "../types/form/option";
import {
  ArrayHandleFormData,
  HandleFormData,
} from "../types/form/handleFormData";
import { getDiffKeys } from "../utils/comparison";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { checkRequiredFields } from "../utils/form/checkRequiredFields";
import { resolveForeignKeyLabels } from "../utils/data/resolveForeignKeyLabels";
import { validateFun } from "../lib/form-engine/validateFun";
import { advanceStep } from "../lib/form-engine/advanceStep";

type AddFormDatasParams<T extends ModelType> = {
  setPage?: (p: number) => void;
  formData?: FormTypeMap[T];
  formLabel?: Record<string, any>;

  duplicateCheck?: (
    existing: FormTypeMap[T],
    incoming: FormTypeMap[T],
  ) => boolean;
};

type FormContextValue<T extends ModelType> = {
  modelType: T | null;
  inputMode: InputMode;

  formOperator: {
    startForm: ({}: StartFormArgs<T>) => Promise<boolean>;
  };

  isEditing: boolean;
  formMode: FormMode;
  isProcessing: boolean;

  single: {
    handleFormData: HandleFormData<T>;
    state: Record<string, any>;
    stateLabel: Record<string, any>;
    originalData: UpdateData<T> | null;
  };

  many?: {
    bulkCommonData: FormTypeMap[T];
    bulkCommonLabel: Record<string, any>;
    handleFormData: ArrayHandleFormData<T>;
    addFormDatas: (params: AddFormDatasParams<T>) => void;
    deleteFormDatas: (index: number) => void;
    renderConfirmMes: (
      confirmData: Record<string, string | number | undefined>[],
    ) => JSX.Element;
    state: Record<string, any>[];
    stateLabel: Record<string, any>[];

    originalDatas: UpdateData<T>[] | null;
  };

  steps: {
    currentStep: number;
    formSteps: FormStep<T>[];
    prevStep: () => void;
    nextData: () => void;
    handleStep: (nextStepIndex: number) => void;
    processStep: () => Promise<void>;
  };

  options: Record<string, OptionObj<any>>;

  displayableField: DetailFieldDefinition[];
  autoFill: (() => Promise<void>) | undefined;
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

  const [originalData, setOriginalData] = useState<UpdateData<T> | null>(null);
  const [originalDatas, setOriginalDatas] = useState<UpdateData<T>[]>([]);

  const [options, setOptions] = useState<Record<string, OptionObj<any>>>({});

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const resetOptions = () => {
    setOptions({});
  };

  useEffect(() => {
    const newState: Record<string, any> = {
      ...bulkCommonData,
      ...metaData,
      ...formData,
    };
    setState(newState);
  }, [formData, metaData, bulkCommonData]);

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
      ...bulkCommonLabel,
      ...metaDataLabel,
      ...formLabel,
    };
    setStateLabel(newStateLabel);
  }, [formLabel, metaDataLabel, bulkCommonLabel]);

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

  const applyState = (result: ApplyStateValue<T>) => {
    const { values, options, filterConditionsObj, quickFilterItemsObj } =
      result;
    setFormData(values.formData);
    setFormLabel(values.formLabel);
    setBulkCommonData(values.bulkCommonData);
    setBulkCommonLabel(values.bulkCommonLabel);
    setFormDatas(values.formDatas);
    setFormLabels(values.formLabels);
    setMetaData(values.metaData);
    setMetaDataLabel(values.metaDataLabel);
    setMetaDatas(values.metaDatas);
    setMetaDataLabels(values.metaDataLabels);
    setDraftData(values.draftData);
    setPostedDraftData(values.postedDraftData);

    setOptions(options);
    setFilterConditionsObj(filterConditionsObj);
    setQuickFilterIteemsObj(quickFilterItemsObj);
  };

  type StartForm<T extends ModelType> = StartFormArgs<T> & {
    steps?: FormStep<T>[];
  };

  const startForm = async (args: StartForm<T>): Promise<boolean> => {
    setIsProcessing(true);

    const failed = () => {
      setIsProcessing(false);
      return false;
    };

    let newSteps: FormStep<T>[];
    if (args.steps) {
      newSteps = args.steps;
    } else {
      if (!args.modelType) {
        console.error("error in startForm : modelType");
        return failed();
      }

      const stepsObj = getSteps(args);

      if (!stepsObj) console.error("error in startForm : getSteps");

      if (!stepsObj?.steps) return failed();

      newSteps = stepsObj?.steps;
    }

    let newFormData: FormTypeMap[T] = {};
    let newFormDatas = [newFormData];
    let newMetaData: Record<string, any> =
      args.formMode === FormMode.CREATE &&
      args.initialData &&
      args.initialData.metaData
        ? args.initialData.metaData
        : {};

    if (
      args.formMode === FormMode.CREATE &&
      args.initialData &&
      args.initialData.formData
    ) {
      newFormData = {
        ...getDefault(args.modelType),
        ...args.initialData?.formData,
      };

      setInitialFormData(newFormData);
    } else if (
      args.formMode === FormMode.UPDATE &&
      args.inputMode === InputMode.SINGLE
    ) {
      if (modelType === ModelType.MATCH_FORMAT) {
        const matchFormatEditItem =
          args.editItem as GettedModelDataMap[ModelType.MATCH_FORMAT];
        const dat = args.editItem && {
          ...getDefault(ModelType.MATCH_FORMAT),
          ...convertGettedToForm(ModelType.MATCH_FORMAT, matchFormatEditItem),
        };
        const periodArray = dat && "period" in dat ? dat["period"] || [] : [];

        newFormDatas = periodArray as FormTypeMap[ModelType.MATCH_FORMAT][];

        const { period, ...data } = matchFormatEditItem;
        newFormData = convertGettedToForm(ModelType.MATCH_FORMAT, {
          ...data,
          period: [],
        });
      }

      const originalData = {
        _id: args.id,
        ...getDefault(args.modelType),
        ...convertGettedToForm(args.modelType, args.editItem),
      };

      newFormData = originalData;
      setOriginalData(originalData);
    } else if (
      args.formMode === FormMode.UPDATE &&
      args.inputMode === InputMode.MANY
    ) {
      const newOriginalDatas: UpdateData<T>[] = args.editItem.flatMap(
        (item, i) => {
          const newData = {
            _id: args.ids[i],
            ...getDefault(args.modelType),
            ...convertGettedToForm(args.modelType, item),
          };
          return newData;
        },
      );

      newFormDatas = newOriginalDatas;
      setOriginalDatas(newOriginalDatas);
    }

    let newFormLabel = await resolveForeignKeyLabels(api, newFormData);
    let newFormLabels = await Promise.all(
      newFormDatas.map((data) => resolveForeignKeyLabels(api, data)),
    );
    let newMetaDataLabel = await resolveForeignKeyLabels(api, newMetaData);

    let updatingValues: FormState<T> = {
      formData: newFormData,
      formLabel: newFormLabel,
      bulkCommonData: args.inputMode === InputMode.MANY ? newFormData : {},
      bulkCommonLabel: args.inputMode === InputMode.MANY ? newFormLabel : {},
      formDatas: newFormDatas,
      formLabels: newFormLabels,
      metaData: newMetaData,
      metaDataLabel: newMetaDataLabel,
      metaDatas: [],
      metaDataLabels: [],
      draftData: {},
      postedDraftData: {},
    };

    let newNextStepIndex = 0;
    if (args.formMode === FormMode.CREATE && args.initialData) {
      const { index, result } = await advanceStep(
        api,
        newSteps,
        updatingValues,
        {
          options,
          filterConditionsObj,
          quickFilterItemsObj,
        },
      );
      newNextStepIndex = index;
      applyState(result);
    } else if (args.formMode === FormMode.CREATE) {
      applyState({
        values: updatingValues,
        filterConditionsObj: {},
        quickFilterItemsObj: {},
        options: {},
      });
    } else if (args.formMode === FormMode.UPDATE) {
      newSteps = newSteps.filter((step) => {
        if (step.many) return step;
        if (!step.dataSource) return step;
      });
      newNextStepIndex = newSteps.length - 1;
      applyState({
        values: updatingValues,
        filterConditionsObj: {},
        quickFilterItemsObj: {},
        options: {},
      });
    }

    setCurrentStep(newNextStepIndex);

    setInputMode(args.inputMode);
    setFormMode(args.formMode);
    setFormSteps(newSteps);
    setModelType(args.modelType);
    setIsEditing(true);

    setIsProcessing(false);
    return true;
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
        relatedAll: false,
        steps: formSteps,
      });
    }
  };

  const sendData = async (modelType: ModelType): Promise<boolean> => {
    if (!modelContext || !modelType) return false;
    let success: boolean = false;

    if (formMode === FormMode.CREATE) {
      let res: CreateItemResponse<FormTypeMap[T] | FormTypeMap[T][]> | null =
        null;

      if (inputMode === InputMode.SINGLE) {
        let item: FormTypeMap[T];
        if (modelType === ModelType.MATCH_FORMAT) {
          item = { ...formData, period: formDatas };
        } else {
          item = formData;
        }

        res = await modelContext.createItem(item);
      }

      if (inputMode === InputMode.MANY) {
        res = await modelContext.createItems(formDatas);
      }
      success = res?.success || false;

      if (success) {
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
    } else {
      if (inputMode === InputMode.SINGLE) {
        if (!originalData?._id) {
          handleSetAlert({
            success: false,
            message: "id設定ミス",
          });
          return false;
        }

        const difKeys = [
          ...getDiffKeys(originalData, formData),
          ...getDiffKeys(formData, originalData),
        ];

        if (difKeys?.length === 0) {
          handleSetAlert({
            success: false,
            message: "変更点がありません",
          });
          return false;
        }

        const updated: Record<string, any> = {};

        difKeys.forEach((key) => {
          if (key in formData) {
            updated[key] = formData[key as keyof typeof formData];
          } else {
            updated[key] = null;
          }
        });

        success = await modelContext.updateItem(originalData._id, {
          ...getDefault(modelType),
          ...updated,
        });
      } else if (inputMode === InputMode.MANY) {
        const updateDatas: UpdateData<T>[] = originalDatas.flatMap(
          (originalData, i) => {
            const formData = formDatas[i];
            const difKeys = [
              ...getDiffKeys(originalData, formData),
              ...getDiffKeys(formData, originalData),
            ];

            if (difKeys.length === 0) return [];

            const updated: Record<string, any> & { _id: string } = {
              _id: originalData._id,
            };
            difKeys.forEach((key) => {
              if (key in formData) {
                updated[key] = formData[key as keyof typeof formData];
              } else {
                updated[key] = null;
              }
            });

            const updatedData: UpdateData<T> = updated;

            return [
              {
                ...updatedData,
                ...getDefault(modelType),
              },
            ];
          },
        );

        if (updateDatas.length === 0) {
          handleSetAlert({
            success: false,
            message: "変更点がありません",
          });
          return false;
        } else {
          success = await modelContext.updateItems(updateDatas);
        }
      }
    }

    return success;
  };

  const nextStep = async (): Promise<void> => {
    const current = formSteps[currentStep];

    if (!current) return;

    let updatingValues: FormState<T> = {
      formData,
      formLabel,
      bulkCommonData,
      bulkCommonLabel,
      formDatas,
      formLabels,
      metaData,
      metaDataLabel,
      metaDatas,
      metaDataLabels,
      draftData,
      postedDraftData,
    };

    // --- 必須チェック ---
    const requiredCheck = checkRequiredFields(
      current.fields,
      current.many ? states : state,
    );
    if (!requiredCheck.success) {
      return handleSetAlert(requiredCheck);
    }

    const valid = validateFun(current, updatingValues);
    handleSetAlert(valid);

    const { index, result } = await advanceStep(
      api,
      formSteps,
      updatingValues,
      {
        options,
        filterConditionsObj,
        quickFilterItemsObj,
      },
      currentStep,
    );

    applyState(result);

    const nextStep = formSteps[index];
    if (nextStep.type === StepType.FORM) {
      const newInputMode = nextStep.many ? InputMode.MANY : InputMode.SINGLE;
      setInputMode(newInputMode);
    }

    setCurrentStep(index);
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
    setCurrentStep(nextStepIndex);
  };

  const handleStep = (nextStepIndex: number) => {
    setCurrentStep(nextStepIndex);
  };

  ////////////////////////// single data edit //////////////////////////

  const singleHandleFormData: HandleFormData<T> = ({
    key,
    value,
    field,
    dataSource,
    updateMode,
    index,
  }) => {
    if (dataSource === DataSource.BULK_COMMON) {
      const { updatedValue, updatedLabel } = updateFormValue({
        prev: bulkCommonData,
        prevLabel: bulkCommonLabel,
        key,
        value,
        field,
        updateMode,
        index,
      });

      setBulkCommonData(updatedValue);
      setBulkCommonLabel(updatedLabel);
    } else if (dataSource === DataSource.META_DATA) {
      const { updatedValue, updatedLabel } = updateFormValue({
        prev: metaData,
        prevLabel: metaDataLabel,
        key: key as keyof typeof metaData,
        value,
        field,
        updateMode,
        index,
      });

      setMetaData(updatedValue);
      setMetaDataLabel(updatedLabel);
    } else {
      const { updatedValue, updatedLabel } = updateFormValue({
        prev: formData,
        prevLabel: formLabel,
        key,
        value,
        field,
        updateMode,
        index,
      });
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

  const handleFormData: ArrayHandleFormData<T> = ({
    index,
    key,
    value,
    field,
    dataSource,
    updateMode,
    dataIndex,
  }) => {
    if (dataSource === DataSource.META_DATA) {
      const newDatas = metaDatas.map((data, targetI) => {
        const label = metaDataLabels[dataIndex];
        if (dataIndex === targetI) {
          const { updatedValue, updatedLabel } = updateFormValue({
            prev: data,
            prevLabel: label,
            key: key as keyof typeof data,
            value,
            field,
            updateMode,
            index,
          });

          return { updatedValue, updatedLabel };
        } else {
          return { updatedValue: data, updatedLabel: label };
        }
      });

      const newMetaDatas = newDatas.map((d) => d.updatedValue);
      const newMetaDataLabels = newDatas.map((d) => d.updatedLabel);

      setMetaDatas(newMetaDatas);
      setMetaDataLabels(newMetaDataLabels);
    } else {
      const newDatas = formDatas.map((data, i) => {
        const label = formLabels[i];

        if (i !== dataIndex) {
          return { updatedValue: data, updatedLabel: label };
        }

        return updateFormValue({
          prev: data,
          prevLabel: label,
          key: key as keyof typeof data,
          value,
          field,
          updateMode,
          index,
        });
      });

      const newFormDatas = newDatas.map((d) => d.updatedValue);
      const newFormLabels = newDatas.map((d) => d.updatedLabel);

      setFormDatas(newFormDatas);
      setFormLabels(newFormLabels);
    }
  };

  const addFormDatas = ({
    setPage,
    formData,
    formLabel,
    duplicateCheck,
  }: AddFormDatasParams<T>) => {
    const baseData = bulkCommonData ? { ...bulkCommonData } : {};
    const baseLabel = bulkCommonLabel ? { ...bulkCommonLabel } : {};

    if (formData && duplicateCheck) {
      const duplicateIndex = formDatas.findIndex((d) =>
        duplicateCheck(d, formData),
      );

      if (duplicateIndex >= 0) {
        setFormDatas(formDatas.filter((_, i) => i !== duplicateIndex));

        setFormLabels(formLabels.filter((_, i) => i !== duplicateIndex));

        return;
      }
    }

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
        ...(formLabel || formData || {}),
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
  const autoFillFun = async (): Promise<void> => {
    const current = formSteps[currentStep];

    if (current.many) {
      const autoFill = current.autoFill;
      if (autoFill) {
        const {
          formDatas: autoFilldFormDatas,
          formLabels: autoFilldFormLabels,
        } = await autoFill({
          formDatas,
          formLabels,
          metaData,
          api,
        });

        setFormDatas(autoFilldFormDatas);
        setFormLabels(autoFilldFormLabels);
      }
    }
  };

  const autoFill =
    formSteps[currentStep] &&
    formSteps[currentStep].many &&
    formSteps[currentStep].autoFill
      ? autoFillFun
      : undefined;

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
    isProcessing,

    formOperator: {
      startForm,
    },
    isEditing,
    formMode,

    single: {
      handleFormData: singleHandleFormData,
      state,
      stateLabel,
      originalData,
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
      originalDatas,
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
