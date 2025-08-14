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
import { useEffect } from "react";
import { usePlayer } from "../../context/models/player-context";
import { useTeam } from "../../context/models/team-context";
import { useAuth } from "../../context/auth-context";
import { InputField, SelectField } from "../field";

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
    type === "number"
      ? "number"
      : type === "date"
      ? "date"
      : type === "checkbox"
      ? "checkbox"
      : "text";

  const inputFieldOnChange = (value: string | number | Date | boolean) => {
    updateFilter(key as string, value as string);
  };

  const inputHandleFormData = (value: string | number | Date | boolean) => {
    handleFormData(key, value as any);
  };

  const multhInputHandleFormData = (
    index: number,
    value: string | number | Date | boolean
  ) => {
    const newValue = [...((formData[key] ?? []) as string[])];
    newValue[index] = value.toString();

    if (
      index === newValue.length - 1 &&
      value.toString().trim() !== "" &&
      !newValue.includes("")
    ) {
      newValue.push("");
    }

    handleFormData(key, newValue as FormTypeMap[T][typeof key]);
  };

  const filteredOptions = getOptions(field.key as string)?.filter(
    (option) =>
      !(
        (formData[key] as string[]) ?? ([] as FormTypeMap[T][typeof key])
      ).includes(option.key)
  );

  const value = formData[key] as string | number | Date;

  const multiInputHandleFormData = (value: string | number | Date) => {
    const selected = value;
    if (selected) {
      const current = (formData[key] as string[]) ?? [];
      handleFormData(key, [...current, selected] as FormTypeMap[T][typeof key]);
    }
  };

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
            <InputField
              type="text"
              value={filters[key as string]?.value || ""}
              onChange={inputFieldOnChange}
              placeholder="検索"
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
        <SelectField
          type={inputType}
          value={value}
          onChange={inputHandleFormData}
          options={getOptions(field.key as string)}
          defaultOption="--- 未選択 ---"
        />
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
            (item: string, index: number) => {
              const inputArrayHandleFormData = (
                value: string | number | Date
              ) => {
                const newValue = [...(formData[key] as string[])];
                newValue[index] = String(value);
                handleFormData(key, newValue as FormTypeMap[T][typeof key]);
              };

              return (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <SelectField
                    type={inputType}
                    value={item}
                    onChange={inputArrayHandleFormData}
                    options={getOptions(field.key as string)}
                    defaultOption="--- 未選択 ---"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const newValue = [...(formData[key] as string[])];
                      newValue.splice(index, 1);
                      handleFormData(
                        key,
                        newValue as FormTypeMap[T][typeof key]
                      );
                    }}
                    className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              );
            }
          )}

          <SelectField
            type={inputType}
            value={""}
            onChange={multiInputHandleFormData}
            options={filteredOptions}
            defaultOption="--- 未選択 ---"
          />
        </>
      ) : type === "multiInput" ? (
        <>
          {[
            ...(formData[key] && (formData[key] as string[]).length > 0
              ? (formData[key] as string[])
              : [""]), // 空配列なら1つだけ空の入力欄を出す
          ].map((item: string, index: number) => {
            const onChange = (value: string | number | Date | boolean) =>
              multhInputHandleFormData(index, value);

            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <InputField
                  type={inputType}
                  value={item}
                  onChange={onChange}
                  placeholder="検索"
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
            );
          })}
        </>
      ) : (
        <InputField
          type={inputType}
          value={value}
          onChange={inputHandleFormData}
          placeholder=""
        />
      )}
    </div>
  );
};

const Form = <T extends keyof FormTypeMap>() => {
  const {
    newData,
    isOpen,
    isEditing,
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
    modal: { alert, resetAlert },
  } = useAlert();

  const { accessToken } = useAuth();

  const { readItems: readPlayers } = usePlayer();
  const { readItems: readTeams } = useTeam();

  useEffect(() => {
    if (!accessToken) return;
    readPlayers({});
    readTeams({});
  }, [accessToken]);

  const { getOptions } = useOptions();

  const diffKeys = getDiffKeys ? getDiffKeys() : [];

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />
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
              // console.log(formData, field.key, formData[field.key]);
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
                if (
                  key === "_id" ||
                  key === "__v" ||
                  key === "createdAt" ||
                  key === "updatedAt"
                )
                  return;

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

          <div className="mt-4">
            {currentStep === formSteps.length - 1 && !isEditing ? (
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
          </div>
        </>
      )}
    </Modal>
  );
};

export default Form;
