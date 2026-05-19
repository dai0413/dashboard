import { FormTypeMap } from "../../../../types/models";
import { RenderField } from "../Field/Field";
import { useForm } from "../../../../context/form-context";
import { DataSource } from "../../../../types/form";

const SingleEditForm = <T extends keyof FormTypeMap>() => {
  const {
    many,
    single,
    options,
    steps: { formSteps, currentStep },
  } = useForm<T>();

  if (!formSteps[currentStep].fields) return <></>;

  return (
    <>
      {formSteps[currentStep].fields.map((field, fieldIndex) => {
        const stepTotal = formSteps[currentStep]?.fields?.length ?? 0;
        const stepIndex = fieldIndex + 1;

        return (
          <div key={field.key as string} className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              <span className="mr-2 text-gray-400">
                {stepIndex}/{stepTotal}
              </span>
              {field.label}
            </label>
            <RenderField
              key={field.key as string}
              field={field}
              formData={
                formSteps[currentStep].dataSource === DataSource.BULK_COMMON
                  ? many?.bulkCommonData || {}
                  : single.state
              }
              formLabel={
                formSteps[currentStep].dataSource === DataSource.BULK_COMMON
                  ? many?.bulkCommonLabel || {}
                  : single.stateLabel
              }
              handleFormData={(props) =>
                single.handleFormData({
                  ...props,
                  dataSource: formSteps[currentStep].dataSource,
                })
              }
              supportButton={!formSteps[currentStep].many}
              options={options}
            />
          </div>
        );
      })}
    </>
  );
};

export default SingleEditForm;
