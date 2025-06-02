import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FieldDefinition } from "../../types/form";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useOptions } from "../../context/options-provider";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Table } from "../table";
import { useForm } from "../../context/form-context";
import { TransferForm } from "../../types/models/transfer";

type RenderFieldProps<T extends Record<string, any>> = {
  field: FieldDefinition<T>;
  formData: T;
  handleFormData: <K extends keyof T>(key: K, value: T[K]) => void;
};

const RenderField = <T extends Record<string, any>>({
  field,
  formData,
  handleFormData,
}: RenderFieldProps<T>) => {
  const { key, label, type } = field;
  const { getOptions, updateFilter, filters } = useOptions();

  const inputType =
    type === "number" ? "number" : type === "date" ? "date" : "text";

  console.log(formData, key, formData[key]);
  const stringKey = key as string;

  return (
    <div key={stringKey} className="mb-4">
      <label className="block text-gray-600 text-sm font-medium mb-1">
        {label}
      </label>

      {type === "table" ? (
        <>
          <div className="mb-2 text-gray-700">
            選択中:{" "}
            {getOptions(field.key as string).find(
              (f) => f.key === formData[key]
            )?.label || "未選択"}
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={filters[field.key as string]?.value || ""}
              onChange={(e) =>
                updateFilter(field.key as string, e.target.value)
              }
              placeholder="フィルター..."
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>
          <Table
            data={getOptions(field.key as string)}
            headers={[{ label: "名前", field: "label" }]}
            form={true}
            onClick={(row) => {
              handleFormData(stringKey, row.key as T[keyof T]);
            }}
            selectedKey={formData[key]}
            itemsPerPage={10}
          />
        </>
      ) : type === "select" ? (
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData[key] ?? ""}
          onChange={(e) => {
            const selectedValue = e.target.value || null;
            handleFormData(stringKey, selectedValue as T[keyof T]);
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
        <>
          {(formData[key] ?? [""]).map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={item}
                onChange={(e) => {
                  const value = e.target.value;
                  const newValue = [...(formData[key] ?? [])];
                  newValue[index] = value;

                  // 入力されたのが最後の要素かつ空だった場合、新たな空欄を追加
                  if (
                    index === newValue.length - 1 &&
                    value.trim() !== "" &&
                    !newValue.includes("")
                  ) {
                    newValue.push("");
                  }

                  handleFormData(stringKey, newValue as T[keyof T]);
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const newValue = [...formData[key]];
                  newValue.splice(index, 1);
                  handleFormData(stringKey, newValue as T[keyof T]);
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </>
      ) : type === "multiselect" ? (
        <>
          {(formData[key] ?? []).map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                value={item}
                onChange={(e) => {
                  const newValue = [...formData[key]];
                  newValue[index] = e.target.value;
                  handleFormData(stringKey, newValue as T[keyof T]);
                }}
              >
                <option value="">未選択</option>
                {getOptions(field.key as string)?.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const newValue = [...formData[key]];
                  newValue.splice(index, 1);
                  handleFormData(stringKey, newValue as T[keyof T]);
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          ))}

          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value=""
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) {
                const current = formData[key] ?? [];
                handleFormData(stringKey, [...current, selected] as T[keyof T]);
              }
            }}
          >
            <option value="">未選択</option>
            {getOptions(field.key as string)
              ?.filter((option) => !(formData[key] ?? []).includes(option.key))
              .map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
          </select>
        </>
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
            handleFormData(stringKey, newValue);
          }}
        />
      )}
    </div>
  );
};

const Form = () => {
  const {
    isOpen,
    closeForm,

    prevStep,
    nextStep,
    nextData,
    sendData,

    currentStep,
    formData,
    formSteps,
    handleFormData,
  } = useForm<TransferForm>();

  const {
    modal: { alert },
  } = useAlert();
  const { getOptions } = useOptions();

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
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
            formSteps[currentStep].fields.map((field) => {
              console.log(formData, field.key, formData[field.key]);
              return (
                <RenderField
                  key={field.key}
                  field={field}
                  formData={formData}
                  handleFormData={handleFormData}
                />
              );
            })
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(formData).map(([key, value]) => {
                const field = formSteps
                  .flatMap((step) => step.fields || [])
                  .find((f) => f.key === key);

                let displayValue = value;

                if (field?.type === "select" || field?.type === "table") {
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

                if (field?.type === "multiurl" && value) {
                  const urls = value as string[];
                  displayValue = `${
                    urls.filter((u) => u.trim() !== "").length
                  }件`;
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

          {currentStep === formSteps.length - 1 && alert.success ? (
            <LinkButtonGroup
              approve={{
                text: "次のデータへ",
                color: "green",
                onClick: nextData,
              }}
              deny={{
                text: "入力終了",
                color: "red",
                onClick: closeForm,
              }}
            />
          ) : (
            <LinkButtonGroup
              approve={{
                text: currentStep === formSteps.length - 1 ? "追加" : "次へ",
                color: "green",
                onClick:
                  currentStep === formSteps.length - 1 ? sendData : nextStep,
              }}
              deny={{
                text: "戻る",
                color: "red",
                onClick: prevStep,
                disabled: currentStep === 0,
              }}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default Form;
