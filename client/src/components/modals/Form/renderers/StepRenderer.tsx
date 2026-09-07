import {
  DataSource,
  FilterConditionsByKey,
  FormStep,
  StepType,
} from "../../../../types/form";
import { Many } from "../../../../types/form/many";
import { OptionObj } from "../../../../types/form/option";
import { Single } from "../../../../types/form/single";
import { FormTypeMap } from "../../../../types/models";
import { InputMode } from "../../../../types/types";
import BulkConfirmForm from "../Bulk/BulkConfirmForm";
import BulkEditForm from "../Bulk/BulkEditForm";
import SingleConfirmForm from "../Single/SingleConfirmForm";
import SingleEditForm from "../Single/SingleEditForm";

type StepRenderer<T extends keyof FormTypeMap> = {
  inputMode: InputMode;
  isTableOpen: boolean;
  toggleTableOpen: () => void;

  options: Record<string, OptionObj<any>>;
  step: FormStep<T>;
  filterConditionsObj: FilterConditionsByKey | null;
  single: Single<T>;
  many?: Many<T>;
};

export const StepRenderer = <T extends keyof FormTypeMap>({
  inputMode,
  isTableOpen,
  toggleTableOpen,

  options,
  step,
  filterConditionsObj,
  single,
  many,
}: StepRenderer<T>) => {
  if (step.type === StepType.FORM) {
    if (!step.fields || step.fields?.length === 0) {
      return <></>;
    }

    if (
      !step.many &&
      (step.dataSource === DataSource.BULK_COMMON ||
        step.dataSource === DataSource.META_DATA)
    ) {
      return (
        <SingleEditForm
          options={options}
          fields={step.fields}
          filterConditionsObj={filterConditionsObj}
          formData={
            step.dataSource === DataSource.BULK_COMMON
              ? many?.bulkCommonData || {}
              : single.state
          }
          formLabel={
            step.dataSource === DataSource.BULK_COMMON
              ? many?.bulkCommonLabel || {}
              : single.stateLabel
          }
          handleFormData={(props) =>
            single.handleFormData({
              ...props,
              dataSource: step.dataSource,
            })
          }
          displaySupportButton={!step.many}
        />
      );
    }

    if (inputMode === InputMode.MANY || step.many) {
      return (
        <BulkEditForm
          isTableOpen={isTableOpen}
          toggleTableOpen={toggleTableOpen}
        />
      );
    }

    if (inputMode === InputMode.SINGLE) {
      return (
        <SingleEditForm
          options={options}
          fields={step.fields}
          filterConditionsObj={filterConditionsObj}
          formData={single.state}
          formLabel={single.stateLabel}
          handleFormData={single.handleFormData}
          displaySupportButton={!step.many}
        />
      );
    }
  }

  if (step.type === StepType.CONFIRM) {
    return (
      <>
        <SingleConfirmForm />
        <BulkConfirmForm />
      </>
    );
  }

  return null;
};
