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
    filterConditionsObj,
  } = useForm<T>();

  const current = formSteps[currentStep];

  if (!current.fields || current.fields?.length === 0) {
    return <></>;
  }

  if (current.many) {
    return <></>;
  }

  return (
    <>
      {current.fields.map((field, fieldIndex) => {
        const stepTotal = current?.fields?.length ?? 0;
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
                current.dataSource === DataSource.BULK_COMMON
                  ? many?.bulkCommonData || {}
                  : single.state
              }
              formLabel={
                current.dataSource === DataSource.BULK_COMMON
                  ? many?.bulkCommonLabel || {}
                  : single.stateLabel
              }
              handleFormData={(props) =>
                single.handleFormData({
                  ...props,
                  dataSource: current.dataSource,
                })
              }
              supportButton={!current.many}
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
