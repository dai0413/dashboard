import { FieldDefinition } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { useOptions } from "../../../context/options-provider";
import { Table } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  single: {
    field: FieldDefinition<T>;
    formData: FormTypeMap[T];
    handleFormData: <K extends keyof FormTypeMap[T]>(
      key: K,
      value: FormTypeMap[T][K]
    ) => void;
  };
  many?: {
    field: FieldDefinition<T>[];
    formData: FormTypeMap[T][];
    handleFormData: <K extends keyof FormTypeMap[T]>(
      index: number,
      key: K,
      value: FormTypeMap[T][K]
    ) => void;
  };
};

export const RenderField = <T extends keyof FormTypeMap>({
  single: { field, formData, handleFormData },
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
