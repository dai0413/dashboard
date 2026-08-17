import { AlertStatus } from "../../../../types/alert";
import { FormStep } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { FormMode } from "../../../../types/types";
import Alert from "../../../layout/Alert";

type FormHeader<T extends keyof FormTypeMap> = {
  modelType: ModelType | null;
  formMode: FormMode;
  formSteps: FormStep<T>[];
  currentStep: number;
  alert: AlertStatus;
  resetAlert: () => void;
};

export const FormHeader = <T extends keyof FormTypeMap>({
  modelType,
  formMode,
  formSteps,
  currentStep,
  alert,
  resetAlert,
}: FormHeader<T>) => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-700 mb-1">
        {formMode === "create"
          ? `${modelType} : 新規データ作成`
          : `${modelType} : 既存データ編集`}
      </h3>

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

      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />
    </>
  );
};
