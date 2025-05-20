import { useState } from "react";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FieldDefinition } from "../../types/form";
import Alert from "../layout/Alert";
import { TransferState } from "../../context/transfer-context";
import { useAlert } from "../../context/alert-context";
import { useOptions } from "../../context/options-provider";

const renderField = <T extends Record<string, any>>(
  field: FieldDefinition<T>,
  formData: any,
  handleFormData: (key: keyof T, value: any) => void
) => {
  const { key, label, type } = field;
  const { getOptions } = useOptions();

  const inputType =
    type === "number" ? "number" : type === "date" ? "date" : "text";

  return (
    <div key={key as string} className="mb-4">
      <label className="block text-gray-600 text-sm font-medium mb-1">
        {label}
      </label>

      {type === "select" ? (
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData[key] ?? ""}
          onChange={(e) => {
            const selectedValue = e.target.value || null;
            handleFormData(key, selectedValue);
          }}
        >
          <option value="">未選択</option>
          {getOptions(field.key as string)?.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "multiurl" ? (
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={(formData[key] ?? []).join("\n")}
          onChange={(e) => {
            const urls = e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            handleFormData(key, urls);
          }}
        />
      ) : (
        <input
          type={inputType}
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={
            inputType === "date"
              ? formData[key] instanceof Date
                ? formData[key].toISOString().split("T")[0]
                : formData[key]
              : formData[key] ?? ""
          }
          onChange={(e) => {
            let newValue: any = e.target.value;
            if (inputType === "number") {
              newValue = Number(newValue);
            } else if (inputType === "date") {
              newValue = new Date(newValue);
            }
            handleFormData(key, newValue);
          }}
        />
      )}
    </div>
  );
};

type FormProps = {
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contextState: TransferState;
};

const Form = ({ formOpen, setFormOpen, contextState }: FormProps) => {
  const {
    formData,
    formSteps,
    handleFormData,
    createTransfer: onSubmit,
  } = contextState;
  const {
    modal: { alert, handleSetAlert, resetAlert },
  } = useAlert();
  const { getOptions } = useOptions();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    resetAlert();
  };

  const nextStepWithValidation = () => {
    const current = formSteps[currentStep];

    if (current.validate) {
      const valid = current.validate(formData);
      if (!valid.success) return handleSetAlert(valid);
      return nextStep();
    }

    const missing = current.fields?.filter(
      (f) => f.required && !formData[f.key]
    );

    if (missing && missing?.length > 0) {
      const payload = {
        success: false,
        message: `${missing[0].label}は必須項目です。`,
      };
      return handleSetAlert(payload);
    }

    return nextStep();
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
      <Alert success={alert?.success || false} message={alert?.message} />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {"新規データ作成"}
      </h3>

      {!formSteps || formSteps.length === 0 ? null : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            ステップ {currentStep + 1} / {formSteps.length}：
            {formSteps[currentStep].stepLabel}
          </div>

          <div className="flex space-x-2 mb-4">
            {formSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {formSteps[currentStep].type === "form" &&
          formSteps[currentStep].fields ? (
            formSteps[currentStep].fields.map((field) =>
              renderField(field, formData, handleFormData)
            )
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(formData).map(([key, value]) => {
                const field = formSteps
                  .flatMap((step) => step.fields || [])
                  .find((f) => f.key === key);

                let displayValue = value;

                if (field?.type === "select") {
                  const options = getOptions(key);
                  const selected = options?.find((opt) => opt.key === value);
                  displayValue = selected?.label || "未選択";
                }

                if (field?.type === "date" && value) {
                  try {
                    const date = new Date(value as string);
                    displayValue = new Intl.DateTimeFormat("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(date);
                  } catch {
                    // 無効な日付ならそのまま表示
                  }
                }

                return (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-semibold">{field?.label ?? key}</span>
                    <span>{String(displayValue)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <LinkButtonGroup
            approve={{
              text: currentStep === formSteps.length - 1 ? "追加" : "次へ",
              color: "green",
              disabled: currentStep === formSteps.length,
              onClick:
                currentStep === formSteps.length - 1
                  ? onSubmit
                  : nextStepWithValidation,
            }}
            deny={{
              text: "戻る",
              color: "red",
              onClick: prevStep,
              disabled: currentStep === 0,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default Form;
