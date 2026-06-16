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
  ArrayDataFormStep,
  DataSource,
  FilterConditionsByKey,
  FormStep,
  QuickFilterItemsByKey,
  RecordDataFormStep,
  StepType,
  UpdateData,
} from "../types/form";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../types/models";
import { getConfirmMes } from "../lib/confirm-mes.ts";
import { convertGettedToForm } from "../lib/convert/GettedtoForm";
import { updateFormValue } from "../utils/form/updateFormValue";
import { getSteps } from "../lib/form-steps/core/getSteps";
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
import { DraftData } from "../types/form/draftData";
import { PostedDraftData } from "../types/form/postedDraftData";
import { getLabelById } from "../utils/model/getLabelById";
import { OptionObj } from "../types/form/option";
import {
  ArrayHandleFormData,
  HandleFormData,
} from "../types/form/handleFormData";
import { getDiffKeys } from "../utils/comparison";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { checkRequiredFields } from "../utils/form/checkRequiredFields";

type FormState<T extends keyof FormTypeMap> = {
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  bulkCommonData: FormTypeMap[T];
  bulkCommonLabel: Record<string, any>;
  formDatas: FormTypeMap[T][];
  formLabels: Record<string, any>[];
  metaData: Record<string, any>;
  metaDataLabel: Record<string, any>;
  metaDatas: Record<string, any>[];
  metaDataLabels: Record<string, any>[];
  draftData: DraftData;
  postedDraftData: PostedDraftData;
};

type ApplyStateValue<T extends keyof FormTypeMap> = {
  values: FormState<T>;
  options: Record<string, OptionObj<any>>;
  filterConditionsObj: FilterConditionsByKey | null;
  quickFilterItemsObj: QuickFilterItemsByKey | null;
};

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

  const resetOptions = () => {
    setOptions({});
  };

  useEffect(() => {
    const newState: Record<string, any> = {
      ...formData,
      ...metaData,
      ...bulkCommonData,
    };
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
      ...bulkCommonLabel,
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

  const runStepEffects = async (
    step: FormStep<T>,
    values: FormState<T>,
  ): Promise<ApplyStateValue<T>> => {
    values = await onChangeFun(step, values);
    values = await fetchValueFun(step, values);
    values = await draftDataFun(step, values);

    const newOptions = await addOptionsFun(step, values, options);
    const newFilterConditionsObj = await createFilterConditionsFun(
      step,
      values,
      filterConditionsObj,
    );

    const newQuickFilterItemsObj = await createQuickFilterItemsFun(
      step,
      values,
      quickFilterItemsObj,
    );

    return {
      values,
      options: newOptions,
      filterConditionsObj: newFilterConditionsObj,
      quickFilterItemsObj: newQuickFilterItemsObj,
    };
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

  const advanceStep = async (
    curInd: number,
    formSteps: FormStep<T>[],
    values: FormState<T>,
  ): Promise<number> => {
    const shouldSkip = (index: number) => {
      const step = formSteps[index];

      if (!step || step.many || !step.skip) return false;

      return step.skip(formData, metaData);
    };

    let nextIndex = Math.min(curInd + 1, formSteps.length - 1);

    let result = await runStepEffects(formSteps[curInd], values);

    while (nextIndex < formSteps.length - 1 && shouldSkip(nextIndex)) {
      result = await runStepEffects(formSteps[nextIndex], result.values);

      nextIndex++;
    }

    applyState(result);

    return nextIndex;
  };

  type StartForm<T extends ModelType> = StartFormArgs<T> & {
    steps?: FormStep<T>[];
  };

  const startForm = async (args: StartForm<T>): Promise<boolean> => {
    let newSteps: FormStep<T>[];
    if (args.steps) {
      newSteps = args.steps;
    } else {
      if (!args.modelType) {
        console.error("error in startForm : modelType");
        return false;
      }

      const stepsObj = getSteps(args);

      if (!stepsObj) console.error("error in startForm : getSteps");

      if (!stepsObj?.steps) return false;

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

    let newFormLabel = await resolveForeignKeyLabels(newFormData);
    let newFormLabels = await Promise.all(
      newFormDatas.map((data) => resolveForeignKeyLabels(data)),
    );
    let newMetaDataLabel = await resolveForeignKeyLabels(newMetaData);

    let updatingValues: FormState<T> = {
      formData: newFormData,
      formLabel: newFormLabel,
      bulkCommonData: newFormData,
      bulkCommonLabel: newFormLabel,
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
      newNextStepIndex = await advanceStep(0, newSteps, updatingValues);
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
        console.log("in sendData", formDatas);
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

  const fetchValueFun = async (
    currentStep: FormStep<T>,
    state: FormState<T>,
  ): Promise<FormState<T>> => {
    let { formData, formDatas, formLabels } = state;

    if (
      currentStep.many &&
      formMode === FormMode.CREATE &&
      currentStep.fetchValue
    ) {
      const fetchValue = currentStep.fetchValue;

      formDatas = await fetchValue(formData, api);
      formLabels = await Promise.all(
        formDatas.map((v) => resolveForeignKeyLabels(v)),
      );

      setFormDatas(formDatas);
      setFormLabels(formLabels);
    }

    return { ...state, formDatas, formLabels };
  };

  const addOptionsFun = async (
    currentStep: FormStep<T>,
    values: FormState<T>,
    options: Record<string, OptionObj<any>>,
  ): Promise<Record<string, OptionObj<any>>> => {
    let newOptions = options;

    if (currentStep.addOptions) {
      const addedOptions = await currentStep.addOptions({
        data: values.formData,
        metaData: values.metaData,
        api,
        formLabel: values.formLabel,
      });
      newOptions = { ...options, ...addedOptions };
    }

    return newOptions;
  };

  const createFilterConditionsFun = async (
    currentStep: FormStep<T>,
    values: FormState<T>,
    filterConditionsObj: FilterConditionsByKey | null,
  ): Promise<FilterConditionsByKey | null> => {
    let newFilterConditionsObj = filterConditionsObj;
    if (currentStep.createFilterConditions) {
      const filterConditions = await currentStep.createFilterConditions({
        data: values.formData,
        metaData: values.metaData,
        api,
      });

      newFilterConditionsObj = {
        ...newFilterConditionsObj,
        ...filterConditions,
      };
    }

    return newFilterConditionsObj;
  };

  const createQuickFilterItemsFun = async (
    currentStep: FormStep<T>,
    values: FormState<T>,
    quickFilterItemsObj: QuickFilterItemsByKey | null,
  ): Promise<QuickFilterItemsByKey | null> => {
    let newQuickConditionsObj = quickFilterItemsObj;

    if (currentStep.createQuickFilterItems) {
      const quickFilterItemsObj = await currentStep.createQuickFilterItems({
        data: values.formData,
        metaData: values.metaData,
        api,
      });

      newQuickConditionsObj = {
        ...newQuickConditionsObj,
        ...quickFilterItemsObj,
      };
    }

    return newQuickConditionsObj;
  };

  const draftDataFun = async (
    currentStep: FormStep<T>,
    values: FormState<T>,
  ): Promise<FormState<T>> => {
    let {
      draftData,
      formData,
      formLabel,
      metaData,
      metaDataLabel,
      postedDraftData,
      formDatas,
      formLabels,
    } = values;

    if (currentStep.addDraftData) {
      draftData = await currentStep.addDraftData({
        data: formData,
        metaData,
        api,
        postedDraftData,
        draftData,
        formLabel,
      });
      setDraftData(draftData);
    }

    if (currentStep.getDraftData) {
      if (currentStep.many) {
        const gettedDraftData = await currentStep.getDraftData({
          draftData,
          postedDraftData,
          metaData,
          formLabel: {
            ...metaDataLabel,
            ...formLabel,
          },
          api,
        });
        if (gettedDraftData) {
          formDatas = gettedDraftData.value;
          formLabels = gettedDraftData.label;
          setFormDatas(formDatas);
          setFormLabels(formLabels);
        }
      } else {
        const gettedDraftData = await currentStep.getDraftData({
          draftData,
          postedDraftData,
          metaData,
          formLabel: {
            ...values.metaDataLabel,
            ...state.formLabel,
          },
          api,
        });
        if (gettedDraftData) {
          formData = gettedDraftData.value;
          formLabel = gettedDraftData.label;
          setFormData(formData);
          setFormLabel(formLabel);
        }
      }
    }

    return {
      ...values,
      draftData,
      formData,
      formLabel,
      metaData,
      metaDataLabel,
      postedDraftData,
      formDatas,
      formLabels,
    };
  };

  const onChangeFun = async (
    currentStep: FormStep<T>,
    values: FormState<T>,
  ): Promise<FormState<T>> => {
    let {
      formData,
      formLabel,
      bulkCommonData,
      bulkCommonLabel,
      formDatas,
      formLabels,
    } = values;

    if (currentStep.many) {
      const result = await onChangeBulkFun(currentStep, formDatas, formLabels);

      formDatas = result.formDatas;
      formLabels = result.formLabels;
    } else {
      const result = await onChangeSingleFun(
        currentStep,
        formData,
        formLabel,
        bulkCommonData,
        bulkCommonLabel,
      );

      formData = result.formData;
      formLabel = result.formLabel;
      bulkCommonData = result.bulkCommonData;
      bulkCommonLabel = result.bulkCommonLabel;
    }

    return {
      ...values,
      formData,
      formLabel,
      bulkCommonData,
      bulkCommonLabel,
      formDatas,
      formLabels,
    };
  };

  const onChangeSingleFun = async (
    currentStep: RecordDataFormStep<T>,
    formData: FormTypeMap[T],
    formLabel: Record<string, any>,
    bulkCommonData: FormTypeMap[T],
    bulkCommonLabel: Record<string, any>,
  ) => {
    let newFormData = formData;
    let newFormLabel = formLabel;

    let newBulkCommonData = bulkCommonData;
    let newBulkCommonLabel = bulkCommonLabel;

    if (currentStep.onChange) {
      const onChange = currentStep.onChange;

      if (currentStep.dataSource === DataSource.BULK_COMMON) {
        const {
          formData: onChangedBulkCommonData,
          formLabel: onChangedBulkCommonLabel,
        } = await onChange({
          formData: bulkCommonData,
          formLabel: bulkCommonLabel,
          metaData,
          api,
        });
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
      } else {
        // formData更新
        const { formData: onChangedFormData, formLabel: onChangedFormLabel } =
          await onChange({ formData, formLabel, metaData, api });
        newFormData = { ...newFormData, ...onChangedFormData };
        newFormLabel = { ...newFormLabel, ...onChangedFormLabel };

        setFormData(newFormData);
        setFormLabel(newFormLabel);
      }
    }

    return {
      formData: newFormData,
      formLabel: newFormLabel,
      bulkCommonData: newBulkCommonData,
      bulkCommonLabel: newBulkCommonLabel,
    };
  };

  const onChangeBulkFun = async (
    currentStep: ArrayDataFormStep<T>,
    formDatas: FormTypeMap[T][],
    formLabels: Record<string, any>[],
  ) => {
    let newFormDatas = formDatas;
    let newFormLabels = formLabels;

    if (currentStep.onChange) {
      const onChange = currentStep.onChange;
      const { formDatas: onChangedFormDatas, formLabels: onChangedFormLabels } =
        await onChange({
          formDatas,
          formLabels,
          metaData,
          api,
        });

      newFormDatas = formDatas.map((formData, index) => ({
        ...formData,
        ...onChangedFormDatas[index],
      }));

      newFormLabels = formLabels.map((formLabel, index) => ({
        ...formLabel,
        ...onChangedFormLabels[index],
      }));

      setFormDatas(newFormDatas);
      setFormLabels(newFormLabels);
    }

    return {
      formDatas: newFormDatas,
      formLabels: newFormLabels,
    };
  };

  const validateFun = (currentStep: FormStep<T>, values: FormState<T>) => {
    if (currentStep.many && currentStep.validate) {
      const { formDatas, formLabels, metaDatas, metaDataLabels } = values;

      for (const [i, d] of (formDatas ?? []).entries()) {
        const valid = currentStep.validate(
          { ...d, ...metaDatas[i] },
          { ...formLabels[i], ...metaDataLabels[i] },
        );

        if (!valid.success) {
          return handleSetAlert(valid);
        }
      }
    } else if (!currentStep.many && currentStep.validate) {
      const { formData, formLabel, metaData, metaDataLabel } = values;

      const valid = currentStep.validate(
        { ...formData, ...metaData },
        { ...formLabel, ...metaDataLabel },
      );
      if (!valid.success) return handleSetAlert(valid);
    }
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

    validateFun(current, updatingValues);

    const nextStepIndex = await advanceStep(
      currentStep,
      formSteps,
      updatingValues,
    );

    const nextStep = formSteps[nextStepIndex];
    if (nextStep.type === StepType.FORM) {
      const newInputMode = nextStep.many ? InputMode.MANY : InputMode.SINGLE;
      setInputMode(newInputMode);
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
