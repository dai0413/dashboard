import { AlertStatus } from "../../../../types/alert";
import { FormStep } from "../../../../types/form";
import { FormTypeMap } from "../../../../types/models";
import Alert from "../../../layout/Alert";

type FormHeader<T extends keyof FormTypeMap> = {
  headingLabel: string;
  formSteps?: FormStep<T>[];
  currentStep?: number;
  alert: AlertStatus;
  resetAlert: () => void;
};

export const FormHeader = <T extends keyof FormTypeMap>({
  headingLabel,
  formSteps,
  currentStep,
  alert,
  resetAlert,
}: FormHeader<T>) => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-700 mb-1">
        {headingLabel}
      </h3>

      {formSteps && typeof currentStep === "number" && (
        <div>
          <div className="mb-1 text-sm text-gray-500">
            ステップ {currentStep + 1} / {formSteps.length}：
            {formSteps[currentStep].stepLabel || ""}
          </div>

          <div className="flex space-x-2">
            {formSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />
    </>
  );
};
