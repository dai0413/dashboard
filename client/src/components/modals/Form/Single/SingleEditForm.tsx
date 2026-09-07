import { FormTypeMap } from "../../../../types/models";
import { RenderField } from "../Field/Field";
import {
  FilterConditionsByKey,
  FormFieldDefinition,
} from "../../../../types/form";
import { OptionObj } from "../../../../types/form/option";
import { HandleFormData } from "../../../../types/form/handleFormData";

type SingleEditForm<T extends keyof FormTypeMap> = {
  options: Record<string, OptionObj<any>>;
  fields?: FormFieldDefinition<T>[];
  filterConditionsObj: FilterConditionsByKey | null;

  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: HandleFormData<T>;
  displaySupportButton: boolean;
};

const SingleEditForm = <T extends keyof FormTypeMap>({
  options,
  fields,
  filterConditionsObj,
  formData,
  formLabel,
  handleFormData,
  displaySupportButton,
}: SingleEditForm<T>) => {
  if (!fields || fields?.length === 0) {
    return <></>;
  }

  return (
    <>
      {fields.map((field, fieldIndex) => {
        const stepTotal = fields?.length ?? 0;
        const stepIndex = fieldIndex + 1;

        return (
          <div key={field.key as string} className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              <span className="mr-2 text-gray-400">
                {stepIndex}/{stepTotal}
              </span>

              {field.label}

              {field.required && (
                <span className="ml-2 text-xs text-red-500 font-normal">
                  必須
                </span>
              )}
            </label>
            <RenderField
              key={field.key as string}
              field={field}
              formData={formData}
              formLabel={formLabel}
              handleFormData={handleFormData}
              supportButton={displaySupportButton}
              options={options}
              filterConditionsObj={filterConditionsObj}
            />
          </div>
        );
      })}
    </>
  );
};

export default SingleEditForm;
