import { useState } from "react";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FieldDefinition } from "../../types/form";
import Alert from "../layout/Alert";
import { TransferState } from "../../context/transfer-context";
import { useModalAlert } from "../../context/modal-alert-context";

const renderField = <T extends Record<string, any>>(
  field: FieldDefinition<T>,
  formData: any,
  handleFormData: (key: keyof T, value: any) => void
) => {
  const { key, label, type, options } = field;

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
          {options?.map((option) => (
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
  contextHook: () => TransferState;
};

const Form = ({ formOpen, setFormOpen, contextHook }: FormProps) => {
  const {
    formData,
    formSteps,
    handleFormData,
    resetFormData,
    createTransfer: onSubmit,
  } = contextHook();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const { message, error } = useModalAlert();

  if (!formSteps || formSteps.length === 0) return null;

  return (
    <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
      <Alert message={message} error={error} />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {"新規データ作成"}
      </h3>

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
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="font-semibold">{key}</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      <LinkButtonGroup
        approve={{
          text: currentStep === formSteps.length - 1 ? "追加" : "次へ",
          color: "green",
          disabled: currentStep === formSteps.length,
          onClick: currentStep === formSteps.length - 1 ? onSubmit : nextStep,
        }}
        deny={{
          text: "戻る",
          color: "red",
          onClick: prevStep,
          disabled: currentStep === 0,
        }}
        reset={{
          text: "リセット",
          color: "gray",
          onClick: resetFormData,
        }}
      />
    </Modal>
  );
};

export default Form;
