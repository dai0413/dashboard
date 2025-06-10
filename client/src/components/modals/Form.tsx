import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui/index";
import { FieldDefinition } from "../../types/form";
import { FormTypeMap } from "../../types/models";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useOptions } from "../../context/options-provider";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Table } from "../table";
import { useForm } from "../../context/form-context";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FieldDefinition<T>;
  formData: FormTypeMap[T];
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => void;
};

const RenderField = <T extends keyof FormTypeMap>({
  field,
  formData,
  handleFormData,
}: RenderFieldProps<T>) => {
  const { key, label, type } = field;
  const { getOptions, updateFilter, filters } = useOptions();

  const inputType =
    type === "number" ? "number" : type === "date" ? "date" : "text";

  // console.log("formData[key]", key, formData[key]);
  console.log(getOptions(key as string));

  return (
    <div key={key as string} className="mb-4">
      <label className="block text-gray-600 text-sm font-medium mb-1">
        {label}
      </label>

      {type === "table" ? (
        <>
          <div className="mb-2 text-gray-700">
            選択中:{" "}
            {getOptions(key as string).find((f) => f.key === formData[key])
              ?.label || "未選択"}
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={filters[key as string]?.value || ""}
              onChange={(e) => updateFilter(key as string, e.target.value)}
              placeholder="フィルター..."
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>
          <Table
            data={getOptions(key as string, true).data}
            headers={getOptions(key as string, true).header}
            form={true}
            onClick={(row) => {
              handleFormData(key, row.key as FormTypeMap[T][typeof key]);
            }}
            selectedKey={
              typeof formData[key] === "string" ? formData[key] : undefined
            }
            itemsPerPage={10}
          />
        </>
      ) : type === "select" ? (
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={(formData[key] ?? "") as string}
          onChange={(e) => {
            const selectedValue = e.target.value as FormTypeMap[T][typeof key];
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
        <>
          {[
            ...(formData[key] && (formData[key] as string[]).length > 0
              ? (formData[key] as string[])
              : [""]), // 空配列なら1つだけ空の入力欄を出す
          ].map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={item}
                onChange={(e) => {
                  const value = e.target.value;
                  const newValue = [...((formData[key] ?? []) as string[])];
                  newValue[index] = value;

                  // 入力されたのが最後の要素かつ空だった場合、新たな空欄を追加
                  if (
                    index === newValue.length - 1 &&
                    value.trim() !== "" &&
                    !newValue.includes("")
                  ) {
                    newValue.push("");
                  }

                  handleFormData(key, newValue as FormTypeMap[T][typeof key]);
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const newValue = [...(formData[key] as string[])];
                  newValue.splice(index, 1);
                  handleFormData(key, newValue as FormTypeMap[T][typeof key]);
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
          {[...((formData[key] as string[]) ?? [])].map(
            (item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={item}
                  onChange={(e) => {
                    const newValue = [...(formData[key] as string[])];
                    newValue[index] = e.target.value;
                    handleFormData(key, newValue as FormTypeMap[T][typeof key]);
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
                    const newValue = [...(formData[key] as string[])];
                    newValue.splice(index, 1);
                    handleFormData(key, newValue as FormTypeMap[T][typeof key]);
                  }}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            )
          )}

          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value=""
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) {
                const current = (formData[key] as string[]) ?? [];
                handleFormData(key, [
                  ...current,
                  selected,
                ] as FormTypeMap[T][typeof key]);
              }
            }}
          >
            <option value="">未選択</option>
            {getOptions(field.key as string)
              ?.filter(
                (option) =>
                  !(
                    (formData[key] as string[]) ??
                    ([] as FormTypeMap[T][typeof key])
                  ).includes(option.key)
              )
              .map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
          </select>
        </>
      ) : type === "multiInput" ? (
        <>
          {[
            ...(formData[key] && (formData[key] as string[]).length > 0
              ? (formData[key] as string[])
              : [""]), // 空配列なら1つだけ空の入力欄を出す
          ].map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type={inputType}
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={item}
                onChange={(e) => {
                  const value = e.target.value;
                  const newValue = [...((formData[key] ?? []) as string[])];
                  newValue[index] = value;

                  if (
                    index === newValue.length - 1 &&
                    value.trim() !== "" &&
                    !newValue.includes("")
                  ) {
                    newValue.push("");
                  }

                  handleFormData(key, newValue as FormTypeMap[T][typeof key]);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newValue = [...(formData[key] as string[])];
                  newValue.splice(index, 1);
                  handleFormData(key, newValue as FormTypeMap[T][typeof key]);
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </>
      ) : (
        <input
          type={inputType}
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={
            inputType === "date"
              ? (() => {
                  const val = formData[key];
                  if (!val) return "";
                  const date =
                    val instanceof Date
                      ? val
                      : typeof val === "string"
                      ? new Date(val)
                      : null;

                  return date && !isNaN(date.getTime())
                    ? date.toISOString().split("T")[0]
                    : "";
                })()
              : (formData[key] ?? "").toString()
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

const Form = <T extends keyof FormTypeMap>() => {
  const {
    newData,
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

    getDiffKeys,
  } = useForm<T>();

  const {
    modal: { alert },
  } = useAlert();
  const { getOptions } = useOptions();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
      <Alert success={alert?.success || false} message={alert?.message} />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {newData ? "新規データ作成" : "既存データ編集"}
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
                  key={field.key as string}
                  field={field}
                  formData={formData}
                  handleFormData={handleFormData}
                />
              );
            })
          ) : (
            // 確認ステップ
            <div className="space-y-2 text-sm text-gray-700">
              {!newData && alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更しました
                </span>
              )}

              {!newData && !alert.success && diffKeys.length > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  ※ 赤文字の値に変更します
                </span>
              )}

              {Object.entries(formData).map(([key, value]) => {
                if (key === "_id" || key === "__v") return;

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

                if (field?.type === "multiInput" && value) {
                  const inputs = value as string[];
                  displayValue = inputs.join(",");
                }

                return (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-semibold">{field?.label ?? key}</span>
                    <span
                      className={
                        !newData && diffKeys.includes(key)
                          ? "text-red-500 font-semibold bg-red-50 px-1 rounded"
                          : ""
                      }
                    >
                      {String(displayValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === formSteps.length - 1 && alert.success ? (
            newData ? (
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
                deny={{
                  text: "入力終了",
                  color: "red",
                  onClick: closeForm,
                }}
              />
            )
          ) : (
            <LinkButtonGroup
              approve={{
                text:
                  currentStep === formSteps.length - 1
                    ? newData
                      ? "追加"
                      : "変更"
                    : "次へ",
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
